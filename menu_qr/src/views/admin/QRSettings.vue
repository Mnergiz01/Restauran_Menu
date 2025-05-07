<template>
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">QR Menü Ayarları</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
                QR kodunuzun görünümünü ve menü sayfanızın ayarlarını buradan yapabilirsiniz.
            </p>
        </div>

        <div v-if="loading" class="px-4 py-5 sm:p-6 text-center">
            <svg class="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
        </div>

        <div v-else class="border-t border-gray-200">
            <div class="px-4 py-5 sm:p-6">
                <form @submit.prevent="saveSettings">
                    <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div class="sm:col-span-4">
                            <label for="restaurantName" class="block text-sm font-medium text-gray-700">
                                Restoran Adı
                            </label>
                            <div class="mt-1">
                                <input type="text" id="restaurantName" v-model="settings.restaurant_name"
                                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    required />
                            </div>
                        </div>

                        <div class="sm:col-span-4">
                            <label for="logoUrl" class="block text-sm font-medium text-gray-700">
                                Logo URL
                            </label>
                            <div class="mt-1">
                                <input type="text" id="logoUrl" v-model="settings.logo_url"
                                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <p class="mt-2 text-sm text-gray-500">
                                Logo resminizin URL'sini girin. Boş bırakırsanız restoran adı gösterilecektir.
                            </p>
                        </div>

                        <div class="sm:col-span-3">
                            <label for="primaryColor" class="block text-sm font-medium text-gray-700">
                                Ana Renk
                            </label>
                            <div class="mt-1 flex items-center">
                                <input type="color" id="primaryColor" v-model="settings.primary_color"
                                    class="h-8 w-8 rounded-md border border-gray-300 mr-2" />
                                <input type="text" v-model="settings.primary_color"
                                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                            </div>
                        </div>

                        <div class="sm:col-span-3">
                            <label for="backgroundColor" class="block text-sm font-medium text-gray-700">
                                Arkaplan Rengi
                            </label>
                            <div class="mt-1 flex items-center">
                                <input type="color" id="backgroundColor" v-model="settings.background_color"
                                    class="h-8 w-8 rounded-md border border-gray-300 mr-2" />
                                <input type="text" v-model="settings.background_color"
                                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                            </div>
                        </div>
                    </div>

                    <div class="mt-8">
                        <h3 class="text-lg font-medium text-gray-900">QR Kod Önizleme</h3>
                        <div class="mt-4 flex justify-center">
                            <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div ref="qrCodeContainer" class="w-64 h-64"></div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 flex justify-end">
                        <button type="submit" :disabled="saving"
                            class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {{ saving ? 'Kaydediliyor...' : 'Ayarları Kaydet' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQRSettingsStore } from '../../stores/qrSettings'
import QRCode from 'qrcode'
import { useRoute } from 'vue-router';

const qrSettingsStore = useQRSettingsStore()
const loading = ref(true)
const saving = ref(false)
const qrCodeContainer = ref(null)
const settings = ref({
    restaurant_name: 'My Restaurant',
    logo_url: '',
    primary_color: '#000000',
    background_color: '#FFFFFF'
})

const route = useRoute();

onMounted(async () => {
    await fetchSettings()
    generateQRCode()
})

watch(() => [settings.value.primary_color, settings.value.background_color], () => {
    generateQRCode()
})

async function fetchSettings() {
    loading.value = true
    try {
        await qrSettingsStore.fetchSettings()
        settings.value = { ...qrSettingsStore.settings }
    } catch (error) {
        console.error('Error fetching QR settings:', error)
    } finally {
        loading.value = false
    }
}

async function saveSettings() {
    saving.value = true
    try {
        await qrSettingsStore.updateSettings(settings.value)
        alert('Ayarlar başarıyla kaydedildi!')
    } catch (error) {
        console.error('Error saving QR settings:', error)
        alert('Ayarlar kaydedilirken bir hata oluştu: ' + error.message)
    } finally {
        saving.value = false
    }
}

function generateQRCode() {
    if (!qrCodeContainer.value) return

    const url = window.location.origin + '/menu'

    QRCode.toCanvas(qrCodeContainer.value, url, {
        width: 256,
        margin: 1,
        color: {
            dark: settings.value.primary_color,
            light: settings.value.background_color
        }
    }, (error) => {
        if (error) console.error('Error generating QR code:', error)
    })
}
</script>
