package com.farhad.modem

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.*

private val HM = listOf(
    Triple("s", "4G SINR", "sinr"), Triple("a", "4G RSRP", "rsrp"),
    Triple("ns", "5G SINR", "sinr"), Triple("na", "5G RSRP", "rsrp")
)

private fun HistPoint.get(k: String): Double? = when (k) {
    "s" -> s
    "a" -> a
    "ns" -> ns
    else -> na
}

@Composable
fun HistoryScreen(vm: ModemViewModel) {
    var mk by remember { mutableStateOf("s") }
    var rng by remember { mutableStateOf("60") }
    val def = HM.first { it.first == mk }
    val m = if (def.third == "sinr") Mets.sinr else Mets.rsrp
    val now = System.currentTimeMillis()
    val t0 = now - rng.toLong() * 60000L
    val hist = vm.hist
    val pts = hist.filter { it.t >= t0 }

    // خط‌های عمودی: تغییر باند/سلول (سفید) و سوییچ خودکار (نارنجی)
    val marks = ArrayList<Mark>()
    for (i in 1 until hist.size) {
        val a = hist[i - 1]
        val b = hist[i]
        if (b.t < t0 || b.t - a.t > 120000) continue   // فاصله‌ی زیاد = اپ بسته بوده
        val ch = ArrayList<String>()
        if (a.b != b.b) ch.add((a.b?.let { "B$it" } ?: "-") + "→" + (b.b?.let { "B$it" } ?: "-"))
        if (a.p != b.p) ch.add("PCI " + (a.p?.toString() ?: "-") + "→" + (b.p?.toString() ?: "-"))
        if (ch.isNotEmpty()) marks.add(Mark(b.t, ch.joinToString("  "), Color(0x59FFFFFF)))
    }
    vm.evs.filter { it.t >= t0 }.forEach { marks.add(Mark(it.t, it.x, Color(0xFFFF9F43))) }
    marks.sortByDescending { it.t }

    val vs = pts.mapNotNull { it.get(mk) }
    val stats = if (vs.isEmpty()) listOf("هنوز داده‌ای نیست؛ هر ۱۰ ثانیه یه نمونه ثبت می‌شه")
    else listOf(
        "کمترین: " + fmt(vs.min()),
        "میانگین: " + fmt(Math.round(vs.sum() / vs.size * 10) / 10.0),
        "بیشترین: " + fmt(vs.max()),
        "نمونه: " + vs.size
    )

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(8.dp)) {
        Sec("نمودار سیگنال (حتی وقتی این تب بسته‌ست ثبت می‌شه). خط‌های عمودی = تغییر باند/سلول، نارنجی = سوییچ خودکار")
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            Dropdown(HM.map { it.first to it.second }, mk, Modifier.weight(1f)) { mk = it }
            Dropdown(listOf("15" to "۱۵ دقیقه", "60" to "۱ ساعت", "120" to "۲ ساعت"), rng, Modifier.weight(1f)) { rng = it }
        }
        Spacer(Modifier.height(6.dp))
        SignalChart(pts, mk, m, t0, now, marks, Modifier.fillMaxWidth().aspectRatio(2.2f))
        Spacer(Modifier.height(6.dp))
        TagRow(stats)
        Sec("رویدادها")
        MonoBox(marks.take(12).joinToString("\n") { clock(it.t) + "  " + it.x }.ifEmpty { "(تغییر باند/سلول یا سوییچی نبوده)" })
        Spacer(Modifier.height(8.dp))
        Btn("پاک کردن تاریخچه", Modifier.fillMaxWidth()) { vm.clearHistory() }
    }
}

@Composable
fun SignalChart(pts: List<HistPoint>, key: String, m: Met, t0: Long, t1: Long, marks: List<Mark>, modifier: Modifier) {
    Canvas(modifier.background(Color(0xFF0F151D))) {
        val w = size.width
        val h = size.height
        val l = 40.dp.toPx()
        val r = 8.dp.toPx()
        val tp = 8.dp.toPx()
        val bt = 22.dp.toPx()
        fun x(t: Long): Float = l + (t - t0).toFloat() * (w - l - r) / (t1 - t0).toFloat()
        fun y(v: Double): Float = tp + (1f - ((v.coerceIn(m.min, m.max) - m.min) / (m.max - m.min)).toFloat()) * (h - tp - bt)

        drawRect(Color(0x212ECC71), Offset(l, y(m.max)), Size(w - l - r, y(m.good) - y(m.max)))
        drawRect(Color(0x21F5C542), Offset(l, y(m.good)), Size(w - l - r, y(m.mid) - y(m.good)))
        drawRect(Color(0x21E5484D), Offset(l, y(m.mid)), Size(w - l - r, y(m.min) - y(m.mid)))

        val paint = android.graphics.Paint().apply {
            color = Color(0xFF8A97A8).toArgb()
            textSize = 11.sp.toPx()
            isAntiAlias = true
            textAlign = android.graphics.Paint.Align.RIGHT
        }
        val cv = drawContext.canvas.nativeCanvas
        listOf(m.min, m.mid, m.good, m.max).forEach { cv.drawText(fmt(it), l - 4.dp.toPx(), y(it) + 4.dp.toPx(), paint) }
        paint.textAlign = android.graphics.Paint.Align.LEFT
        cv.drawText(clock(t0), l, h - 5.dp.toPx(), paint)
        paint.textAlign = android.graphics.Paint.Align.RIGHT
        cv.drawText(clock(t1), w - r, h - 5.dp.toPx(), paint)

        marks.forEach { mk ->
            if (mk.t in t0..t1) drawLine(mk.c, Offset(x(mk.t), tp), Offset(x(mk.t), h - bt), strokeWidth = 1.5.dp.toPx())
        }

        val path = Path()
        var prev: Long? = null
        for (p in pts) {
            val v = p.get(key)
            if (v == null) { prev = null; continue }
            val pv = prev
            if (pv == null || p.t - pv > 60000) path.moveTo(x(p.t), y(v)) else path.lineTo(x(p.t), y(v))
            prev = p.t
        }
        drawPath(path, Color(0xFF5AA2FF), style = Stroke(width = 2.dp.toPx()))
        if (pts.size <= 150) {
            pts.forEach { p ->
                val v = p.get(key)
                if (v != null) drawRect(Color(0xFF5AA2FF), Offset(x(p.t) - 2.dp.toPx(), y(v) - 2.dp.toPx()), Size(4.dp.toPx(), 4.dp.toPx()))
            }
        }
    }
}
