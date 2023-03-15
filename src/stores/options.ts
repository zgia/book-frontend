import { defineStore } from 'pinia'
import { SystemService } from '~/utils/api'
import { intval } from '~/utils/tools'
import { Book } from '~/models/book'

const useOptionsStore = defineStore(
  'globalOptions',
  {
    state: () => ({
      perpage: 20,
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
            this.perpage = intval(resp.data.perpage)

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