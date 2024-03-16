import { createI18n } from 'vue-i18n'

import en from './lang/en'
import zhCn from './lang/zh-cn'

// 创建 i18n
const i18n = createI18n({
  legacy: false,
  globalInjection: true, // 全局模式，可以直接使用 $t
  locale: localStorage.getItem('lang') || 'zhCn',
  messages: {
    zhCn,
    en
  }
})

export default i18n
