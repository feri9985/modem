package com.farhad.modem

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.*
import kotlinx.coroutines.delay

private val OPT_LIST = listOf("" to "5G: بدون تغییر", "0" to "5G NSA", "1" to "5G SA", "2" to "5G SA+NSA")

@Composable
fun HomeScreen(vm: ModemViewModel) {
    val s = vm.sig
    var pname by remember { mutableStateOf("") }
    Column(Modifier.fillMaxSize()) {
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(8.dp)) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text(
                    vm.opName, color = Color(0xFFFFD84D), fontSize = 16.sp, fontWeight = FontWeight.Bold,
                    maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f)
                )
                Tag(vm.netMode)
            }
            Spacer(Modifier.height(6.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Box(Modifier.weight(1f).clip(RoundedCornerShape(10.dp)).background(Color(0xFF0F4D2A)).padding(8.dp), contentAlignment = Alignment.Center) {
                    Text("↓ ${vm.dl} Mbps", color = Color.White, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                }
                Box(Modifier.weight(1f).clip(RoundedCornerShape(10.dp)).background(Color(0xFF5A4A0A)).padding(8.dp), contentAlignment = Alignment.Center) {
                    Text("↑ ${vm.ul} Mbps", color = Color.White, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(Modifier.height(6.dp))
            if (s != null) {
                TagRow(
                    listOfNotNull(
                        s.band?.let { "Band: B$it" },
                        s.pci.takeIf { it.isNotEmpty() }?.let { "PCI: $it" },
                        s.cell.takeIf { it.isNotEmpty() }?.let { "Cell: $it" },
                        s.tac.takeIf { it.isNotEmpty() }?.let { "TAC: $it" },
                        s.bw4g.takeIf { it.isNotEmpty() }?.let { "4G BW: $it" },
                        s.bw5g.takeIf { it.isNotEmpty() }?.let { "5G BW: $it" }
                    )
                )
            }
            SigRow("4G RSRP", s?.rsrp, Mets.rsrp)
            SigRow("4G RSRQ", s?.rsrq, Mets.rsrq)
            SigRow("4G SINR", s?.sinr, Mets.sinr)
            SigRow("4G RSSI", s?.rssi, Mets.rssi)
            SigRow("5G RSRP", s?.nrRsrp, Mets.rsrp)
            SigRow("5G RSRQ", s?.nrRsrq, Mets.rsrq)
            SigRow("5G SINR", s?.nrSinr, Mets.sinr)

            Sec("حالت شبکه")
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Btn("Auto", Modifier.weight(1f), size = 13.sp) { vm.quick("Auto", "00", "3FFFFFFF") }
                Btn("5G فقط", Modifier.weight(1f), size = 13.sp) { vm.quick("5G فقط", "08", "3FFFFFFF") }
                Btn("4G", Modifier.weight(1f), size = 13.sp) { vm.quick("4G", "03", "3FFFFFFF") }
                Btn("3G", Modifier.weight(1f), size = 13.sp) { vm.quick("3G", "02", "3FFFFFFF") }
                Btn("2G", Modifier.weight(1f), size = 13.sp) { vm.quick("2G", "01", "3FFFFFFF") }
            }

            // ---------- پروفایل‌ها ----------
            Sec("پروفایل‌ها (یک‌ضربه = اعمال)")
            if (vm.profiles.isEmpty()) Tag("هنوز پروفایلی ذخیره نشده")
            vm.profiles.forEachIndexed { i, p ->
                key(p.n) {
                    var armed by remember { mutableStateOf(false) }
                    LaunchedEffect(armed) { if (armed) { delay(2500); armed = false } }
                    Row(Modifier.padding(bottom = 6.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Btn("${p.n}  (${descP(p)})", Modifier.weight(1f)) { vm.applyProfile(p) }
                        Btn(if (armed) "؟" else "✕", Modifier.width(52.dp)) { if (armed) vm.deleteProfile(i) else armed = true }
                    }
                }
            }
            Sec("سوییچ خودکار: اگه میانگین SINR (اولی) تو این مدت (دومی) زیر حد بمونه، پروفایل بعدی امتحان می‌شه. حداقل ۲ پروفایل لازمه")
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                Check(vm.auto.on, "فعال") { vm.updateAuto(it, vm.auto.thr, vm.auto.mins) }
                Dropdown(listOf(0, 3, 5, 8, 10).map { it.toString() to "$it dB" }, vm.auto.thr.toString(), Modifier.weight(1f)) {
                    vm.updateAuto(vm.auto.on, it.toInt(), vm.auto.mins)
                }
                Dropdown(listOf(2, 3, 5, 10).map { it.toString() to "$it دقیقه" }, vm.auto.mins.toString(), Modifier.weight(1f)) {
                    vm.updateAuto(vm.auto.on, vm.auto.thr, it.toInt())
                }
            }
            Spacer(Modifier.height(4.dp))
            Tag(vm.autoMsg)

            // ---------- قفل باند ----------
            Sec("قفل باند: باندها رو انتخاب کن، بعد Apply")
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                Dropdown(OPT_LIST, vm.opt, Modifier.weight(1f)) { vm.opt = it }
                Check(vm.en5, " 4G+5G") { vm.en5 = it }
            }
            Spacer(Modifier.height(6.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Btn("همه باندها", Modifier.weight(1f)) { vm.lteSel = vm.lteSup.toSet() }
                Btn("پاک کردن", Modifier.weight(1f)) { vm.lteSel = emptySet(); vm.nrSel = emptySet() }
            }
            Sec("باندهای 4G")
            BandGrid(vm.lteSup, vm.lteSel, "B", FREQ, false) { n -> vm.lteSel = if (n in vm.lteSel) vm.lteSel - n else vm.lteSel + n }
            Sec("باندهای 5G (قفل باند هنوز آماده نیست؛ فعلاً از دکمه‌ی «5G فقط» استفاده کن)")
            BandGrid(vm.nrSup, vm.nrSel, "n", NRF, true) { n -> vm.nrSel = if (n in vm.nrSel) vm.nrSel - n else vm.nrSel + n }

            Sec("ذخیره‌ی انتخاب فعلی باندها به‌عنوان پروفایل")
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                OutlinedTextField(
                    value = pname, onValueChange = { pname = it }, singleLine = true,
                    placeholder = { Text("اسم پروفایل (مثلاً n78 شب)") }, modifier = Modifier.weight(1f)
                )
                Btn("ذخیره", Modifier.width(80.dp)) { if (vm.saveProfile(pname)) pname = "" }
            }
            Spacer(Modifier.height(12.dp))
        }
        Box(Modifier.fillMaxWidth().background(C.panel).padding(8.dp)) {
            Btn("Apply", Modifier.fillMaxWidth(), primary = true) { vm.applySelected() }
        }
    }
}
