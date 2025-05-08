<template>
    <footer class="bg-gray-900 text-white py-8 mt-12">
      <div class="container mx-auto px-4">
        <!-- Footer Üst Kısım -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Hakkımızda -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Hakkımızda</h3>
            <p class="text-sm text-gray-400">
              Biz, restoran menülerini dijitalleştiren ve kullanıcı dostu hale getiren bir platformuz. 
              Yemeklerinizi keşfedin ve siparişinizi kolayca verin!
            </p>
          </div>
  
          <!-- Hızlı Bağlantılar -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul class="space-y-2">
              <li><router-link to="/" class="text-sm text-gray-400 hover:text-indigo-500">Ana Sayfa</router-link></li>
              <li><router-link to="/menu" class="text-sm text-gray-400 hover:text-indigo-500">Menü</router-link></li>
              <li><router-link to="/order" class="text-sm text-gray-400 hover:text-indigo-500">Sipariş Ver</router-link></li>
              <li><router-link to="/contact" class="text-sm text-gray-400 hover:text-indigo-500">İletişim</router-link></li>
            </ul>
          </div>
  
          <!-- Sosyal Medya -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Bizi Takip Edin</h3>
            <div class="flex space-x-4">
              <a href="https://facebook.com" class="text-gray-400 hover:text-indigo-500" target="_blank" rel="noopener noreferrer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 3a10.96 10.96 0 00-3.18-.47C18.48 2.25 16.66 1 14 1"></path>
                </svg>
              </a>
              <a href="https://twitter.com" class="text-gray-400 hover:text-indigo-500" target="_blank" rel="noopener noreferrer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 3a10.96 10.96 0 00-3.18-.47C18.48 2.25 16.66 1 14 1"></path>
                </svg>
              </a>
              <a href="https://instagram.com" class="text-gray-400 hover:text-indigo-500" target="_blank" rel="noopener noreferrer">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M23 3a10.96 10.96 0 00-3.18-.47C18.48 2.25 16.66 1 14 1"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
  
        <!-- Footer Alt Kısım -->
        <div class="border-t border-gray-700 pt-6 text-center">
          <p class="text-sm text-gray-400">&copy; 2025 Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  // Vue Router importu
  import { useRouter } from 'vue-router'
  </script>
  
  <style scoped>
  /* Footer stiline dair ekstra düzenlemeler yapılabilir */
  </style>
  