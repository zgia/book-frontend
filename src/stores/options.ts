import { defineStore } from 'pinia'
import { SystemService } from '~/http'
import { intval } from '~/utils'
import { Book, Category } from '~/models'

export const useOptionsStore = defineStore(
  'globalOptions',
  {
    state: () => ({
      pagesize: 10,
      categories: [] as Category[],
      categoryMap: {},
      options: {},
      book: null as Book | null,
      headerIndex: '',
      clientWidth: document.body.clientWidth,
    }),
    actions: {
      getGlobalOptions() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          try {
            const resp = await SystemService.globalOptions()

            this.options = resp.data.options
            this.pagesize = intval(resp.data.pagesize)
            this.categories = resp.data.categories
            this.categories.forEach((v) => {
              this.categoryMap[v['id']] = v['title']
            })
            resolve(resp)
          }
          catch (error) {
            console.error('getGlobalOptions', error)
            reject(error)
          }
        })
      },
    }
  })