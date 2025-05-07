<template>
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold">QR Menü Admin</h1>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                <router-link
                  to="/admin/categories"
                  class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                  inactive-class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Kategoriler
                </router-link>
                <router-link
                  to="/admin/products"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                  inactive-class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Ürünler
                </router-link>
                <router-link
                  to="/admin/qr-settings"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  active-class="border-indigo-500 text-gray-900"
                  inactive-class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  QR Ayarları
                </router-link>
              </div>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
              <div class="ml-3 relative">
                <button
                  @click="logout"
                  class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
  
      <div class="py-10">
        <main>
          <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <router-view />
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  import { onMounted } from 'vue';
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  onMounted(() => {
    // This ensures that the router and authStore are initialized before being used.
    // It prevents the "called conditionally" error.
  });
  
  async function logout() {
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  </script>