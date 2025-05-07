<template>
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Ürünler</h3>
        <div class="flex space-x-4">
          <select
            v-model="selectedCategoryId"
            @change="fetchProducts"
            class="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Tüm Kategoriler</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <button
            @click="openAddModal"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ürün Ekle
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="px-4 py-5 sm:p-6 text-center">
        <svg class="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ürün
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiyat
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Düzenle</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full object-cover" :src="product.image_url || '/placeholder.svg?height=40&width=40'" alt="" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div v-if="product.description" class="text-sm text-gray-500 truncate max-w-xs">{{ product.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getCategoryName(product.category_id) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatPrice(product.price) }}</div>
                <div v-if="product.variations" class="text-xs text-gray-500">
                  <span v-for="(variation, index) in product.variations" :key="index" class="block">
                    {{ variation }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ product.active ? 'Aktif' : 'Pasif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openEditModal(product)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Düzenle
                </button>
                <button
                  @click="confirmDelete(product)"
                  class="text-red-600 hover:text-red-900"
                >
                  Sil
                </button>
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                Henüz ürün bulunmamaktadır. Yeni bir ürün ekleyin.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Add/Edit Product Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full max-h-full overflow-y-auto">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              {{ isEditing ? 'Ürün Düzenle' : 'Yeni Ürün Ekle' }}
            </h3>
            <form @submit.prevent="saveProduct">
              <div class="mb-4">
                <label for="productName" class="block text-sm font-medium text-gray-700">Ürün Adı</label>
                <input
                  type="text"
                  id="productName"
                  v-model="currentProduct.name"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ürün Adı"
                  required
                />
              </div>
              
              <div class="mb-4">
                <label for="productCategory" class="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  id="productCategory"
                  v-model="currentProduct.category_id"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="" disabled>Kategori Seçin</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              
              <div class="mb-4">
                <label for="productDescription" class="block text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                  id="productDescription"
                  v-model="currentProduct.description"
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ürün açıklaması (isteğe bağlı)"
                ></textarea>
              </div>
              
              <div class="mb-4">
                <label for="productPrice" class="block text-sm font-medium text-gray-700">Fiyat (₺)</label>
                <input
                  type="number"
                  id="productPrice"
                  v-model="currentProduct.price"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              
              <div class="mb-4">
                <label for="productImageUrl" class="block text-sm font-medium text-gray-700">Resim URL</label>
                <input
                  type="text"
                  id="productImageUrl"
                  v-model="currentProduct.image_url"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Varyasyonlar</label>
                <div v-for="(variation, index) in variations" :key="index" class="flex mb-2">
                  <input
                    type="text"
                    v-model="variations[index]"
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Örn: Büyük: 100₺"
                  />
                  <button
                    type="button"
                    @click="removeVariation(index)"
                    class="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  @click="addVariation"
                  class="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="-ml-0.5 mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  Varyasyon Ekle
                </button>
              </div>
              
              <div class="mb-4">
                <div class="flex items-center">
                  <input
                    id="productActive"
                    type="checkbox"
                    v-model="currentProduct.active"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label for="productActive" class="ml-2 block text-sm text-gray-900">
                    Aktif
                  </label>
                </div>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {{ saving ? 'Kaydediliyor...' : 'Kaydet' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Ürünü Sil</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    <strong>{{ productToDelete?.name }}</strong> ürününü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="deleteProduct"
              :disabled="deleting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ deleting ? 'Siliniyor...' : 'Sil' }}
            </button>
            <button
              type="button"
              @click="showDeleteModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useMenuStore } from '../../stores/menu'
  
  const menuStore = useMenuStore()
  const categories = ref([])
  const products = ref([])
  const loading = ref(true)
  const showModal = ref(false)
  const showDeleteModal = ref(false)
  const isEditing = ref(false)
  const saving = ref(false)
  const deleting = ref(false)
  const productToDelete = ref(null)
  const selectedCategoryId = ref('')
  const variations = ref([])
  
  const currentProduct = ref({
    id: null,
    name: '',
    category_id: '',
    description: '',
    price: 0,
    image_url: '',
    variations: null,
    active: true
  })
  
  onMounted(async () => {
    await fetchCategories()
    await fetchProducts()
  })
  
  async function fetchCategories() {
    try {
      await menuStore.fetchCategories()
      categories.value = menuStore.categories
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }
  
  async function fetchProducts() {
    loading.value = true
    try {
      await menuStore.fetchMenuItems(selectedCategoryId.value || null)
      products.value = menuStore.menuItems
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      loading.value = false
    }
  }
  
  function getCategoryName(categoryId) {
    const category = categories.value.find(c => c.id === categoryId)
    return category ? category.name : 'Bilinmeyen Kategori'
  }
  
  function formatPrice(price) {
    return `${price}₺`
  }
  
  function openAddModal() {
    isEditing.value = false
    currentProduct.value = {
      id: null,
      name: '',
      category_id: selectedCategoryId.value || '',
      description: '',
      price: 0,
      image_url: '',
      variations: null,
      active: true
    }
    variations.value = []
    showModal.value = true
  }
  
  function openEditModal(product) {
    isEditing.value = true
    currentProduct.value = { ...product }
    variations.value = product.variations ? [...product.variations] : []
    showModal.value = true
  }
  
  function closeModal() {
    showModal.value = false
  }
  
  function addVariation() {
    variations.value.push('')
  }
  
  function removeVariation(index) {
    variations.value.splice(index, 1)
  }
  
  async function saveProduct() {
    saving.value = true
    
    try {
      // Process variations
      if (variations.value.length > 0 && variations.value.some(v => v.trim() !== '')) {
        currentProduct.value.variations = variations.value.filter(v => v.trim() !== '')
      } else {
        currentProduct.value.variations = null
      }
      
      if (isEditing.value) {
        await menuStore.updateMenuItem(currentProduct.value.id, currentProduct.value)
      } else {
        await menuStore.addMenuItem(currentProduct.value)
      }
      
      closeModal()
      await fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Ürün kaydedilirken bir hata oluştu: ' + error.message)
    } finally {
      saving.value = false
    }
  }
  
  function confirmDelete(product) {
    productToDelete.value = product
    showDeleteModal.value = true
  }
  
  async function deleteProduct() {
    if (!productToDelete.value) return
    
    deleting.value = true
    try {
      await menuStore.deleteMenuItem(productToDelete.value.id, productToDelete.value.category_id)
      showDeleteModal.value = false
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Ürün silinirken bir hata oluştu: ' + error.message)
    } finally {
      deleting.value = false
    }
  }
  </script>