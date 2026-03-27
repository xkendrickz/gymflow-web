import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { useAuthStore } from '@/stores/auth'

const vuetify = createVuetify({ components, directives })
const pinia = createPinia()
const app = createApp(App)

app.use(vuetify)
app.use(pinia) // ← pinia first
app.use(Toast)

// Restore session before router starts navigating
const auth = useAuthStore()
auth.init() // ← then init auth

app.use(router) // ← then router
app.mount('#app')
