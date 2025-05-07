
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  
  const isAuthenticated = computed(() => !!user.value)
  
  async function initialize() {
    loading.value = true
    
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      user.value = data.session.user
    }
    
    loading.value = false
    
    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user || null
    })
  }
  
  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    user.value = data.user
    return data
  }
  
  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    user.value = null
  }
  
  return {
    user,
    loading,
    isAuthenticated,
    initialize,
    login,
    logout
  }
})
