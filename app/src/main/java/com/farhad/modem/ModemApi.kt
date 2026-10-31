package com.farhad.modem

import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.ConcurrentHashMap

class Resp(val code: Int, val body: String, val headers: Map<String, List<String>>) {
    fun header(n: String): String? = headers.entries.firstOrNull { it.key.equals(n, true) }?.value?.firstOrNull()
}

class ModemApi(context: Context) {
    private val cm = context.getSystemService(ConnectivityManager::class.java)

    @Volatile var network: Network? = null
    @Volatile var host: String = "192.168.8.1"
    @Volatile var loggedIn = false
    var onLog: (String) -> Unit = {}
    var onNetwork: (Network?) -> Unit = {}
    var onSessionLost: () -> Unit = {}

    private val cookies = ConcurrentHashMap<String, String>()
    private val loginMutex = Mutex()
    private var user = ""
    private var pass = ""
    private var lastLogin = 0L
    private var cb: ConnectivityManager.NetworkCallback? = null

    // ---------- شبکه: ترافیک فقط از مسیر Wi-Fi مودم می‌ره ----------
    fun startNetwork() {
        stopNetwork()
        val callback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(n: Network) { network = n; onNetwork(n) }
            override fun onLost(n: Network) { if (network == n) { network = null; onNetwork(null) } }
        }
        cb = callback
        cm.requestNetwork(NetworkRequest.Builder().addTransportType(NetworkCapabilities.TRANSPORT_WIFI).build(), callback)
    }

    fun stopNetwork() {
        cb?.let { try { cm.unregisterNetworkCallback(it) } catch (e: Exception) { } }
        cb = null
    }

    // ---------- HTTP ----------
    private fun cookieHeader() = cookies.entries.joinToString("; ") { it.key + "=" + it.value }

    private suspend fun http(
        path: String, method: String = "GET", body: String? = null,
        hdr: Map<String, String> = emptyMap(), ms: Int = 12000
    ): Resp = withContext(Dispatchers.IO) {
        val net = network ?: throw IOException("به Wi-Fi مودم وصل نیستی")
        val c = net.openConnection(URL("http://$host$path")) as HttpURLConnection
        try {
            c.requestMethod = method
            c.connectTimeout = 6000
            c.readTimeout = ms
            c.instanceFollowRedirects = false
            if (cookies.isNotEmpty()) c.setRequestProperty("Cookie", cookieHeader())
            c.setRequestProperty("Referer", "http://$host/html/home.html")
            c.setRequestProperty("Origin", "http://$host")
            hdr.forEach { (k, v) -> c.setRequestProperty(k, v) }
            if (body != null) {
                val bytes = body.toByteArray(Charsets.UTF_8)
                c.doOutput = true
                c.setFixedLengthStreamingMode(bytes.size)
                c.outputStream.use { it.write(bytes) }
            }
            val code = c.responseCode
            val stream = if (code >= 400) c.errorStream else c.inputStream
            val text = stream?.bufferedReader(Charsets.UTF_8)?.use { it.readText() } ?: ""
            val hs = HashMap<String, List<String>>()
            for ((k, v) in c.headerFields) if (k != null) hs[k] = v
            hs.entries.filter { it.key.equals("set-cookie", true) }.forEach { e ->
                e.value.forEach { sc ->
                    val kv = sc.substringBefore(';')
                    val i = kv.indexOf('=')
                    if (i > 0) cookies[kv.substring(0, i).trim()] = kv.substring(i + 1).trim()
                }
            }
            Resp(code, text, hs)
        } finally {
            c.disconnect()
        }
    }

    private val authCodes = setOf("100003", "125001", "125002", "125003", "125004")
    private fun authErr(b: String): Boolean = b.contains("<error>") && tag(b, "code") in authCodes

    suspend fun pageTokens(path: String = "/html/home.html"): List<String> {
        val b = http(path).body
        return Regex("name=\"csrf_token\" content=\"([^\"]*)\"").findAll(b).map { it.groupValues[1] }.toList()
    }

    suspend fun get(path: String, ms: Int = 12000): String {
        var r = http(path, "GET", ms = ms).body
        if (authErr(r) && relogin()) r = http(path, "GET", ms = ms).body
        return r
    }

    /** مثل panel.js: قبل از هر POST توکن تازه از صفحه‌ی خونه گرفته می‌شه */
    suspend fun post(path: String, body: String, ms: Int = 20000): String {
        suspend fun once(): String {
            val t = pageTokens().lastOrNull() ?: ""
            val r = http(path, "POST", body, mapOf("__RequestVerificationToken" to t, "Content-Type" to "application/xml"), ms).body
            onLog("POST $path -> ${r.take(300)}")
            return r
        }
        return try {
            var r = once()
            if (authErr(r) && relogin()) r = once()
            r
        } catch (e: Exception) {
            onLog("POST $path ERR $e")
            "ERR $e"
        }
    }

    // ---------- لاگین SCRAM ----------
    private suspend fun relogin(): Boolean {
        if (user.isEmpty()) return false
        return loginMutex.withLock {
            val now = System.currentTimeMillis()
            if (now - lastLogin < 15000) return@withLock loggedIn
            lastLogin = now
            val err = try { loginInternal(user, pass) } catch (e: Exception) { "خطا: ${e.message ?: e}" }
            loggedIn = err == null
            if (err != null) { onLog("relogin failed: $err"); onSessionLost() }
            err == null
        }
    }

    /** null یعنی موفق؛ وگرنه متن خطا */
    suspend fun login(u: String, p: String): String? {
        user = u
        pass = p
        return loginMutex.withLock {
            lastLogin = System.currentTimeMillis()
            val e = try { loginInternal(u, p) } catch (ex: Exception) { onLog("login ERR $ex"); "خطا: ${ex.message ?: ex}" }
            loggedIn = e == null
            e
        }
    }

    suspend fun logout() {
        try { post("/api/user/logout", "<?xml version=\"1.0\" encoding=\"UTF-8\"?><request><Logout>1</Logout></request>") } catch (e: Exception) { }
        cookies.clear()
        loggedIn = false
        user = ""
        pass = ""
    }

    private fun errMsg(b: String, fb: String): String {
        val code = tag(b, "code")
        return when (code) {
            "108001", "108002", "108006" -> "نام کاربری یا رمز اشتباه است"
            "108003" -> "یه کاربر دیگه با همین نام توی مودم لاگینه"
            "108007" -> "تلاش بیش از حد؛ چند دقیقه صبر کن و دوباره امتحان کن"
            "" -> fb + (if (b.isNotBlank()) " | " + b.take(150) else "")
            else -> "$fb (کد $code)"
        }
    }

    private suspend fun loginInternal(u: String, p: String): String? {
        cookies.clear()
        var toks = pageTokens("/")
        if (toks.isEmpty()) toks = pageTokens("/html/index.html")
        onLog("login: csrf tokens=${toks.size}")
        if (toks.isEmpty()) return "توکن CSRF از مودم گرفته نشد (آدرس مودم درسته؟)"

        val head = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        val form = "application/x-www-form-urlencoded; charset=UTF-8"
        val first = Scram.randomHex(32)
        val b1 = "$head<request><username>$u</username><firstnonce>$first</firstnonce><mode>1</mode></request>"

        var r1: Resp? = null
        for (t in toks.distinct()) {
            val r = http("/api/user/challenge_login", "POST", b1, mapOf("__RequestVerificationToken" to t, "Content-Type" to form))
            onLog("challenge -> ${r.body.take(300)} | hdr=${r.headers.keys.filter { it.contains("Verification", true) }}")
            r1 = r
            if (r.body.contains("<salt>")) break
        }
        val c = r1?.body ?: ""
        val salt = tag(c, "salt")
        val iter = tag(c, "iterations").toIntOrNull()
        val sn = tag(c, "servernonce")
        if (salt.isEmpty() || iter == null || sn.isEmpty()) return errMsg(c, "پاسخ challenge نامعتبر بود")
        if (!sn.startsWith(first)) onLog("warn: servernonce با firstnonce شروع نمی‌شه")

        val res = withContext(Dispatchers.Default) { Scram.compute(p, salt, iter, first, sn) }
        val b2 = "$head<request><clientproof>${res.proof}</clientproof><finalnonce>$sn</finalnonce></request>"
        val hdrTok = r1?.header("__RequestVerificationToken") ?: r1?.header("__RequestVerificationTokenone")
        val cands = listOfNotNull(hdrTok, toks.getOrNull(1), toks.firstOrNull(), toks.lastOrNull()).distinct()

        var r2: Resp? = null
        for (t in cands) {
            val r = http("/api/user/authentication_login", "POST", b2, mapOf("__RequestVerificationToken" to t, "Content-Type" to form))
            onLog("auth -> ${r.body.take(300)} | cookies=${cookies.keys}")
            r2 = r
            if (r.body.contains("<serversignature>")) break
            if (tag(r.body, "code") in setOf("108001", "108002", "108006", "108007")) break
        }
        val d = r2?.body ?: ""
        val ss = tag(d, "serversignature")
        if (ss.isEmpty()) return errMsg(d, "لاگین ناموفق")
        if (!ss.equals(res.serverSig, true)) onLog("warn: serversignature با محاسبه‌ی ما نمی‌خونه")
        onLog("state-login: " + http("/api/user/state-login").body.take(200))
        return null
    }
}
