package com.farhad.modem

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels

class MainActivity : ComponentActivity() {
    private val vm: ModemViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { AppRoot(vm) }
    }

    override fun onStart() {
        super.onStart()
        vm.setActive(true)
    }

    override fun onStop() {
        super.onStop()
        vm.setActive(false)
        vm.persist()
    }
}
