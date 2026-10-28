package com.farhad.modem

import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.security.SecureRandom
import javax.crypto.Mac
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

class Modem {
    private var base = ""
    private var cookie = ""
    private var token = ""
    private val xmlHead = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"

    private fun out(s: Int, b: String) = JSONObject().put("s", s).put("b", b).toString()

    fun call(m: String, p: String, b: String): String {
        try {
            if (m == "LOGIN") {
                val (u, pw) = b.split("\n", limit = 2)
                base = "http://$p"
                return out(200, login(u, pw))
            }
            val (s, t) = http(m, p, b)
            return out(s, t)
        } catch (e: Exception) {
            return out(0, "ERR " + e)
        }
    }

    private fun http(m: String, p: String, b: String): Pair<Int, String> {
        val c = URL(base + p).openConnection() as HttpURLConnection
        c.requestMethod = m
        c.connectTimeout = 8000
        c.readTimeout = 15000
        if (cookie.isNotEmpty()) c.setRequestProperty("Cookie", cookie)
        if (token.isNotEmpty()) c.setRequestProperty("__RequestVerificationToken", token)
        if (m == "POST") {
            c.doOutput = true
            c.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
            c.outputStream.use { it.write(b.toByteArray()) }
        }
        val code = c.responseCode
        for ((k, v) in c.headerFields) {
            if (k == null || v.isNullOrEmpty()) continue
            if (k.equals("RequestVerificationToken", true) || k.equals("RequestVerificationTokenone", true)) token = v[0]
            if (k.equals("Set-Cookie", true)) v.firstOrNull { it.startsWith("SessionID=") }?.let { cookie = it.substringBefore(";") }
        }
        val text = (if (code < 400) c.inputStream else c.errorStream)?.readBytes()?.toString(Charsets.UTF_8) ?: ""
        return code to text
    }

    private fun tag(x: String, t: String) = Regex("<$t>([^<]*)</$t>").find(x)?.groupValues?.get(1) ?: ""
    private fun hex(b: ByteArray) = b.joinToString("") { "%02x".format(it) }
    private fun unhex(s: String) = ByteArray(s.length / 2) { s.substring(it * 2, it * 2 + 2).toInt(16).toByte() }
    private fun hmac(k: ByteArray, d: String): ByteArray =
        Mac.getInstance("HmacSHA256").apply { init(SecretKeySpec(k, "HmacSHA256")) }.doFinal(d.toByteArray())

    private fun login(u: String, pw: String): String {
        cookie = ""; token = ""
        val st = http("GET", "/api/webserver/SesTokInfo", "").second
        cookie = tag(st, "SesInfo"); token = tag(st, "TokInfo")
        val fn = hex(ByteArray(32).also { SecureRandom().nextBytes(it) })
        val ch = http("POST", "/api/user/challenge_login",
            "$xmlHead<request><username>$u</username><firstnonce>$fn</firstnonce><mode>1</mode></request>").second
        val sn = tag(ch, "servernonce")
        if (sn.isEmpty()) return "FAIL challenge: $ch"
        val iters = tag(ch, "iterations").toInt()
        val salted = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
            .generateSecret(PBEKeySpec(pw.toCharArray(), unhex(tag(ch, "salt")), iters, 256)).encoded
        val ck = hmac(salted, "Client Key")
        val sk = MessageDigest.getInstance("SHA-256").digest(ck)
        val sig = hmac(sk, "$fn,$sn,$sn")
        val proof = hex(ByteArray(32) { (ck[it].toInt() xor sig[it].toInt()).toByte() })
        val r = http("POST", "/api/user/authentication_login",
            "$xmlHead<request><clientproof>$proof</clientproof><finalnonce>$sn</finalnonce></request>").second
        return if (r.contains("<error>")) "FAIL: $r" else "OK"
    }
}
