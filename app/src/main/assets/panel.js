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
  var css = "#mm{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:#10151c;color:#e8edf3;font:15px sans-serif;overflow:auto;padding:12px;display:none}" +
    "#mmb{position:fixed;right:14px;bottom:14px;z-index:100000;width:56px;height:56px;border-radius:28px;border:0;background:#2f7bf5;color:#fff;font-size:24px}" +
    "#mm button,#mm select,#mm input[type=text],#mm textarea{font:inherit;color:#e8edf3;background:#2c3746;border:0;border-radius:8px;padding:10px;margin:3px 0;width:100%}" +
    "#mm button.p{background:#2f7bf5;font-weight:bold}#mm button.r{background:#e5484d}" +
    "#mm table{width:100%;border-collapse:collapse}#mm td{padding:6px;border-bottom:1px solid #2c3746;word-break:break-all}#mm td:first-child{color:#8a97a8;width:45%}" +
    "#mm .g{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}#mm .g label{background:#1a222d;padding:10px;border-radius:8px}" +
    "#mm pre{background:#0b0f14;padding:8px;border-radius:8px;font-size:11px;white-space:pre-wrap;max-height:200px;overflow:auto}";
  document.head.append(h("style", { textContent: css }));

  var get = function (u) { return fetch(u, { credentials: "include" }).then(function (r) { return r.text(); }); };
  var tag = function (x, t) { var m = x.match(new RegExp("<" + t + ">([^<]*)</" + t + ">", "i")); return m ? m[1] : ""; };
  var logEl = h("pre");
  var log = function (s) { logEl.textContent = new Date().toLocaleTimeString() + " " + s.slice(0, 400) + "\n" + logEl.textContent.slice(0, 3000); };
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
  function kv(x) {
    var d = new DOMParser().parseFromString(x, "text/xml");
    var tb = h("table");
    Array.from(d.documentElement.children).forEach(function (e) {
      if (!e.children.length && e.textContent) tb.append(h("tr", {}, h("td", { textContent: e.tagName }), h("td", { textContent: e.textContent })));
    });
    if (!tb.children.length) tb.append(h("tr", {}, h("td", { textContent: "raw" }), h("td", { textContent: x.slice(0, 300) })));
    return tb;
  }

  var body = h("div"), cur = "s", timer;
  var panel = h("div", { id: "mm" });
  var tabs = h("div", { style: "display:flex;gap:6px" });
  [["s", "Signal"], ["b", "Bands"], ["d", "Devices"], ["t", "Tools"]].forEach(function (t) {
    tabs.append(h("button", { textContent: t[1], onclick: function () { cur = t[0]; render(); } }));
  });
  panel.append(h("button", { textContent: "Close", className: "r", onclick: function () { panel.style.display = "none"; clearInterval(timer); } }), tabs, body, h("h4", { textContent: "Log" }), logEl);
  var btn = h("button", { id: "mmb", textContent: "📶", onclick: function () { panel.style.display = "block"; render(); clearInterval(timer); timer = setInterval(function () { if (cur == "s") render(); }, 4000); } });
  document.body.append(panel, btn);

  function render() {
    if (cur == "s") sig(); else if (cur == "b") bands(); else if (cur == "d") devs(); else tools();
  }
  async function sig() {
    var a = await get("/api/device/signal"), s = await get("/api/monitoring/status"), t = await get("/api/monitoring/traffic-statistics");
    body.replaceChildren(h("h4", { textContent: "Signal" }), kv(a), h("h4", { textContent: "Traffic" }), kv(t), h("h4", { textContent: "Status" }), kv(s));
  }

  var BODY = function (m, b, l, o) {
    return "<request><NetworkMode>" + m + "</NetworkMode><NetworkBand>" + b + "</NetworkBand><LTEBand>" + l + "</LTEBand>" + (o !== "" ? "<networkOption>" + o + "</networkOption>" : "") + "</request>";
  };
  async function bands() {
    var nm = await get("/api/net/net-mode"), ls = await get("/api/net/net-mode-list");
    var cm = ls.match(/<LTEBand>[\s\S]*?<Value>([0-9A-Fa-f]+)<\/Value>/);
    var sup = cm ? BigInt("0x" + cm[1]) : (1n << 53n) - 1n;
    var cur2 = BigInt("0x" + (tag(nm, "LTEBand") || "0"));
    var grid = h("div", { className: "g" });
    for (var n = 1; n <= 64; n++) {
      if (!((sup >> BigInt(n - 1)) & 1n)) continue;
      var c = h("input", { type: "checkbox", checked: !!((cur2 >> BigInt(n - 1)) & 1n) });
      c.dataset.b = n;
      grid.append(h("label", {}, c, " B" + n));
    }
    var opt = h("select", {}, h("option", { value: "", textContent: "5G type: unchanged" }), h("option", { value: "0", textContent: "5G NSA" }), h("option", { value: "1", textContent: "5G SA" }), h("option", { value: "2", textContent: "5G SA+NSA" }));
    var en5 = h("input", { type: "checkbox", checked: true });
    var all = function (v) { grid.querySelectorAll("input").forEach(function (i) { i.checked = v; }); };
    var quick = function (name, m, b) { return h("button", { textContent: name, onclick: function () { post("/api/net/net-mode", BODY(m, b, "7FFFFFFFFFFFFFFF", "")); } }); };
    body.replaceChildren(
      h("div", { textContent: "Current: mode " + tag(nm, "NetworkMode") + ", 5G option " + tag(nm, "networkOption") + ", LTE " + tag(nm, "LTEBand") }),
      h("h4", { textContent: "4G bands (supported by modem)" }), grid,
      h("button", { textContent: "Select all", onclick: function () { all(true); } }),
      h("button", { textContent: "Clear", onclick: function () { all(false); } }),
      opt, h("label", {}, en5, " Enable 4G + 5G together"),
      h("button", {
        className: "p", textContent: "Apply band lock", onclick: async function () {
          var v = 0n;
          grid.querySelectorAll("input:checked").forEach(function (i) { v |= 1n << BigInt(i.dataset.b - 1); });
          if (v == 0n) return alert("Select at least one band");
          var r = await post("/api/net/net-mode", en5.checked ? BODY("00", "00000000", v.toString(16).toUpperCase(), opt.value) : BODY("03", "3FFFFFFF", v.toString(16).toUpperCase(), ""));
          alert(r.indexOf("OK") > -1 ? "Applied" : "Modem replied: " + r.slice(0, 200));
        }
      }),
      h("h4", { textContent: "Quick modes" }),
      quick("Auto", "00", "3FFFFFFF"), quick("5G", "00", "00000000"), quick("4G", "03", "3FFFFFFF"), quick("3G", "02", "3FFFFFFF"), quick("2G", "01", "3FFFFFFF")
    );
  }

  async function devs() {
    var x = await get("/api/lan/HostInfo");
    if (x.indexOf("<Host") < 0) x = await get("/api/wlan/host-list");
    var d = new DOMParser().parseFromString(x, "text/xml"), tb = h("table");
    d.querySelectorAll("Host").forEach(function (e) {
      var g = function (n) { var f = e.querySelector(n); return f ? f.textContent : ""; };
      tb.append(h("tr", {}, h("td", { textContent: g("HostName") || "?" }), h("td", { textContent: g("IpAddress") + " " + g("MacAddress") })));
    });
    body.replaceChildren(tb.children.length ? tb : h("pre", { textContent: x.slice(0, 1500) }));
  }

  function tools() {
    var m = h("select", {}, h("option", { textContent: "GET" }), h("option", { textContent: "POST" }));
    var p = h("input", { type: "text", value: "/api/net/net-mode" }), b = h("textarea", { rows: 3 }), o = h("pre");
    body.replaceChildren(
      h("button", { className: "r", textContent: "Reboot modem", onclick: function () { if (confirm("Reboot modem?")) post("/api/device/control", "<request><Control>1</Control></request>"); } }),
      h("h4", { textContent: "Explorer" }), m, p, b,
      h("button", { textContent: "Send", onclick: async function () { o.textContent = m.value == "GET" ? await get(p.value) : await post(p.value, b.value); } }), o
    );
  }
})();
