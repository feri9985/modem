package com.farhad.modem

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.*
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.*

// ---------- Operator ----------
@Composable
fun OperatorScreen(vm: ModemViewModel) {
    LaunchedEffect(Unit) { vm.opShow() }
    var rat by remember { mutableStateOf("7") }
    var plmn by remember { mutableStateOf("") }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(8.dp)) {
        Sec("وضعیت فعلی")
        MonoBox(vm.opStatus.ifEmpty { "..." })
        Spacer(Modifier.height(6.dp))
        Btn("خودکار (Auto)", Modifier.fillMaxWidth()) { vm.setReg(0, "", "") }
        Sec("انتخاب سریع (بدون جستجو)")
        Dropdown(listOf("7" to "4G/5G NSA (LTE)", "2" to "3G", "0" to "2G"), rat) { rat = it }
        Spacer(Modifier.height(6.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            Btn("ایرانسل", Modifier.weight(1f)) { vm.setReg(1, "43235", rat) }
            Btn("همراه اول", Modifier.weight(1f)) { vm.setReg(1, "43211", rat) }
            Btn("رایتل", Modifier.weight(1f)) { vm.setReg(1, "43220", rat) }
        }
        Sec("PLMN دلخواه")
        OutlinedTextField(value = plmn, onValueChange = { plmn = it }, singleLine = true, placeholder = { Text("PLMN مثلا 43235") }, modifier = Modifier.fillMaxWidth())
        Spacer(Modifier.height(6.dp))
        Btn("اتصال به PLMN بالا", Modifier.fillMaxWidth()) { if (plmn.isNotBlank()) vm.setReg(1, plmn.trim(), rat) }
        Sec("جستجوی اپراتورهای اطراف")
        Btn(if (vm.scanning) "در حال جستجو..." else "جستجو (اینترنت چند دقیقه قطع می‌شه)", Modifier.fillMaxWidth(), primary = true) { vm.scan() }
        if (vm.scanning) Sec("۱ تا ۳ دقیقه طول می‌کشه و اینترنت قطع می‌شه. صبر کن.")
        vm.opList.forEach { n ->
            val num = n["Numeric"] ?: ""
            val rt = n["Rat"] ?: ""
            val st = n["State"] ?: ""
            Column(Modifier.fillMaxWidth().padding(top = 7.dp).clip(RoundedCornerShape(12.dp)).background(Color(0xFF161E29)).padding(12.dp)) {
                Text((n["FullName"] ?: "").ifEmpty { (n["ShortName"] ?: "").ifEmpty { num } }, color = C.text, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                Text("$num  Rat:$rt  " + (if (st == "2") "(فعلی)" else if (st == "3") "(ممنوع)" else ""), color = Color(0xFF9FB0C3), fontSize = 14.sp)
                Spacer(Modifier.height(6.dp))
                Btn("اتصال به این اپراتور", Modifier.fillMaxWidth(), primary = true) { vm.setReg(1, num, rt) }
            }
        }
        if (vm.opRaw.isNotEmpty()) { Spacer(Modifier.height(6.dp)); MonoBox(vm.opRaw) }
        Spacer(Modifier.height(12.dp))
    }
}

// ---------- Devices ----------
@Composable
fun DevicesScreen(vm: ModemViewModel) {
    LaunchedEffect(Unit) { vm.loadDevices() }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(8.dp)) {
        Sec(if (vm.devLoading) "Loading..." else "دستگاه‌های متصل: ${vm.devices.size}")
        vm.devices.forEach { d ->
            Column(Modifier.fillMaxWidth().padding(vertical = 4.dp).clip(RoundedCornerShape(12.dp)).background(Color(0xFF161E29)).padding(12.dp)) {
                Text((d["HostName"] ?: "").ifEmpty { "Unknown" }, color = C.text, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                Text(d["IpAddress"] ?: "", color = Color(0xFF9FB0C3), fontSize = 14.sp)
                Text((d["MacAddress"] ?: "") + "  " + (d["InterfaceType"] ?: ""), color = Color(0xFF9FB0C3), fontSize = 14.sp)
            }
        }
        if (vm.devRaw.isNotEmpty()) MonoBox(vm.devRaw)
        Spacer(Modifier.height(8.dp))
        Btn("تازه‌سازی", Modifier.fillMaxWidth()) { vm.loadDevices() }
    }
}

// ---------- Tools ----------
@Composable
fun ToolsScreen(vm: ModemViewModel) {
    val cb = LocalClipboardManager.current
    var confirm by remember { mutableStateOf(false) }
    var devPage by remember { mutableStateOf("/html/developmode.html") }
    var post by remember { mutableStateOf(false) }
    var path by remember { mutableStateOf("/api/net/net-mode") }
    var body by remember { mutableStateOf("") }

    if (confirm) {
        AlertDialog(
            onDismissRequest = { confirm = false },
            title = { Text("Reboot modem?") },
            confirmButton = { TextButton(onClick = { confirm = false; vm.reboot() }) { Text("Reboot") } },
            dismissButton = { TextButton(onClick = { confirm = false }) { Text("Cancel") } }
        )
    }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(8.dp)) {
        Btn("Reboot modem", Modifier.fillMaxWidth(), danger = true) { confirm = true }

        Sec("برای ساخت قفل n78/n48: این دکمه رو بزن، صبر کن تا «done» بیاد، متن رو کپی کن و برام بفرست.")
        OutlinedTextField(value = devPage, onValueChange = { devPage = it }, singleLine = true, label = { Text("صفحه‌ی اضافه برای بررسی") }, modifier = Modifier.fillMaxWidth())
        Spacer(Modifier.height(6.dp))
        Btn("جمع‌آوری اطلاعات 5G", Modifier.fillMaxWidth(), primary = true) { vm.collect(devPage) }
        Spacer(Modifier.height(6.dp))
        MonoBox(vm.collectOut.ifEmpty { "نتیجه اینجا میاد" })
        Spacer(Modifier.height(6.dp))
        Btn("کپی نتیجه", Modifier.fillMaxWidth()) { cb.setText(AnnotatedString(vm.collectOut)); vm.toast("کپی شد") }

        Sec("Explorer")
        Dropdown(listOf("GET" to "GET", "POST" to "POST"), if (post) "POST" else "GET") { post = it == "POST" }
        OutlinedTextField(value = path, onValueChange = { path = it }, singleLine = true, modifier = Modifier.fillMaxWidth().padding(top = 6.dp))
        if (post) OutlinedTextField(value = body, onValueChange = { body = it }, minLines = 2, modifier = Modifier.fillMaxWidth().padding(top = 6.dp))
        Spacer(Modifier.height(6.dp))
        Btn("Send", Modifier.fillMaxWidth()) { vm.explore(post, path.trim(), body) }
        if (vm.explorerOut.isNotEmpty()) { Spacer(Modifier.height(6.dp)); MonoBox(vm.explorerOut.take(4000)) }

        Sec("Log")
        MonoBox(vm.logText.ifEmpty { "(خالی)" })
        Spacer(Modifier.height(6.dp))
        Btn("کپی لاگ", Modifier.fillMaxWidth()) { cb.setText(AnnotatedString(vm.logText)); vm.toast("کپی شد") }
        Spacer(Modifier.height(12.dp))
    }
}
