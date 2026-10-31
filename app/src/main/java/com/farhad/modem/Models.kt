package com.farhad.modem

import androidx.compose.ui.graphics.Color
import org.w3c.dom.Node
import org.xml.sax.InputSource
import java.io.StringReader
import java.math.BigInteger
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import javax.xml.parsers.DocumentBuilderFactory

class Met(val label: String, val unit: String, val min: Double, val max: Double, val good: Double, val mid: Double)

object Mets {
    val rssi = Met("RSSI", "dBm", -100.0, -45.0, -65.0, -80.0)
    val rsrp = Met("RSRP", "dBm", -120.0, -70.0, -90.0, -105.0)
    val rsrq = Met("RSRQ", "dB", -20.0, -3.0, -10.0, -15.0)
    val sinr = Met("SINR", "dB", -5.0, 30.0, 13.0, 0.0)
}

val FREQ = mapOf(1 to 2100, 2 to 1900, 3 to 1800, 4 to 1700, 5 to 850, 7 to 2600, 8 to 900, 12 to 700, 13 to 700, 17 to 700, 18 to 850, 19 to 850, 20 to 800, 25 to 1900, 26 to 850, 28 to 700, 32 to 1500, 34 to 2000, 38 to 2600, 39 to 1900, 40 to 2300, 41 to 2500, 42 to 3500, 43 to 3700, 46 to 5200, 48 to 3500)
val NRF = mapOf(1 to 2100, 3 to 1800, 5 to 850, 7 to 2600, 8 to 900, 20 to 800, 28 to 700, 38 to 2600, 40 to 2300, 41 to 2500, 48 to 3500, 77 to 3700, 78 to 3500, 79 to 4700)

val ALIGN_OPTS = listOf(
    "auto" to "خودکار (5G SINR، اگه نبود 4G)",
    "sinr" to "4G SINR", "rsrp" to "4G RSRP", "nrsinr" to "5G SINR", "nrrsrp" to "5G RSRP"
)

data class Signal(
    val rssi: Double?, val rsrp: Double?, val rsrq: Double?, val sinr: Double?,
    val nrRsrp: Double?, val nrRsrq: Double?, val nrSinr: Double?,
    val band: Int?, val pci: String, val cell: String, val tac: String, val bw4g: String, val bw5g: String
)

data class HistPoint(val t: Long, val a: Double?, val s: Double?, val na: Double?, val ns: Double?, val b: Int?, val p: Int?)
data class Ev(val t: Long, val x: String)
data class Profile(val n: String, val l: String, val r: String, val o: String, val e: Boolean)
data class AutoCfg(
    val on: Boolean = false, val thr: Int = 5, val mins: Int = 3, val cur: String = "",
    val t0: Long = 0L, val hold: Long = 0L, val tried: Map<String, Double> = emptyMap()
)
class Mark(val t: Long, val x: String, val c: Color)

fun tag(x: String, t: String): String =
    Regex("<$t>([^<]*)</$t>", RegexOption.IGNORE_CASE).find(x)?.groupValues?.get(1) ?: ""

fun num(v: String?): Double? = Regex("-?\\d+(\\.\\d+)?").find(v ?: "")?.value?.toDoubleOrNull()

fun fmt(v: Double): String = if (v == Math.rint(v)) v.toLong().toString() else v.toString()

fun clock(t: Long): String = SimpleDateFormat("HH:mm", Locale.US).format(Date(t))

fun netType(m: String): String = when (m) {
    "0" -> "No Service"
    "1", "2", "3" -> "2G"
    "41", "42", "43", "44" -> "3G"
    "45", "46" -> "3G+"
    "101" -> "LTE 4G"
    "1011" -> "LTE CA 4G+"
    "111" -> "5G NR"
    else -> m
}

fun bitsOf(v: BigInteger, max: Int): List<Int> = (1..max).filter { v.testBit(it - 1) }
fun maskOf(s: Set<Int>): BigInteger = s.fold(BigInteger.ZERO) { a, n -> a.setBit(n - 1) }

fun descP(p: Profile): String {
    val l = bitsOf(BigInteger(p.l, 16), 64)
    val r = bitsOf(BigInteger(p.r, 16), 128)
    var s = if (l.size > 5) "4G×${l.size}" else l.joinToString(" ") { "B$it" }
    if (r.isNotEmpty()) s += (if (s.isNotEmpty()) " " else "") + (if (r.size > 4) "5G×${r.size}" else r.joinToString(" ") { "n$it" })
    return s
}

fun netBody(m: String, b: String, l: String, o: String, extra: String = ""): String =
    "<request><NetworkMode>$m</NetworkMode><NetworkBand>$b</NetworkBand><LTEBand>$l</LTEBand>" +
        (if (o != "") "<networkOption>$o</networkOption>" else "") + extra + "</request>"

fun xmlItems(xml: String, tagName: String): List<Map<String, String>> = try {
    val doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(InputSource(StringReader(xml)))
    val els = doc.getElementsByTagName(tagName)
    (0 until els.length).map { i ->
        val m = HashMap<String, String>()
        val ch = els.item(i).childNodes
        for (j in 0 until ch.length) {
            val n = ch.item(j)
            if (n.nodeType == Node.ELEMENT_NODE) m[n.nodeName] = n.textContent ?: ""
        }
        m
    }
} catch (e: Exception) {
    emptyList()
}
