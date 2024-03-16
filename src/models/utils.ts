import { useOptionsStore, useLocaleStore } from '~/stores'
import { Book, Chapter } from '~/models'
import i18n from '~/locales';

export const setBookInfo = (dist: Book, src: Book) => {
  for (const j in src) {
    dist[j] = src[j]
  }

  useOptionsStore().$state.book = src
}

export const setChapInfo = (dist: Chapter | { id: number; title: string; content: string; volumeid: string; volumeTitle: string }, src?: Chapter) => {
  if (src === undefined) {
    src = { id: 0, title: '' }
  }

  for (const i in src) {
    dist[i] = src[i]
  }
}

export const wc2Wan = (num = 0) => {
  const unit = useLocaleStore().locale === 'zhCn' ? 10000 : 1000

  return num >= unit ? Math.ceil(num / unit) + i18n.global.t('common.wan') : num
}
