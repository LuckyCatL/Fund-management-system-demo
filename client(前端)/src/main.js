import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from './http'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)
app.use(store).use(router).use(ElementPlus)
app.config.globalProperties.$axios = axios;

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')