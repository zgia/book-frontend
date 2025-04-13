import { useOptionsStore } from '~/stores'
import { Book, Chapter } from '~/models'
import { _t } from '~/locales'

export const searchModeList = ['title', 'content', 'author', 'categ']

export const santSearchMode = (sm: string) => {
  return searchModeList.includes(sm) ? sm : ''
}

export const setBookInfo = (dist: Book, src: Book) => {
  for (const j in src) {
    dist[j] = src[j]
  }

  useOptionsStore().$state.book = src
}

export const setChapInfo = (
  dist:
    | Chapter
    | {
        id: number
        title: string
        content: string
        volumeid: string
        volumeTitle: string
      },
  src?: Chapter,
) => {
  if (src === undefined) {
    src = { id: 0, title: '' }
  }

  for (const i in src) {
    dist[i] = src[i]
  }
}

export const wc2Wan = (num = 0) => {
  const unit = localStorage.getItem('language') === 'en' ? 1000 : 10000

  return num >= unit ? Math.ceil(num / unit) + _t('common.wan') : num
}
