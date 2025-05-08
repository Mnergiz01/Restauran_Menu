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
              class="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="flex justify-center py-16">
        <div class="flex flex-col items-center">
          <svg class="animate-spin h-10 w-10 text-gray-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-500">Menü yükleniyor...</p>
        </div>
      </div>

      <div v-else>
        <!-- Category Navigation -->
        <div class="mb-10 overflow-x-auto py-2 px-1">
          <nav class="flex space-x-3 pb-1">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="scrollToCategory(category.id)"
              class="px-5 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out whitespace-nowrap flex items-center"
              :class="[
                activeCategory === category.id 
                  ? 'bg-white text-gray-900 shadow-md ring-1 ring-gray-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
              ]"
              :style="activeCategory === category.id ? { color: settings.primary_color } : {}"
            >
              <span class="mr-2.5" v-html="category.icon"></span>
              {{ category.name }}
            </button>
          </nav>
        </div>

        <!-- Categories and Menu Items -->
        <div>
          <div
            v-for="category in categories"
            :key="category.id"
            :id="category.id"
            class="mb-20"
          >
            <div class="flex items-center mb-8">
              <div 
                class="p-3 rounded-xl shadow-sm mr-4 flex items-center justify-center" 
                :style="{ backgroundColor: settings.primary_color + '10' }"
              >
                <div class="text-2xl" :style="{ color: settings.primary_color }" v-html="category.icon"></div>
              </div>
              <h2 class="text-2xl font-bold" :style="{ color: settings.primary_color }">
                {{ category.name }}
              </h2>
            </div>

            <div v-if="categoryLoading[category.id]" class="flex justify-center py-12">
              <svg class="animate-spin h-8 w-8" :style="{ color: settings.primary_color }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>

            <div v-else-if="getCategoryItems(category.id).length === 0" class="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div class="inline-flex items-center justify-center p-4 rounded-full bg-gray-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <p class="text-gray-500 text-lg font-medium">Bu kategoride henüz ürün bulunmamaktadır.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div
                v-for="item in getCategoryItems(category.id)"
                :key="item.id"
                class="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                :style="{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)', borderBottom: `3px solid ${settings.primary_color}` }"
              >
                <!-- Image Container -->
                <div class="relative overflow-hidden">
                  <div class="aspect-w-16 aspect-h-10 bg-gray-100">
                    <img
                      v-if="item.image_url"
                      :src="item.image_url"
                      :alt="item.name"
                      class="w-full h-52 object-cover transform transition duration-700 group-hover:scale-110"
                    />
                    <div v-else class="w-full h-52 flex items-center justify-center bg-gray-50 text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Overlay Gradient -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <!-- Price Badge -->
                <div 
                  class="absolute top-4 right-4 px-3.5 py-1.5 rounded-full font-bold text-white shadow-lg transform transition-all duration-300 group-hover:scale-110"
                  :style="{ backgroundColor: settings.primary_color }"
                >
                  {{ formatPrice(item.price) }}
                </div>
                
                <!-- Content -->
                <div class="p-6">
                  <!-- Title and Description -->
                  <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition duration-300">
                    {{ item.name }}
                  </h3>
                  
                  <p v-if="item.description" class="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {{ item.description }}
                  </p>
                  
                  <!-- Variations -->
                  <div v-if="item.variations && item.variations.length > 0" class="mt-4 space-y-2">
                    <p class="text-sm font-semibold text-gray-700 flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      Seçenekler
                    </p>
                    <div class="space-y-2">
                      <div 
                        v-for="(variation, index) in item.variations" 
                        :key="index" 
                        class="text-sm rounded-lg flex justify-between items-center border border-gray-100 overflow-hidden"
                      >
                        <span class="px-3 py-2 bg-gray-50 text-gray-700">{{ getVariationName(variation) }}</span>
                        <span 
                          class="px-3 py-2 font-medium" 
                          :style="{ color: settings.primary_color }"
                        >
                          {{ getVariationPrice(variation) }}
                        </span>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, onBeforeUnmount } from 'vue'
import { useMenuStore } from '../stores/menu'
import { useQRSettingsStore } from '../stores/qrSettings'
import { supabase } from '../supabase'

const menuStore = useMenuStore()
const qrSettingsStore = useQRSettingsStore()
const loading = ref(true)
const activeCategory = ref('')
const categoryItems = reactive({})
const categoryLoading = reactive({})
const observer = ref(null)

const categories = computed(() => menuStore.categories)
const settings = computed(() => qrSettingsStore.settings)

// Initialize data loading
onMounted(async () => {
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
    setupIntersectionObserver();
  }
})

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})

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
    element.scrollIntoView({ behavior: 'smooth' })
  }
  activeCategory.value = categoryId
}

// Scroll to the top of the page
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Set up intersection observer to highlight active category during scroll
function setupIntersectionObserver() {
    if (!categories.value.length) return;

    const options = {
        root: null,
        rootMargin: '-100px 0px -70% 0px',
        threshold: 0
    };

    if (!observer.value) {
        observer.value = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activeCategory.value = entry.target.id;
                }
            });
        }, options);
    }

    // Get all category elements and observe them
    setTimeout(() => {
        categories.value.forEach(category => {
            const element = document.getElementById(category.id);
            if (element) {
                observer.value.observe(element);
            }
        });
    }, 100);
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
</style>