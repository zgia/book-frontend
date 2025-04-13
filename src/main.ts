import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApp from './App.vue'
// 全量导入取消注释
//import ElementPlus from 'element-plus'

// 多语言
import { i18n } from './locales'

// 路由
import router from '~/routers'

// 全局图标
import {
  IconoirBook,
  IconCustomExit,
  IconoirSearch,
  IconoirGroup,
  IconoirEdit,
  IconoirTrash,
  IconoirInfinite,
  IconoirSettings,
  IconoirPeopleTag,
  IconoirPage,
  IconoirPageEdit,
  IconoirAddPage,
  IconoirMultiplePages,
  IconoirPageSearch,
  IconoirGridAdd,
  IconoirXmarkCircle,
  IconoirXmark,
  IconoirRefreshDouble,
  IconoirArrowLeftCircle,
  IconoirNavArrowRight,
  IconoirNavArrowLeft,
  IconoirNavArrowDown,
  IconoirKey,
  IconCustomAddBook,
  IconoirCheck,
  IconoirCheckCircled,
  IconoirCheckCircledSolid,
  IconoirMore,
  IconoirEmoji,
  IconoirStarDashed,
  IconoirStar,
  IconoirStarSolid,
  IconoirRate1,
  IconoirRate2,
  IconoirRate3,
  IconoirRate4,
  IconoirRate5,
} from '~/composables'

// 全量导入取消注释
//import 'element-plus/dist/index.css'

import '~/styles/index.scss'
import 'uno.css'

// 全量导入取消注释
//import "element-plus/theme-chalk/src/message.scss"

// 在某些屏幕尺寸下隐藏元素
// https://element-plus.org/zh-CN/component/layout.html#基于断点的隐藏类
import 'element-plus/theme-chalk/display.css'

const pinia = createPinia()
const app = createApp(VueApp)

for (const [key, component] of Object.entries({
  IconoirBook,
  IconCustomExit,
  IconoirSearch,
  IconoirGroup,
  IconoirEdit,
  IconoirTrash,
  IconoirInfinite,
  IconoirSettings,
  IconoirPeopleTag,
  IconoirPage,
  IconoirPageEdit,
  IconoirAddPage,
  IconoirMultiplePages,
  IconoirPageSearch,
  IconoirGridAdd,
  IconoirXmarkCircle,
  IconoirXmark,
  IconoirRefreshDouble,
  IconoirArrowLeftCircle,
  IconoirNavArrowRight,
  IconoirNavArrowLeft,
  IconoirNavArrowDown,
  IconoirKey,
  IconCustomAddBook,
  IconoirCheck,
  IconoirCheckCircled,
  IconoirCheckCircledSolid,
  IconoirMore,
  IconoirEmoji,
  IconoirStarDashed,
  IconoirStar,
  IconoirStarSolid,
  IconoirRate1,
  IconoirRate2,
  IconoirRate3,
  IconoirRate4,
  IconoirRate5,
})) {
  app.component(key, component)
}

// 全量导入取消注释
//app.use(ElementPlus, { locale: zhCn, size: 'small', });
app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
