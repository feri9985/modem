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
  var FREQ = { 1: 2100, 2: 1900, 3: 1800, 4: 1700, 5: 850, 7: 2600, 8: 900, 12: 700, 13: 700, 17: 700, 18: 850, 19: 850, 20: 800, 25: 1900, 26: 850, 28: 700, 32: 1500, 34: 2000, 38: 2600, 39: 1900, 40: 2300, 41: 2500, 42: 3500, 43: 3700, 46: 5200, 48: 3500 };
  var G = "#2ecc71", Y = "#f5c542", R = "#e5484d";

  // capture POST requests made by the modem's own pages (to learn the 5G lock API)
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
    "#mm{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;background:#0c1118;color:#e8edf3;font:14px sans-serif;display:none;flex-direction:column;overflow:hidden}" +
    "#mm *{box-sizing:border-box}" +
    "#mm .hd{background:linear-gradient(90deg,#c7000b,#6e0a1c);padding:10px 12px;display:flex;align-items:center;justify-content:space-between;font-weight:bold;font-size:16px}" +
    "#mm .hd button{width:auto;margin:0;padding:6px 14px;background:rgba(0,0,0,.35);border:0;border-radius:8px;color:#fff;font:inherit}" +
    "#mm .tb{display:flex;gap:4px;padding:6px;background:#141b24}" +
    "#mm .tb button{flex:1;margin:0;padding:9px 0;background:#202a37;border:0;border-radius:8px;color:#c9d3df;font:inherit}" +
    "#mm .tb button.on{background:#2f7bf5;color:#fff}" +
    "#mm .bd{flex:1;overflow-y:auto;overflow-x:hidden;padding:8px}" +
    "#mm .ft{padding:8px;background:#141b24;border-top:1px solid #243041;display:none}" +
    "#mm .cards{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    "#mm .cd{background:#161e29;border-radius:12px;padding:10px}" +
    "#mm .cd .l{color:#8a97a8;font-size:12px}" +
    "#mm .cd .v{font-size:28px;font-weight:bold;line-height:1.2}" +
    "#mm .cd .u{font-size:12px;color:#8a97a8;font-weight:normal}" +
    "#mm .bar{height:6px;border-radius:3px;background:#243041;margin-top:6px;overflow:hidden}" +
    "#mm .bar i{display:block;height:100%;width:0;transition:width .5s}" +
    "#mm .q{font-size:12px;margin-top:4px}" +
    "#mm .sec{margin:12px 0 6px;color:#8a97a8;font-size:12px}" +
    "#mm .info{display:flex;flex-wrap:wrap;gap:6px}" +
    "#mm .tag{background:#1a2430;border-radius:8px;padding:5px 9px;font-size:12px}" +
    "#mm .chips{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}" +
    "#mm .chip{margin:0;background:#1a2430;border:1px solid #2c3746;border-radius:10px;padding:8px 2px;text-align:center;color:#c9d3df;font:inherit}" +
    "#mm .chip.on{background:#1f7a3d;border-color:#2ecc71;color:#fff}" +
    "#mm .chip small{display:block;font-size:10px;opacity:.7}" +
    "#mm .row{display:flex;gap:6px;align-items:center}" +
    "#mm .b{flex:1;margin:0;padding:10px 4px;background:#2c3746;border:0;border-radius:8px;color:#e8edf3;font:inherit}" +
    "#mm .p{background:#2f7bf5;font-weight:bold}#mm .r{background:#e5484d}" +
    "#mm select,#mm input[type=text],#mm textarea{width:100%;margin:3px 0;padding:9px;background:#1a2430;border:0;border-radius:8px;color:#e8edf3;font:inherit}" +
    "#mm select{flex:1}#mm label{white-space:nowrap}" +
    "#mm table{width:100%;border-collapse:collapse}#mm td{padding:7px 4px;border-bottom:1px solid #243041;word-break:break-all}" +
    "#mm pre{background:#080b10;padding:8px;border-radius:8px;font-size:11px;white-space:pre-wrap;max-height:220px;overflow:auto}" +
    "#mmb{position:fixed;right:14px;bottom:14px;z-index:100000;width:56px;height:56px;border-radius:28px;border:0;background:#c7000b;color:#fff;font-size:24px;box-shadow:0 2px 8px rgba(0,0,0,.5)}" +
    "#mmt{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#000c;color:#fff;padding:10px 16px;border-radius:20px;z-index:100001;display:none}";
  document.head.append(h("style", { textContent: css }));

  var get = function (u) { return fetch(u, { credentials: "include" }).then(function (r) { return r.text(); }); };
  var tag = function (x, t) { var m = x.match(new RegExp("<" + t + ">([^<]*)</" + t + ">", "i")); return m ? m[1] : ""; };
  var num = function (v) { var m = String(v || "").match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : NaN; };
  var logEl = h("pre");
  var log = function (s) { logEl.textContent = new Date().toLocaleTimeString() + " " + String(s).slice(0, 400) + "\n" + logEl.textContent.slice(0, 3000); };
  var toastEl = h("div", { id: "mmt" });
  var toast = function (s) { toastEl.textContent = s; toastEl.style.display = "block"; setTimeout(function () { toastEl.style.display = "none"; }, 3500); };
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
  var vp = function (on) {
    var m = q("meta[name=viewport]");
    if (!m) { m = h("meta", { name: "viewport" }); document.head.append(m); }
    if (on) { m.dataset.o = m.content || ""; m.content = "width=device-width,initial-scale=1,maximum-scale=1"; }
    else if (m.dataset.o !== undefined) m.content = m.dataset.o;
  };

  var body = h("div", { className: "bd" }), foot = h("div", { className: "ft" }), cur = "s", timer, sig;
  var tabs = h("div", { className: "tb" });
  var tabBtns = {};
  [["s", "Signal"], ["b", "Bands"], ["d", "Devices"], ["t", "Tools"]].forEach(function (t) {
    tabBtns[t[0]] = h("button", { textContent: t[1], onclick: function () { go(t[0]); } });
    tabs.append(tabBtns[t[0]]);
  });
  var panel = h("div", { id: "mm" }, h("div", { className: "hd" }, h("span", { textContent: "Huawei 5G CPE Max" }), h("button", { textContent: "✕", onclick: function () { panel.style.display = "none"; vp(false); clearInterval(timer); } })), tabs, body, foot);
  var btn = h("button", { id: "mmb", textContent: "📶", onclick: function () { vp(true); panel.style.display = "flex"; go(cur); clearInterval(timer); timer = setInterval(tick, 1500); } });
  document.body.append(panel, btn, toastEl);

  function go(t) {
    cur = t;
    Object.keys(tabBtns).forEach(function (k) { tabBtns[k].className = k == t ? "on" : ""; });
    foot.style.display = "none"; foot.replaceChildren();
    if (t == "s") { if (!sig) sig = buildSig(); body.replaceChildren(sig.root); tick(); }
    else if (t == "b") bands(); else if (t == "d") devs(); else tools();
  }

  // ---------- live signal ----------
  var MET = [["rsrp", "RSRP", "dBm", -120, -70, -90, -105], ["rsrq", "RSRQ", "dB", -20, -3, -10, -15], ["sinr", "SINR", "dB", -5, 30, 13, 0], ["rssi", "RSSI", "dBm", -100, -45, -65, -80]];
  function card(m) {
    var v = h("span", { className: "v", textContent: "-" }), bar = h("i"), ql = h("div", { className: "q" });
    var root = h("div", { className: "cd" }, h("div", { className: "l", textContent: m[1] }), h("div", {}, v, h("span", { className: "u", textContent: " " + m[2] })), h("div", { className: "bar" }, bar), ql);
    return { root: root, v: v, bar: bar, q: ql, m: m };
  }
  function setCard(c, val) {
    var n = num(val), m = c.m;
    if (isNaN(n)) { c.v.textContent = "-"; c.v.style.color = "#8a97a8"; c.bar.style.width = "0"; c.q.textContent = ""; return; }
    var col = n >= m[5] ? G : n >= m[6] ? Y : R;
    c.v.textContent = n; c.v.style.color = col;
    c.bar.style.width = Math.max(4, Math.min(100, (n - m[3]) * 100 / (m[4] - m[3]))) + "%"; c.bar.style.background = col;
    c.q.textContent = n >= m[5] ? "عالی" : n >= m[6] ? "متوسط" : "بد"; c.q.style.color = col;
  }
  function buildSig() {
    var s = { c4: {}, c5: {} };
    var g4 = h("div", { className: "cards" }), g5 = h("div", { className: "cards" });
    MET.forEach(function (m) { s.c4[m[0]] = card(m); g4.append(s.c4[m[0]].root); });
    MET.slice(0, 3).forEach(function (m) { s.c5[m[0]] = card(m); g5.append(s.c5[m[0]].root); });
    s.dl = card(["", "Download", "Mbps", 0, 1, 0, 0]); s.ul = card(["", "Upload", "Mbps", 0, 1, 0, 0]);
    s.dlv = h("span", { className: "v", textContent: "-" }); s.ulv = h("span", { className: "v", textContent: "-" });
    var sp = h("div", { className: "cards" },
      h("div", { className: "cd" }, h("div", { className: "l", textContent: "Download" }), h("div", {}, s.dlv, h("span", { className: "u", textContent: " Mbps" }))),
      h("div", { className: "cd" }, h("div", { className: "l", textContent: "Upload" }), h("div", {}, s.ulv, h("span", { className: "u", textContent: " Mbps" }))));
    s.info = h("div", { className: "info" });
    s.t5 = h("div", { className: "sec", textContent: "5G NR" });
    s.root = h("div", {}, sp, h("div", { className: "sec", textContent: "اطلاعات اتصال" }), s.info, h("div", { className: "sec", textContent: "4G LTE" }), g4, s.t5, g5);
    s.g5 = g5;
    return s;
  }
  var nrBand = function (a) {
    if (a > 620000 && a < 653333) return "n78"; if (a >= 653333 && a < 680000) return "n77"; if (a > 693334 && a < 733333) return "n79";
    if (a > 499200 && a < 537999) return "n41"; if (a > 422000 && a < 434000) return "n1"; if (a > 361000 && a < 376000) return "n3";
    if (a > 151600 && a < 160600) return "n28"; return "";
  };
  var busy = false;
  async function tick() {
    if (cur != "s" || panel.style.display != "flex" || busy || !sig) return;
    busy = true;
    try {
      var a = await get("/api/device/signal"), t = await get("/api/monitoring/traffic-statistics");
      MET.forEach(function (m) { setCard(sig.c4[m[0]], tag(a, m[0])); });
      var has5 = num(tag(a, "nrrsrp")) == num(tag(a, "nrrsrp")) && tag(a, "nrrsrp") != "";
      sig.g5.style.display = sig.t5.style.display = has5 ? "" : "none";
      MET.slice(0, 3).forEach(function (m) { setCard(sig.c5[m[0]], tag(a, "nr" + m[0])); });
      var mb = function (v) { var n = parseFloat(v) * 8 / 1e6; return isNaN(n) ? "-" : n.toFixed(1); };
      sig.dlv.textContent = mb(tag(t, "CurrentDownloadRate")); sig.ulv.textContent = mb(tag(t, "CurrentUploadRate"));
      var dl = num((tag(a, "nrearfcn").match(/DL:\s*(\d+)/) || [])[1]);
      var items = [["Band", tag(a, "band") && tag(a, "band") != "0" ? "B" + tag(a, "band") : ""], ["5G", has5 ? nrBand(dl) || "NR" : ""], ["PCI", tag(a, "pci")], ["Cell", tag(a, "cell_id")], ["TAC", tag(a, "tac")], ["BW 4G", tag(a, "dlbandwidth")], ["BW 5G", tag(a, "nrdlbandwidth")]];
      sig.info.replaceChildren.apply(sig.info, items.filter(function (i) { return i[1]; }).map(function (i) { return h("span", { className: "tag", textContent: i[0] + ": " + i[1] }); }));
    } catch (e) { log("ERR " + e); }
    busy = false;
  }

  // ---------- bands ----------
  var BODY = function (m, b, l, o) {
    return "<request><NetworkMode>" + m + "</NetworkMode><NetworkBand>" + b + "</NetworkBand><LTEBand>" + l + "</LTEBand>" + (o !== "" ? "<networkOption>" + o + "</networkOption>" : "") + "</request>";
  };
  async function bands() {
    body.replaceChildren(h("div", { textContent: "Loading..." }));
    var nm = await get("/api/net/net-mode"), ls = await get("/api/net/net-mode-list");
    var cm = ls.match(/<LTEBand>[\s\S]*?<Value>([0-9A-Fa-f]+)<\/Value>/);
    var sup = cm ? BigInt("0x" + cm[1]) : (1n << 53n) - 1n;
    var cv = BigInt("0x" + (tag(nm, "LTEBand") || "0"));
    var grid = h("div", { className: "chips" });
    for (var n = 1; n <= 64; n++) {
      if (!((sup >> BigInt(n - 1)) & 1n)) continue;
      var c = h("button", { className: "chip" + (((cv >> BigInt(n - 1)) & 1n) ? " on" : ""), onclick: function () { this.classList.toggle("on"); } }, h("div", { textContent: "B" + n }), h("small", { textContent: FREQ[n] ? FREQ[n] + " MHz" : "" }));
      c.dataset.b = n;
      grid.append(c);
    }
    var quick = function (name, m, b) { return h("button", { className: "b", textContent: name, onclick: async function () { var r = await post("/api/net/net-mode", BODY(m, b, "7FFFFFFFFFFFFFFF", "")); toast(r.indexOf("OK") > -1 ? name + " ✓" : "Error"); } }); };
    body.replaceChildren(
      h("div", { className: "sec", textContent: "حالت شبکه (فعلی: " + tag(nm, "NetworkMode") + ")" }),
      h("div", { className: "row" }, quick("Auto", "00", "3FFFFFFF"), quick("5G", "00", "00000000"), quick("4G", "03", "3FFFFFFF"), quick("3G", "02", "3FFFFFFF"), quick("2G", "01", "3FFFFFFF")),
      h("div", { className: "sec", textContent: "قفل باند 4G (باند رو بزن، بعد Apply)" }), grid,
      h("div", { className: "sec", textContent: "قفل باند 5G (n78 / n48 ...) از تب Tools انجام می‌شه." }));
    var opt = h("select", {}, h("option", { value: "", textContent: "5G: بدون تغییر" }), h("option", { value: "0", textContent: "5G NSA" }), h("option", { value: "1", textContent: "5G SA" }), h("option", { value: "2", textContent: "5G SA+NSA" }));
    var en5 = h("input", { type: "checkbox", checked: true });
    var all = function (v) { grid.querySelectorAll(".chip").forEach(function (i) { i.classList.toggle("on", v); }); };
    foot.replaceChildren(
      h("div", { className: "row" }, opt, h("label", {}, en5, " 4G+5G")),
      h("div", { className: "row", style: "margin-top:6px" },
        h("button", { className: "b", textContent: "همه", onclick: function () { all(true); } }),
        h("button", { className: "b", textContent: "پاک", onclick: function () { all(false); } }),
        h("button", {
          className: "b p", style: "flex:2", textContent: "Apply", onclick: async function () {
            var v = 0n;
            grid.querySelectorAll(".chip.on").forEach(function (i) { v |= 1n << BigInt(i.dataset.b - 1); });
            if (v == 0n) return toast("حداقل یک باند انتخاب کن");
            var hx = v.toString(16).toUpperCase();
            var r = await post("/api/net/net-mode", en5.checked ? BODY("00", "00000000", hx, opt.value) : BODY("03", "3FFFFFFF", hx, ""));
            toast(r.indexOf("OK") > -1 ? "اعمال شد ✓" : "خطا: " + r.slice(0, 80));
          }
        })));
    foot.style.display = "block";
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
      h("button", { className: "b r", style: "width:100%", textContent: "Reboot modem", onclick: function () { if (confirm("Reboot modem?")) post("/api/device/control", "<request><Control>1</Control></request>"); } }),
      h("div", { className: "sec", textContent: "درخواست‌های ثبت‌شده (برای قفل 5G): صفحه‌ی Developer options مودم رو باز کن، باند رو قفل کن و Save بزن، بعد اینجا رو ببین." }), capEl,
      h("button", { className: "b", style: "width:100%", textContent: "پاک کردن", onclick: function () { localStorage.mmcap = "[]"; capEl.textContent = "(خالی)"; } }),
      h("div", { className: "sec", textContent: "Explorer" }), m, p, b,
      h("button", { className: "b", style: "width:100%", textContent: "Send", onclick: async function () { o.textContent = m.value == "GET" ? await get(p.value) : await post(p.value, b.value); } }), o,
      h("div", { className: "sec", textContent: "Log" }), logEl);
  }
})();
