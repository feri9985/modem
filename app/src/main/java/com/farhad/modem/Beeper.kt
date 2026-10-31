package com.farhad.modem

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import kotlinx.coroutines.delay

object Beeper {
    /** q بین 0 تا 100: هرچی بیشتر، بیپ تیزتر */
    suspend fun play(q: Double) {
        try {
            val sr = 22050
            val n = sr / 10
            val f = 350.0 + q * 9.0
            val buf = ShortArray(n) { i ->
                val t = i.toDouble() / sr
                val env = if (t < 0.01) t / 0.01 else Math.exp(-(t - 0.01) * 60.0)
                (Math.sin(2 * Math.PI * f * t) * env * 0.4 * Short.MAX_VALUE).toInt().toShort()
            }
            val at = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build()
                )
                .setAudioFormat(
                    AudioFormat.Builder().setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sr).setChannelMask(AudioFormat.CHANNEL_OUT_MONO).build()
                )
                .setBufferSizeInBytes(n * 2)
                .setTransferMode(AudioTrack.MODE_STATIC)
                .build()
            at.write(buf, 0, n)
            at.play()
            delay(130)
            at.release()
        } catch (e: Exception) {
        }
    }
}
