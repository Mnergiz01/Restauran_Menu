<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <!-- Main Header -->
    <header class="bg-white shadow-md sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex-shrink-0 flex items-center">
            <img v-if="settings.logo_url" :src="settings.logo_url" class="h-9 w-auto" :alt="settings.restaurant_name" />
            <h1 v-else class="text-xl font-bold" :style="{ color: settings.primary_color }">{{ settings.restaurant_name }}</h1>
          </div>
          <div class="flex items-center">
            <button
              @click="scrollToTop"
              class="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              :style="{ '--tw-gradient-from': settings.primary_color }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Sticky Category Navigation -->
    <div class="sticky top-16 z-10 bg-white shadow-md pt-4 pb-3 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="overflow-x-auto py-1 px-1 -mx-4 sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full px-4 sm:px-6 lg:px-8">
            <nav class="flex space-x-3">
              <button
                v-for="category in categories"
                :key="category.id"
                @click="scrollToCategory(category.id)"
                class="px-5 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap flex items-center"
                :class="[
                  activeCategory === category.id 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg ring-2 ring-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm'
                ]"
                :style="activeCategory === category.id ? { '--tw-gradient-from': settings.primary_color, '--tw-gradient-to': adjustColor(settings.primary_color, 40) } : {}"
              >
                <span class="mr-2.5" v-html="category.icon"></span>
                {{ category.name }}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu Body -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="flex flex-col items-center">
          <div class="relative w-20 h-20">
            <div class="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
            <div 
              class="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"
              :style="{ borderTopColor: settings.primary_color }"
            ></div>
          </div>
          <p class="mt-4 text-gray-600 font-medium">Menü yükleniyor...</p>
        </div>
      </div>

      <div v-else>
        <!-- Categories and Menu Items -->
        <div>
          <div
            v-for="category in categories"
            :key="category.id"
            :id="category.id"
            class="mb-24 scroll-mt-32"
            data-aos="fade-up"
            data-aos-offset="150"
            data-aos-duration="800"
          >
            <div class="flex items-center mb-10">
              <div 
                class="p-4 rounded-2xl shadow-md mr-5 flex items-center justify-center" 
                :style="{ 
                  background: `linear-gradient(135deg, ${settings.primary_color}15, ${settings.primary_color}30)`,
                  boxShadow: `0 10px 15px -3px ${settings.primary_color}10, 0 4px 6px -4px ${settings.primary_color}10`
                }"
              >
                <div class="text-3xl" :style="{ color: settings.primary_color }" v-html="category.icon"></div>
              </div>
              <h2 class="text-3xl font-bold" :style="{ color: settings.primary_color }">
                {{ category.name }}
              </h2>
            </div>

            <div v-if="categoryLoading[category.id]" class="flex justify-center py-16">
              <div class="relative w-16 h-16">
                <div class="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
                <div 
                  class="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"
                  :style="{ borderTopColor: settings.primary_color }"
                ></div>
              </div>
            </div>

            <div v-else-if="getCategoryItems(category.id).length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div class="inline-flex items-center justify-center p-5 rounded-full bg-gray-100 mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <p class="text-gray-500 text-lg font-medium">Bu kategoride henüz ürün bulunmamaktadır.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div
                v-for="item in getCategoryItems(category.id)"
                :key="item.id"
                class="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                :style="{ 
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)', 
                  borderBottom: `3px solid ${settings.primary_color}` 
                }"
                data-aos="zoom-in-up"
                data-aos-delay="100"
              >
                <!-- Image & Overlay -->
                <div class="relative overflow-hidden">
                  <div class="aspect-w-16 aspect-h-12 bg-gray-100">
                    <img
                      v-if="item.image_url"
                      :src="item.image_url"
                      :alt="item.name"
                      class="w-full h-64 object-cover transform transition duration-700 group-hover:scale-110"
                    />
                    <div v-else class="w-full h-64 flex items-center justify-center bg-gray-50 text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div 
                    class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    :style="{ '--tw-gradient-from': settings.primary_color + 'cc' }"
                  ></div>
                </div>

                <!-- Price -->
                <div 
                  class="absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-white shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  :style="{ 
                    background: `linear-gradient(135deg, ${settings.primary_color}, ${adjustColor(settings.primary_color, 40)})`,
                    boxShadow: `0 10px 15px -3px ${settings.primary_color}40`
                  }"
                >
                  {{ formatPrice(item.price) }}
                </div>

                <!-- Content -->
                <div class="p-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition duration-300"
                      :style="{ 'group-hover:color': settings.primary_color }">
                    {{ item.name }}
                  </h3>
                  <p v-if="item.description" class="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {{ item.description }}
                  </p>

                  <!-- Variations -->
                  <div v-if="item.variations?.length > 0" class="mt-4">
                    <div class="flex items-center mb-3">
                      <div 
                        class="w-1.5 h-6 rounded-full mr-2"
                        :style="{ backgroundColor: settings.primary_color }"
                      ></div>
                      <p class="text-sm font-semibold text-gray-700">Seçenekler</p>
                    </div>
                    <div class="space-y-2">
                      <div 
                        v-for="(variation, index) in item.variations" 
                        :key="index" 
                        class="text-sm rounded-lg flex justify-between items-center border border-gray-100 overflow-hidden transition-all duration-200 hover:border-indigo-200 hover:shadow-sm"
                      >
                        <span class="px-3 py-2.5 bg-gray-50 text-gray-700 flex-1">{{ getVariationName(variation) }}</span>
                        <span class="px-3 py-2.5 font-medium flex-shrink-0" :style="{ color: settings.primary_color }">
                          {{ getVariationPrice(variation) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> <!-- End grid -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, onBeforeUnmount } from 'vue'
import { useMenuStore } from '../stores/menu'
import { useQRSettingsStore } from '../stores/qrSettings'
import { supabase } from '../supabase'
import AOS from 'aos'

const menuStore = useMenuStore()
const qrSettingsStore = useQRSettingsStore()
const loading = ref(true)
const activeCategory = ref('')
const categoryItems = reactive({})
const categoryLoading = reactive({})
const observer = ref(null)
const initialLoadComplete = ref(false);
const isMounted = ref(false);

onMounted(async () => {
  AOS.init({ once: false, duration: 700 })
  isMounted.value = true
  try {
    await Promise.all([
      qrSettingsStore.fetchSettings(),
      menuStore.fetchCategories()
    ])
    if (categories.value.length > 0) {
      activeCategory.value = categories.value[0].id
      await loadAllCategoryItems()
    }
  } catch (error) {
    console.error('Error loading menu data:', error)
  } finally {
    loading.value = false
    initialLoadComplete.value = true
    setupIntersectionObserver()
  }
})

onBeforeUnmount(() => {
  if (observer.value) observer.value.disconnect()
})

const categories = computed(() => menuStore.categories)
const settings = computed(() => qrSettingsStore.settings)

function adjustColor(hex, percent) {
  hex = hex.replace(/^#/, '')
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)
  r = Math.min(255, Math.max(0, r + percent))
  g = Math.min(255, Math.max(0, g + percent))
  b = Math.min(255, Math.max(0, b + percent))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

async function loadAllCategoryItems() {
  for (const category of categories.value) {
    await loadCategoryItems(category.id)
  }
}

async function loadCategoryItems(categoryId) {
  if (!categoryId || categoryItems[categoryId]) return
  categoryLoading[categoryId] = true
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryId)
      .eq('active', true)
      .order('name')
    if (error) throw error
    categoryItems[categoryId] = data || []
  } catch (error) {
    console.error(`Error loading items for category ${categoryId}:`, error)
    categoryItems[categoryId] = []
  } finally {
    categoryLoading[categoryId] = false
  }
}

function getCategoryItems(categoryId) {
  return categoryItems[categoryId] || []
}

function formatPrice(price) {
  return `${price}₺`
}

function getVariationName(variation) {
  return variation.split(':')[0].trim()
}

function getVariationPrice(variation) {
  const parts = variation.split(':')
  return parts.length > 1 ? parts[1].trim() : ''
}

function scrollToCategory(categoryId) {
  const element = document.getElementById(categoryId)
  if (element) element.scrollIntoView({ behavior: 'smooth' })
  activeCategory.value = categoryId
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function setupIntersectionObserver() {
  if (!categories.value.length || !initialLoadComplete.value || !isMounted.value) return

  const options = {
    root: null,
    rootMargin: '-100px 0px -70% 0px',
    threshold: 0
  }

  if (!observer.value) {
    observer.value = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeCategory.value = entry.target.id
        }
      })
    }, options)
  }

  setTimeout(() => {
    categories.value.forEach(category => {
      const element = document.getElementById(category.id)
      if (element) observer.value.observe(element)
    })
  }, 100)
}
</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
</style>
