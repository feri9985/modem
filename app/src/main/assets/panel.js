(function () {
  if (window.__mm) return;
  window.__mm = 1;
  var h = function (t, a) {
    var e = document.createElement(t);
    Object.assign(e, a || {});
    for (var i = 2; i < arguments.length; i++) [].concat(arguments[i]).forEach(function (x) { e.append(x); });
    return e;
  };
  var FREQ = { 1: 2100, 2: 1900, 3: 1800, 4: 1700, 5: 850, 7: 2600, 8: 900, 12: 700, 13: 700, 17: 700, 18: 850, 19: 850, 20: 800, 25: 1900, 26: 850, 28: 700, 32: 1500, 34: 2000, 38: 2600, 39: 1900, 40: 2300, 41: 2500, 42: 3500, 43: 3700, 46: 5200, 48: 3500 };
  var NRF = { 1: 2100, 3: 1800, 5: 850, 7: 2600, 8: 900, 20: 800, 28: 700, 38: 2600, 40: 2300, 41: 2500, 48: 3500, 77: 3700, 78: 3500, 79: 4700 };
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
    "#mm{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:#0c1118;color:#e8edf3;font:12px sans-serif;display:none;flex-direction:column;overflow:hidden}" +
    "#mm *{box-sizing:border-box;min-width:0;-webkit-tap-highlight-color:transparent}" +
    "#mm .hd{background:linear-gradient(90deg,#c7000b,#6e0a1c);padding:6px 10px;display:flex;align-items:center;justify-content:space-between;font-weight:bold;font-size:14px}" +
    "#mm .hd button{width:auto;margin:0;padding:3px 12px;background:rgba(0,0,0,.35);border:0;border-radius:8px;color:#fff;font:inherit}" +
    "#mm .tb{display:flex;gap:4px;padding:4px;background:#141b24}" +
    "#mm .tb button{flex:1;margin:0;padding:6px 0;background:#202a37;border:0;border-radius:8px;color:#c9d3df;font:inherit}" +
    "#mm .tb button.on{background:#2f7bf5;color:#fff}" +
    "#mm .bd{position:relative;flex:1;overflow-x:hidden;overflow-y:auto;padding:5px 7px}" +
    "#mm .ft{padding:5px 7px;background:#141b24;border-top:1px solid #243041;display:none;font-size:14px}" +
    "#mm .bd > .sec{margin:6px 0 3px}" +
    "#mm .home{position:absolute;top:0;left:0;right:0;bottom:0;padding:5px 7px;display:flex;flex-direction:column;justify-content:space-between;font-size:12px;overflow:hidden}" +
    "#mm .top{display:flex;align-items:center;justify-content:space-between;gap:.5em}" +
    "#mm .top b{font-size:1.15em;color:#ffd84d;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}" +
    "#mm .sp{display:grid;grid-template-columns:1fr 1fr;gap:.4em}" +
    "#mm .sp div{background:#0f4d2a;border-radius:.6em;padding:.35em;text-align:center;font-size:1.2em;font-weight:bold}" +
    "#mm .sp div:last-child{background:#5a4a0a}" +
    "#mm .info{display:flex;flex-wrap:wrap;gap:.25em}" +
    "#mm .tag{background:#1a2430;border-radius:.4em;padding:.2em .5em;font-size:.85em}" +
    "#mm .cols{display:grid;grid-template-columns:1fr 1fr;gap:.6em}" +
    "#mm .ct{font-size:.85em;color:#8a97a8;margin-bottom:.15em}" +
    "#mm .sr{display:grid;grid-template-columns:2.8em 1fr;gap:.25em;margin:.25em 0;align-items:center}" +
    "#mm .sr .n{font-size:.8em;font-weight:bold;color:#c9d3df}" +
    "#mm .bar{position:relative;height:1.8em;background:#243041;border-radius:.9em;overflow:hidden}" +
    "#mm .bar i{position:absolute;left:0;top:0;bottom:0;width:0;transition:width .4s}" +
    "#mm .bar span{position:absolute;left:0;right:0;top:0;bottom:0;text-align:center;line-height:1.8em;font-weight:bold;font-size:.85em;text-shadow:0 0 3px #000;white-space:nowrap}" +
    "#mm .sec{margin:0 0 .2em;color:#8a97a8;font-size:.85em}" +
    "#mm .chips{display:grid;grid-template-columns:repeat(7,1fr);gap:.25em}" +
    "#mm .chip{margin:0;background:#1a2430;border:1px solid #2c3746;border-radius:.6em;padding:.3em 0;text-align:center;color:#c9d3df;font:inherit;font-size:.95em;line-height:1.1}" +
    "#mm .chip.on{background:#1f7a3d;border-color:#2ecc71;color:#fff}" +
    "#mm .chip.nr.on{background:#7a1f6e;border-color:#e060d0}" +
    "#mm .chip small{display:block;font-size:.7em;opacity:.7}" +
    "#mm .row{display:flex;gap:.3em;align-items:center}" +
    "#mm .b{flex:1;margin:0;padding:.6em 2px;background:#2c3746;border:0;border-radius:.6em;color:#e8edf3;font:inherit}" +
    "#mm .p{background:#2f7bf5;font-weight:bold}#mm .r{background:#e5484d}" +
    "#mm button{touch-action:manipulation}" +
    "#mm button:active,#mm .fl{background:#fff !important;color:#000 !important;transform:scale(.95)}" +
    "#mm select,#mm input[type=text],#mm textarea{width:100%;margin:3px 0;padding:7px;background:#1a2430;border:0;border-radius:8px;color:#e8edf3;font:inherit}" +
    "#mm select{flex:1}#mm label{white-space:nowrap}" +
    "#mm table{width:100%;border-collapse:collapse}#mm td{padding:5px 3px;border-bottom:1px solid #243041;word-break:break-all}" +
    "#mm pre{background:#080b10;padding:6px;border-radius:8px;font-size:10px;white-space:pre-wrap;max-height:160px;overflow:auto}" +
    "#mmb{position:fixed;right:14px;bottom:14px;z-index:100000;width:56px;height:56px;border-radius:28px;border:0;background:#c7000b;color:#fff;font-size:24px;box-shadow:0 2px 8px rgba(0,0,0,.5)}" +
    "#mmt{position:fixed;left:50%;bottom:120px;transform:translateX(-50%);background:#000d;color:#fff;padding:9px 14px;border-radius:20px;z-index:100001;display:none;max-width:90%;text-align:center;font-size:12px}";
  document.head.append(h("style", { textContent: css }));

  var get = function (u) { return fetch(u, { credentials: "include" }).then(function (r) { return r.text(); }); };
  var tag = function (x, t) { var m = x.match(new RegExp("<" + t + ">([^<]*)</" + t + ">", "i")); return m ? m[1] : ""; };
  var num = function (v) { var m = String(v || "").match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : NaN; };
  var logEl = h("pre");
  var log = function (s) { logEl.textContent = new Date().toLocaleTimeString() + " " + String(s).slice(0, 400) + "\n" + logEl.textContent.slice(0, 2500); };
  var toastEl = h("div", { id: "mmt" }), tt;
  var toast = function (s) { toastEl.textContent = s; toastEl.style.display = "block"; clearTimeout(tt); tt = setTimeout(function () { toastEl.style.display = "none"; }, 3500); };
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
  var netType = function (m) { return { "0": "No Service", "1": "2G", "2": "2G", "3": "2G", "41": "3G", "42": "3G", "43": "3G", "44": "3G", "45": "3G+", "46": "3G+", "101": "LTE 4G", "1011": "LTE CA 4G+", "111": "5G NR" }[m] || m; };

  var body = h("div", { className: "bd" }), foot = h("div", { className: "ft" }), cur = "h", timer, home, cnt = 0;
  var tabs = h("div", { className: "tb" }), tabBtns = {};
  [["h", "Home"], ["d", "Devices"], ["t", "Tools"]].forEach(function (t) {
    tabBtns[t[0]] = h("button", { textContent: t[1], onclick: function () { go(t[0]); } });
    tabs.append(tabBtns[t[0]]);
  });
  var btn;
  var closePanel = function () {
    panel.style.display = "none"; clearInterval(timer);
    document.body.style.display = ""; document.documentElement.style.overflow = ""; btn.style.display = "";
  };
  var panel = h("div", { id: "mm" }, h("div", { className: "hd" }, h("span", { textContent: "Huawei 5G CPE Max" }), h("button", { textContent: "✕", onclick: closePanel })), tabs, body, foot);
  panel.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("button") : null;
    if (b) { b.classList.add("fl"); setTimeout(function () { b.classList.remove("fl"); }, 250); }
  }, true);
  var openPanel = function () {
    document.body.style.display = "none"; document.documentElement.style.overflow = "hidden"; window.scrollTo(0, 0);
    btn.style.display = "none"; panel.style.display = "flex";
    go(cur); clearInterval(timer); timer = setInterval(tick, 1500);
  };
  btn = h("button", { id: "mmb", textContent: "📶", onclick: openPanel });
  document.documentElement.append(panel, btn, toastEl);

  function fit() {
    if (!home || cur != "h") return;
    var w = home.root, lo = 8, hi = Math.min(24, body.clientWidth / 25), f;
    if (hi <= lo) return;
    for (var i = 0; i < 7; i++) {
      f = (lo + hi) / 2; w.style.fontSize = f + "px";
      if (w.scrollHeight <= w.clientHeight + 1 && w.scrollWidth <= w.clientWidth + 1) lo = f; else hi = f;
    }
    w.style.fontSize = lo + "px";
  }
  window.addEventListener("resize", fit);
  function go(t) {
    cur = t;
    Object.keys(tabBtns).forEach(function (k) { tabBtns[k].className = k == t ? "on" : ""; });
    foot.style.display = "none"; foot.replaceChildren();
    body.style.overflowY = t == "h" ? "hidden" : "auto";
    if (t == "h") {
      if (!home) { home = buildHome(); loadBands(); }
      body.replaceChildren(home.root);
      foot.replaceChildren(home.foot); foot.style.display = "block";
      setTimeout(fit, 50); tick();
    } else if (t == "d") devs(); else tools();
  }

  // ---------- home ----------
  var MET = { rssi: ["RSSI", "dBm", -100, -45, -65, -80], rsrp: ["RSRP", "dBm", -120, -70, -90, -105], rsrq: ["RSRQ", "dB", -20, -3, -10, -15], sinr: ["SINR", "dB", -5, 30, 13, 0] };
  function row(k) {
    var m = MET[k], fill = h("i"), val = h("span", { textContent: "-" });
    return { root: h("div", { className: "sr" }, h("div", { className: "n", textContent: m[0] }), h("div", { className: "bar" }, fill, val)), fill: fill, val: val, m: m };
  }
  function setRow(r, v) {
    var n = num(v), m = r.m;
    if (isNaN(n)) { r.val.textContent = "-"; r.fill.style.width = "0"; return; }
    var col = n >= m[4] ? G : n >= m[5] ? Y : R;
    r.val.textContent = n + m[1] + " " + (n >= m[4] ? "عالی" : n >= m[5] ? "متوسط" : "بد");
    r.fill.style.width = Math.max(4, Math.min(100, (n - m[2]) * 100 / (m[3] - m[2]))) + "%"; r.fill.style.background = col;
  }
  var BODY = function (m, b, l, o, extra) {
    return "<request><NetworkMode>" + m + "</NetworkMode><NetworkBand>" + b + "</NetworkBand><LTEBand>" + l + "</LTEBand>" + (o !== "" ? "<networkOption>" + o + "</networkOption>" : "") + (extra || "") + "</request>";
  };
  function buildHome() {
    var o = { rows: {}, nrTag: "" };
    o.opn = h("b", { textContent: "..." }); o.mode = h("span", { className: "tag", textContent: "-" });
    o.dl = h("div", { textContent: "↓ -" }); o.ul = h("div", { textContent: "↑ -" });
    o.info = h("div", { className: "info" });
    var c4 = h("div", {}, h("div", { className: "ct", textContent: "4G LTE" })), c5 = h("div", {}, h("div", { className: "ct", textContent: "5G NR" }));
    ["rsrp", "rsrq", "sinr", "rssi"].forEach(function (k) { var r = row(k); o.rows[k] = r; c4.append(r.root); });
    ["rsrp", "rsrq", "sinr"].forEach(function (k) { var r = row(k); o.rows["nr" + k] = r; c5.append(r.root); });
    var quick = function (name, m, b) {
      return h("button", { className: "b", textContent: name, onclick: async function () { toast(name + " ..."); var r = await post("/api/net/net-mode", BODY(m, b, "7FFFFFFFFFFFFFFF", "")); toast(r.indexOf("OK") > -1 ? name + " ✓" : "Error"); loadBands(); } });
    };
    o.chips = h("div", { className: "chips" }); o.nrchips = h("div", { className: "chips" });
    o.root = h("div", { className: "home" },
      h("div", { className: "top" }, o.opn, o.mode),
      h("div", { className: "sp" }, o.dl, o.ul), o.info,
      h("div", { className: "cols" }, c4, c5),
      h("div", { className: "sec", textContent: "حالت شبکه" }),
      h("div", { className: "row" }, quick("Auto", "00", "3FFFFFFF"), quick("5G", "00", "00000000"), quick("4G", "03", "3FFFFFFF"), quick("3G", "02", "3FFFFFFF"), quick("2G", "01", "3FFFFFFF")),
      h("div", { className: "sec", textContent: "قفل باند 4G (باند رو بزن، بعد Apply)" }), o.chips,
      h("div", { className: "sec", textContent: "قفل باند 5G" }), o.nrchips);
    o.opt = h("select", {}, h("option", { value: "", textContent: "5G: بدون تغییر" }), h("option", { value: "0", textContent: "5G NSA" }), h("option", { value: "1", textContent: "5G SA" }), h("option", { value: "2", textContent: "5G SA+NSA" }));
    o.en5 = h("input", { type: "checkbox", checked: true });
    var all = function (v) { o.chips.querySelectorAll(".chip").forEach(function (i) { i.classList.toggle("on", v); }); };
    var mask = function (box) { var v = 0n; box.querySelectorAll(".chip.on").forEach(function (i) { v |= 1n << BigInt(i.dataset.b - 1); }); return v; };
    o.foot = h("div", {},
      h("div", { className: "row" }, o.opt, h("label", {}, o.en5, " 4G+5G")),
      h("div", { className: "row", style: "margin-top:4px" },
        h("button", { className: "b", textContent: "همه", onclick: function () { all(true); } }),
        h("button", { className: "b", textContent: "پاک", onclick: function () { all(false); } }),
        h("button", {
          className: "b p", style: "flex:2", textContent: "Apply", onclick: async function () {
            var v = mask(o.chips), nv = mask(o.nrchips);
            if (v == 0n && nv == 0n) return toast("حداقل یک باند انتخاب کن");
            if (nv != 0n && !o.nrTag) return toast("API قفل 5G هنوز مشخص نشده. Tools ← جمع‌آوری اطلاعات 5G رو بزن و متن رو بفرست");
            toast("در حال اعمال...");
            var lte = v == 0n ? "7FFFFFFFFFFFFFFF" : v.toString(16).toUpperCase();
            var extra = nv != 0n ? "<" + o.nrTag + ">" + nv.toString(16).toUpperCase() + "</" + o.nrTag + ">" : "";
            var r = await post("/api/net/net-mode", o.en5.checked ? BODY("00", "00000000", lte, o.opt.value, extra) : BODY("03", "3FFFFFFF", lte, "", extra));
            toast(r.indexOf("OK") > -1 ? "اعمال شد ✓" : "خطا: " + r.slice(0, 80));
            loadBands();
          }
        })));
    return o;
  }
  function mkChips(box, supBits, curBits, pre, freq, cls) {
    var els = [];
    supBits.forEach(function (n) {
      var c = h("button", { className: "chip " + cls + (((curBits >> BigInt(n - 1)) & 1n) ? " on" : ""), onclick: function () { this.classList.toggle("on"); } }, h("div", { textContent: pre + n }), h("small", { textContent: freq[n] || "" }));
      c.dataset.b = n; els.push(c);
    });
    box.replaceChildren.apply(box, els);
  }
  var bitsOf = function (v, max) { var a = []; for (var n = 1; n <= max; n++) if ((v >> BigInt(n - 1)) & 1n) a.push(n); return a; };
  async function loadBands() {
    try {
      var nm = await get("/api/net/net-mode"), ls = await get("/api/net/net-mode-list");
      var cm = ls.match(/<LTEBand>[\s\S]*?<Value>([0-9A-Fa-f]+)<\/Value>/);
      var sup = cm ? BigInt("0x" + cm[1]) : (1n << 53n) - 1n;
      mkChips(home.chips, bitsOf(sup, 64), BigInt("0x" + (tag(nm, "LTEBand") || "0")), "B", FREQ, "lte");
      var mt = nm.match(/<([A-Za-z_]*(?:NR|Nr|nr)[A-Za-z_]*[Bb]and[A-Za-z_]*)>([0-9A-Fa-f]*)<\//);
      home.nrTag = mt ? mt[1] : "";
      var nrCur = mt && mt[2] ? BigInt("0x" + mt[2]) : 0n, nrSup = 0n;
      if (mt) { var sm = ls.match(new RegExp("<" + mt[1] + ">[\\s\\S]*?<Value>([0-9A-Fa-f]+)</Value>")); if (sm) nrSup = BigInt("0x" + sm[1]); }
      mkChips(home.nrchips, nrSup ? bitsOf(nrSup, 128) : [78, 48], nrCur, "n", NRF, "nr");
    } catch (e) { log("bands ERR " + e); }
    setTimeout(fit, 50);
  }
  var busy = false;
  async function tick() {
    if (cur != "h" || panel.style.display != "flex" || busy || !home) return;
    busy = true;
    try {
      var a = await get("/api/device/signal"), t = await get("/api/monitoring/traffic-statistics");
      ["rssi", "rsrp", "rsrq", "sinr"].forEach(function (k) { setRow(home.rows[k], tag(a, k)); });
      ["rsrp", "rsrq", "sinr"].forEach(function (k) { setRow(home.rows["nr" + k], tag(a, "nr" + k)); });
      var mb = function (v) { var n = parseFloat(v) * 8 / 1e6; return isNaN(n) ? "-" : n.toFixed(1); };
      home.dl.textContent = "↓ " + mb(tag(t, "CurrentDownloadRate")) + " Mbps"; home.ul.textContent = "↑ " + mb(tag(t, "CurrentUploadRate")) + " Mbps";
      var items = [["Band", tag(a, "band") && tag(a, "band") != "0" ? "B" + tag(a, "band") : ""], ["PCI", tag(a, "pci")], ["Cell", tag(a, "cell_id")], ["TAC", tag(a, "tac")], ["4G BW", tag(a, "dlbandwidth")], ["5G BW", tag(a, "nrdlbandwidth")]];
      home.info.replaceChildren.apply(home.info, items.filter(function (i) { return i[1]; }).map(function (i) { return h("span", { className: "tag", textContent: i[0] + ": " + i[1] }); }));
      if (cnt++ % 6 == 0) {
        var pl = await get("/api/net/current-plmn"), st = await get("/api/monitoring/status");
        home.opn.textContent = (tag(pl, "FullName") || "No Service") + " " + tag(pl, "Numeric");
        home.mode.textContent = netType(tag(st, "CurrentNetworkTypeEx"));
      }
      fit();
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
  async function collect(out) {
    var t = [], add = function (s) { t.push(s); out.value = t.join("\n").slice(0, 7000); };
    try {
      add("== net-mode ==\n" + await get("/api/net/net-mode"));
      add("== net-mode-list ==\n" + (await get("/api/net/net-mode-list")).slice(0, 1800));
      var hm = await get("/html/home.html"), cand = {};
      (hm.match(/[A-Za-z0-9_\/\.\-]*devel[A-Za-z0-9_\/\.\-]*/gi) || []).forEach(function (x) { cand[x] = 1; });
      ["/html/developmode.html", "/html/developer.html", "/html/developeroptions.html", "/html/develop.html"].forEach(function (x) { cand[x] = 1; });
      add("== links ==\n" + Object.keys(cand).join(" "));
      for (var u in cand) {
        var p = u.charAt(0) == "/" ? u : "/html/" + u, pg = "";
        try { pg = await get(p); } catch (e) { continue; }
        if (pg.length < 300 || !/band/i.test(pg)) continue;
        add("== page " + p + " (" + pg.length + ") ==");
        var texts = [pg], srcs = (pg.match(/src="([^"]+\.js[^"]*)"/g) || []).slice(0, 8);
        for (var i = 0; i < srcs.length; i++) {
          try { texts.push(await get("/" + srcs[i].slice(5, -1).replace(/^\.?\//, "").replace(/^\.\.\//, ""))); } catch (e) {}
        }
        var apis = {};
        texts.forEach(function (tx) { (tx.match(/\/api\/[\w\-\/]+/g) || []).forEach(function (a) { apis[a] = 1; }); });
        add("APIs: " + Object.keys(apis).join(" "));
        texts.forEach(function (tx) {
          var re = /lock/ig, m, n = 0;
          while ((m = re.exec(tx)) && n < 3) { add("…" + tx.slice(Math.max(0, m.index - 80), m.index + 200).replace(/\s+/g, " ")); n++; re.lastIndex = m.index + 250; }
        });
      }
    } catch (e) { add("ERR " + e); }
    add("== done ==");
    out.focus(); out.select();
  }
  function tools() {
    var m = h("select", {}, h("option", { textContent: "GET" }), h("option", { textContent: "POST" }));
    var p = h("input", { type: "text", value: "/api/net/net-mode" }), b = h("textarea", { rows: 2 }), o = h("pre");
    var out = h("textarea", { rows: 7, placeholder: "نتیجه اینجا میاد" });
    var capEl = h("pre", { textContent: (JSON.parse(localStorage.mmcap || "[]")).join("\n\n") || "(خالی)" });
    body.replaceChildren(
      h("button", { className: "b r", style: "width:100%", textContent: "Reboot modem", onclick: function () { if (confirm("Reboot modem?")) { toast("Reboot..."); post("/api/device/control", "<request><Control>1</Control></request>"); } } }),
      h("div", { className: "sec", textContent: "برای ساخت قفل n78/n48: این دکمه رو بزن، صبر کن تا «done» بیاد، متن رو کپی کن و برام بفرست." }),
      h("button", { className: "b p", style: "width:100%", textContent: "جمع‌آوری اطلاعات 5G", onclick: function () { out.value = "در حال جمع‌آوری..."; collect(out); } }), out,
      h("div", { className: "sec", textContent: "درخواست‌های ثبت‌شده از صفحه‌ی مودم" }), capEl,
      h("button", { className: "b", style: "width:100%", textContent: "پاک کردن", onclick: function () { localStorage.mmcap = "[]"; capEl.textContent = "(خالی)"; } }),
      h("div", { className: "sec", textContent: "Explorer" }), m, p, b,
      h("button", { className: "b", style: "width:100%", textContent: "Send", onclick: async function () { o.textContent = m.value == "GET" ? await get(p.value) : await post(p.value, b.value); } }), o,
      h("div", { className: "sec", textContent: "Log" }), logEl);
  }

  try { if (/home\.html/.test(location.href) && !sessionStorage.mmo) { sessionStorage.mmo = 1; openPanel(); } } catch (e) {}
})();
