import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

import useUserStore from '~/stores/user'
import useOptionsStore from '~/stores/options'
import { getToken, intval } from '~/utils/Tools'

import baseHeader from '~/components/layouts/BaseHeader.vue'

const routes = [
  { name: 'login', path: '/login', component: () => import('~/components/Login.vue') },
  {
    name: 'books', path: '/', components:
    {
      default: () => import('~/components/Books.vue'),
      header: baseHeader
    }
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
    }
  },
  { name: 'notfound', path: '/:pathMatch(.*)*', component: () => import('~/components/NotFound.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})


const haveNoPermission = (status = 0) => {
  ElMessage.error('ROUTER' + status + ': 没有查看此页面的权限或者页面不存在。')

  return { name: 'home' }
}

router.beforeEach(async (to, from) => {
  const toPage = intval(to.query.page)
  localStorage.topage = toPage ? toPage : 1

  if (getToken()) {
    if (to.name == 'login') {
      useUserStore().logout()
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