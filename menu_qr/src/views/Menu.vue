<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden">
    <!-- Main Header -->
    <header class="bg-white shadow-md sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex justify-between h-14 sm:h-16 items-center">
          <div class="flex-shrink-0 flex items-center">
            <img v-if="settings.logo_url" :src="settings.logo_url" class="h-8 sm:h-9 w-auto" :alt="settings.restaurant_name" />
            <h1 v-else class="text-lg sm:text-xl font-bold truncate" :style="{ color: settings.primary_color }">{{ settings.restaurant_name }}</h1>
          </div>
          <div>
           
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Search Bar -->
    <div v-if="showSearch" class="md:hidden bg-white border-b border-gray-200 px-3 py-3 sticky top-14 sm:top-16 z-25">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Menüde ara..."
          class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:border-transparent text-sm"
          :style="{ 'focus:ring-color': settings.primary_color }"
          @input="handleSearch"
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Sticky Category Navigation - Hidden on mobile -->
    <div class="hidden md:block sticky top-16 z-20 bg-white shadow-md pt-4 pb-3 px-4 sm:px-6 lg:px-8">
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
                data-aos="fade-right"
                data-aos-duration="800"
                data-aos-delay="100"
              >
                <span class="mr-2.5" v-html="category.icon"></span>
                {{ category.name }}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Category Pills - Horizontal scrollable -->
    <div class="md:hidden sticky z-20 bg-white shadow-sm py-2 px-3" :class="showSearch ? 'top-[120px] sm:top-[124px]' : 'top-14 sm:top-16'">
      <div class="overflow-x-auto hide-scrollbar">
        <div class="inline-flex space-x-2 py-1">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="scrollToCategory(category.id)"
            class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center touch-manipulation"
            :class="[
              activeCategory === category.id 
                ? 'text-white shadow-md scale-105' 
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300'
            ]"
            :style="activeCategory === category.id ? { 
              background: `linear-gradient(135deg, ${settings.primary_color}, ${adjustColor(settings.primary_color, 40)})` 
            } : {}"
          >
            <span class="mr-1 text-sm" v-html="category.icon"></span>
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-10">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="flex flex-col items-center">
          <div class="relative w-16 h-16 sm:w-20 sm:h-20">
            <div class="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
            <div 
              class="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"
              :style="{ borderTopColor: settings.primary_color }"
            ></div>
          </div>
          <p class="mt-4 text-gray-600 font-medium text-sm sm:text-base">Menü yükleniyor...</p>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchQuery && searchResults.length > 0" class="mb-8">
        <h2 class="text-xl font-bold mb-4 text-gray-900">Arama Sonuçları</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
          <div
            v-for="item in searchResults"
            :key="item.id"
            class="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col border border-gray-100"
            :style="{ borderBottom: `2px solid ${settings.primary_color}` }"
          >
            <!-- Compact card for search results -->
            <div class="relative overflow-hidden h-32 sm:h-40 flex-shrink-0">
              <img
                v-if="item.image_url"
                :src="item.image_url"
                :alt="item.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div 
                class="absolute top-2 right-2 px-2 py-1 rounded-full font-bold text-white shadow-md text-xs"
                :style="{ 
                  background: `linear-gradient(135deg, ${settings.primary_color}, ${adjustColor(settings.primary_color, 40)})`
                }"
              >
                {{ formatPrice(item.price) }}
              </div>
            </div>
            
            <div class="p-3 flex-grow">
              <h3 class="font-bold text-gray-900 mb-1 text-sm" :style="{ color: settings.primary_color }">
                {{ item.name }}
              </h3>
              <p v-if="item.description" class="text-gray-600 text-xs line-clamp-2">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- No search results -->
      <div v-else-if="searchQuery && searchResults.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-gray-500 text-lg font-medium">Aradığınız ürün bulunamadı</p>
        <p class="text-gray-400 text-sm mt-1">Farklı bir arama terimi deneyin</p>
      </div>

      <div v-else>
        <!-- Categories and Menu Items -->
        <div>
          <div
            v-for="category in categories"
            :key="category.id"
            :id="category.id"
            class="mb-12 sm:mb-16 md:mb-24 scroll-mt-24 sm:scroll-mt-32 md:scroll-mt-40" 
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div class="flex items-center mb-4 sm:mb-6 md:mb-10">
              <div 
                class="p-2 sm:p-3 md:p-4 rounded-xl shadow-md mr-2 sm:mr-3 md:mr-5 flex items-center justify-center" 
                :style="{ 
                  background: `linear-gradient(135deg, ${settings.primary_color}15, ${settings.primary_color}30)`,
                  boxShadow: `0 8px 12px -3px ${settings.primary_color}10, 0 4px 6px -4px ${settings.primary_color}10`
                }"
                data-aos="zoom-in"
                data-aos-duration="800"
              >
                <div class="text-xl sm:text-2xl md:text-3xl" :style="{ color: settings.primary_color }" v-html="category.icon"></div>
              </div>
              <h2 class="text-xl sm:text-2xl md:text-3xl font-bold" :style="{ color: settings.primary_color }">
                {{ category.name }}
              </h2>
            </div>

            <div v-if="categoryLoading[category.id]" class="flex justify-center py-12 sm:py-16">
              <div class="relative w-12 h-12 sm:w-16 sm:h-16">
                <div class="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
                <div 
                  class="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"
                  :style="{ borderTopColor: settings.primary_color }"
                ></div>
              </div>
            </div>

            <div v-else-if="getCategoryItems(category.id).length === 0" class="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-12 text-center">
              <div class="inline-flex items-center justify-center p-3 sm:p-4 md:p-5 rounded-full bg-gray-100 mb-3 sm:mb-4 md:mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <p class="text-gray-500 text-sm sm:text-base md:text-lg font-medium">Bu kategoride henüz ürün bulunmamaktadır.</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
              <div
                v-for="(item, index) in getCategoryItems(category.id)"
                :key="item.id"
                class="group relative bg-white rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl flex flex-col touch-manipulation"
                :style="{ 
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)', 
                  borderBottom: `3px solid ${settings.primary_color}` 
                }"
                :data-aos="index % 3 === 0 ? 'fade-up' : index % 3 === 1 ? 'fade-up-right' : 'fade-up-left'"
                :data-aos-delay="(index % 3) * 100"
                data-aos-duration="800"
                data-aos-anchor-placement="top-bottom"
              >
                <!-- Image Container - Responsive Height -->
                <div class="relative overflow-hidden h-40 sm:h-48 md:h-56 flex-shrink-0">
                  <img
                    v-if="item.image_url"
                    :src="item.image_url"
                    :alt="item.name"
                    class="w-full h-full object-cover transform transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <!-- Overlay Gradient -->
                  <div 
                    class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    :style="{ '--tw-gradient-from': settings.primary_color + 'aa' }"
                  ></div>
                </div>
                
                <!-- Price Badge -->
                <div 
                  class="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full font-bold text-white shadow-lg transform transition-all duration-300 group-hover:scale-105 text-xs sm:text-sm md:text-base"
                  :style="{ 
                    background: `linear-gradient(135deg, ${settings.primary_color}, ${adjustColor(settings.primary_color, 40)})`,
                    boxShadow: `0 8px 12px -3px ${settings.primary_color}40`
                  }"
                >
                  {{ formatPrice(item.price) }}
                </div>
                
                <!-- Content - Auto Height -->
                <div class="p-3 sm:p-4 md:p-6 flex-grow flex flex-col">
                  <!-- Title and Description -->
                  <div class="mb-2 sm:mb-3 md:mb-4">
                    <h3 class="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-indigo-600 transition duration-300 line-clamp-2"
                        :style="{ 'group-hover:color': settings.primary_color }">
                      {{ item.name }}
                    </h3>
                    
                    <p v-if="item.description" class="text-gray-600 line-clamp-2 text-xs sm:text-sm">
                      {{ item.description }}
                    </p>
                  </div>
                  
                  <!-- Variations Section (Always Visible) -->
                  <div v-if="item.variations && item.variations.length > 0" class="mt-auto">
                    <div class="flex items-center mb-2">
                      <div 
                        class="w-1 h-4 sm:h-5 md:h-6 rounded-full mr-2"
                        :style="{ backgroundColor: settings.primary_color }"
                      ></div>
                      <p class="text-xs sm:text-sm font-semibold text-gray-700">Seçenekler</p>
                    </div>
                    
                    <div class="space-y-1 sm:space-y-1.5 md:space-y-2">
                      <div 
                        v-for="(variation, index) in item.variations.slice(0, 3)" 
                        :key="index" 
                        class="text-xs sm:text-sm rounded-lg flex justify-between items-center border border-gray-100 overflow-hidden transition-all duration-200 hover:border-indigo-200 hover:shadow-sm"
                      >
                        <span class="px-2 py-1.5 sm:py-2 md:px-3 md:py-2.5 bg-gray-50 text-gray-700 flex-1 truncate">{{ getVariationName(variation) }}</span>
                        <span 
                          class="px-2 py-1.5 sm:py-2 md:px-3 md:py-2.5 font-medium flex-shrink-0" 
                          :style="{ color: settings.primary_color }"
                        >
                          {{ getVariationPrice(variation) }}
                        </span>
                      </div>
                      <div v-if="item.variations.length > 3" class="text-xs text-gray-500 text-center py-1">
                        +{{ item.variations.length - 3 }} seçenek daha
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
    
    <!-- Mobile Floating Action Button for scrolling to top -->
    <button 
      v-if="showScrollToTop"
      @click="scrollToTop"
      class="md:hidden fixed bottom-4 right-5 z-50 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation"
      :style="{ 
        background: `linear-gradient(135deg, ${settings.primary_color}, ${adjustColor(settings.primary_color, 40)})`,
        boxShadow: `0 8px 20px -3px ${settings.primary_color}40`
      }"
      data-aos="fade-up"
      data-aos-duration="300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, onBeforeUnmount, watch } from 'vue'
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
const showCategoryDropdown = ref(false)
const showScrollToTop = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')
const searchResults = ref([])

// Initialize AOS with mobile-friendly settings
AOS.init({
  duration: 600,
  easing: 'ease-in-out',
  once: false,
  mirror: false,
  offset: window.innerWidth < 768 ? 30 : 120,
  delay: 0
})

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (showCategoryDropdown.value && !event.target.closest('.relative')) {
    showCategoryDropdown.value = false
  }
}

// Toggle category dropdown
const toggleCategoryDropdown = (value) => {
  showCategoryDropdown.value = typeof value === 'boolean' ? value : !showCategoryDropdown.value
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
  
  // Collect all items from all categories
  Object.values(categoryItems).forEach(items => {
    allItems.push(...items)
  })
  
  // Filter items based on search query
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

// Handle scroll events for showing/hiding scroll to top button
const handleScroll = () => {
  showScrollToTop.value = window.scrollY > 200
}

// Initialize data loading
onMounted(async () => {
  isMounted.value = true
  
  // Add event listeners
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  try {
    // First, load categories and settings
    await Promise.all([
      qrSettingsStore.fetchSettings(),
      menuStore.fetchCategories()
    ])
    
    // If we have categories, set the first one as active
    if (categories.value.length > 0) {
      activeCategory.value = categories.value[0].id
      
      // Load menu items for each category
      await loadAllCategoryItems()
    }
  } catch (error) {
    console.error('Error loading menu data:', error)
  } finally {
    loading.value = false
    initialLoadComplete.value = true // Mark initial loading as complete
    
    // Refresh AOS after content is loaded
    setTimeout(() => {
      setupIntersectionObserver()
      AOS.refresh()
    }, 300)
  }
})

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
  
  // Remove event listeners
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})

const categories = computed(() => menuStore.categories)
const settings = computed(() => qrSettingsStore.settings)

// Helper function to adjust color brightness
function adjustColor(hex, percent) {
  // Remove # if present
  hex = hex.replace(/^#/, '')
  
  // Parse r, g, b values
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)
  
  // Adjust brightness
  r = Math.min(255, Math.max(0, r + percent))
  g = Math.min(255, Math.max(0, g + percent))
  b = Math.min(255, Math.max(0, b + percent))
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Load menu items for all categories
async function loadAllCategoryItems() {
  for (const category of categories.value) {
    await loadCategoryItems(category.id)
  }
}

// Load menu items for a specific category
async function loadCategoryItems(categoryId) {
  if (!categoryId) return
  
  // Skip if already loaded
  if (categoryItems[categoryId]) return
  
  categoryLoading[categoryId] = true
  
  try {
    // Fetch directly from Supabase for more reliability
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('category_id', categoryId)
      .eq('active', true)
      .order('name')
    
    if (error) throw error
    
    // Store the items in our reactive object
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
    const headerHeight = showSearch.value ? 120 : 80
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

// Set up intersection observer to highlight active category during scroll
function setupIntersectionObserver() {
  if (!categories.value.length || !initialLoadComplete.value || !isMounted.value) return

  const options = {
    root: null,
    rootMargin: '-120px 0px -70% 0px',
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

<style>
/* Add line clamp utility if not already available in your Tailwind setup */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Add horizontal scrollbar styling for category navigation */
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

/* Hide scrollbar for mobile category pills */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* Add touch-friendly tap highlight */
@media (max-width: 768px) {
  button, a {
    -webkit-tap-highlight-color: transparent;
  }
  
  .group {
    will-change: transform;
  }
  
  .touch-manipulation {
    touch-action: manipulation;
  }
}

/* Optimize animations for mobile */
@media (max-width: 768px) {
  [data-aos] {
    transition-duration: 400ms !important;
  }
}

/* Improve focus states for accessibility */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth scrolling for iOS */
html {
  -webkit-overflow-scrolling: touch;
}
</style>