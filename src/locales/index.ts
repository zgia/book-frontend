import { createI18n } from 'vue-i18n'
import { useNavigatorLanguage } from '@vueuse/core'

import enUS from './lang/en-us'
import zhCN from './lang/zh-cn'
import zhTW from './lang/zh-tw'

// 'zh-CN', 'zh', 'en', 'enUS', 'zh-TW', 'zh-HK'
const { language } = useNavigatorLanguage()

export const defaultLanguage = () => {
  let lang = localStorage.getItem('language')
  if (lang) {
    return lang
  }

  switch (language.value) {
    case 'en':
    case 'en-US':
      lang = 'enUS'
      break
    case 'zh-TW':
    case 'zh-HK':
      lang = 'zhTW'
      break
    case 'zh':
    case 'zh-CN':
    default:
      lang = 'zhCN'
      break
  }

  return lang
}

// 创建 i18n
export const i18n = createI18n({
  legacy: false,
  globalInjection: true, // 全局模式，可以直接使用 $t
  locale: defaultLanguage(),
  messages: {
    zhCN,
    zhTW,
    enUS,
  },
})

export const _t = i18n.global.t
