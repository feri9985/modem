package com.farhad.modem

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.*
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.*

@Composable
fun AlignScreen(vm: ModemViewModel) {
    // موقع جهت‌یابی آنتن صفحه خاموش نشه
    val view = LocalView.current
    DisposableEffect(Unit) {
        view.keepScreenOn = true
        onDispose { view.keepScreenOn = false }
    }
    val key = vm.alignKey
    val m = if (key.endsWith("sinr")) Mets.sinr else Mets.rsrp
    val v = vm.alignVal
    val col = when {
        v == null -> C.text
        v >= m.good -> C.green
        v >= m.mid -> C.yellow
        else -> C.red
    }
    val name = ALIGN_OPTS.firstOrNull { it.first == key }?.second ?: key
    val s = vm.sig
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(8.dp)) {
        Sec("آنتن یا مودم رو آروم جابه‌جا کن؛ عدد بالاتر و بیپ تندتر = سیگنال بهتر. هر جابه‌جایی رو چند ثانیه صبر کن تا عدد جا بیفته.")
        Dropdown(ALIGN_OPTS, vm.alignSel) { vm.setAlignSel(it) }
        Row(Modifier.fillMaxWidth().padding(top = 18.dp, bottom = 6.dp), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.Bottom) {
            Text(if (v == null) "-" else fmt(v), color = col, fontSize = 60.sp, fontWeight = FontWeight.Bold)
            if (v != null) Text(m.unit, color = Color(0xB3E8EDF3), fontSize = 20.sp, modifier = Modifier.padding(start = 6.dp, bottom = 10.dp))
        }
        Text(
            if (v == null) "$name — سیگنالی دریافت نمی‌شه" else name,
            color = C.muted, fontSize = 12.sp, modifier = Modifier.fillMaxWidth(), textAlign = androidx.compose.ui.text.style.TextAlign.Center
        )
        SigRow("", v, m)
        Row(Modifier.fillMaxWidth().padding(top = 8.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Tag("بهترین: " + (vm.alignPeak?.let { fmt(it) + " " + m.unit } ?: "-"))
            Btn("ریست", Modifier.width(90.dp)) { vm.resetPeak() }
        }
        Spacer(Modifier.height(8.dp))
        if (s != null) {
            TagRow(listOfNotNull(s.band?.let { "Band: B$it" }, s.pci.takeIf { it.isNotEmpty() }?.let { "PCI: $it" }, s.cell.takeIf { it.isNotEmpty() }?.let { "Cell: $it" }))
        }
        Spacer(Modifier.height(8.dp))
        Btn(if (vm.beepOn) "🔊 بیپ روشن" else "🔈 بیپ خاموش", Modifier.fillMaxWidth(), primary = vm.beepOn) { vm.toggleBeep() }
    }
}
