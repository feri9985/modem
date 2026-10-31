package com.farhad.modem

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

class Store(ctx: Context) {
    private val sp = ctx.getSharedPreferences("modem", Context.MODE_PRIVATE)

    fun str(k: String, d: String = ""): String = sp.getString(k, d) ?: d
    fun putStr(k: String, v: String) { sp.edit().putString(k, v).apply() }
    fun bool(k: String, d: Boolean): Boolean = sp.getBoolean(k, d)
    fun putBool(k: String, v: Boolean) { sp.edit().putBoolean(k, v).apply() }

    private fun arr(k: String): JSONArray = try { JSONArray(str(k, "[]")) } catch (e: Exception) { JSONArray() }
    private fun dbl(a: JSONArray, i: Int): Double? = if (a.isNull(i)) null else a.getDouble(i)
    private fun int(a: JSONArray, i: Int): Int? = if (a.isNull(i)) null else a.getInt(i)

    fun loadProfiles(): List<Profile> {
        val a = arr("prof")
        return (0 until a.length()).mapNotNull {
            try {
                val o = a.getJSONObject(it)
                Profile(o.getString("n"), o.getString("l"), o.getString("r"), o.optString("o", ""), o.optBoolean("e", true))
            } catch (e: Exception) { null }
        }
    }

    fun saveProfiles(l: List<Profile>) {
        val a = JSONArray()
        l.forEach { p ->
            a.put(JSONObject().put("n", p.n).put("l", p.l).put("r", p.r).put("o", p.o).put("e", p.e))
        }
        putStr("prof", a.toString())
    }

    fun loadHist(): List<HistPoint> {
        val a = arr("hist")
        return (0 until a.length()).mapNotNull {
            try {
                val r = a.getJSONArray(it)
                HistPoint(r.getLong(0), dbl(r, 1), dbl(r, 2), dbl(r, 3), dbl(r, 4), int(r, 5), int(r, 6))
            } catch (e: Exception) { null }
        }
    }

    fun saveHist(h: List<HistPoint>) {
        val a = JSONArray()
        h.forEach { p ->
            a.put(
                JSONArray().put(p.t).put(p.a ?: JSONObject.NULL).put(p.s ?: JSONObject.NULL)
                    .put(p.na ?: JSONObject.NULL).put(p.ns ?: JSONObject.NULL)
                    .put(p.b ?: JSONObject.NULL).put(p.p ?: JSONObject.NULL)
            )
        }
        putStr("hist", a.toString())
    }

    fun loadEvents(): List<Ev> {
        val a = arr("ev")
        return (0 until a.length()).mapNotNull {
            try { val o = a.getJSONObject(it); Ev(o.getLong("t"), o.getString("x")) } catch (e: Exception) { null }
        }
    }

    fun saveEvents(l: List<Ev>) {
        val a = JSONArray()
        l.forEach { a.put(JSONObject().put("t", it.t).put("x", it.x)) }
        putStr("ev", a.toString())
    }

    fun loadAuto(): AutoCfg = try {
        val o = JSONObject(str("auto", "{}"))
        val t = o.optJSONObject("tried")
        val m = HashMap<String, Double>()
        if (t != null) {
            val ks = t.keys()
            while (ks.hasNext()) { val k = ks.next(); m[k] = t.getDouble(k) }
        }
        AutoCfg(o.optBoolean("on", false), o.optInt("thr", 5), o.optInt("mins", 3), o.optString("cur", ""),
            o.optLong("t0", 0L), o.optLong("hold", 0L), m)
    } catch (e: Exception) { AutoCfg() }

    fun saveAuto(a: AutoCfg) {
        val t = JSONObject()
        a.tried.forEach { (k, v) -> t.put(k, v) }
        putStr("auto", JSONObject().put("on", a.on).put("thr", a.thr).put("mins", a.mins).put("cur", a.cur)
            .put("t0", a.t0).put("hold", a.hold).put("tried", t).toString())
    }
}
