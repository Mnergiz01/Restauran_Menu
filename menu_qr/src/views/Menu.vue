<template>
  <div class="min-h-screen bg-gradient-to-br from-white/95 via-white to-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 sm:h-18 items-center">
          <div class="flex items-center space-x-3">
            <div v-if="settings.logo_url" class="relative">
              <img :src="settings.logo_url" class="h-10 sm:h-12 w-auto rounded-lg shadow-sm"
                :alt="settings.restaurant_name" />
            </div>
            <div v-else class="p-2 rounded-xl bg-white/30 shadow-sm">
              <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span class="text-gray-700 font-bold text-lg">{{ settings.restaurant_name?.charAt(0) || 'M' }}</span>
              </div>
            </div>
            <div>
              <h1
                class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent">
                {{ settings.restaurant_name }}
              </h1>
              <p class="text-xs text-gray-400 hidden sm:block">Dijital Menü</p>
            </div>
          </div>

          <button @click="toggleSearch"
            class="p-3 rounded-xl bg-gradient-to-r from-gray-300/80 to-gray-200/70 text-gray-700 shadow hover:shadow-md transform hover:scale-105 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Categories -->
    <div class="sticky z-20 bg-white/70 backdrop-blur-xl border-b border-white/20 py-4"
      :class="showSearch ? 'top-[136px] sm:top-[144px]' : 'top-16 sm:top-18'">
      <div class="max-w-7xl mx-auto px-4 overflow-x-auto hide-scrollbar">
        <div class="flex space-x-3 pb-2">
          <button v-for="category in categories" :key="category.id" @click="scrollToCategory(category.id)"
            class="flex-shrink-0 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 whitespace-nowrap transform hover:scale-105"
            :class="[
              activeCategory === category.id
                ? 'bg-white/90 text-gray-800 shadow-md'
                : 'bg-white/70 text-gray-600 hover:bg-white/80 hover:text-gray-700 shadow-sm border border-white/30'
            ]">
            <span class="text-lg" v-html="category.icon"></span>
            <span class="text-sm font-medium">{{ category.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Items -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-for="category in categories" :key="category.id" :id="category.id" class="mb-16 scroll-mt-32"
        data-aos="fade-up" data-aos-duration="800">

        <!-- Category Header -->
        <div class="flex items-center mb-8">
          <div class="p-4 rounded-2xl bg-white/30 mr-4 shadow-sm">
            <div class="text-3xl" v-html="category.icon" style="color: #9D7E5D"></div>
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-800">{{ category.name }}</h2>
            <div class="w-20 h-1 bg-gray-300 rounded-full mt-2"></div>
          </div>
        </div>

        <!-- Items Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div v-for="(item, index) in getCategoryItems(category.id)" :key="item.id"
            class="group relative bg-white/60 backdrop-blur-lg border border-white/30 rounded-3xl overflow-hidden shadow-md transition-transform duration-700 hover:shadow-xl hover:-translate-y-2 hover:scale-105 hover:rotate-1 hover:shadow-[0_20px_30px_rgba(0,0,0,0.1)] floating-card"
            :data-aos="'fade-up'" :data-aos-delay="(index % 4) * 100">

            <!-- Image -->
            <div class="relative aspect-square overflow-hidden rounded-t-3xl bg-white/40">
              <img v-if="item.image_url" :src="item.image_url" :alt="item.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[1deg] group-hover:brightness-105" />
              <div v-else
                class="w-full h-full bg-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <!-- Price Badge -->
              <div class="absolute top-3 right-3 px-4 py-2 rounded-xl text-gray-800 font-semibold text-sm bg-white/80 backdrop-blur-md border border-white/40 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-2">
                {{ formatPrice(item.price) }}
              </div>

              <!-- Glow Effect -->
              <div class="absolute inset-0 pointer-events-none">
                <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-100/30 rounded-full blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"></div>
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-yellow-50/25 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <h3 class="font-bold text-gray-800 mb-2 text-lg transition-colors duration-300 group-hover:text-gray-600">{{ item.name }}</h3>
              <p v-if="item.description" class="text-gray-600 text-sm leading-relaxed">{{ item.description }}</p>

              <!-- Variations -->
              <div v-if="item.variations && item.variations.length > 0" class="mt-3">
                <div class="flex items-center mb-2">
                  <div class="w-1.5 h-6 bg-yellow-200 rounded-full mr-2"></div>
                  <h4 class="font-semibold text-gray-700">Seçenekler</h4>
                </div>
                <div class="flex flex-wrap gap-2">
                  <div v-for="(variation, vIndex) in item.variations" :key="vIndex"
                    class="px-3 py-1.5 bg-yellow-50/70 backdrop-blur-md border border-yellow-200 rounded-full text-xs font-semibold text-gray-800 hover:bg-yellow-100/80 hover:border-yellow-300 transition-all duration-300 cursor-pointer glow-variation">
                    <span class="truncate">{{ getVariationName(variation) }}</span>
                    <span class="ml-1 font-semibold">{{ getVariationPrice(variation) }}</span>
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
/* Floating Card Animation */
@keyframes floatCard {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(1deg); }
}
.floating-card {
  animation: floatCard 6s ease-in-out infinite;
}

/* Glow on variations */
.glow-variation:hover {
  box-shadow: 0 0 12px rgba(253, 227, 167, 0.4);
}

/* Scrollbar hidden */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
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

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
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
