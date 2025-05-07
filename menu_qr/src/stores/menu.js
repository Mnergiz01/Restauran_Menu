
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useMenuStore = defineStore('menu', () => {
  const categories = ref([])
  const menuItems = ref([])
  const loading = ref(false)
  
  async function fetchCategories() {
    loading.value = true
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) throw error
    
    categories.value = data
    loading.value = false
  }
  
  async function fetchMenuItems(categoryId = null) {
    loading.value = true
    let query = supabase.from('menu_items').select('*')
    
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }
    
    const { data, error } = await query.order('name')
    
    if (error) throw error
    
    menuItems.value = data
    loading.value = false
  }
  
  async function addCategory(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
    
    if (error) throw error
    
    await fetchCategories()
    return data[0]
  }
  
  async function updateCategory(id, updates) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    await fetchCategories()
    return data[0]
  }
  
  async function deleteCategory(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    await fetchCategories()
  }
  
  async function addMenuItem(item) {
    const { id, ...cleanItem } = item  // id'yi ayıkla
    const { data, error } = await supabase
      .from('menu_items')
      .insert(cleanItem)
      .select()
    
    if (error) throw error
  
    await fetchMenuItems(item.category_id)
    return data[0]
  }
  
  
  async function updateMenuItem(id, updates) {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    await fetchMenuItems(updates.category_id)
    return data[0]
  }
  
  async function deleteMenuItem(id, categoryId) {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    await fetchMenuItems(categoryId)
  }
  
  return {
    categories,
    menuItems,
    loading,
    fetchCategories,
    fetchMenuItems,
    addCategory,
    updateCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
  }
})
