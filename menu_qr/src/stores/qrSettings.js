
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useQRSettingsStore = defineStore('qrSettings', () => {
  const settings = ref({
    id: 1,
    restaurant_name: 'My Restaurant',
    logo_url: '',
    primary_color: '#000000',
    background_color: '#FFFFFF'
  })
  const loading = ref(false)
  
  async function fetchSettings() {
    loading.value = true
    const { data, error } = await supabase
      .from('qr_settings')
      .select('*')
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    if (data) {
      settings.value = data
    }
    
    loading.value = false
  }
  
  async function updateSettings(updates) {
    loading.value = true
    
    // Check if settings exist
    const { data: existingData, error: existingError } = await supabase
      .from('qr_settings')
      .select('id')
      .limit(1)
    
    let result
    
    if (existingData && existingData.length > 0) {
      // Update existing settings
      const { data, error } = await supabase
        .from('qr_settings')
        .update({
          ...updates,
          updated_at: new Date()
        })
        .eq('id', existingData[0].id)
        .select()
      
      if (error) throw error
      result = data[0]
    } else {
      // Insert new settings
      const { data, error } = await supabase
        .from('qr_settings')
        .insert({
          ...settings.value,
          ...updates
        })
        .select()
      
      if (error) throw error
      result = data[0]
    }
    
    settings.value = result
    loading.value = false
    return result
  }
  
  return {
    settings,
    loading,
    fetchSettings,
    updateSettings
  }
})
