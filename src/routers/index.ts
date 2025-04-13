import {
  RouteLocationNormalized,
  createRouter,
  createWebHistory,
} from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore, useOptionsStore } from '~/stores'
import { getToken } from '~/utils'
import { routes } from './routes'
import { _t } from '~/locales'

// scrollBehavior:
// - only available in html5 history mode
// - defaults to no scroll behavior
// - return false to prevent scroll
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    //console.log('savedPosition ', from.name, ' to ', to.name, savedPosition)
    return savedPosition
  } else {
    const position = {}
    // new navigation.
    // scroll to anchor by returning the selector
    if (to.hash) {
      position['selector'] = to.hash
    }
    // check if any matched route config has meta that requires scrolling to top
    if (to.matched.some((m) => m.meta.scrollToTop)) {
      // cords will be used if no selector is provided,
      // or if the selector didn't match any element.
      position['top'] = 0
      position['left'] = 0
    }
    // if the returned position is falsy or an empty object,
    // will retain current scroll position.
    //console.log('newPosition ', from.name, ' to ', to.name, position)
    return position
  }
}

// 使用createWebHistory时，浏览器直接打开非首页链接时会404，这时需要在
// nginx 的 location / {...} 内添加: try_files $uri $uri/ /index.html;
//
// location / {
//   try_files $uri $uri/ /index.html;
// }
//
// @see https://router.vuejs.org/zh/guide/essentials/history-mode.html
const router = createRouter({
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
  scrollBehavior,
})

const haveNoPermission = (status = 0) => {
  ElMessage.error('ROUTER' + status + ': ' + _t('common.no_permission'))

  return { name: 'booklist' }
}

router.beforeEach(async (to: RouteLocationNormalized) => {
  localStorage.setItem('reqtoken', '' + Date.now())

  if (getToken()) {
    if (to.name === 'login') {
      return { name: 'booklist' }
    } else {
      try {
        await useUserStore().getUser()

        if (!useOptionsStore().loaded) {
          await useOptionsStore().getOptions()
        }

        const permissions = useUserStore().permissions
        console.log('router.beforeEach.to', to)

        // 部分路由需要检查权限，其他路由不需要检查权限
        const pk = to.name as PropertyKey
        const toName = to.name as string
        if (
          !toName &&
          Object.prototype.hasOwnProperty.call(permissions, pk) &&
          !permissions[toName]
        ) {
          return haveNoPermission()
        }
      } catch (err: any) {
        console.error('router.beforeEach.error', err, typeof err)
        // 已经登录，有些页面无权限查看，则跳转回首页
        if (err.status === 403) {
          return haveNoPermission(403)
        } else {
          ElMessage.error('ROUTERX: ' + (err.message || err.msg || err))

          useUserStore().logout()
          return { name: 'login' }
        }
      }
    }
  } else if (to.name !== 'login') {
    useUserStore().logout()
    return { name: 'login' }
  }
})

export default router
