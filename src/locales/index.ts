import { createI18n } from 'vue-i18n'
import { useNavigatorLanguage } from '@vueuse/core'

import en from './lang/en'
import zhCN from './lang/zh-cn'
import zhTW from './lang/zh-tw'

// 'zh-CN', 'zh', 'en', 'zh-TW', 'zh-HK'
const { language } = useNavigatorLanguage()

export const navigatorLanguage = () => {
  let lang = ''
  switch (language.value) {
    case 'zh':
    case 'zh-CN':
      lang = 'zhCN'
      break
    case 'zh-TW':
    case 'zh-HK':
      lang = 'zhTW'
      break
    default:
      lang = 'en'
      break
  }

  return lang
}

// 创建 i18n
export const i18n = createI18n({
  legacy: false,
  globalInjection: true, // 全局模式，可以直接使用 $t
  locale: localStorage.getItem('language') || navigatorLanguage(),
  messages: {
    zhCN,
    zhTW,
    en,
  },
})

export const _t = i18n.global.t
