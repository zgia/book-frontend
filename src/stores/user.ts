import { defineStore } from 'pinia'
import { getToken, clearCaches, setCaches } from '~/utils/tools'
import { UserService } from '~/utils/api'

interface UserInfo {
  id: number,
  username: string,
  realname: string,
  mobile: string,
  permissions: {}
}

const useUserStore = defineStore(
  'userinfo',
  {
    state: () => ({
      token: getToken(),
      user: null as UserInfo | null,
      permissions: {}
    }),

    actions: {

      dologin(user: {}) {
        return new Promise((resolve, reject) => {
          UserService.dologin(user).then(res => {
            setCaches(res.data.token, res.data.user)

            this.token = res.data.token
            this.user = res.data.user

            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },

      getUser() {
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

export default useUserStore
