import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// 路由
import router from '~/routers'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Translations provided by Vuetify
import { zhHans } from 'vuetify/locale'
// Icon
import { aliases, fa } from 'vuetify/iconsets/fa'


const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: 'zhHans',
    fallback: 'zhHans',
    messages: { zhHans },
  },
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: { fa },
  },
  theme: {
    defaultTheme: 'light'
  },
})

const pinia = createPinia()
const app = createApp(App)

// 全量导入取消注释
//app.use(ElementPlus, { locale: zhCn, size: 'small', });
app.use(pinia)
app.use(router)
app.use(vuetify)


// 页面显示的数据的行数
app.config.globalProperties.pageSize = 20

app.mount('#app')