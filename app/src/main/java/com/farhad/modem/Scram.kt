package com.farhad.modem

import java.security.MessageDigest
import java.security.SecureRandom
import javax.crypto.Mac
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

class ScramResult(val proof: String, val serverSig: String)

/** همون الگوریتم scram.js مودم (توجه: ترتیب key/data در clientKey و serverKey برعکسِ SCRAM استاندارده) */
object Scram {
    fun hex(b: ByteArray): String = b.joinToString("") { "%02x".format(it) }
    fun unhex(s: String): ByteArray = ByteArray(s.length / 2) { s.substring(it * 2, it * 2 + 2).toInt(16).toByte() }
    fun randomHex(n: Int): String { val b = ByteArray(n); SecureRandom().nextBytes(b); return hex(b) }

    private fun hmac(key: ByteArray, msg: ByteArray): ByteArray {
        val m = Mac.getInstance("HmacSHA256")
        m.init(SecretKeySpec(key, "HmacSHA256"))
        return m.doFinal(msg)
    }

    private fun sha256(b: ByteArray): ByteArray = MessageDigest.getInstance("SHA-256").digest(b)

    fun compute(password: String, saltHex: String, iter: Int, firstNonce: String, serverNonce: String): ScramResult {
        val salted = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
            .generateSecret(PBEKeySpec(password.toCharArray(), unhex(saltHex), iter, 256)).encoded
        val clientKey = hmac("Client Key".toByteArray(), salted)
        val stored = sha256(clientKey)
        val auth = "$firstNonce,$serverNonce,$serverNonce".toByteArray()
        val sig = hmac(stored, auth)
        val proof = ByteArray(clientKey.size) { (clientKey[it].toInt() xor sig[it].toInt()).toByte() }
        val serverKey = hmac("Server Key".toByteArray(), salted)
        return ScramResult(hex(proof), hex(hmac(serverKey, auth)))
    }
}
