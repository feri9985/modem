package com.farhad.modem

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.math.BigInteger
import java.net.URI
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

enum class Pg(val label: String) { Home("Home"), Align("Align"), History("History"), Operator("Operator"), Devices("Devices"), Tools("Tools") }

const val HMAX = 720          // حداکثر ۲ ساعت، هر ۱۰ ثانیه یه نمونه
const val SAMPLE_MS = 10000L

class ModemViewModel(app: Application) : AndroidViewModel(app) {
    val api = ModemApi(app)
    private val store = Store(app)

    // ---------- اتصال و لاگین ----------
    var netReady by mutableStateOf(false)
    var loggedIn by mutableStateOf(false)
    var loginBusy by mutableStateOf(false)
    var loginError by mutableStateOf("")
    var host by mutableStateOf(store.str("host", "192.168.8.1"))
    var user by mutableStateOf(store.str("user", "admin"))
    var pass by mutableStateOf(store.str("pass", ""))
    var remember by mutableStateOf(store.bool("remember", true))
    private var autoLoginTried = false

    // ---------- عمومی ----------
    var pg by mutableStateOf(Pg.Home)
    var active = true
    var toastMsg by mutableStateOf("")
    var logText by mutableStateOf("")
    private var toastJob: Job? = null

    // ---------- Home ----------
    var sig by mutableStateOf<Signal?>(null)
    var dl by mutableStateOf("-")
    var ul by mutableStateOf("-")
    var opName by mutableStateOf("...")
    var netMode by mutableStateOf("-")
    var lteSup by mutableStateOf<List<Int>>(emptyList())
    var lteSel by mutableStateOf<Set<Int>>(emptySet())
    var nrSup by mutableStateOf<List<Int>>(listOf(78, 48))
    var nrSel by mutableStateOf<Set<Int>>(emptySet())
    var nrTag = ""
    var opt by mutableStateOf("")
    var en5 by mutableStateOf(true)
    var profiles by mutableStateOf(store.loadProfiles())
    var auto by mutableStateOf(store.loadAuto())
    var autoMsg by mutableStateOf("")
    private var autoBusy = false
    private var busy = false
    private var cnt = 0

    // ---------- Align ----------
    var alignSel by mutableStateOf("auto")
    var alignKey by mutableStateOf("sinr")
    var alignVal by mutableStateOf<Double?>(null)
    var alignPeak by mutableStateOf<Double?>(null)
    var beepOn by mutableStateOf(false)
    private var lastQ = -1.0
    private var beepJob: Job? = null

    // ---------- History ----------
    var hist by mutableStateOf(store.loadHist())
    var evs by mutableStateOf(store.loadEvents())
    private var sampleBusy = false
    private var nSamp = 0

    // ---------- Operator / Devices / Tools ----------
    var opStatus by mutableStateOf("")
    var opList by mutableStateOf<List<Map<String, String>>>(emptyList())
    var opRaw by mutableStateOf("")
    var scanning by mutableStateOf(false)
    var devices by mutableStateOf<List<Map<String, String>>>(emptyList())
    var devRaw by mutableStateOf("")
    var devLoading by mutableStateOf(false)
    var collectOut by mutableStateOf("")
    var explorerOut by mutableStateOf("")

    init {
        api.host = host
        api.onLog = { log(it) }
        api.onSessionLost = { viewModelScope.launch { loggedIn = false; loginError = "نشست منقضی شد؛ دوباره وارد شو" } }
        api.onNetwork = { n ->
            viewModelScope.launch {
                netReady = n != null
                if (n != null && !loggedIn && !loginBusy && !autoLoginTried && remember && pass.isNotEmpty()) {
                    autoLoginTried = true
                    login()
                }
            }
        }
        api.startNetwork()
        setAutoMsg(if (auto.on) "فعال" else "خاموش")
        viewModelScope.launch { while (true) { delay(if (pg == Pg.Align) 800L else 1500L); tick() } }
        viewModelScope.launch { while (true) { delay(SAMPLE_MS); sample() } }
        viewModelScope.launch {
            while (true) {
                delay(30000)
                try { autoTick() } catch (e: Exception) { log("auto ERR $e") }
            }
        }
    }

    override fun onCleared() {
        api.stopNetwork()
        persist()
        super.onCleared()
    }

    // ---------- util ----------
    fun log(s: String) {
        val t = SimpleDateFormat("HH:mm:ss", Locale.US).format(Date())
        synchronized(this) { logText = (t + " " + s.take(400) + "\n" + logText).take(3500) }
    }

    fun toast(s: String) {
        toastMsg = s
        toastJob?.cancel()
        toastJob = viewModelScope.launch { delay(3500); toastMsg = "" }
    }

    fun persist() {
        store.saveHist(hist)
        store.saveEvents(evs)
    }

    fun setActive(a: Boolean) {
        active = a
        if (!a) { beepOn = false; beepJob?.cancel() }
    }

    private fun addEv(x: String) {
        evs = (evs + Ev(System.currentTimeMillis(), x)).takeLast(40)
        store.saveEvents(evs)
    }

    // ---------- لاگین ----------
    fun login() {
        if (loginBusy) return
        loginBusy = true
        loginError = ""
        api.host = host.trim().ifEmpty { "192.168.8.1" }
        viewModelScope.launch {
            val err = api.login(user.trim(), pass)
            loginBusy = false
            if (err == null) {
                store.putStr("host", host.trim())
                store.putStr("user", user.trim())
                store.putBool("remember", remember)
                store.putStr("pass", if (remember) pass else "")
                loggedIn = true
                cnt = 0
                loadBands()
                tick()
            } else {
                loginError = err
            }
        }
    }

    fun logout() {
        autoLoginTried = true
        viewModelScope.launch {
            api.logout()
            loggedIn = false
            beepOn = false
        }
    }

    fun go(p: Pg) {
        pg = p
        beepOn = false
        beepJob?.cancel()
        if (p == Pg.Align) alignPeak = null
        if (p == Pg.Home || p == Pg.Align) viewModelScope.launch { tick() }
    }

    // ---------- polling ----------
    private fun parseSignal(a: String) = Signal(
        rssi = num(tag(a, "rssi")), rsrp = num(tag(a, "rsrp")), rsrq = num(tag(a, "rsrq")), sinr = num(tag(a, "sinr")),
        nrRsrp = num(tag(a, "nrrsrp")), nrRsrq = num(tag(a, "nrrsrq")), nrSinr = num(tag(a, "nrsinr")),
        band = num(tag(a, "band"))?.toInt()?.takeIf { it != 0 },
        pci = tag(a, "pci"), cell = tag(a, "cell_id"), tac = tag(a, "tac"),
        bw4g = tag(a, "dlbandwidth"), bw5g = tag(a, "nrdlbandwidth")
    )

    private suspend fun tick() {
        if (busy || !loggedIn || !active) return
        if (pg != Pg.Home && pg != Pg.Align) return
        busy = true
        try {
            val a = api.get("/api/device/signal")
            if (!a.contains("<response")) return
            val s = parseSignal(a)
            sig = s
            if (pg == Pg.Align) updateAlign(s)
            if (pg == Pg.Home) {
                val t = api.get("/api/monitoring/traffic-statistics")
                val mb = { v: String -> val n = v.toDoubleOrNull(); if (n == null) "-" else "%.1f".format(Locale.US, n * 8 / 1e6) }
                dl = mb(tag(t, "CurrentDownloadRate"))
                ul = mb(tag(t, "CurrentUploadRate"))
                if (cnt++ % 6 == 0) {
                    val pl = api.get("/api/net/current-plmn")
                    val st = api.get("/api/monitoring/status")
                    opName = (tag(pl, "FullName").ifEmpty { "No Service" }) + " " + tag(pl, "Numeric")
                    netMode = netType(tag(st, "CurrentNetworkTypeEx"))
                }
            }
        } catch (e: Exception) {
            log("ERR $e")
        } finally {
            busy = false
        }
    }

    private suspend fun sample() {
        if (sampleBusy || !active || !loggedIn) return
        sampleBusy = true
        try {
            val a = api.get("/api/device/signal", 8000)
            if (!a.contains("<response")) return
            val p = HistPoint(
                System.currentTimeMillis(), num(tag(a, "rsrp")), num(tag(a, "sinr")), num(tag(a, "nrrsrp")), num(tag(a, "nrsinr")),
                num(tag(a, "band"))?.toInt()?.takeIf { it != 0 }, num(tag(a, "pci"))?.toInt()
            )
            hist = (hist + p).takeLast(HMAX)
            if (++nSamp % 6 == 0) persist()
        } catch (e: Exception) {
        } finally {
            sampleBusy = false
        }
    }

    // ---------- Align ----------
    private fun metOf(key: String) = if (key.endsWith("sinr")) Mets.sinr else Mets.rsrp
    private fun valueOf(s: Signal, key: String): Double? = when (key) {
        "sinr" -> s.sinr
        "rsrp" -> s.rsrp
        "nrsinr" -> s.nrSinr
        else -> s.nrRsrp
    }

    private fun updateAlign(s: Signal) {
        val key = if (alignSel == "auto") (if (s.nrSinr == null) "sinr" else "nrsinr") else alignSel
        if (key != alignKey) { alignKey = key; alignPeak = null }
        val n = valueOf(s, key)
        alignVal = n
        if (n == null) {
            lastQ = -1.0
            alignPeak = null
        } else {
            val m = metOf(key)
            lastQ = ((n - m.min) * 100 / (m.max - m.min)).coerceIn(0.0, 100.0)
            alignPeak = maxOf(alignPeak ?: n, n)
        }
    }

    fun setAlignSel(v: String) { alignSel = v; alignPeak = null; lastQ = -1.0 }
    fun resetPeak() { alignPeak = null }

    fun toggleBeep() {
        beepOn = !beepOn
        beepJob?.cancel()
        if (beepOn) {
            beepJob = viewModelScope.launch(Dispatchers.Default) {
                while (isActive && beepOn && pg == Pg.Align && active) {
                    val q = lastQ
                    if (q >= 0) Beeper.play(q)
                    delay(if (q >= 0) (1000 - q * 8.5).toLong() else 800L)
                }
            }
        }
    }

    // ---------- History ----------
    fun clearHistory() { hist = emptyList(); evs = emptyList(); persist() }

    // ---------- باندها ----------
    suspend fun loadBands() {
        try {
            val nm = api.get("/api/net/net-mode")
            val ls = api.get("/api/net/net-mode-list")
            val cm = Regex("<LTEBand>[\\s\\S]*?<Value>([0-9A-Fa-f]+)</Value>").find(ls)
            val sup = cm?.let { BigInteger(it.groupValues[1], 16) } ?: BigInteger.ONE.shiftLeft(53).subtract(BigInteger.ONE)
            lteSup = bitsOf(sup, 64)
            val cur = BigInteger(tag(nm, "LTEBand").ifEmpty { "0" }, 16)
            lteSel = bitsOf(cur, 64).filter { it in lteSup }.toSet()

            val mt = Regex("<([A-Za-z_]*(?:NR|Nr|nr)[A-Za-z_]*[Bb]and[A-Za-z_]*)>([0-9A-Fa-f]*)</").find(nm)
            nrTag = mt?.groupValues?.get(1) ?: ""
            val nrCur = mt?.groupValues?.get(2)?.takeIf { it.isNotEmpty() }?.let { BigInteger(it, 16) } ?: BigInteger.ZERO
            var nrS = BigInteger.ZERO
            if (mt != null) {
                val sm = Regex("<" + mt.groupValues[1] + ">[\\s\\S]*?<Value>([0-9A-Fa-f]+)</Value>").find(ls)
                if (sm != null) nrS = BigInteger(sm.groupValues[1], 16)
            }
            nrSup = if (nrS.signum() != 0) bitsOf(nrS, 128) else listOf(78, 48)
            nrSel = bitsOf(nrCur, 128).filter { it in nrSup }.toSet()
        } catch (e: Exception) {
            log("bands ERR $e")
        }
    }

    fun quick(name: String, m: String, b: String) {
        viewModelScope.launch {
            toast("$name ...")
            if (m != "08") {
                val r0 = api.post("/api/net/net-mode", netBody(m, b, "7FFFFFFFFFFFFFFF", ""))
                toast(if (r0.contains("OK")) "$name ✓" else "خطا: " + r0.take(120))
                loadBands()
                return@launch
            }
            val opts = if (opt.isNotEmpty()) listOf(opt) else listOf("2", "1", "0")
            val bands = listOf("3FFFFFFF", "00000000")
            var done = ""
            outer@ for (o in opts) {
                for (bd in bands) {
                    val r = api.post("/api/net/net-mode", netBody("08", bd, "7FFFFFFFFFFFFFFF", o))
                    if (!r.contains("OK")) continue
                    delay(1500)
                    val nm = api.get("/api/net/net-mode")
                    log("check: $nm")
                    if (tag(nm, "NetworkMode") == "08") { done = "5G فقط ✓ (option $o)"; break@outer }
                }
            }
            toast(done.ifEmpty { "5G فقط ثبت نشد؛ Tools ← Log رو ببین" })
            loadBands()
        }
    }

    fun applySelected() {
        viewModelScope.launch { applyBands(maskOf(lteSel), maskOf(nrSel), opt, en5, "", false) }
    }

    fun applyProfile(p: Profile) {
        viewModelScope.launch { applyBands(BigInteger(p.l, 16), BigInteger(p.r, 16), p.o, p.e, p.n, false) }
    }

    private suspend fun applyBands(v: BigInteger, nv: BigInteger, o: String, e5: Boolean, label: String, isAuto: Boolean): Boolean {
        if (v.signum() == 0 && nv.signum() == 0) { toast("حداقل یک باند انتخاب کن"); return false }
        if (nv.signum() != 0 && nrTag.isEmpty()) {
            toast("API قفل 5G هنوز مشخص نشده. Tools ← جمع‌آوری اطلاعات 5G رو بزن و متن رو بفرست")
            return false
        }
        toast(if (isAuto) "سوییچ خودکار: «$label»..." else "در حال اعمال...")
        val lte = if (v.signum() == 0) "7FFFFFFFFFFFFFFF" else v.toString(16).uppercase()
        val extra = if (nv.signum() != 0) "<$nrTag>${nv.toString(16).uppercase()}</$nrTag>" else ""
        val r = api.post("/api/net/net-mode", if (e5) netBody("00", "00000000", lte, o, extra) else netBody("03", "3FFFFFFF", lte, "", extra))
        val good = r.contains("OK")
        toast(if (good) (if (label.isNotEmpty()) "«$label» اعمال شد ✓" else "اعمال شد ✓") else "خطا: " + r.take(80))
        if (good && !isAuto) {
            auto = auto.copy(cur = label, t0 = System.currentTimeMillis() + 45000, tried = emptyMap())
            store.saveAuto(auto)
        }
        loadBands()
        return good
    }

    // ---------- پروفایل‌ها ----------
    fun saveProfile(name: String): Boolean {
        val n = name.trim()
        val v = maskOf(lteSel)
        val nv = maskOf(nrSel)
        if (v.signum() == 0 && nv.signum() == 0) { toast("اول باندها رو انتخاب کن"); return false }
        if (n.isEmpty()) { toast("یه اسم برای پروفایل بنویس"); return false }
        profiles = profiles.filter { it.n != n } + Profile(n, v.toString(16), nv.toString(16), opt, en5)
        store.saveProfiles(profiles)
        toast("پروفایل ذخیره شد ✓")
        return true
    }

    fun deleteProfile(i: Int) {
        profiles = profiles.filterIndexed { idx, _ -> idx != i }
        store.saveProfiles(profiles)
    }

    // ---------- سوییچ خودکار ----------
    private fun setAutoMsg(s: String) { autoMsg = (if (auto.cur.isNotEmpty()) "«${auto.cur}» · " else "") + s }

    fun updateAuto(on: Boolean, thr: Int, mins: Int) {
        val was = auto.on
        auto = auto.copy(on = on, thr = thr, mins = mins)
        if (on && !was) {
            auto = auto.copy(t0 = System.currentTimeMillis(), tried = emptyMap(), hold = 0L)
            toast("سوییچ خودکار روشن شد")
        }
        store.saveAuto(auto)
        if (!on) autoMsg = "خاموش" else viewModelScope.launch { autoTick() }
    }

    private suspend fun autoTick() {
        if (!auto.on || autoBusy || !active || !loggedIn) return
        val ps = profiles
        val now = System.currentTimeMillis()
        val win = auto.mins * 60000L
        if (ps.size < 2) { setAutoMsg("حداقل ۲ پروفایل ذخیره کن"); return }
        if (now < auto.hold) { setAutoMsg("روی بهترین پروفایل نگه داشته شد تا " + clock(auto.hold)); return }
        val pts = hist.filter { it.t >= maxOf(auto.t0, now - win) }
        val span = if (pts.isNotEmpty()) pts.last().t - pts.first().t else 0L
        if (now - auto.t0 < win || pts.size < 3 || span < win * 0.7) { setAutoMsg("در حال بررسی سیگنال..."); return }
        var sum = 0.0
        pts.forEach { sum += (it.ns ?: it.s) ?: -20.0 }      // بدون سرویس = خیلی بد
        val avg = Math.round(sum / pts.size * 10) / 10.0
        if (avg >= auto.thr) {
            auto = auto.copy(tried = emptyMap())
            store.saveAuto(auto)
            setAutoMsg("سیگنال خوبه (میانگین $avg dB)")
            return
        }
        val tried = auto.tried.toMutableMap()
        if (auto.cur.isNotEmpty()) tried[auto.cur] = avg
        val fresh = ps.firstOrNull { it.n !in tried }
        val target: Profile
        val why: String
        var hold = auto.hold
        if (fresh != null) {
            target = fresh
            why = "امتحان"
        } else {   // همه امتحان شدن: بهترین رو انتخاب کن و نیم ساعت دست نزن
            target = ps.sortedByDescending { tried[it.n] ?: -99.0 }.first()
            why = "بهترین"
            hold = now + 30 * 60000L
            tried.clear()
        }
        auto = auto.copy(tried = tried, hold = hold)
        autoBusy = true
        try {
            if (target.n != auto.cur) {
                val ok = applyBands(BigInteger(target.l, 16), BigInteger(target.r, 16), target.o, target.e, target.n, true)
                if (!ok) {
                    auto = auto.copy(t0 = now)
                    store.saveAuto(auto)
                    setAutoMsg("اعمال «${target.n}» ناموفق بود؛ بعداً دوباره")
                    return
                }
                auto = auto.copy(cur = target.n)
                addEv("سوییچ خودکار ← «${target.n}» ($why، میانگین قبلی $avg dB)")
            }
            auto = auto.copy(t0 = now + 45000)   // ۴۵ ثانیه برای وصل شدن دوباره‌ی مودم
            store.saveAuto(auto)
            setAutoMsg("«${target.n}» اعمال شد؛ صبر برای ارزیابی")
        } finally {
            autoBusy = false
        }
    }

    // ---------- Operator ----------
    fun opShow() {
        viewModelScope.launch {
            try {
                val r = api.get("/api/net/register")
                val pl = api.get("/api/net/current-plmn")
                opStatus = "حالت: " + (if (tag(r, "Mode") == "1") "دستی" else "خودکار") +
                    "\nPLMN: " + tag(r, "Plmn").ifEmpty { "-" } + "  Rat: " + tag(r, "Rat").ifEmpty { "-" } +
                    "\nاپراتور فعلی: " + tag(pl, "FullName").ifEmpty { "-" } + " " + tag(pl, "Numeric")
            } catch (e: Exception) {
                opStatus = "ERR $e"
            }
        }
    }

    fun setReg(mode: Int, plmn: String, rat: String) {
        viewModelScope.launch {
            toast("در حال اعمال...")
            val x = api.post("/api/net/register", "<request><Mode>$mode</Mode><Plmn>$plmn</Plmn><Rat>$rat</Rat></request>")
            toast(if (x.contains("OK")) "ثبت شد ✓ چند ثانیه صبر کن" else "خطا: " + x.take(100))
            delay(5000)
            opShow()
        }
    }

    fun scan() {
        if (scanning) return
        scanning = true
        opList = emptyList()
        opRaw = ""
        toast("شروع جستجو...")
        viewModelScope.launch {
            val x = try { api.get("/api/net/plmn-list", 240000) } catch (e: Exception) { "ERR $e" }
            log("plmn-list: $x")
            opList = xmlItems(x, "Network")
            if (opList.isEmpty()) opRaw = x.take(1200)
            scanning = false
        }
    }

    // ---------- Devices ----------
    fun loadDevices() {
        viewModelScope.launch {
            devLoading = true
            try {
                var x = api.get("/api/lan/HostInfo")
                if (!x.contains("<Host")) x = api.get("/api/wlan/host-list")
                devices = xmlItems(x, "Host")
                devRaw = if (devices.isEmpty()) x.take(1500) else ""
            } catch (e: Exception) {
                devices = emptyList()
                devRaw = "ارتباط با مودم برقرار نشد: $e"
            }
            devLoading = false
        }
    }

    // ---------- Tools ----------
    fun reboot() {
        toast("Reboot...")
        viewModelScope.launch { api.post("/api/device/control", "<request><Control>1</Control></request>") }
    }

    fun explore(isPost: Boolean, path: String, body: String) {
        viewModelScope.launch {
            explorerOut = try { if (isPost) api.post(path, body) else api.get(path) } catch (e: Exception) { "ERR $e" }
        }
    }

    fun collect(extra: String) {
        collectOut = "در حال جمع‌آوری..."
        viewModelScope.launch {
            val t = StringBuilder()
            fun add(s: String) { t.append(s).append('\n'); collectOut = t.toString().take(7000) }
            fun norm(f0: String): String {
                val f = f0.replace(Regex("^(\\.\\.?/)+"), "")
                return if (f.startsWith("/")) f else if (f.startsWith("html/")) "/$f" else "/html/$f"
            }
            fun resolve(src: String, base: String): String {
                val u = URI("http://x$base").resolve(src)
                return u.rawPath + (if (u.rawQuery != null) "?" + u.rawQuery else "")
            }
            try {
                val shell = api.get("/html/content.html")
                val texts = mutableListOf(shell)
                val srcs = Regex("src=\"([^\"]+\\.js[^\"]*)\"").findAll(shell).map { it.groupValues[1] }.take(14).toList()
                for (s in srcs) {
                    try { texts.add(api.get(resolve(s, "/html/content.html"))) } catch (e: Exception) { }
                }
                add("scripts: ${srcs.size}")
                val found = linkedSetOf<String>()
                val ctx = mutableListOf<String>()
                val dv = Regex("[\\w\\-/.#]*devel[\\w\\-/.#]*", RegexOption.IGNORE_CASE)
                for (tx in texts) {
                    var n = 0
                    for (m in dv.findAll(tx)) {
                        if (n >= 30) break
                        found.add(m.value)
                        if (ctx.size < 4) ctx.add(tx.substring(maxOf(0, m.range.first - 60), minOf(tx.length, m.range.first + 120)).replace(Regex("\\s+"), " "))
                        n++
                    }
                }
                add("== devel tokens ==\n" + found.joinToString("\n"))
                ctx.forEach { add("...$it") }
                val base = try { api.get("/html/zz_notfound.html").length } catch (e: Exception) { -1 }
                val cand = linkedSetOf<String>()
                if (extra.isNotBlank()) cand.add(norm(extra.trim()))
                found.filter { it.contains(".html", true) }.forEach { cand.add(norm(it)) }
                listOf("developmode", "developer", "developeroptions", "developOptions", "developerOptions", "develop_options", "developer_options", "develop", "development", "developopt")
                    .forEach { cand.add("/html/$it.html") }
                val lines = mutableListOf<String>()
                val real = mutableListOf<Pair<String, String>>()
                for (p in cand) {
                    val pg2 = try { api.get(p) } catch (e: Exception) { lines.add("$p ERR"); continue }
                    lines.add("$p len=${pg2.length}" + (if (pg2.length == base) " (=default page)" else ""))
                    if (pg2.length > 300 && pg2.length != base) real.add(p to pg2)
                }
                add("== pages ==\n" + lines.joinToString("\n"))
                for ((p, content) in real) {
                    val txs = mutableListOf(content)
                    val ss = Regex("src=\"([^\"]+\\.js[^\"]*)\"").findAll(content).map { it.groupValues[1] }.take(6).toList()
                    for (s in ss) { try { txs.add(api.get(resolve(s, p))) } catch (e: Exception) { } }
                    val apis = linkedSetOf<String>()
                    txs.forEach { tx -> Regex("/api/[\\w\\-/]+").findAll(tx).forEach { apis.add(it.value) } }
                    add("== $p APIs ==\n" + apis.joinToString(" "))
                    val bl = Regex("band.?lock|lockband|nrband|lock_band", RegexOption.IGNORE_CASE)
                    txs.forEach { tx ->
                        var n = 0
                        var next = 0
                        for (m in bl.findAll(tx)) {
                            if (n >= 3) break
                            if (m.range.first < next) continue
                            add("..." + tx.substring(maxOf(0, m.range.first - 100), minOf(tx.length, m.range.first + 220)).replace(Regex("\\s+"), " "))
                            n++
                            next = m.range.first + 300
                        }
                    }
                }
            } catch (e: Exception) {
                add("ERR $e")
            }
            add("== done ==")
        }
    }
}
