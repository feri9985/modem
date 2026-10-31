package com.farhad.modem

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.*
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.*

object C {
    val bg = Color(0xFF0C1118)
    val panel = Color(0xFF141B24)
    val card = Color(0xFF1A2430)
    val btn = Color(0xFF2C3746)
    val track = Color(0xFF243041)
    val blue = Color(0xFF2F7BF5)
    val green = Color(0xFF2ECC71)
    val yellow = Color(0xFFF5C542)
    val red = Color(0xFFE5484D)
    val muted = Color(0xFF8A97A8)
    val text = Color(0xFFE8EDF3)
}

@Composable
fun AppRoot(vm: ModemViewModel) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = C.blue, onPrimary = Color.White, background = C.bg, onBackground = C.text,
            surface = C.panel, onSurface = C.text, surfaceVariant = C.card, onSurfaceVariant = C.text
        )
    ) {
        CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
            Box(Modifier.fillMaxSize().background(C.bg)) {
                if (vm.loggedIn) MainScreen(vm) else LoginScreen(vm)
                if (vm.toastMsg.isNotEmpty()) {
                    Box(
                        Modifier.align(Alignment.BottomCenter).padding(bottom = 96.dp, start = 16.dp, end = 16.dp)
                            .clip(RoundedCornerShape(22.dp)).background(Color(0xDD000000)).padding(horizontal = 16.dp, vertical = 11.dp)
                    ) { Text(vm.toastMsg, color = Color.White, fontSize = 14.sp, textAlign = TextAlign.Center) }
                }
            }
        }
    }
}

// ---------- اجزای مشترک ----------
@Composable
fun Sec(t: String) {
    Text(t, color = C.muted, fontSize = 12.sp, modifier = Modifier.padding(top = 12.dp, bottom = 6.dp))
}

@Composable
fun Tag(t: String) {
    Box(Modifier.clip(RoundedCornerShape(7.dp)).background(C.card).padding(horizontal = 9.dp, vertical = 4.dp)) {
        Text(t, color = C.text, fontSize = 12.sp)
    }
}

@Composable
fun TagRow(items: List<String>) {
    items.chunked(3).forEach { r ->
        Row(Modifier.padding(bottom = 5.dp), horizontalArrangement = Arrangement.spacedBy(5.dp)) { r.forEach { Tag(it) } }
    }
}

@Composable
fun Btn(
    text: String, modifier: Modifier = Modifier, primary: Boolean = false, danger: Boolean = false,
    size: TextUnit = 15.sp, onClick: () -> Unit
) {
    Button(
        onClick = onClick, modifier = modifier, shape = RoundedCornerShape(10.dp),
        contentPadding = PaddingValues(horizontal = 4.dp, vertical = 12.dp),
        colors = ButtonDefaults.buttonColors(containerColor = if (primary) C.blue else if (danger) C.red else C.btn, contentColor = Color.White)
    ) { Text(text, fontSize = if (primary) 17.sp else size, textAlign = TextAlign.Center, fontWeight = if (primary) FontWeight.Bold else FontWeight.Normal) }
}

@Composable
fun Check(checked: Boolean, label: String, onChange: (Boolean) -> Unit) {
    Row(Modifier.clickable { onChange(!checked) }.padding(4.dp), verticalAlignment = Alignment.CenterVertically) {
        Checkbox(checked = checked, onCheckedChange = onChange)
        Text(label, color = C.text, fontSize = 15.sp)
    }
}

@Composable
fun Dropdown(options: List<Pair<String, String>>, value: String, modifier: Modifier = Modifier, onSelect: (String) -> Unit) {
    var open by remember { mutableStateOf(false) }
    val label = options.firstOrNull { it.first == value }?.second ?: value
    Box(modifier) {
        Box(Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp)).background(C.card).clickable { open = true }.padding(12.dp)) {
            Text("$label  ▾", color = C.text, fontSize = 15.sp)
        }
        DropdownMenu(expanded = open, onDismissRequest = { open = false }) {
            options.forEach { (k, l) -> DropdownMenuItem(text = { Text(l) }, onClick = { onSelect(k); open = false }) }
        }
    }
}

@Composable
fun MonoBox(t: String) {
    SelectionContainer {
        Text(
            t, color = C.text, fontSize = 12.sp, fontFamily = FontFamily.Monospace,
            modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(8.dp)).background(Color(0xFF080B10)).padding(8.dp)
        )
    }
}

@Composable
fun SigRow(label: String, v: Double?, m: Met) {
    val col = when {
        v == null -> C.track
        v >= m.good -> C.green
        v >= m.mid -> C.yellow
        else -> C.red
    }
    val frac = if (v == null) 0f else ((v - m.min) / (m.max - m.min)).coerceIn(0.05, 1.0).toFloat()
    val txt = if (v == null) "-" else fmt(v) + " " + m.unit + "  " + (if (v >= m.good) "عالی" else if (v >= m.mid) "متوسط" else "بد")
    Box(Modifier.fillMaxWidth().padding(vertical = 3.dp).height(28.dp).clip(RoundedCornerShape(14.dp)).background(C.track)) {
        Box(Modifier.fillMaxHeight().fillMaxWidth(frac).background(col))
        Row(Modifier.fillMaxSize().padding(horizontal = 12.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text(label, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
            Text(txt, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun BandGrid(sup: List<Int>, sel: Set<Int>, prefix: String, freq: Map<Int, Int>, nr: Boolean, onToggle: (Int) -> Unit) {
    val onBg = if (nr) Color(0xFF7A1F6E) else Color(0xFF1F7A3D)
    val onBorder = if (nr) Color(0xFFE060D0) else C.green
    Column {
        sup.chunked(3).forEach { r ->
            Row(Modifier.fillMaxWidth().padding(bottom = 6.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                r.forEach { n ->
                    val on = n in sel
                    Box(
                        Modifier.weight(1f).clip(RoundedCornerShape(10.dp)).background(if (on) onBg else C.card)
                            .border(1.dp, if (on) onBorder else C.btn, RoundedCornerShape(10.dp))
                            .clickable { onToggle(n) }.padding(vertical = 10.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("$prefix$n", color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                            val f = freq[n]
                            if (f != null) Text(" $f", color = Color(0xBFFFFFFF), fontSize = 11.sp)
                        }
                    }
                }
                repeat(3 - r.size) { Spacer(Modifier.weight(1f)) }
            }
        }
    }
}

// ---------- لاگین ----------
@Composable
fun LoginScreen(vm: ModemViewModel) {
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Spacer(Modifier.height(24.dp))
        Text("Huawei 5G CPE Max", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
        Text(
            if (vm.netReady) "به Wi-Fi مودم وصل شد ✓" else "منتظر اتصال به Wi-Fi مودم...",
            color = if (vm.netReady) C.green else C.yellow, fontSize = 14.sp
        )
        OutlinedTextField(value = vm.host, onValueChange = { vm.host = it }, label = { Text("آدرس مودم") }, singleLine = true, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = vm.user, onValueChange = { vm.user = it }, label = { Text("نام کاربری") }, singleLine = true, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(
            value = vm.pass, onValueChange = { vm.pass = it }, label = { Text("رمز عبور") }, singleLine = true,
            visualTransformation = PasswordVisualTransformation(), modifier = Modifier.fillMaxWidth()
        )
        Check(vm.remember, "ذخیره‌ی رمز و ورود خودکار") { vm.remember = it }
        Btn(if (vm.loginBusy) "در حال ورود..." else "ورود", Modifier.fillMaxWidth(), primary = true) {
            if (vm.netReady && !vm.loginBusy) vm.login()
        }
        if (vm.loginError.isNotEmpty()) {
            Text(vm.loginError, color = C.red, fontSize = 14.sp)
            Sec("لاگ (اگه لاگین جواب نداد این رو بفرست)")
            MonoBox(vm.logText.take(1500))
        }
    }
}

// ---------- صفحه‌ی اصلی بعد از لاگین ----------
@Composable
fun MainScreen(vm: ModemViewModel) {
    BackHandler(enabled = vm.pg != Pg.Home) { vm.go(Pg.Home) }
    Column(Modifier.fillMaxSize()) {
        Row(
            Modifier.fillMaxWidth().background(Brush.horizontalGradient(listOf(Color(0xFFC7000B), Color(0xFF6E0A1C))))
                .padding(horizontal = 12.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Huawei 5G CPE Max", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            TextButton(onClick = { vm.logout() }) { Text("خروج", color = Color.White) }
        }
        ScrollableTabRow(selectedTabIndex = vm.pg.ordinal, edgePadding = 0.dp, containerColor = C.panel, contentColor = Color.White) {
            Pg.values().forEach { p ->
                Tab(selected = vm.pg == p, onClick = { vm.go(p) }, text = { Text(p.label, fontSize = 13.sp, maxLines = 1, overflow = TextOverflow.Clip) })
            }
        }
        Box(Modifier.weight(1f).fillMaxWidth()) {
            when (vm.pg) {
                Pg.Home -> HomeScreen(vm)
                Pg.Align -> AlignScreen(vm)
                Pg.History -> HistoryScreen(vm)
                Pg.Operator -> OperatorScreen(vm)
                Pg.Devices -> DevicesScreen(vm)
                Pg.Tools -> ToolsScreen(vm)
            }
        }
    }
}
