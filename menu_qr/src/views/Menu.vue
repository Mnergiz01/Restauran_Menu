<template>
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex-shrink-0 flex items-center">
              <img v-if="settings.logo_url" :src="settings.logo_url" class="h-8 w-auto" :alt="settings.restaurant_name" />
              <h1 v-else class="text-xl font-bold" :style="{ color: settings.primary_color }">{{ settings.restaurant_name }}</h1>
            </div>
            <div class="flex items-center">
              <button
                @click="scrollToTop"
                class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
  
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div v-if="loading" class="flex justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
  
        <div v-else>
          <!-- Category Navigation -->
          <div class="mb-6 overflow-x-auto">
            <nav class="flex space-x-4 pb-2">
              <button
                v-for="category in categories"
                :key="category.id"
                @click="scrollToCategory(category.id)"
                class="px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap"
                :class="[
                  activeCategory === category.id 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                ]"
              >
                <span class="flex items-center">
                  <span class="mr-2" v-html="category.icon"></span>
                  {{ category.name }}
                </span>
              </button>
            </nav>
          </div>
  
          <!-- Categories and Menu Items -->
          <div>
            <div
              v-for="category in categories"
              :key="category.id"
              :id="category.id"
              class="mb-12"
              ref="categoryRefs"
            >
              <h2 class="text-2xl font-bold mb-6 flex items-center" :style="{ color: settings.primary_color }">
                <span class="mr-2" v-html="category.icon"></span>
                {{ category.name }}
              </h2>
  
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="item in getItemsByCategory(category.id)"
                  :key="item.id"
                  class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div class="aspect-w-16 aspect-h-9 ">
                    <img
                      v-if="item.image_url"
                      :src="item.image_url"
                      :alt="item.name"
                      class="w-full h-48 object-contain"
                    />
                    <div v-else class="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="flex justify-between items-start">
                      <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
                      <span class="text-lg font-bold" :style="{ color: settings.primary_color }">{{ formatPrice(item.price) }}</span>
                    </div>
                    <p v-if="item.description" class="mt-1 text-sm text-gray-500">{{ item.description }}</p>
                    <div v-if="item.variations && item.variations.length > 0" class="mt-2">
                      <p class="text-sm font-medium text-gray-700">Seçenekler:</p>
                      <ul class="mt-1 space-y-1">
                        <li v-for="(variation, index) in item.variations" :key="index" class="text-sm text-gray-600">
                          {{ variation }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
  import { useMenuStore } from '../stores/menu'
  import { useQRSettingsStore } from '../stores/qrSettings'
  
  const menuStore = useMenuStore()
  const qrSettingsStore = useQRSettingsStore()
  const loading = ref(true)
  const activeCategory = ref('')
  const categoryRefs = ref([])
  const observer = ref(null)
  const isMounted = ref(false)
  
  const categories = computed(() => menuStore.categories)
  const menuItems = computed(() => menuStore.menuItems)
  const settings = computed(() => qrSettingsStore.settings)
  
  onMounted(async () => {
    await Promise.all([
      menuStore.fetchCategories(),
      qrSettingsStore.fetchSettings()
    ])
    
    await fetchAllMenuItems()
    
    loading.value = false
    
    if (categories.value.length > 0) {
      activeCategory.value = categories.value[0].id
    }
    
    isMounted.value = true
    // Set up intersection observer after DOM update
    setTimeout(() => {
      setupIntersectionObserver()
    }, 100)
  })
  
  onBeforeUnmount(() => {
    if (observer.value) {
      observer.value.disconnect()
    }
  })
  
  async function fetchAllMenuItems() {
    const promises = categories.value.map(category => 
      menuStore.fetchMenuItems(category.id)
    )
    await Promise.all(promises)
  }
  
  function getItemsByCategory(categoryId) {
    return menuItems.value.filter(item => item.category_id === categoryId && item.active)
  }
  
  function formatPrice(price) {
    return `${price}₺`
  }
  
  function scrollToCategory(categoryId) {
    const element = document.getElementById(categoryId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    activeCategory.value = categoryId
  }
  
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  function setupIntersectionObserver() {
    if (!isMounted.value) return;
  
    const options = {
      root: null,
      rootMargin: '-100px 0px -70% 0px',
      threshold: 0
    }
    
    observer.value = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeCategory.value = entry.target.id
        }
      })
    }, options)
    
    // Get all category elements and observe them
    const categoryElements = document.querySelectorAll('[id^="dondurma"], [id^="tatli"], [id^="sutlu"], [id^="pastalar"], [id^="kahvalti"], [id^="mesrubat"]')
    categoryElements.forEach(el => {
      observer.value.observe(el)
    })
  }
  </script>