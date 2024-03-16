<template>
  <el-page-header :icon="backIcon()" :title="backTitle()" @back="goBack()" style="padding-top: 10px;">
    <template #content>
      <div class="flex items-center">
        <div><router-link to="/" class="library">{{ $t('common.library') }}</router-link></div>
        <el-divider direction="vertical" v-if="gostore.headerIndex != 'books' && gostore.book?.title"
          class="header-title" />
        <div class="font-500 header-title" v-if="gostore.book?.title" style="cursor: pointer;" @click="bookIndex()"> {{
          gostore.book?.title }} </div>
      </div>
    </template>
    <template #extra>
      <BaseHeaderExtra />
    </template>
  </el-page-header>
  <el-divider style="margin-top: 10px;" />
</template>

<script lang="ts" setup>
import { useOptionsStore } from '~/stores'
import i18n from '~/locales';
import BaseHeaderExtra from '~/components/layouts/BaseHeaderExtra.vue'

const gostore = useOptionsStore()
const router = useRouter()

const isReadingChapter = () => {
  return gostore.headerIndex == 'chapter' || gostore.headerIndex == 'volumes' || gostore.headerIndex == 'editchapter' || gostore.headerIndex == 'searchinbook'
}

// 页头按钮
const goBack = () => {
  if (isReadingChapter()) {
    bookIndex()
  }
  else if (gostore.headerIndex == 'book' || gostore.headerIndex == 'search') {
    bookList()
  }
}

const backTitle = () => {
  return isReadingChapter() ? i18n.global.t('common.bookindex') : i18n.global.t('common.booklist')
}

const backIcon = () => {
  return gostore.headerIndex == 'books' ? 'Reading' : 'Back'
}

const bookIndex = () => {
  router.push({ name: 'book', params: { 'bookid': gostore.book?.id } })
}

const bookList = () => {
  router.push({ name: 'books', query: { 'p': localStorage.topage } })
}
</script>

<style scoped>
.library {
  color: var(--ep-text-color-primary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}
</style>