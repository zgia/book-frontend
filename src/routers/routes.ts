import baseHeader from '~/components/layouts/BaseHeader.vue'

export const routes = [
  {
    name: 'login',
    path: '/login',
    component: () => import('~/components/Login.vue'),
  },
  {
    name: 'booklist',
    path: '/',
    components: {
      default: () => import('~/components/book/BookList.vue'),
      header: baseHeader,
    },
    meta: { scrollToTop: true },
  },
  {
    name: 'volumes',
    path: '/book/:bookid/volumes',
    components: {
      default: () => import('~/components/book/Volumes.vue'),
      header: baseHeader,
    },
  },
  {
    name: 'volumechapters',
    path: '/book/:bookid/volcha/:volumeid',
    components: {
      default: () => import('~/components/book/VolumeChapter.vue'),
      header: baseHeader,
    },
  },
  {
    name: 'book',
    path: '/book/:bookid/index',
    components: {
      default: () => import('~/components/book/Book.vue'),
      header: baseHeader,
    },
  },
  {
    name: 'editchapter',
    path: '/book/:bookid/editchapter/:chapterid',
    components: {
      default: () => import('~/components/book/EditChapter.vue'),
      header: baseHeader,
    },
  },
  {
    name: 'chapter',
    path: '/book/:bookid/chapter/:chapterid',
    components: {
      default: () => import('~/components/book/Chapter.vue'),
      header: baseHeader,
    },
    meta: { scrollToTop: true },
  },
  {
    name: 'search',
    path: '/search',
    components: {
      default: () => import('~/components/Search.vue'),
      header: baseHeader,
    },
    meta: { scrollToTop: true },
  },
  {
    name: 'author',
    path: '/author/index',
    components: {
      default: () => import('~/components/author/Index.vue'),
      header: baseHeader,
    },
  },
  {
    name: 'notfound',
    path: '/:pathMatch(.*)*',
    component: () => import('~/components/NotFound.vue'),
  },
]
