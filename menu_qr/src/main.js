import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import './style.css'
import { useAuthStore } from './stores/auth'
import AOS from 'aos'
import 'aos/dist/aos.css'

AOS.init()

// Create the app
const app = createApp(App)

// Set up Pinia
const pinia = createPinia()
app.use(pinia)

// Set up router
app.use(router)

// Initialize auth state
const authStore = useAuthStore()
authStore.initialize()

// Mount the app
app.mount('#app')