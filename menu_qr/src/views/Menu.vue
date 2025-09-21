<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <!-- Modern Header with Glass Effect -->
    <header class="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg shadow-black/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 sm:h-18 items-center">
          <div class="flex items-center space-x-3">
            <div v-if="settings.logo_url" class="relative">
              <img :src="settings.logo_url" class="h-10 sm:h-12 w-auto rounded-lg shadow-md" :alt="settings.restaurant_name" />
            </div>
            <div v-else class="p-2 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 shadow-lg">
              <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">{{ settings.restaurant_name?.charAt(0) || 'M' }}</span>
              </div>
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {{ settings.restaurant_name }}
              </h1>
              <p class="text-xs text-gray-500 hidden sm:block">Dijital Menü</p>
            </div>
          </div>
          
          <!-- Search Toggle Button -->
          <button @click="toggleSearch" 
            class="p-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Enhanced Search Bar -->
    <div v-if="showSearch" class="sticky top-16 sm:top-18 z-30 bg-white/95 backdrop-blur-xl border-b border-white/20 px-4 py-4">
      <div class="max-w-2xl mx-auto relative">
        <div class="relative group">
          <input v-model="searchQuery" type="text" placeholder="Menüde aradığınız ürünü yazın..."
            class="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-gray-500 focus:ring-4 focus:ring-gray-500/20 transition-all duration-300 text-gray-700 placeholder-gray-400 shadow-lg"
            @input="handleSearch" />
          <svg xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-500 transition-colors" 
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button v-if="searchQuery" @click="clearSearch"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modern Category Navigation -->
    <div class="sticky z-20 bg-white/90 backdrop-blur-xl border-b border-white/10 py-4"
      :class="showSearch ? 'top-[136px] sm:top-[144px]' : 'top-16 sm:top-18'">
      <div class="max-w-7xl mx-auto px-4">
        <div class="overflow-x-auto hide-scrollbar">
          <div class="flex space-x-3 pb-2">
            <button v-for="category in categories" :key="category.id" @click="scrollToCategory(category.id)"
              class="flex-shrink-0 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 whitespace-nowrap transform hover:scale-105"
              :class="[
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg shadow-gray-500/25'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 shadow-md hover:shadow-lg border border-gray-200'
              ]">
              <span class="text-lg" v-html="category.icon"></span>
              <span class="text-sm font-medium">{{ category.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div class="text-center">
          <div class="relative w-20 h-20 mx-auto mb-6">
            <div class="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-gray-500 animate-spin"></div>
          </div>
          <p class="text-gray-600 font-medium text-lg">Menü yükleniyor...</p>
          <p class="text-gray-400 text-sm mt-1">Lütfen bekleyin</p>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchQuery && searchResults.length > 0" class="mb-12">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Arama Sonuçları
          </h2>
          <p class="text-gray-500">{{ searchResults.length }} ürün bulundu</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="item in searchResults" :key="item.id"
            class="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            
            <div class="relative h-48 overflow-hidden">
              <img v-if="item.image_url" :src="item.image_url" :alt="item.name" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div v-else class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div class="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold rounded-full shadow-lg text-sm">
                {{ formatPrice(item.price) }}
              </div>
            </div>

            <div class="p-5">
              <h3 class="font-bold text-gray-800 mb-2 text-lg group-hover:text-gray-600 transition-colors">
                {{ item.name }}
              </h3>
              <p v-if="item.description" class="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- No Search Results -->
      <div v-else-if="searchQuery && searchResults.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-700 mb-2">Ürün bulunamadı</h3>
        <p class="text-gray-500 mb-6">Aradığınız ürün menümüzde bulunmuyor</p>
        <button @click="clearSearch" 
          class="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
          Aramayı Temizle
        </button>
      </div>

      <!-- Categories and Menu Items -->
      <div v-else>
        <div v-for="category in categories" :key="category.id" :id="category.id"
          class="mb-16 scroll-mt-32" data-aos="fade-up" data-aos-duration="800">
          
          <!-- Category Header -->
          <div class="flex items-center mb-8">
            <div class="p-4 rounded-2xl bg-gradient-to-br from-gray-600/10 to-gray-800/10 mr-4 shadow-lg">
              <div class="text-3xl" v-html="category.icon" style="color: #4b5563"></div>
            </div>
            <div>
              <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {{ category.name }}
              </h2>
              <div class="w-20 h-1 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full mt-2"></div>
            </div>
          </div>

          <!-- Category Loading -->
          <div v-if="categoryLoading[category.id]" class="flex justify-center py-20">
            <div class="relative w-16 h-16">
              <div class="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-gray-500 animate-spin"></div>
            </div>
          </div>

          <!-- Empty Category -->
          <div v-else-if="getCategoryItems(category.id).length === 0"
            class="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-100">
            <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Bu kategoride ürün bulunmuyor</h3>
            <p class="text-gray-400">Yakında yeni ürünler eklenecek</p>
          </div>

          <!-- Menu Items Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div v-for="(item, index) in getCategoryItems(category.id)" :key="item.id"
              class="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100"
              :data-aos="index % 4 === 0 ? 'fade-up' : index % 4 === 1 ? 'fade-up' : index % 4 === 2 ? 'fade-up' : 'fade-up'"
              :data-aos-delay="(index % 4) * 100">
              
              <!-- Image Container -->
              <div class="relative h-56 overflow-hidden">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div v-else class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <!-- Price Badge -->
                <div class="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  {{ formatPrice(item.price) }}
                </div>
              </div>

              <!-- Content -->
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2">
                  {{ item.name }}
                </h3>

                <p v-if="item.description" class="text-gray-600 line-clamp-3 leading-relaxed mb-4 text-sm">
                  {{ item.description }}
                </p>

                <!-- Variations -->
                <div v-if="item.variations && item.variations.length > 0" class="mt-4">
                  <div class="flex items-center mb-3">
                    <div class="w-1 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full mr-3"></div>
                    <h4 class="font-semibold text-gray-700">Seçenekler</h4>
                  </div>

                  <div class="grid grid-cols-3 gap-2">
                    <div v-for="(variation, vIndex) in item.variations" :key="vIndex"
                      class="bg-gray-50 rounded-xl p-3 border border-gray-200 hover:border-gray-400 hover:bg-gray-100/50 transition-all duration-200">
                      <div class="text-xs font-medium text-gray-700 truncate">
                        {{ getVariationName(variation) }}
                      </div>
                      <div class="text-sm font-bold text-gray-600 mt-1">
                        {{ getVariationPrice(variation) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Scroll to Top Button -->
    <button v-if="showScrollToTop" @click="scrollToTop"
      class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-2xl shadow-2xl hover:shadow-gray-500/25 flex items-center justify-center transform hover:scale-110 transition-all duration-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
    
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, onBeforeUnmount } from 'vue'
import { useMenuStore } from '../stores/menu'
import { useQRSettingsStore } from '../stores/qrSettings'
import { supabase } from '../supabase'
import AOS from 'aos'
import 'aos/dist/aos.css'

const menuStore = useMenuStore()
const qrSettingsStore = useQRSettingsStore()
const loading = ref(true)
const activeCategory = ref('')
const categoryItems = reactive({})
const categoryLoading = reactive({})
const observer = ref(null)
const initialLoadComplete = ref(false)
const isMounted = ref(false)
const showScrollToTop = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')
const searchResults = ref([])

// Initialize AOS
const initAOS = () => {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    mirror: false,
    offset: 100,
    delay: 0
  })
}

// Toggle search
const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchQuery.value = ''
    searchResults.value = []
  }
}

// Handle search
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase().trim()
  const allItems = []

  Object.values(categoryItems).forEach(items => {
    allItems.push(...items)
  })

  searchResults.value = allItems.filter(item =>
    item.name.toLowerCase().includes(query) ||
    (item.description && item.description.toLowerCase().includes(query)) ||
    (item.variations && item.variations.some(variation =>
      variation.toLowerCase().includes(query)
    ))
  )
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

// Handle scroll events
const handleScroll = () => {
  showScrollToTop.value = window.scrollY > 300
}

// Initialize data loading
onMounted(async () => {
  isMounted.value = true
  window.addEventListener('scroll', handleScroll, { passive: true })

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

    setTimeout(() => {
      setupIntersectionObserver()
      initAOS()
    }, 300)
  }
})

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
  window.removeEventListener('scroll', handleScroll)
})

const categories = computed(() => menuStore.categories)
const settings = computed(() => qrSettingsStore.settings)

// Load menu items for all categories
async function loadAllCategoryItems() {
  for (const category of categories.value) {
    await loadCategoryItems(category.id)
  }
}

// Load menu items for a specific category
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

// Get items for a specific category
function getCategoryItems(categoryId) {
  return categoryItems[categoryId] || []
}

// Format price with currency symbol
function formatPrice(price) {
  return `${price}₺`
}

// Parse variation string to get name
function getVariationName(variation) {
  const parts = variation.split(':')
  return parts[0].trim()
}

// Parse variation string to get price
function getVariationPrice(variation) {
  const parts = variation.split(':')
  if (parts.length > 1) {
    return parts[1].trim()
  }
  return ''
}

// Scroll to a specific category
function scrollToCategory(categoryId) {
  const element = document.getElementById(categoryId)
  if (element) {
    const headerHeight = showSearch.value ? 180 : 120
    const elementPosition = element.offsetTop - headerHeight
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
  activeCategory.value = categoryId
}

// Scroll to the top of the page
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Set up intersection observer
function setupIntersectionObserver() {
  if (!categories.value.length || !initialLoadComplete.value || !isMounted.value) return

  const options = {
    root: null,
    rootMargin: '-150px 0px -70% 0px',
    threshold: 0
  }

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeCategory.value = entry.target.id
      }
    })
  }, options)

  setTimeout(() => {
    categories.value.forEach(category => {
      const element = document.getElementById(category.id)
      if (element) {
        observer.value.observe(element)
      }
    })
  }, 100)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Glass effect */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}

/* Custom gradient animations */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Enhanced focus states */
button:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .transform {
    will-change: transform;
  }
}

</style>
