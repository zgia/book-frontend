import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
// 全量导入取消注释
//import ElementPlus from 'element-plus'

// 多语言
import i18n from './locales'

// 路由
import router from '~/routers'

// 全局图标
import {
  Setting, Unlock, OfficeBuilding, User, UserFilled, SwitchButton, SetUp,
  Edit, Plus, Delete, Search, Female, Check, Close, Moon, Sunny, Guide,
  Management, Download, Reading, ArrowLeft, ArrowRight, ArrowDown, Back
} from '@element-plus/icons-vue'

// 全量导入取消注释
//import 'element-plus/dist/index.css'

import '~/styles/index.scss'
import 'uno.css'

// 全量导入取消注释
//import "element-plus/theme-chalk/src/message.scss"

// 在某些屏幕尺寸下隐藏元素
// https://element-plus.org/zh-CN/component/layout.html#%E5%9F%BA%E4%BA%8E%E6%96%AD%E7%82%B9%E7%9A%84%E9%9A%90%E8%97%8F%E7%B1%BB
import 'element-plus/theme-chalk/display.css'

const pinia = createPinia()
const app = createApp(App)

for (const [key, component] of Object.entries({
  Setting, Unlock, OfficeBuilding, User, UserFilled, SwitchButton, SetUp,
  Edit, Plus, Delete, Search, Female, Check, Close, Moon, Sunny, Guide,
  Management, Download, Reading, ArrowLeft, ArrowRight, ArrowDown, Back
})) {
  app.component(key, component)
}

// 全量导入取消注释
//app.use(ElementPlus, { locale: zhCn, size: 'small', });
app.use(pinia)
app.use(router)
app.use(i18n)

// 页面显示的数据的行数
app.config.globalProperties.pageSize = 20

app.mount('#app')