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
    name: 'bookvolumes',
    path: '/book/:bookid/volume',
    components: {
      default: () => import('~/components/book/BookVolumes.vue'),
      header: baseHeader,
    },
  },
  {
    name: 'volumechapters',
    path: '/book/:bookid/volcha/:volumeid',
    components: {
      default: () => import('~/components/book/VolumeChapters.vue'),
      header: baseHeader,
    },
  },
  {
    name: 'bookindex',
    path: '/book/:bookid/index',
    components: {
      default: () => import('~/components/book/BookIndex.vue'),
      header: baseHeader,
    },
  },
  {
    name: 'bookchapters',
    path: '/book/:bookid/chapter/:chapterid',
    components: {
      default: () => import('~/components/book/BookChapters.vue'),
      header: baseHeader,
    },
    meta: { scrollToTop: true },
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
