import { defineStore } from 'pinia'
import { SystemService } from '~/utils/api'
import { intval } from '~/utils/tools'
import { Book } from '~/models/book'

const useOptionsStore = defineStore(
  'globalOptions',
  {
    state: () => ({
      pagesize: 10,
      options: {},
      book: null as Book | null,
      headerIndex: ''
    }),
    actions: {
      getGlobalOptions() {
        return new Promise(async (resolve, reject) => {
          try {
            const resp = await SystemService.globalOptions()

            this.options = resp.data.options
            this.pagesize = intval(resp.data.pagesize)

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

export default useOptionsStore