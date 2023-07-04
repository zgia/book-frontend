import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

import useUserStore from '~/stores/user'
import useOptionsStore from '~/stores/options'
import { getToken } from '~/utils/tools'

import baseHeader from '~/components/layouts/BaseHeader.vue'

const routes = [
  { name: 'login', path: '/login', component: () => import('~/components/Login.vue') },
  {
    name: 'books', path: '/', components:
    {
      default: () => import('~/components/Books.vue'),
      header: baseHeader
    }, meta: { scrollToTop: true }
  },
  {
    name: 'volumes', path: '/book/:bookid/volumes', components:
    {
      default: () => import('~/components/Volumes.vue'),
      header: baseHeader
    }
  },
  {
    name: 'chapters', path: '/book/:bookid/chapters', components:
    {
      default: () => import('~/components/Chapters.vue'),
      header: baseHeader
    }
  },
  {
    name: 'editchapter', path: '/book/:bookid/editchapter/:chapterid', components:
    {
      default: () => import('~/components/EditChapter.vue'),
      header: baseHeader
    }
  },
  {
    name: 'content', path: '/book/:bookid/chapter/:chapterid', components:
    {
      default: () => import('~/components/Content.vue'),
      header: baseHeader
    }, meta: { scrollToTop: true }
  },
  { name: 'notfound', path: '/:pathMatch(.*)*', component: () => import('~/components/NotFound.vue') },
]

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
    if (to.matched.some(m => m.meta.scrollToTop)) {
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
  ElMessage.error('ROUTER' + status + ': 没有查看此页面的权限或者页面不存在。')

  return { name: 'books' }
}

router.beforeEach(async (to, from) => {

  localStorage.reqtoken = Date.now()

  if (getToken()) {
    if (to.name == 'login') {
      return { name: 'books' }
    } else {
      try {
        await useUserStore().getUser()
        await useOptionsStore().getGlobalOptions()

        const permissions = useUserStore().permissions
        console.log('router.beforeEach', permissions, to)

        // 部分路由需要检查权限，其他路由不需要检查权限
        if (Object.prototype.hasOwnProperty.call(permissions, to.name) && !permissions[to.name]) {
          return haveNoPermission()
        }
      } catch (err: any) {
        // 已经登录，有些页面无权限查看，则跳转回首页
        if (err['status'] == 403) {
          return haveNoPermission(403)
        } else {
          ElMessage.error('ROUTERX' + (err.message || err.msg))

          useUserStore().logout()
          return { name: 'login' }
        }
      }
    }
  } else {
    if (to.name != 'login') {
      useUserStore().logout()
      return { name: 'login' }
    }
  }
})

export default router;