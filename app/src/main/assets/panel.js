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
  var ofe = window.fetch;
  window.fetch = function (u, o) {
    try { if (!window.__mmown && o && o.method && String(o.method).toUpperCase() == "POST") cap(typeof u == "string" ? u : u.url, o.body); } catch (e) {}
    return ofe.apply(this, arguments);
  };
  var xo = XMLHttpRequest.prototype.open, xs = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u) { this._m = m; this._u = u; return xo.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function (b) { if (this._m && String(this._m).toUpperCase() == "POST") cap(this._u, b); return xs.apply(this, arguments); };

  var css =
    "#mm{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:#0c1118;color:#e8edf3;font:14px sans-serif;display:none;flex-direction:column;overflow:hidden}" +
    "#mm *{box-sizing:border-box;min-width:0;-webkit-tap-highlight-color:transparent}" +
    "#mm .hd{background:linear-gradient(90deg,#c7000b,#6e0a1c);padding:9px 12px;display:flex;align-items:center;justify-content:space-between;font-weight:bold;font-size:16px}" +
    "#mm .hd button{width:auto;margin:0;padding:5px 16px;background:rgba(0,0,0,.35);border:0;border-radius:8px;color:#fff;font:inherit}" +
    "#mm .tb{display:flex;gap:6px;padding:6px;background:#141b24;overflow-x:auto}" +
    "#mm .tb::-webkit-scrollbar{display:none}" +
    "#mm .tb button{flex:1 0 auto;margin:0;padding:12px 9px;background:#202a37;border:0;border-radius:10px;color:#c9d3df;font:inherit;font-size:13px}" +
    "#mm .tb button.on{background:#2f7bf5;color:#fff;font-weight:bold}" +
    "#mm .bd{flex:1;overflow-x:hidden;overflow-y:auto;padding:8px}" +
    "#mm .ft{padding:8px;background:#141b24;border-top:1px solid #243041;display:none}" +
    "#mm .top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}" +
    "#mm .top b{font-size:16px;color:#ffd84d;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}" +
    "#mm .sp{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px}" +
    "#mm .sp div{background:#0f4d2a;border-radius:10px;padding:8px;text-align:center;font-size:17px;font-weight:bold}" +
    "#mm .sp div:last-child{background:#5a4a0a}" +
    "#mm .info{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:6px}" +
    "#mm .tag{background:#1a2430;border-radius:7px;padding:4px 9px;font-size:12px}" +
    "#mm .sr{position:relative;height:28px;background:#243041;border-radius:14px;overflow:hidden;margin:5px 0}" +
    "#mm .sr i{position:absolute;left:0;top:0;bottom:0;width:0;transition:width .4s}" +
    "#mm .sr .t{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;justify-content:space-between;align-items:center;padding:0 12px;font-weight:bold;font-size:14px;text-shadow:0 0 3px #000}" +
    "#mm .sec{margin:12px 0 6px;color:#8a97a8;font-size:12px}" +
    "#mm .bd > .sec:first-child{margin-top:2px}" +
    "#mm .chips{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}" +
    "#mm .chip{margin:0;background:#1a2430;border:1px solid #2c3746;border-radius:10px;padding:10px 0;text-align:center;color:#c9d3df;font:inherit;font-size:15px}" +
    "#mm .chip.on{background:#1f7a3d;border-color:#2ecc71;color:#fff}" +
    "#mm .chip.nr.on{background:#7a1f6e;border-color:#e060d0}" +
    "#mm .chip small{font-size:11px;opacity:.75;margin-left:5px}" +
    "#mm .row{display:flex;gap:6px;align-items:center}" +
    "#mm .b{flex:1;margin:0;padding:13px 4px;background:#2c3746;border:0;border-radius:10px;color:#e8edf3;font:inherit;font-size:15px}" +
    "#mm .p{background:#2f7bf5;font-weight:bold;font-size:18px;padding:15px 4px}#mm .r{background:#e5484d}" +
    "#mm button{touch-action:manipulation}" +
    "#mm button:active,#mm .fl{background:#fff !important;color:#000 !important;transform:scale(.96)}" +
    "#mm select,#mm input[type=text],#mm textarea{width:100%;margin:4px 0;padding:11px;background:#1a2430;border:0;border-radius:10px;color:#e8edf3;font:inherit;font-size:15px}" +
    "#mm select{flex:1}#mm label{white-space:nowrap;font-size:15px;padding:0 4px}#mm input[type=checkbox]{width:20px;height:20px;vertical-align:middle}" +
    "#mm .dv{background:#161e29;border-radius:12px;padding:12px;margin:7px 0}" +
    "#mm .dv b{font-size:17px;display:block}#mm .dv span{font-size:14px;color:#9fb0c3;word-break:break-all}" +
    "#mm .abig{font-size:60px;font-weight:bold;text-align:center;padding:18px 0 6px;line-height:1.1}" +
    "#mm .abig small{font-size:20px;opacity:.7;margin-left:6px;font-weight:normal}" +
    "#mm .b.x{flex:none;width:52px;padding:13px 0;background:#4a2530}" +
    "#mm pre{background:#080b10;padding:8px;border-radius:8px;font-size:12px;white-space:pre-wrap;max-height:200px;overflow:auto}" +
    "#mmb{position:fixed;right:14px;bottom:14px;z-index:100000;width:58px;height:58px;border-radius:29px;border:0;background:#c7000b;color:#fff;font-size:26px;box-shadow:0 2px 8px rgba(0,0,0,.5)}" +
    "#mmt{position:fixed;left:50%;bottom:130px;transform:translateX(-50%);background:#000d;color:#fff;padding:11px 16px;border-radius:22px;z-index:100001;display:none;max-width:90%;text-align:center;font-size:14px}";
  document.head.append(h("style", { textContent: css }));

  // timeout لازمه: اگه مودم ریبوت بشه و درخواست آویزون بمونه، بدون این busy برای همیشه true می‌مونه و دیگه آپدیت نمی‌شه
  var get = function (u, ms) {
    var c = new AbortController(), tm = setTimeout(function () { c.abort(); }, ms || 12000);
    return fetch(u, { credentials: "include", signal: c.signal }).then(function (r) { return r.text(); }).finally(function () { clearTimeout(tm); });
  };
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
    var c = new AbortController(), tm;
    try {
      var t = await tok();
      tm = setTimeout(function () { c.abort(); }, 20000);
      window.__mmown = 1;
      var pr = fetch(u, { method: "POST", credentials: "include", headers: { "__RequestVerificationToken": t, "Content-Type": "application/xml" }, body: b, signal: c.signal });
      window.__mmown = 0;
      var r = await pr;
      var x = await r.text();
      log("POST " + u + " -> " + x);
      return x;
    } catch (e) {
      // قبلاً خطای شبکه بی‌صدا قورت داده می‌شد و هیچ پیامی نمی‌اومد
      window.__mmown = 0;
      log("POST " + u + " ERR " + e);
      return "ERR " + e;
    } finally { clearTimeout(tm); }
  }
  var netType = function (m) { return { "0": "No Service", "1": "2G", "2": "2G", "3": "2G", "41": "3G", "42": "3G", "43": "3G", "44": "3G", "45": "3G+", "46": "3G+", "101": "LTE 4G", "1011": "LTE CA 4G+", "111": "5G NR" }[m] || m; };

  var body = h("div", { className: "bd" }), foot = h("div", { className: "ft" }), cur = "h", timer, home, cnt = 0;
  var tabs = h("div", { className: "tb" }), tabBtns = {};
  [["h", "Home"], ["a", "Align"], ["g", "History"], ["o", "Operator"], ["d", "Devices"], ["t", "Tools"]].forEach(function (t) {
    tabBtns[t[0]] = h("button", { textContent: t[1], onclick: function () { go(t[0]); } });
    tabs.append(tabBtns[t[0]]);
  });
  var btn;
  var closePanel = function () {
    panel.style.display = "none"; clearInterval(timer); clearTimeout(beepT); beepOn = false; persistHist();
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
    go(cur);
  };
  btn = h("button", { id: "mmb", textContent: "📶", onclick: openPanel });
  document.documentElement.append(panel, btn, toastEl);

  function go(t) {
    cur = t;
    clearInterval(timer); timer = setInterval(tick, t == "a" ? 800 : 1500);
    if (t != "a") { clearTimeout(beepT); beepOn = false; }
    Object.keys(tabBtns).forEach(function (k) { tabBtns[k].className = k == t ? "on" : ""; });
    foot.style.display = "none"; foot.replaceChildren();
    if (t == "h") {
      if (!home) { home = buildHome(); loadBands(); }
      body.replaceChildren(home.root);
      foot.replaceChildren(home.foot); foot.style.display = "block";
      tick();
    } else if (t == "a") { beepOn = false; align(); tick(); }   // هر بار وارد Align بشی بیپ خاموشه
    else if (t == "g") histTab();
    else if (t == "o") ops(); else if (t == "d") devs(); else tools();
  }

  // ---------- shared state: profiles, signal history, auto-switch ----------
  var profs = function () { try { return JSON.parse(localStorage.getItem("mmprof") || "[]"); } catch (e) { return []; } };
  var saveProfs = function (a) { try { localStorage.setItem("mmprof", JSON.stringify(a)); } catch (e) { toast("ذخیره نشد"); } };
  var pad2 = function (n) { return ("0" + n).slice(-2); };
  var hm = function (t) { var d = new Date(t); return pad2(d.getHours()) + ":" + pad2(d.getMinutes()); };
  var numOrNull = function (s) { var n = num(s); return isNaN(n) ? null : n; };

  // تاریخچه: هر ۱۰ ثانیه یه نمونه، حداکثر ۲ ساعت، توی localStorage هم ذخیره می‌شه
  var HMAX = 720, SAMPLE_MS = 10000, hist = [], evs = [], nSamp = 0, sampleBusy = false, hv = null;
  try { hist = JSON.parse(localStorage.getItem("mmhist") || "[]"); evs = JSON.parse(localStorage.getItem("mmev") || "[]"); } catch (e) { hist = []; evs = []; }
  if (!Array.isArray(hist)) hist = [];
  if (!Array.isArray(evs)) evs = [];
  function persistHist() {
    try { localStorage.setItem("mmhist", JSON.stringify(hist)); localStorage.setItem("mmev", JSON.stringify(evs)); } catch (e) {}
  }
  function addEv(txt) { evs.push({ t: Date.now(), x: txt }); if (evs.length > 40) evs.shift(); persistHist(); }
  async function sample() {
    if (sampleBusy || document.hidden) return;
    sampleBusy = true;
    try {
      var a = await get("/api/device/signal", 8000);
      if (a.indexOf("<response") < 0) return;   // لاگین نیست یا مودم داره بالا میاد: نمونه ثبت نکن
      var b = numOrNull(tag(a, "band"));
      hist.push({ t: Date.now(), a: numOrNull(tag(a, "rsrp")), s: numOrNull(tag(a, "sinr")), na: numOrNull(tag(a, "nrrsrp")), ns: numOrNull(tag(a, "nrsinr")), b: b ? b : null, p: numOrNull(tag(a, "pci")) });
      if (hist.length > HMAX) hist.splice(0, hist.length - HMAX);
      if (++nSamp % 6 == 0) persistHist();
    } catch (e) { } finally { sampleBusy = false; }
  }

  // سوییچ خودکار پروفایل وقتی سیگنال مدتی ضعیف بمونه
  var AK = "mmauto", autoMsg = "", autoBusy = false;
  var auto = { on: false, thr: 5, mins: 3, cur: "", t0: 0, hold: 0, tried: {} };
  try { Object.assign(auto, JSON.parse(localStorage.getItem(AK) || "{}")); } catch (e) { }
  if (!auto.tried || typeof auto.tried != "object") auto.tried = {};
  var saveAuto = function () { try { localStorage.setItem(AK, JSON.stringify(auto)); } catch (e) { } };
  var setAutoMsg = function (s) { autoMsg = s; if (home && home.autoEl) home.autoEl.textContent = (auto.cur ? "«" + auto.cur + "» · " : "") + s; };
  var mainVal = function (p) { return p.ns !== null ? p.ns : p.s; };   // 5G SINR اگه بود، وگرنه 4G
  async function autoTick() {
    if (!auto.on || autoBusy || document.hidden) return;
    var ps = profs(), now = Date.now(), win = auto.mins * 60000;
    if (ps.length < 2) return setAutoMsg("حداقل ۲ پروفایل ذخیره کن");
    if (!home || !home.applyBands) return setAutoMsg("در انتظار آماده شدن پنل...");
    if (now < auto.hold) return setAutoMsg("روی بهترین پروفایل نگه داشته شد تا " + hm(auto.hold));
    var pts = hist.filter(function (p) { return p.t >= Math.max(auto.t0, now - win); });
    var span = pts.length ? pts[pts.length - 1].t - pts[0].t : 0;
    if (now - auto.t0 < win || pts.length < 3 || span < win * 0.7) return setAutoMsg("در حال بررسی سیگنال...");
    var sum = 0;
    pts.forEach(function (p) { var v = mainVal(p); sum += v === null ? -20 : v; });   // بدون سرویس = خیلی بد
    var avg = Math.round(sum / pts.length * 10) / 10;
    if (avg >= auto.thr) { auto.tried = {}; saveAuto(); return setAutoMsg("سیگنال خوبه (میانگین " + avg + " dB)"); }
    if (auto.cur) auto.tried[auto.cur] = avg;
    var target = ps.filter(function (p) { return !(p.n in auto.tried); })[0], why = "امتحان";
    if (!target) {   // همه امتحان شدن: بهترین رو انتخاب کن و نیم ساعت دست نزن
      var sc = function (p) { return auto.tried[p.n] === undefined ? -99 : auto.tried[p.n]; };
      target = ps.slice().sort(function (x, y) { return sc(y) - sc(x); })[0]; why = "بهترین";
      auto.hold = now + 30 * 60000; auto.tried = {};
    }
    autoBusy = true;
    try {
      if (target.n != auto.cur) {
        var okk = await home.applyBands(BigInt("0x" + target.l), BigInt("0x" + target.r), target.o, target.e, target.n, true);
        if (!okk) { auto.t0 = now; saveAuto(); return setAutoMsg("اعمال «" + target.n + "» ناموفق بود؛ بعداً دوباره"); }
        auto.cur = target.n;
        addEv("سوییچ خودکار ← «" + target.n + "» (" + why + "، میانگین قبلی " + avg + " dB)");
      }
      auto.t0 = now + 45000; saveAuto();   // ۴۵ ثانیه برای وصل شدن دوباره‌ی مودم
      setAutoMsg("«" + target.n + "» اعمال شد؛ صبر برای ارزیابی");
    } finally { autoBusy = false; }
  }

  // ---------- home ----------
  var MET = { rssi: ["RSSI", "dBm", -100, -45, -65, -80], rsrp: ["RSRP", "dBm", -120, -70, -90, -105], rsrq: ["RSRQ", "dB", -20, -3, -10, -15], sinr: ["SINR", "dB", -5, 30, 13, 0] };
  function row(k, label) {
    var fill = h("i"), v = h("span", { textContent: "-" });
    return { root: h("div", { className: "sr" }, fill, h("div", { className: "t" }, h("span", { textContent: label }), v)), fill: fill, v: v, m: MET[k] };
  }
  function setRow(r, val) {
    var n = num(val), m = r.m;
    if (isNaN(n)) { r.v.textContent = "-"; r.fill.style.width = "0"; return; }
    var col = n >= m[4] ? G : n >= m[5] ? Y : R;
    r.v.textContent = n + " " + m[1] + "  " + (n >= m[4] ? "عالی" : n >= m[5] ? "متوسط" : "بد");
    r.fill.style.width = Math.max(5, Math.min(100, (n - m[2]) * 100 / (m[3] - m[2]))) + "%"; r.fill.style.background = col;
  }
  var BODY = function (m, b, l, o, extra) {
    return "<request><NetworkMode>" + m + "</NetworkMode><NetworkBand>" + b + "</NetworkBand><LTEBand>" + l + "</LTEBand>" + (o !== "" ? "<networkOption>" + o + "</networkOption>" : "") + (extra || "") + "</request>";
  };
  function buildHome() {
    var o = { rows: {}, nrTag: "" };
    o.opn = h("b", { textContent: "..." }); o.mode = h("span", { className: "tag", textContent: "-" });
    o.dl = h("div", { textContent: "↓ -" }); o.ul = h("div", { textContent: "↑ -" });
    o.info = h("div", { className: "info" });
    var sig = h("div");
    [["rsrp", "4G RSRP"], ["rsrq", "4G RSRQ"], ["sinr", "4G SINR"], ["rssi", "4G RSSI"]].forEach(function (d) { var r = row(d[0], d[1]); o.rows[d[0]] = r; sig.append(r.root); });
    [["rsrp", "5G RSRP"], ["rsrq", "5G RSRQ"], ["sinr", "5G SINR"]].forEach(function (d) { var r = row(d[0], d[1]); o.rows["nr" + d[0]] = r; sig.append(r.root); });
    var quick = function (name, m, b) {
      return h("button", { className: "b", textContent: name, onclick: async function () {
        toast(name + " ...");
        if (m != "08") {
          var r0 = await post("/api/net/net-mode", BODY(m, b, "7FFFFFFFFFFFFFFF", ""));
          toast(r0.indexOf("OK") > -1 ? name + " ✓" : "خطا: " + r0.slice(0, 120));
          loadBands();
          return;
        }
        var opts = o.opt.value !== "" ? [o.opt.value] : ["2", "1", "0"];
        var bands = ["3FFFFFFF", "00000000"];
        var done = "";
        outer:
        for (var i = 0; i < opts.length; i++) {
          for (var j = 0; j < bands.length; j++) {
            var r = await post("/api/net/net-mode", BODY("08", bands[j], "7FFFFFFFFFFFFFFF", opts[i]));
            if (r.indexOf("OK") < 0) continue;
            await new Promise(function (res) { setTimeout(res, 1500); });
            var nm = await get("/api/net/net-mode");
            log("check: " + nm);
            if (tag(nm, "NetworkMode") == "08") { done = "5G فقط ✓ (option " + opts[i] + ")"; break outer; }
          }
        }
        toast(done || "5G فقط ثبت نشد؛ Tools ← Log رو ببین");
        loadBands();
      } });
    };
    o.chips = h("div", { className: "chips" }); o.nrchips = h("div", { className: "chips" });
    o.opt = h("select", {}, h("option", { value: "", textContent: "5G: بدون تغییر" }), h("option", { value: "0", textContent: "5G NSA" }), h("option", { value: "1", textContent: "5G SA" }), h("option", { value: "2", textContent: "5G SA+NSA" }));
    o.en5 = h("input", { type: "checkbox", checked: true });
    var all = function (v) { o.chips.querySelectorAll(".chip").forEach(function (i) { i.classList.toggle("on", v); }); };
    var mask = function (box) { var v = 0n; box.querySelectorAll(".chip.on").forEach(function (i) { v |= 1n << BigInt(i.dataset.b - 1); }); return v; };
    o.root = h("div", {},
      h("div", { className: "top" }, o.opn, o.mode),
      h("div", { className: "sp" }, o.dl, o.ul), o.info, sig,
      h("div", { className: "sec", textContent: "حالت شبکه" }),
      h("div", { className: "row" }, quick("Auto", "00", "3FFFFFFF"), quick("5G فقط", "08", "3FFFFFFF"), quick("4G", "03", "3FFFFFFF"), quick("3G", "02", "3FFFFFFF"), quick("2G", "01", "3FFFFFFF")),
      h("div", { className: "sec", textContent: "قفل باند: باندها رو انتخاب کن، بعد Apply" }),
      h("div", { className: "row" }, o.opt, h("label", {}, o.en5, " 4G+5G")),
      h("div", { className: "row" },
        h("button", { className: "b", textContent: "همه باندها", onclick: function () { all(true); } }),
        h("button", { className: "b", textContent: "پاک کردن", onclick: function () { all(false); } })),
      h("div", { className: "sec", textContent: "باندهای 4G" }), o.chips,
      h("div", { className: "sec", textContent: "باندهای 5G (قفل باند هنوز آماده نیست؛ فعلاً از دکمه‌ی «5G فقط» استفاده کن)" }), o.nrchips);
    // v/nv: ماسک باندهای 4G/5G (BigInt)، opt: حالت 5G، en5: فعال بودن 4G+5G
    // خروجی: true اگه مودم OK داد. isAuto=true یعنی سوییچ خودکار (حالت خودکار رو ریست نکن)
    var applyBands = async function (v, nv, opt, en5, label, isAuto) {
      if (v == 0n && nv == 0n) { toast("حداقل یک باند انتخاب کن"); return false; }
      if (nv != 0n && !o.nrTag) { toast("API قفل 5G هنوز مشخص نشده. Tools ← جمع‌آوری اطلاعات 5G رو بزن و متن رو بفرست"); return false; }
      toast(isAuto ? "سوییچ خودکار: «" + label + "»..." : "در حال اعمال...");
      var lte = v == 0n ? "7FFFFFFFFFFFFFFF" : v.toString(16).toUpperCase();
      var extra = nv != 0n ? "<" + o.nrTag + ">" + nv.toString(16).toUpperCase() + "</" + o.nrTag + ">" : "";
      var r = await post("/api/net/net-mode", en5 ? BODY("00", "00000000", lte, opt, extra) : BODY("03", "3FFFFFFF", lte, "", extra));
      var good = r.indexOf("OK") > -1;
      toast(good ? (label ? "«" + label + "» اعمال شد ✓" : "اعمال شد ✓") : "خطا: " + r.slice(0, 80));
      if (good && !isAuto) { auto.cur = label || ""; auto.t0 = Date.now() + 45000; auto.tried = {}; saveAuto(); }
      loadBands();
      return good;
    };
    o.applyBands = applyBands;
    o.foot = h("button", {
      className: "b p", style: "width:100%", textContent: "Apply",
      onclick: function () { applyBands(mask(o.chips), mask(o.nrchips), o.opt.value, o.en5.checked); }
    });

    // ---------- پروفایل‌ها ----------
    var descP = function (p) {
      var l = bitsOf(BigInt("0x" + p.l), 64), r = bitsOf(BigInt("0x" + p.r), 128);
      var s = l.length > 5 ? "4G×" + l.length : l.map(function (n) { return "B" + n; }).join(" ");
      if (r.length) s += (s ? " " : "") + (r.length > 4 ? "5G×" + r.length : r.map(function (n) { return "n" + n; }).join(" "));
      return s;
    };
    var renderProfs = function () {
      var a = profs();
      if (!a.length) { o.profBox.replaceChildren(h("div", { className: "tag", textContent: "هنوز پروفایلی ذخیره نشده" })); return; }
      o.profBox.replaceChildren.apply(o.profBox, a.map(function (p, i) {
        var del = h("button", {
          className: "b x", textContent: "✕", onclick: function () {
            var b = this;
            if (!b.dataset.s) { b.dataset.s = "1"; b.textContent = "؟"; setTimeout(function () { delete b.dataset.s; b.textContent = "✕"; }, 2500); return; }
            var all = profs(); all.splice(i, 1); saveProfs(all); renderProfs();
          }
        });
        var go1 = h("button", {
          className: "b", textContent: p.n + "  (" + descP(p) + ")",
          onclick: function () { applyBands(BigInt("0x" + p.l), BigInt("0x" + p.r), p.o, p.e, p.n); }
        });
        return h("div", { className: "row", style: "margin-bottom:6px" }, go1, del);
      }));
    };
    var saveProfile = function () {
      var v = mask(o.chips), nv = mask(o.nrchips), name = o.pname.value.trim();
      if (v == 0n && nv == 0n) return toast("اول باندها رو انتخاب کن");
      if (!name) return toast("یه اسم برای پروفایل بنویس");
      var a = profs().filter(function (p) { return p.n != name; });
      a.push({ n: name, l: v.toString(16), r: nv.toString(16), o: o.opt.value, e: o.en5.checked });
      saveProfs(a); o.pname.value = ""; renderProfs(); toast("پروفایل ذخیره شد ✓");
    };
    o.profBox = h("div");
    o.pname = h("input", { type: "text", placeholder: "اسم پروفایل (مثلاً n78 شب)" });
    o.profSave = h("div", {},
      h("div", { className: "sec", textContent: "ذخیره‌ی انتخاب فعلی باندها به‌عنوان پروفایل" }),
      h("div", { className: "row" }, o.pname, h("button", { className: "b", style: "flex:none;width:auto;padding:13px 16px", textContent: "ذخیره", onclick: saveProfile })));
    // سوییچ خودکار: اگه میانگین SINR تو N دقیقه زیر حد بود، پروفایل بعدی رو امتحان می‌کنه
    var optsOf = function (a, unit) { return a.map(function (v) { return h("option", { value: String(v), textContent: v + unit }); }); };
    o.autoOn = h("input", { type: "checkbox", checked: !!auto.on });
    o.autoThr = h("select", {}, optsOf([0, 3, 5, 8, 10], " dB")); o.autoThr.value = String(auto.thr);
    o.autoMins = h("select", {}, optsOf([2, 3, 5, 10], " دقیقه")); o.autoMins.value = String(auto.mins);
    o.autoEl = h("div", { className: "tag", textContent: auto.on ? "فعال" : "خاموش" });
    var autoSave = function () {
      var was = auto.on;
      auto.on = !!o.autoOn.checked; auto.thr = +o.autoThr.value; auto.mins = +o.autoMins.value;
      if (auto.on && !was) { auto.t0 = Date.now(); auto.tried = {}; auto.hold = 0; toast("سوییچ خودکار روشن شد"); }
      saveAuto();
      if (!auto.on) o.autoEl.textContent = "خاموش"; else autoTick();
    };
    o.autoOn.onchange = o.autoThr.onchange = o.autoMins.onchange = autoSave;
    o.root.insertBefore(h("div", {},
      h("div", { className: "sec", textContent: "پروفایل‌ها (یک‌ضربه = اعمال)" }), o.profBox,
      h("div", { className: "sec", textContent: "سوییچ خودکار: اگه میانگین SINR (اولی) تو این مدت (دومی) زیر حد بمونه، پروفایل بعدی امتحان می‌شه. حداقل ۲ پروفایل لازمه" }),
      h("div", { className: "row" }, h("label", {}, o.autoOn, " فعال"), o.autoThr, o.autoMins), o.autoEl), o.root.children[6]);
    o.root.append(o.profSave);
    renderProfs();
    return o;
  }
  function mkChips(box, supBits, curBits, pre, freq, cls) {
    var els = [];
    supBits.forEach(function (n) {
      var c = h("button", { className: "chip " + cls + (((curBits >> BigInt(n - 1)) & 1n) ? " on" : ""), onclick: function () { this.classList.toggle("on"); } }, h("b", { textContent: pre + n }), h("small", { textContent: freq[n] || "" }));
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
  }
  var busy = false;
  async function tick() {
    if (panel.style.display != "flex") return;
    if (cur == "g") { if (hv) hv.redraw(); return; }
    if (busy) return;
    if (cur == "a") return alignTick();
    if (cur != "h" || !home) return;
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
    } catch (e) { log("ERR " + e); }
    busy = false;
  }

  // ---------- align (antenna alignment) ----------
  var AO = [["auto", "خودکار (5G SINR، اگه نبود 4G)"], ["sinr", "4G SINR"], ["rsrp", "4G RSRP"], ["nrsinr", "5G SINR"], ["nrrsrp", "5G RSRP"]];
  var al = null, AC = null, beepOn = false, beepT = 0, lastQ = -1;
  var metOf = function (k) { return MET[k.replace(/^nr/, "")]; };
  var qOf = function (n, m) { return Math.max(0, Math.min(100, (n - m[2]) * 100 / (m[3] - m[2]))); };
  function beepOnce(q) {
    if (!AC) return;
    try {
      var os = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
      os.type = "sine"; os.frequency.value = 350 + q * 9;
      os.connect(g); g.connect(AC.destination);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      os.start(t); os.stop(t + 0.1);
    } catch (e) {}
  }
  // هرچی سیگنال بهتر، بیپ تیزتر و سریع‌تر
  function beepLoop() {
    clearTimeout(beepT);
    if (!beepOn || cur != "a" || panel.style.display != "flex") return;
    if (lastQ >= 0) beepOnce(lastQ);
    beepT = setTimeout(beepLoop, lastQ >= 0 ? 1000 - lastQ * 8.5 : 800);
  }
  function align() {
    var sel = h("select", {}, AO.map(function (x) { return h("option", { value: x[0], textContent: x[1] }); }));
    var big = h("div", { className: "abig", textContent: "-" }), lab = h("div", { className: "sec", style: "text-align:center" });
    var bar = row("sinr", ""), peak = h("span", { className: "tag", textContent: "بهترین: -" }), info = h("div", { className: "info" });
    al = { sel: sel, big: big, lab: lab, bar: bar, peak: peak, info: info, pk: null, key: "" };
    sel.onchange = function () { al.pk = null; lastQ = -1; };
    var bb = h("button", {
      className: "b" + (beepOn ? " p" : ""), textContent: beepOn ? "🔊 بیپ روشن" : "🔈 بیپ خاموش", onclick: function () {
        beepOn = !beepOn;
        if (beepOn) {
          try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.resume) AC.resume(); }
          catch (e) { toast("صدا روی این WebView کار نکرد"); }
        }
        this.textContent = beepOn ? "🔊 بیپ روشن" : "🔈 بیپ خاموش"; this.classList.toggle("p", beepOn);
        beepLoop();
      }
    });
    body.replaceChildren(
      h("div", { className: "sec", textContent: "آنتن یا مودم رو آروم جابه‌جا کن؛ عدد بالاتر و بیپ تندتر = سیگنال بهتر. هر جابه‌جایی رو چند ثانیه صبر کن تا عدد جا بیفته." }),
      sel, big, lab, bar.root,
      h("div", { className: "row", style: "margin-top:8px" }, peak,
        h("button", { className: "b", style: "flex:none;width:auto;padding:8px 14px", textContent: "ریست", onclick: function () { al.pk = null; peak.textContent = "بهترین: -"; } })),
      info,
      h("div", { className: "row", style: "margin-top:8px" }, bb));
  }
  async function alignTick() {
    if (!al) return;
    busy = true;
    try {
      var a = await get("/api/device/signal"), key = al.sel.value;
      if (key == "auto") key = isNaN(num(tag(a, "nrsinr"))) ? "sinr" : "nrsinr";
      var n = num(tag(a, key)), m = metOf(key), nm = "";
      AO.forEach(function (x) { if (x[0] == key) nm = x[1]; });
      if (key != al.key) { al.key = key; al.pk = null; al.bar.m = m; }
      if (isNaN(n)) {
        lastQ = -1; al.pk = null;
        al.big.textContent = "-"; al.big.style.color = "";
        al.lab.textContent = nm + " — سیگنالی دریافت نمی‌شه";
        al.peak.textContent = "بهترین: -"; setRow(al.bar, NaN);
      } else {
        lastQ = qOf(n, m);
        var col = n >= m[4] ? G : n >= m[5] ? Y : R;
        al.big.replaceChildren(String(n), h("small", { textContent: m[1] }));
        al.big.style.color = col;
        al.lab.textContent = nm;
        if (al.pk === null || n > al.pk) al.pk = n;
        al.peak.textContent = "بهترین: " + al.pk + " " + m[1];
        setRow(al.bar, n);
      }
      var items = [["Band", tag(a, "band") && tag(a, "band") != "0" ? "B" + tag(a, "band") : ""], ["PCI", tag(a, "pci")], ["Cell", tag(a, "cell_id")]];
      al.info.replaceChildren.apply(al.info, items.filter(function (i) { return i[1]; }).map(function (i) { return h("span", { className: "tag", textContent: i[0] + ": " + i[1] }); }));
    } catch (e) { log("align ERR " + e); }
    busy = false;
  }

  // ---------- history (signal chart) ----------
  var HM = [["s", "4G SINR", "sinr"], ["a", "4G RSRP", "rsrp"], ["ns", "5G SINR", "sinr"], ["na", "5G RSRP", "rsrp"]];
  function drawChart(cv, pts, key, m, t0, t1, marks) {
    var c = cv.getContext("2d"), W = cv.width, H = cv.height, L = 52, R = 10, T = 10, B = 26;
    var X = function (t) { return L + (t - t0) * (W - L - R) / (t1 - t0); };
    var Y = function (v) { return T + (1 - (Math.max(m[2], Math.min(m[3], v)) - m[2]) / (m[3] - m[2])) * (H - T - B); };
    c.clearRect(0, 0, W, H);
    c.fillStyle = "rgba(46,204,113,.13)"; c.fillRect(L, Y(m[3]), W - L - R, Y(m[4]) - Y(m[3]));
    c.fillStyle = "rgba(245,197,66,.13)"; c.fillRect(L, Y(m[4]), W - L - R, Y(m[5]) - Y(m[4]));
    c.fillStyle = "rgba(229,72,77,.13)"; c.fillRect(L, Y(m[5]), W - L - R, Y(m[2]) - Y(m[5]));
    c.font = "20px sans-serif"; c.fillStyle = "#8a97a8"; c.textAlign = "right";
    [m[2], m[5], m[4], m[3]].forEach(function (v) { c.fillText(String(v), L - 6, Y(v) + 7); });
    c.textAlign = "left"; c.fillText(hm(t0), L, H - 5); c.textAlign = "right"; c.fillText(hm(t1), W - R, H - 5);
    (marks || []).forEach(function (k) {
      c.strokeStyle = k.c; c.lineWidth = 2; c.beginPath(); c.moveTo(X(k.t), T); c.lineTo(X(k.t), H - B); c.stroke();
    });
    c.strokeStyle = "#5aa2ff"; c.fillStyle = "#5aa2ff"; c.lineWidth = 3; c.beginPath();
    var prev = null;
    pts.forEach(function (p) {
      var v = p[key];
      if (v === null) { prev = null; return; }
      if (prev === null || p.t - prev > 60000) c.moveTo(X(p.t), Y(v)); else c.lineTo(X(p.t), Y(v));
      prev = p.t;
    });
    c.stroke();
    if (pts.length <= 150) pts.forEach(function (p) { if (p[key] !== null) c.fillRect(X(p.t) - 2, Y(p[key]) - 2, 4, 4); });
  }
  function histTab() {
    var opt = function (x) { return h("option", { value: x[0], textContent: x[1] }); };
    var ms = h("select", {}, HM.map(function (x) { return opt([x[0], x[1]]); }));
    var rs = h("select", {}, [["15", "۱۵ دقیقه"], ["60", "۱ ساعت"], ["120", "۲ ساعت"]].map(opt)); rs.value = "60";
    var cv = h("canvas", { width: 720, height: 300, style: "width:100%;height:auto;background:#0f151d;border-radius:12px;margin-top:6px" });
    var stat = h("div", { className: "info" }), evEl = h("pre");
    var redraw = function () {
      var def = HM.filter(function (x) { return x[0] == ms.value; })[0], key = def[0], m = MET[def[2]];
      var now = Date.now(), t0 = now - (+rs.value) * 60000;
      var pts = hist.filter(function (p) { return p.t >= t0; }), lines = [];
      for (var i = 1; i < hist.length; i++) {
        var a = hist[i - 1], b = hist[i], ch = [];
        if (b.t < t0 || b.t - a.t > 120000) continue;   // فاصله‌ی زیاد = اپ بسته بوده، تغییر حساب نکن
        if (a.b !== b.b) ch.push((a.b === null ? "-" : "B" + a.b) + "→" + (b.b === null ? "-" : "B" + b.b));
        if (a.p !== b.p) ch.push("PCI " + (a.p === null ? "-" : a.p) + "→" + (b.p === null ? "-" : b.p));
        if (ch.length) lines.push({ t: b.t, x: ch.join("  "), c: "rgba(255,255,255,.35)" });
      }
      evs.forEach(function (e) { if (e.t >= t0) lines.push({ t: e.t, x: e.x, c: "#ff9f43" }); });
      lines.sort(function (x, y) { return y.t - x.t; });
      var vs = pts.map(function (p) { return p[key]; }).filter(function (v) { return v !== null; });
      var items = [];
      if (vs.length) {
        var sum = 0; vs.forEach(function (v) { sum += v; });
        items = [["کمترین", Math.min.apply(null, vs)], ["میانگین", Math.round(sum / vs.length * 10) / 10], ["بیشترین", Math.max.apply(null, vs)], ["نمونه", vs.length]];
      }
      stat.replaceChildren.apply(stat, items.length
        ? items.map(function (i) { return h("span", { className: "tag", textContent: i[0] + ": " + i[1] }); })
        : [h("span", { className: "tag", textContent: "هنوز داده‌ای نیست؛ هر ۱۰ ثانیه یه نمونه ثبت می‌شه" })]);
      evEl.textContent = lines.slice(0, 12).map(function (l) { return hm(l.t) + "  " + l.x; }).join("\n") || "(تغییر باند/سلول یا سوییچی نبوده)";
      drawChart(cv, pts, key, m, t0, now, lines);
    };
    ms.onchange = rs.onchange = redraw;
    hv = { redraw: redraw };
    body.replaceChildren(
      h("div", { className: "sec", textContent: "نمودار سیگنال (حتی وقتی این تب بسته‌ست ثبت می‌شه). خط‌های عمودی = تغییر باند/سلول، نارنجی = سوییچ خودکار" }),
      h("div", { className: "row" }, ms, rs), cv, stat,
      h("div", { className: "sec", textContent: "رویدادها" }), evEl,
      h("button", { className: "b", style: "width:100%;margin-top:8px", textContent: "پاک کردن تاریخچه", onclick: function () { hist = []; evs = []; persistHist(); redraw(); } }));
    redraw();
  }

  // ---------- devices ----------
  async function devs() {
    body.replaceChildren(h("div", { className: "sec", textContent: "Loading..." }));
    var x = "";
    try {
      x = await get("/api/lan/HostInfo");
      if (x.indexOf("<Host") < 0) x = await get("/api/wlan/host-list");
    } catch (e) { return body.replaceChildren(h("div", { className: "sec", textContent: "ارتباط با مودم برقرار نشد: " + e })); }
    var d = new DOMParser().parseFromString(x, "text/xml"), els = [];
    d.querySelectorAll("Host").forEach(function (e) {
      var g = function (n) { var f = e.querySelector(n); return f ? f.textContent : ""; };
      els.push(h("div", { className: "dv" }, h("b", { textContent: g("HostName") || "Unknown" }), h("span", { textContent: g("IpAddress") }), h("br"), h("span", { textContent: g("MacAddress") + "  " + g("InterfaceType") })));
    });
    if (!els.length) els.push(h("pre", { textContent: x.slice(0, 1500) }));
    body.replaceChildren(h("div", { className: "sec", textContent: "دستگاه‌های متصل: " + (els.length) }), ...els);
  }

  // ---------- operator ----------
  async function ops() {
    var st = h("pre"), list = h("div");
    var rat = h("select", {}, h("option", { value: "7", textContent: "4G/5G NSA (LTE)" }), h("option", { value: "2", textContent: "3G" }), h("option", { value: "0", textContent: "2G" }));
    var pin = h("input", { type: "text", placeholder: "PLMN مثلا 43235" });
    var show = async function () {
      try {
        var r = await get("/api/net/register"), pl = await get("/api/net/current-plmn");
        st.textContent = "حالت: " + (tag(r, "Mode") == "1" ? "دستی" : "خودکار") + "\nPLMN: " + (tag(r, "Plmn") || "-") + "  Rat: " + (tag(r, "Rat") || "-") + "\nاپراتور فعلی: " + (tag(pl, "FullName") || "-") + " " + tag(pl, "Numeric");
      } catch (e) { st.textContent = "ERR " + e; }
    };
    var setReg = async function (mode, plmn, rt) {
      toast("در حال اعمال...");
      var x = await post("/api/net/register", "<request><Mode>" + mode + "</Mode><Plmn>" + plmn + "</Plmn><Rat>" + rt + "</Rat></request>");
      toast(x.indexOf("OK") > -1 ? "ثبت شد ✓ چند ثانیه صبر کن" : "خطا: " + x.slice(0, 100));
      setTimeout(show, 5000);
    };
    var scan = async function () {
      list.replaceChildren(h("div", { className: "sec", textContent: "در حال جستجو... ۱ تا ۳ دقیقه طول می‌کشه و اینترنت قطع می‌شه. صبر کن." }));
      var x = "";
      try { x = await get("/api/net/plmn-list", 240000); } catch (e) { x = "ERR " + e; }
      log("plmn-list: " + x);
      var d = new DOMParser().parseFromString(x, "text/xml"), els = [];
      d.querySelectorAll("Network").forEach(function (e) {
        var g = function (n) { var f = e.querySelector(n); return f ? f.textContent : ""; };
        var num = g("Numeric"), rt = g("Rat"), sv = g("State");
        els.push(h("div", { className: "dv" },
          h("b", { textContent: g("FullName") || g("ShortName") || num }),
          h("span", { textContent: num + "  Rat:" + rt + "  " + (sv == "2" ? "(فعلی)" : sv == "3" ? "(ممنوع)" : "") }),
          h("button", { className: "b p", style: "width:100%;margin-top:6px", textContent: "اتصال به این اپراتور", onclick: function () { setReg(1, num, rt); } })));
      });
      list.replaceChildren.apply(list, els.length ? els : [h("pre", { textContent: x.slice(0, 1200) })]);
    };
    body.replaceChildren(
      h("div", { className: "sec", textContent: "وضعیت فعلی" }), st,
      h("button", { className: "b", style: "width:100%", textContent: "خودکار (Auto)", onclick: function () { setReg(0, "", ""); } }),
      h("div", { className: "sec", textContent: "انتخاب سریع (بدون جستجو)" }), rat,
      h("div", { className: "row" },
        h("button", { className: "b", textContent: "ایرانسل", onclick: function () { setReg(1, "43235", rat.value); } }),
        h("button", { className: "b", textContent: "همراه اول", onclick: function () { setReg(1, "43211", rat.value); } }),
        h("button", { className: "b", textContent: "رایتل", onclick: function () { setReg(1, "43220", rat.value); } })),
      h("div", { className: "sec", textContent: "PLMN دلخواه" }), pin,
      h("button", { className: "b", style: "width:100%", textContent: "اتصال به PLMN بالا", onclick: function () { if (pin.value) setReg(1, pin.value.trim(), rat.value); } }),
      h("div", { className: "sec", textContent: "جستجوی اپراتورهای اطراف" }),
      h("button", { className: "b p", style: "width:100%", textContent: "جستجو (اینترنت چند دقیقه قطع می‌شه)", onclick: function () { toast("شروع جستجو..."); scan(); } }),
      list);
    show();
  }

  // ---------- tools ----------
  async function collect(out, extra) {
    var t = [], add = function (s) { t.push(s); out.value = t.join("\n").slice(0, 7000); };
    var norm = function (f) { f = f.replace(/^(\.\.?\/)+/, ""); return f.charAt(0) == "/" ? f : (/^html\//.test(f) ? "/" + f : "/html/" + f); };
    try {
      var shell = await get("/html/content.html"), texts = [shell];
      var srcs = (shell.match(/src="([^"]+\.js[^"]*)"/g) || []).slice(0, 14);
      for (var i = 0; i < srcs.length; i++) {
        try { var u = new URL(srcs[i].slice(5, -1), location.origin + "/html/content.html"); texts.push(await get(u.pathname + u.search)); } catch (e) {}
      }
      add("scripts: " + srcs.length);
      var found = {}, ctx = [];
      texts.forEach(function (tx) {
        var re = /[\w\-\/\.#]*devel[\w\-\/\.#]*/ig, m, n = 0;
        while ((m = re.exec(tx)) && n < 30) { found[m[0]] = 1; if (ctx.length < 4) ctx.push(tx.slice(Math.max(0, m.index - 60), m.index + 120).replace(/\s+/g, " ")); n++; }
      });
      add("== devel tokens ==\n" + Object.keys(found).join("\n"));
      ctx.forEach(function (c) { add("..." + c); });
      var base = (await get("/html/zz_notfound.html")).length, cand = {};
      if (extra) cand[norm(extra)] = 1;
      Object.keys(found).forEach(function (f) { if (/\.html/i.test(f)) cand[norm(f)] = 1; });
      ["developmode", "developer", "developeroptions", "developOptions", "developerOptions", "develop_options", "developer_options", "develop", "development", "developopt"].forEach(function (n) { cand["/html/" + n + ".html"] = 1; });
      var lines = [], real = [];
      for (var p in cand) {
        var pg = ""; try { pg = await get(p); } catch (e) { lines.push(p + " ERR"); continue; }
        lines.push(p + " len=" + pg.length + (pg.length == base ? " (=default page)" : ""));
        if (pg.length > 300 && pg.length != base) real.push([p, pg]);
      }
      add("== pages ==\n" + lines.join("\n"));
      for (var r = 0; r < real.length; r++) {
        var txs = [real[r][1]], ss = (real[r][1].match(/src="([^"]+\.js[^"]*)"/g) || []).slice(0, 6);
        for (var k = 0; k < ss.length; k++) { try { var uu = new URL(ss[k].slice(5, -1), location.origin + real[r][0]); txs.push(await get(uu.pathname + uu.search)); } catch (e) {} }
        var apis = {};
        txs.forEach(function (tx) { (tx.match(/\/api\/[\w\-\/]+/g) || []).forEach(function (x) { apis[x] = 1; }); });
        add("== " + real[r][0] + " APIs ==\n" + Object.keys(apis).join(" "));
        txs.forEach(function (tx) {
          var re = /band.?lock|lockband|nrband|lock_band/ig, m, n = 0;
          while ((m = re.exec(tx)) && n < 3) { add("..." + tx.slice(Math.max(0, m.index - 100), m.index + 220).replace(/\s+/g, " ")); n++; re.lastIndex = m.index + 300; }
        });
      }
    } catch (e) { add("ERR " + e); }
    add("== done ==");
    out.focus(); out.select();
  }
  function tools() {
    var m = h("select", {}, h("option", { textContent: "GET" }), h("option", { textContent: "POST" }));
    var p = h("input", { type: "text", value: "/api/net/net-mode" }), b = h("textarea", { rows: 2 }), o = h("pre");
    var out = h("textarea", { rows: 7, placeholder: "نتیجه اینجا میاد" }), pg = h("input", { type: "text", value: "/html/developmode.html" });
    var capEl = h("pre", { textContent: (JSON.parse(localStorage.mmcap || "[]")).join("\n\n") || "(خالی)" });
    body.replaceChildren(
      h("button", { className: "b r", style: "width:100%", textContent: "Reboot modem", onclick: function () { if (confirm("Reboot modem?")) { toast("Reboot..."); post("/api/device/control", "<request><Control>1</Control></request>"); } } }),
      h("div", { className: "sec", textContent: "برای ساخت قفل n78/n48: این دکمه رو بزن، صبر کن تا «done» بیاد، متن رو کپی کن و برام بفرست." }),
      h("button", { className: "b p", style: "width:100%", textContent: "جمع‌آوری اطلاعات 5G", onclick: function () { out.value = "در حال جمع‌آوری..."; collect(out, pg.value); } }), out,
      h("div", { className: "sec", textContent: "درخواست‌های ثبت‌شده از صفحه‌ی مودم" }), capEl,
      h("button", { className: "b", style: "width:100%", textContent: "پاک کردن", onclick: function () { localStorage.mmcap = "[]"; capEl.textContent = "(خالی)"; } }),
      h("div", { className: "sec", textContent: "باز کردن یه صفحه‌ی مودم (مثلاً Developer options)" }), pg,
      h("button", { className: "b", style: "width:100%", textContent: "باز کن", onclick: function () { location.href = pg.value; } }),
      h("div", { className: "sec", textContent: "Explorer" }), m, p, b,
      h("button", { className: "b", style: "width:100%", textContent: "Send", onclick: async function () { o.textContent = m.value == "GET" ? await get(p.value) : await post(p.value, b.value); } }), o,
      h("div", { className: "sec", textContent: "Log" }), logEl);
  }

  setInterval(sample, SAMPLE_MS); setInterval(autoTick, 30000); sample();
  try { if (window.addEventListener) window.addEventListener("pagehide", persistHist); } catch (e) {}
  if (window.__mmdbg) window.__mmdbg({ autoTick: autoTick, sample: sample, auto: auto, hist: function () { return hist; }, setHist: function (a) { hist = a; } });
  try { if (/home\.html/.test(location.href) && !sessionStorage.mmo) { sessionStorage.mmo = 1; openPanel(); } } catch (e) {}
})();
