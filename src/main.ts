import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
// 全量导入取消注释
//import ElementPlus from 'element-plus'

// 路由
import router from '~/routers'

// 全局图标
import { Unlock, OfficeBuilding, User, UserFilled, Edit, Plus, Delete, Search, Female, Check, Close, SwitchButton, DocumentAdd, Management, Reading, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

// 全量导入取消注释
//import 'element-plus/dist/index.css'

import '~/styles/index.scss'
import 'uno.css'

// 全量导入取消注释
//import "element-plus/theme-chalk/src/message.scss"

const pinia = createPinia()
const app = createApp(App)

for (const [key, component] of Object.entries({ Unlock, OfficeBuilding, User, UserFilled, Edit, Plus, Delete, Search, Female, Check, Close, SwitchButton, DocumentAdd, Management, Reading, ArrowLeft, ArrowRight })) {
  app.component(key, component)
}

// 全量导入取消注释
//app.use(ElementPlus, { locale: zhCn, size: 'small', });
app.use(pinia)
app.use(router)

// 页面显示的数据的行数
app.config.globalProperties.pageSize = 20

app.mount('#app')