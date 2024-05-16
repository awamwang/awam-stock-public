import './polyfills'
import './registerClassHooks'
import './registerElectron'

import 'normalize.css'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import useVueUtils from './utils/vue/index'
import useVueSocket from './useVueSocket'
import App from './App.vue'
import router from './routers'

const app = createApp(App)

useVueUtils(app, router)
useVueSocket(app)

app
  .use(createPinia())
  .use(router)
  // .mount('#app')
  .mount(document.body)
  .$nextTick(window.removeLoading)
