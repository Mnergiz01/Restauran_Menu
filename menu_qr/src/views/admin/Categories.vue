<template>
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Kategoriler</h3>
        <button
          @click="openAddModal"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Kategori Ekle
        </button>
      </div>
      
      <div v-if="loading" class="px-4 py-5 sm:p-6 text-center">
        <svg class="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="category in categories" :key="category.id" class="px-4 py-4 sm:px-6 flex items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center text-gray-500" v-html="category.icon"></div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
              <div class="text-sm text-gray-500">ID: {{ category.id }}</div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="openEditModal(category)"
              class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Düzenle
            </button>
            <button
              @click="confirmDelete(category)"
              class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sil
            </button>
          </div>
        </li>
        <li v-if="categories.length === 0" class="px-4 py-5 sm:p-6 text-center text-gray-500">
          Henüz kategori bulunmamaktadır. Yeni bir kategori ekleyin.
        </li>
      </ul>
      
      <!-- Add/Edit Category Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              {{ isEditing ? 'Kategori Düzenle' : 'Yeni Kategori Ekle' }}
            </h3>
            <form @submit.prevent="saveCategory">
              <div class="mb-4">
                <label for="categoryId" class="block text-sm font-medium text-gray-700">Kategori ID</label>
                <input
                  type="text"
                  id="categoryId"
                  v-model="currentCategory.id"
                  :disabled="isEditing"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="ornek-kategori"
                  required
                />
                <p class="mt-1 text-xs text-gray-500">URL-dostu bir ID olmalıdır (örn: tatli-cesitleri)</p>
              </div>
              
              <div class="mb-4">
                <label for="categoryName" class="block text-sm font-medium text-gray-700">Kategori Adı</label>
                <input
                  type="text"
                  id="categoryName"
                  v-model="currentCategory.name"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Tatlı Çeşitleri"
                  required
                />
              </div>
              
              <div class="mb-4">
                <label for="categoryIcon" class="block text-sm font-medium text-gray-700">Kategori İkonu (SVG)</label>
                <textarea
                  id="categoryIcon"
                  v-model="currentCategory.icon"
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 7.5 7.5 9.5"/><path d="M9.5 16.5 7.5 14.5"/><path d="m14.5 7.5 2 2"/><path d="m14.5 16.5 2-2"/><path d="M12 8a4 4 0 0 1 0 8 4 4 0 0 1 0-8Z"/></svg>'
                  required
                ></textarea>
              </div>
              
              <div class="mb-4">
                <label for="displayOrder" class="block text-sm font-medium text-gray-700">Görüntüleme Sırası</label>
                <input
                  type="number"
                  id="displayOrder"
                  v-model="currentCategory.display_order"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="0"
                />
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
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Kategoriyi Sil</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    <strong>{{ categoryToDelete?.name }}</strong> kategorisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve bu kategoriye ait tüm ürünler de silinecektir.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="deleteCategory"
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
  import { ref, onMounted } from 'vue'
  import { useMenuStore } from '../../stores/menu'
  
  const menuStore = useMenuStore()
  const categories = ref([])
  const loading = ref(true)
  const showModal = ref(false)
  const showDeleteModal = ref(false)
  const isEditing = ref(false)
  const saving = ref(false)
  const deleting = ref(false)
  const categoryToDelete = ref(null)
  
  const currentCategory = ref({
    id: '',
    name: '',
    icon: '',
    display_order: 0
  })
  
  const fetchData = async () => {
    loading.value = true;
    try {
      await menuStore.fetchCategories();
      categories.value = menuStore.categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(fetchData);
  
  async function fetchCategories() {
    loading.value = true
    try {
      await menuStore.fetchCategories()
      categories.value = menuStore.categories
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      loading.value = false
    }
  }
  
  function openAddModal() {
    isEditing.value = false
    currentCategory.value = {
      id: '',
      name: '',
      icon: '',
      display_order: categories.value.length
    }
    showModal.value = true
  }
  
  function openEditModal(category) {
    isEditing.value = true
    currentCategory.value = { ...category }
    showModal.value = true
  }
  
  function closeModal() {
    showModal.value = false
  }
  
  async function saveCategory() {
    saving.value = true
    try {
      if (isEditing.value) {
        await menuStore.updateCategory(currentCategory.value.id, currentCategory.value)
      } else {
        await menuStore.addCategory(currentCategory.value)
      }
      closeModal()
      await fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Kategori kaydedilirken bir hata oluştu: ' + error.message)
    } finally {
      saving.value = false
    }
  }
  
  function confirmDelete(category) {
    categoryToDelete.value = category
    showDeleteModal.value = true
  }
  
  async function deleteCategory() {
    if (!categoryToDelete.value) return
    
    deleting.value = true
    try {
      await menuStore.deleteCategory(categoryToDelete.value.id)
      showDeleteModal.value = false
      await fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Kategori silinirken bir hata oluştu: ' + error.message)
    } finally {
      deleting.value = false
    }
  }
  </script>