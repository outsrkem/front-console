import { createApp } from 'vue'
import App from './App.vue'
import router from '../router'
import EventBusPlugin from '../utils/event-bus.js'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import vueCookies from 'vue-cookies'

import '../styles/index.less'
const app = createApp(App)

// 使用element国际化
app.use(ElementPlus, {
    locale: zhCn,
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(vueCookies)
app.use(EventBusPlugin);
app.mount('#app')
