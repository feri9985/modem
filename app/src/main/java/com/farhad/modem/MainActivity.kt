package com.farhad.modem

import android.app.Activity
import android.net.*
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient

class MainActivity : Activity() {
    private lateinit var wv: WebView

    override fun onCreate(b: Bundle?) {
        super.onCreate(b)
        val cm = getSystemService(ConnectivityManager::class.java)
        cm.requestNetwork(
            NetworkRequest.Builder().addTransportType(NetworkCapabilities.TRANSPORT_WIFI).build(),
            object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(n: Network) {
                    cm.bindProcessToNetwork(n)
                    runOnUiThread { wv.loadUrl("http://192.168.8.1/") }
                }
            })
        wv = WebView(this)
        setContentView(wv)
        wv.settings.javaScriptEnabled = true
        wv.settings.domStorageEnabled = true
        wv.settings.useWideViewPort = false
        wv.settings.loadWithOverviewMode = false
        // pinch-to-zoom enabled
        wv.settings.setSupportZoom(true)
        wv.settings.builtInZoomControls = true
        wv.settings.displayZoomControls = false
        wv.setInitialScale(100)
        // بدون WebChromeClient، confirm()/alert() (مثل تأیید ریبوت) اصلاً نشون داده نمی‌شن
        wv.webChromeClient = WebChromeClient()
        // موقع جهت‌یابی آنتن صفحه خاموش نشه
        wv.keepScreenOn = true
        wv.webViewClient = object : WebViewClient() {
            override fun onPageFinished(v: WebView, u: String) {
                val js = assets.open("panel.js").bufferedReader().readText()
                v.evaluateJavascript(js, null)
            }
        }
    }

    override fun onBackPressed() {
        if (wv.canGoBack()) wv.goBack() else finish()
    }
}
