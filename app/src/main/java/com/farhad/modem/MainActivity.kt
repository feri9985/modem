package com.farhad.modem

import android.app.Activity
import android.net.*
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import org.json.JSONObject

class MainActivity : Activity() {
    private lateinit var wv: WebView
    private val api = Modem()

    override fun onCreate(b: Bundle?) {
        super.onCreate(b)
        val cm = getSystemService(ConnectivityManager::class.java)
        cm.requestNetwork(
            NetworkRequest.Builder().addTransportType(NetworkCapabilities.TRANSPORT_WIFI).build(),
            object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(n: Network) { cm.bindProcessToNetwork(n) }
            })
        wv = WebView(this)
        setContentView(wv)
        wv.settings.javaScriptEnabled = true
        wv.settings.domStorageEnabled = true
        wv.addJavascriptInterface(object {
            @JavascriptInterface
            fun req(id: Int, m: String, p: String, body: String) {
                Thread {
                    val r = api.call(m, p, body)
                    runOnUiThread { wv.evaluateJavascript("cb($id,${JSONObject.quote(r)})", null) }
                }.start()
            }
        }, "A")
        wv.loadUrl("file:///android_asset/index.html")
    }

    override fun onBackPressed() = finish()
}
