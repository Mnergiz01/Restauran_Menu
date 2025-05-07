<template>
    <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-900">{{ restaurantName }}</h1>
                <div class="flex space-x-4">
                    <router-link to="/menu"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Menüyü Görüntüle
                    </router-link>
                    <router-link to="/login"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Admin Girişi
                    </router-link>
                </div>
            </div>
        </header>
        <main>
            <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div class="px-4 py-6 sm:px-0">
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div class="flex flex-col justify-center">
                                    <h2 class="text-2xl font-bold text-gray-900 mb-4">QR Menü Sistemi</h2>
                                    <p class="text-gray-600 mb-6">
                                        Müşterilerinize modern bir deneyim sunun. QR kodlarımızla menünüzü dijital
                                        ortama taşıyın.
                                    </p>
                                    <div class="flex space-x-4">
                                        <router-link to="/menu"
                                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Menüyü Görüntüle
                                        </router-link>
                                        <router-link to="/login"
                                            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            Admin Girişi
                                        </router-link>
                                    </div>
                                </div>
                                <div class="flex justify-center items-center">
                                    <div ref="qrCodeContainer"
                                        class="w-64 h-64 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <img src="@/assets/frame.png" alt="">
                                    </div>
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
import { useRoute } from 'vue-router';

const qrSettingsStore = useQRSettingsStore()
const qrCodeContainer = ref(null)
const route = useRoute();

const restaurantName = computed(() => {
    return qrSettingsStore.settings.restaurant_name || 'QR Menü'
})

onMounted(async () => {
    await qrSettingsStore.fetchSettings()
    generateQRCode()
})

function generateQRCode() {
    if (!qrCodeContainer.value) return

    const url = window.location.origin + '/menu'

    QRCode.toCanvas(qrCodeContainer.value, url, {
        width: 256,
        margin: 1,
        color: {
            dark: qrSettingsStore.settings.primary_color,
            light: qrSettingsStore.settings.background_color
        }
    }, (error) => {
        if (error) console.error('Error generating QR code:', error)
    })
}
</script>