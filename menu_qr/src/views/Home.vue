<template>
  <div class="min-h-screen bg-gray-50">
    <!-- HEADER -->
    <header class="bg-white shadow">
      <div
        class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center"
      >
        <h1 class="text-3xl font-bold text-gray-900">Türkoğlu Mado</h1>
      </div>
    </header>

    <!-- MAIN -->
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- LEFT CONTENT -->
                <div class="flex flex-col justify-center">
                  <h2 class="text-2xl font-bold text-gray-900 mb-4">
                    QR Menü Sistemi
                  </h2>
                  <p class="text-gray-600 mb-6">
                    Müşterilerinize modern bir deneyim sunun. QR kodlarımızla
                    menünüzü dijital ortama taşıyın.
                  </p>
                  <div class="flex space-x-4">
                    <router-link
                      to="/menu"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Menüyü Görüntüle
                    </router-link>
                    <router-link
                      to="/login"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Admin Girişi
                    </router-link>
                  </div>
                </div>

                <!-- RIGHT CONTENT - QR CODE -->
                <div class="flex mt-10 border py-8 justify-center items-center relative">
                  <!-- Frame arka plan -->
                 

                  <!-- QR Code Canvas -->
                  <canvas
                    ref="qrCodeCanvas"
                    class="relative z-10 w-56 h-56 rounded-xl shadow-md"
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQRSettingsStore } from '../stores/qrSettings'
import QRCode from 'qrcode'

const qrSettingsStore = useQRSettingsStore()
const qrCodeCanvas = ref(null)

const restaurantName = computed(() => {
  return qrSettingsStore.settings.restaurant_name || 'QR Menü'
})

onMounted(async () => {
  await qrSettingsStore.fetchSettings()
  generateQRCode()
})

/**
 * QR Kod oluşturma fonksiyonu
 */
function generateQRCode() {
  if (!qrCodeCanvas.value) return

  const url = window.location.origin + '/menu'

  QRCode.toCanvas(
    qrCodeCanvas.value,
    url,
    {
      width: 224, // QR boyutu
      margin: 1,
      color: {
        dark: qrSettingsStore.settings.primary_color || '#000000', // koyu alan rengi
        light: qrSettingsStore.settings.background_color || '#ffffff00' // şeffaf arka plan
      }
    },
    (error) => {
      if (error) console.error('QR kod oluşturulurken hata:', error)
    }
  )
}
</script>

<style scoped>
/* QR kodu frame ile uyumlu hale getirmek için */
canvas {
  background: transparent;
}
</style>
