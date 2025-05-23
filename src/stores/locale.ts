import { defineStore } from 'pinia'
import { i18n, defaultLanguage } from '~/locales'

// 参考：https://juejin.cn/post/7127606944184926245
export const useLocaleStore = defineStore('globalLocale', {
  state: () => ({
    locale: defaultLanguage(),
  }),
  actions: {
    setLocale(locale) {
      this.locale = locale
      localStorage.setItem('language', locale)
      i18n.global.locale.value = locale
    },
  },
})
