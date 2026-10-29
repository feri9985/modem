(function () {
     if (window.__mm) return;
     window.__mm = 1;
     var q = function (s) { return document.querySelector(s); };
     var h = function (t, a) {
       var e = document.createElement(t);
       Object.assign(e, a || {});
       for (var i = 2; i < arguments.length; i++) [].concat(arguments[i]).forEach(function (x) { e.append(x); });
       return e;
     };
     var FREQ = { 1: 2100, 2: 1900, 3: 1800, 4: 1700, 5: 850, 7: 2600, 8: 900, 12: 700, 13: 700, 17: 700, 18: 850, 19: 850, 20: 800, 25: 1900, 26: 850, 28: 700, 32: 1500, 34: 2000, 38: 2600, 39:
 1900, 40: 2300, 41: 2500, 42: 3500, 43: 3700, 46: 5200, 48: 3500 };
     var LBL = { 1: "2100-B1", 3: "1800-B3", 7: "2600-B7", 8: "900-B8", 20: "800-B20", 28: "700-B28", 38: "2600-B38", 40: "2300-B40", 41: "2500-B41" };
     var G = "#2ecc71", Y = "#f5c542", R = "#e5484d";

     var cap = function (u, b) {
       try {
         if (String(u).indexOf("/api/user/") > -1) return;
         var a = JSON.parse(localStorage.mmcap || "[]");
         a.unshift("POST " + u + " " + String(b || "").slice(0, 400));
         localStorage.mmcap = JSON.stringify(a.slice(0, 12));
       } catch (e) {}
     };
     var xo = XMLHttpRequest.prototype.open, xs = XMLHttpRequest.prototype.send;
     XMLHttpRequest.prototype.open = function (m, u) { this._m = m; this._u = u; return xo.apply(this, arguments); };
     XMLHttpRequest.prototype.send = function (b) { if (this._m && String(this._m).toUpperCase() == "POST") cap(this._u, b); return xs.apply(this, arguments); };

     var css =
       "#mm{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#0c1118;color:#e8edf3;font:13px sans-serif;display:none;flex-direction:column;overflow:hidden}" +
       "#mm *{box-sizing:border-box;min-width:0;-webkit-tap-highlight-color:transparent}" +
       "#mm .hd{background:linear-gradient(90deg,#c7000b,#6e0a1c);padding:7px 10px;display:flex;align-items:center;justify-content:space-between;font-weight:bold;font-size:15px}" +
       "#mm .hd button{width:auto;margin:0;padding:4px 12px;background:rgba(0,0,0,.35);border:0;border-radius:8px;color:#fff;font:inherit}" +
       "#mm .tb{display:flex;gap:4px;padding:5px;background:#141b24}" +
       "#mm .tb button{flex:1;margin:0;padding:8px 0;background:#202a37;border:0;border-radius:8px;color:#c9d3df;font:inherit}" +
       "#mm .tb button.on{background:#2f7bf5;color:#fff}" +
       "#mm .bd{flex:1;overflow-y:auto;overflow-x:hidden;padding:6px 8px}" +
       "#mm .ft{padding:6px 8px;background:#141b24;border-top:1px solid #243041;display:none}" +
       "#mm .top{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:5px}" +
       "#mm .top b{font-size:14px;color:#ffd84d;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}" +
       "#mm .sp{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:5px}" +
       "#mm .sp div{background:#0f4d2a;border-radius:8px;padding:5px;text-align:center;font-size:15px;font-weight:bold}" +
       "#mm .sp div:last-child{background:#5a4a0a}" +
       "#mm .info{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px}" +
       "#mm .tag{background:#1a2430;border-radius:6px;padding:3px 7px;font-size:11px}" +
       "#mm .sr{display:grid;grid-template-columns:50px 1fr 82px;gap:6px;align-items:center;margin:4px 0}" +
       "#mm .sr .n{background:#202a37;border-radius:6px;padding:4px 0;text-align:center;font-size:11px;font-weight:bold}" +
       "#mm .bar{position:relative;height:22px;background:#243041;border-radius:11px;overflow:hidden}" +
       "#mm .bar i{position:absolute;left:0;top:0;bottom:0;width:0;transition:width .4s}" +
       "#mm .bar span{position:absolute;left:0;right:0;top:0;bottom:0;text-align:center;line-height:22px;font-weight:bold;text-shadow:0 0 3px #000}" +
       "#mm .pill{border-radius:11px;padding:4px 0;text-align:center;font-size:11px;font-weight:bold;color:#000;background:#3a4656}" +
       "#mm .sec{margin:8px 0 4px;color:#8a97a8;font-size:11px}" +
       "#mm .chips{display:grid;grid-template-columns:repeat(6,1fr);gap:4px}" +
       "#mm .chip{margin:0;background:#1a2430;border:1px solid #2c3746;border-radius:8px;padding:5px 0;text-align:center;color:#c9d3df;font:inherit;font-size:12px}" +
       "#mm .chip.on{background:#1f7a3d;border-color:#2ecc71;color:#fff}" +
       "#mm .chip small{display:block;font-size:9px;opacity:.7}" +
       "#mm .row{display:flex;gap:5px;align-items:center}" +
       "#mm .b{flex:1;margin:0;padding:9px 2px;background:#2c3746;border:0;border-radius:8px;color:#e8edf3;font:inherit}" +
       "#mm .p{background:#2f7bf5;font-weight:bold}#mm .r{background:#e5484d}" +
       "#mm button{touch-action:manipulation}" +
       "#mm button:active,#mm .fl{background:#fff !important;color:#000 !important;transform:scale(.95)}" +
       "#mm select,#mm input[type=text],#mm textarea{width:100%;margin:3px 0;padding:8px;background:#1a2430;border:0;border-radius:8px;color:#e8edf3;font:inherit}" +
       "#mm select{flex:1}#mm label{white-space:nowrap}" +
       "#mm table{width:100%;border-collapse:collapse}#mm td{padding:6px 3px;border-bottom:1px solid #243041;word-break:break-all}" +
       "#mm pre{background:#080b10;padding:8px;border-radius:8px;font-size:11px;white-space:pre-wrap;max-height:200px;overflow:auto}" +
       "#mmb{position:fixed;right:14px;bottom:14px;z-index:100000;width:56px;height:56px;border-radius:28px;border:0;background:#c7000b;color:#fff;font-size:24px;box-shadow:0 2px 8px rgba(0,0,0,.5)}"
  +
       "#mmt{position:fixed;left:50%;bottom:110px;transform:translateX(-50%);background:#000d;color:#fff;padding:10px
 16px;border-radius:20px;z-index:100001;display:none;max-width:90%;text-align:center}";
     document.head.append(h("style", { textContent: css }));

     var get = function (u) { return fetch(u, { credentials: "include" }).then(function (r) { return r.text(); }); };
     var tag = function (x, t) { var m = x.match(new RegExp("<" + t + ">([^<]*)</" + t + ">", "i")); return m ? m[1] : ""; };
     var num = function (v) { var m = String(v || "").match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : NaN; };
     var logEl = h("pre");
     var log = function (s) { logEl.textContent = new Date().toLocaleTimeString() + " " + String(s).slice(0, 400) + "\n" + logEl.textContent.slice(0, 3000); };
     var toastEl = h("div", { id: "mmt" }), tt;
     var toast = function (s) { toastEl.textContent = s; toastEl.style.display = "block"; clearTimeout(tt); tt = setTimeout(function () { toastEl.style.display = "none"; }, 3000); };
     async function tok() {
       var t = await get(location.href);
       var m = Array.from(t.matchAll(/name="csrf_token" content="([^"]*)"/g));
       return m.length ? m[m.length - 1][1] : "";
     }
     async function post(u, b) {
       var t = await tok();
       var r = await fetch(u, { method: "POST", credentials: "include", headers: { "__RequestVerificationToken": t, "Content-Type": "application/xml" }, body: b });
       var x = await r.text();
       log("POST " + u + " -> " + x);
       return x;
     }
     var netType = function (m) { return { "0": "No Service", "1": "2G", "2": "2G", "3": "2G", "41": "3G", "42": "3G", "43": "3G", "44": "3G", "45": "3G+", "46": "3G+", "101": "LTE 4G", "1011": "LTE
 CA 4G+", "111": "5G NR" }[m] || m; };

     var body = h("div", { className: "bd" }), foot = h("div", { className: "ft" }), cur = "h", timer, home, cnt = 0;
     var tabs = h("div", { className: "tb" }), tabBtns = {};
     [["h", "Home"], ["d", "Devices"], ["t", "Tools"]].forEach(function (t) {
       tabBtns[t[0]] = h("button", { textContent: t[1], onclick: function () { go(t[0]); } });
       tabs.append(tabBtns[t[0]]);
     });
     var panel = h("div", { id: "mm" }, h("div", { className: "hd" }, h("span", { textContent: "Huawei 5G CPE Max" }), h("button", { textContent: "✕", onclick: function () { panel.style.display =
 "none"; clearInterval(timer); } })), tabs, body, foot);
     panel.addEventListener("click", function (e) {
       var b = e.target.closest ? e.target.closest("button") : null;
       if (b) { b.classList.add("fl"); setTimeout(function () { b.classList.remove("fl"); }, 250); }
     }, true);
     var openPanel = function () { panel.style.display = "flex"; go(cur); clearInterval(timer); timer = setInterval(tick, 1500); };
     var btn = h("button", { id: "mmb", textContent: "📶", onclick: openPanel });
     document.body.append(panel, btn, toastEl);

     function go(t) {
       cur = t;
       Object.keys(tabBtns).forEach(function (k) { tabBtns[k].className = k == t ? "on" : ""; });
       foot.style.display = "none"; foot.replaceChildren();
       if (t == "h") {
         if (!home) { home = buildHome(); loadBands(); }
         body.replaceChildren(home.root);
         foot.replaceChildren(home.foot); foot.style.display = "block";
         tick();
       } else if (t == "d") devs(); else tools();
     }

     // ---------- home ----------
     var MET = { rssi: ["RSSI", "dBm", -100, -45, -65, -80], rsrp: ["RSRP", "dBm", -120, -70, -90, -105], rsrq: ["RSRQ", "dB", -20, -3, -10, -15], sinr: ["SINR", "dB", -5, 30, 13, 0] };
     function row(label, key, unit, m) {
       var fill = h("i"), val = h("span", { textContent: "-" }), pill = h("div", { className: "pill", textContent: "-" });
       var root = h("div", { className: "sr" }, h("div", { className: "n", textContent: label }), h("div", { className: "bar" }, fill, val), pill);
       return { root: root, fill: fill, val: val, pill: pill, m: m, unit: unit };
     }
     function setRow(r, v) {
       var n = num(v), m = r.m;
       if (isNaN(n)) { r.val.textContent = "-"; r.fill.style.width = "0"; r.pill.textContent = "-"; r.pill.style.background = "#3a4656"; return; }
       var col = n >= m[4] ? G : n >= m[5] ? Y : R;
       var pct = Math.round(Math.max(3, Math.min(100, (n - m[2]) * 100 / (m[3] - m[2]))));
       r.val.textContent = n + " " + r.unit; r.fill.style.width = pct + "%"; r.fill.style.background = col;
       r.pill.textContent = pct + "% " + (n >= m[4] ? "عالی" : n >= m[5] ? "متوسط" : "بد"); r.pill.style.background = col;
     }
     var BODY = function (m, b, l, o) {
       return "<request><NetworkMode>" + m + "</NetworkMode><NetworkBand>" + b + "</NetworkBand><LTEBand>" + l + "</LTEBand>" + (o !== "" ? "<networkOption>" + o + "</networkOption>" : "") +
 "</request>";
     };
     function buildHome() {
       var o = { rows: {}, nr: [] };
       o.opn = h("b", { textContent: "..." }); o.mode = h("span", { className: "tag", textContent: "-" });
       o.dl = h("div", { textContent: "↓ -" }); o.ul = h("div", { textContent: "↑ -" });
       o.info = h("div", { className: "info" });
       var table = h("div");
       [["RSSI", "rssi", "rssi"], ["RSRP", "rsrp", "rsrp"], ["RSRQ", "rsrq", "rsrq"], ["SINR", "sinr", "sinr"]].forEach(function (d) {
         var r = row(d[0], d[1], MET[d[2]][1], MET[d[2]]); o.rows[d[1]] = r; table.append(r.root);
       });
       ["rsrp", "rsrq", "sinr"].forEach(function (k) {
         var r = row("5G " + MET[k][0], "nr" + k, MET[k][1], MET[k]); o.rows["nr" + k] = r; o.nr.push(r.root); table.append(r.root);
       });
       var quick = function (name, m, b) {
         return h("button", { className: "b", textContent: name, onclick: async function () { toast(name + " ..."); var r = await post("/api/net/net-mode", BODY(m, b, "7FFFFFFFFFFFFFFF", ""));
 toast(r.indexOf("OK") > -1 ? name + " ✓" : "Error"); loadBands(); } });
       };
       o.chips = h("div", { className: "chips" });
       o.root = h("div", {},
         h("div", { className: "top" }, o.opn, o.mode),
         h("div", { className: "sp" }, o.dl, o.ul), o.info, table,
         h("div", { className: "sec", textContent: "حالت شبکه" }),
         h("div", { className: "row" }, quick("Auto", "00", "3FFFFFFF"), quick("5G", "00", "00000000"), quick("4G", "03", "3FFFFFFF"), quick("3G", "02", "3FFFFFFF"), quick("2G", "01", "3FFFFFFF")),
         h("div", { className: "sec", textContent: "قفل باند 4G: باندها رو بزن، بعد Apply" }), o.chips);
       o.opt = h("select", {}, h("option", { value: "", textContent: "5G: بدون تغییر" }), h("option", { value: "0", textContent: "5G NSA" }), h("option", { value: "1", textContent: "5G SA" }),
 h("option", { value: "2", textContent: "5G SA+NSA" }));
       o.en5 = h("input", { type: "checkbox", checked: true });
       var all = function (v) { o.chips.querySelectorAll(".chip").forEach(function (i) { i.classList.toggle("on", v); }); };
       o.foot = h("div", {},
         h("div", { className: "row" }, o.opt, h("label", {}, o.en5, " 4G+5G")),
         h("div", { className: "row", style: "margin-top:5px" },
           h("button", { className: "b", textContent: "همه", onclick: function () { all(true); } }),
           h("button", { className: "b", textContent: "پاک", onclick: function () { all(false); } }),
           h("button", {
             className: "b p", style: "flex:2", textContent: "Apply", onclick: async function () {
               var v = 0n;
               o.chips.querySelectorAll(".chip.on").forEach(function (i) { v |= 1n << BigInt(i.dataset.b - 1); });
               if (v == 0n) return toast("حداقل یک باند انتخاب کن");
               toast("در حال اعمال...");
               var hx = v.toString(16).toUpperCase();
               var r = await post("/api/net/net-mode", o.en5.checked ? BODY("00", "00000000", hx, o.opt.value) : BODY("03", "3FFFFFFF", hx, ""));
               toast(r.indexOf("OK") > -1 ? "اعمال شد ✓" : "خطا: " + r.slice(0, 80));
               loadBands();
             }
           })));
       return o;
     }
     async function loadBands() {
       try {
         var nm = await get("/api/net/net-mode"), ls = await get("/api/net/net-mode-list");
         var cm = ls.match(/<LTEBand>[\s\S]*?<Value>([0-9A-Fa-f]+)<\/Value>/);
         var sup = cm ? BigInt("0x" + cm[1]) : (1n << 53n) - 1n;
         var cv = BigInt("0x" + (tag(nm, "LTEBand") || "0")), els = [];
         for (var n = 1; n <= 64; n++) {
           if (!((sup >> BigInt(n - 1)) & 1n)) continue;
           var lbl = LBL[n] || ("B" + n + (FREQ[n] ? " "+FREQ[n]+"M" : ""));
           var c = h("button", { className: "chip" + (((cv >> BigInt(n - 1)) & 1n) ? " on" : ""), onclick: function () { this.classList.toggle("on"); } }, h("div", { textContent: lbl }), h("small", {
 textContent: "" }));
           c.dataset.b = n; els.push(c);
         }
         home.chips.replaceChildren.apply(home.chips, els);
       } catch (e) { log("bands ERR " + e); }
     }
     var busy = false;
     async function tick() {
       if (cur != "h" || panel.style.display != "flex" || busy || !home) return;
       busy = true;
       try {
         var a = await get("/api/device/signal"), t = await get("/api/monitoring/traffic-statistics");
         ["rssi", "rsrp", "rsrq", "sinr"].forEach(function (k) { setRow(home.rows[k], tag(a, k)); });
         var has5 = tag(a, "nrrsrp") != "";
         home.nr.forEach(function (e) { e.style.display = has5 ? "" : "none"; });
         ["rsrp", "rsrq", "sinr"].forEach(function (k) { setRow(home.rows["nr" + k], tag(a, "nr" + k)); });
         var mb = function (v) { var n = parseFloat(v) * 8 / 1e6; return isNaN(n) ? "-" : n.toFixed(1); };
         home.dl.textContent = "↓ " + mb(tag(t, "CurrentDownloadRate")) + " Mbps"; home.ul.textContent = "↑ " + mb(tag(t, "CurrentUploadRate")) + " Mbps";
         var items = [["Band", tag(a, "band") && tag(a, "band") != "0" ? "B" + tag(a, "band") : ""], ["PCI", tag(a, "pci")], ["Cell", tag(a, "cell_id")], ["TAC", tag(a, "tac")], ["4G BW", tag(a,
 "dlbandwidth")], ["5G BW", tag(a, "nrdlbandwidth")]];
         home.info.replaceChildren.apply(home.info, items.filter(function (i) { return i[1]; }).map(function (i) { return h("span", { className: "tag", textContent: i[0] + ": " + i[1] }); }));
         if (cnt++ % 6 == 0) {
           var pl = await get("/api/net/current-plmn"), st = await get("/api/monitoring/status");
           home.opn.textContent = (tag(pl, "FullName") || "No Service") + " " + tag(pl, "Numeric");
           home.mode.textContent = netType(tag(st, "CurrentNetworkTypeEx"));
         }
       } catch (e) { log("ERR " + e); }
       busy = false;
     }

     // ---------- devices ----------
     async function devs() {
       body.replaceChildren(h("div", { textContent: "Loading..." }));
       var x = await get("/api/lan/HostInfo");
       if (x.indexOf("<Host") < 0) x = await get("/api/wlan/host-list");
       var d = new DOMParser().parseFromString(x, "text/xml"), tb = h("table");
       d.querySelectorAll("Host").forEach(function (e) {
         var g = function (n) { var f = e.querySelector(n); return f ? f.textContent : ""; };
         tb.append(h("tr", {}, h("td", { textContent: g("HostName") || "?" }), h("td", { textContent: g("IpAddress") + " " + g("MacAddress") })));
       });
       body.replaceChildren(tb.children.length ? tb : h("pre", { textContent: x.slice(0, 1500) }));
     }

     // ---------- tools ----------
     function tools() {
       var m = h("select", {}, h("option", { textContent: "GET" }), h("option", { textContent: "POST" }));
       var p = h("input", { type: "text", value: "/api/net/net-mode" }), b = h("textarea", { rows: 3 }), o = h("pre");
       var capEl = h("pre", { textContent: (JSON.parse(localStorage.mmcap || "[]")).join("\n\n") || "(خالی)" });
       body.replaceChildren(
         h("button", { className: "b r", style: "width:100%", textContent: "Reboot modem", onclick: function () { if (confirm("Reboot modem?")) { toast("Reboot..."); post("/api/device/control",
 "<request><Control>1</Control></request>"); } } }),
         h("div", { className: "sec", textContent: "درخواست‌های ثبت‌شده (برای قفل 5G): صفحه‌ی Developer options مودم رو باز کن، باند رو قفل کن و Save بزن، بعد اینجا رو ببین." }), capEl,
         h("button", { className: "b", style: "width:100%", textContent: "پاک کردن", onclick: function () { localStorage.mmcap = "[]"; capEl.textContent = "(خالی)"; } }),
         h("div", { className: "sec", textContent: "Explorer" }), m, p, b,
         h("button", { className: "b", style: "width:100%", textContent: "Send", onclick: async function () { o.textContent = m.value == "GET" ? await get(p.value) : await post(p.value, b.value); }
 }), o,
         h("div", { className: "sec", textContent: "Log" }), logEl);
     }

     try { if (/home\.html/.test(location.href) && !sessionStorage.mmo) { sessionStorage.mmo = 1; openPanel(); } } catch (e) {}
   })();
