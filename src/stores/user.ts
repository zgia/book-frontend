import { defineStore } from 'pinia'
import { getToken, clearCaches, setCaches } from '~/utils'
import { UserService } from '~/http'

interface UserInfo {
  id: number,
  username: string,
  realname: string,
  mobile: string,
  permissions: object
}

export const useUserStore = defineStore(
  'userinfo',
  {
    state: () => ({
      token: getToken(),
      user: null as UserInfo | null,
      permissions: {}
    }),

    actions: {

      dologin(user: object) {
        return new Promise((resolve, reject) => {
          UserService.dologin(user)
            .then(resp => {
              setCaches(resp.data.token, resp.data.user)

              this.token = resp.data.token
              this.user = resp.data.user

              resolve(resp)
            })
            .catch(err => {
              reject(err)
            })
        })
      },

      getUser() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          try {
            const resp = await UserService.isLogined()
            this.permissions = resp.data.user.permissions
            this.user = resp.data.user

            resolve(resp)
          }
          catch (err) {
            console.error('useUserStore.getUser.isLogined')
            reject(err)
          }
        })
      },

      logout() {
        console.log('useUserStore.logout')
        this.user = null
        this.token = null

        clearCaches()
      }
    }
  })