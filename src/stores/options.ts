import { defineStore } from 'pinia'
import { SystemService } from '~/http'
import { intval } from '~/utils'
import { Book, Category } from '~/models'

const VITE_PAGE_SIZE = intval(import.meta.env.VITE_PAGE_SIZE)

export const useOptionsStore = defineStore('globalOptions', {
  state: () => ({
    pagesize: VITE_PAGE_SIZE,
    categories: [] as Category[],
    categoryMap: {},
    options: {},
    book: null as Book | null,
    headerIndex: '',
    dialogPopup: false,
    clientWidth: document.body.clientWidth,
    loaded: false,
    query: '',
  }),
  actions: {
    getOptions() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          const resp = await SystemService.options()

          this.loaded = true

          this.options = resp.data.options
          this.pagesize = intval(resp.data.pagesize) ?? this.pagesize
          this.categories = resp.data.categories
          this.categories.forEach((v) => {
            this.categoryMap[v['id']] = v['title']
          })

          resolve(resp)
        } catch (error) {
          console.error('getOptions', error)
          reject(error)
        }
      })
    },
  },
})
