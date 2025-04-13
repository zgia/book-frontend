<template>
  <el-page-header
    :icon="backIcon()"
    :title="backTitle()"
    @back="goBack()"
    style="padding-top: 10px"
  >
    <template #content>
      <div class="flex items-center">
        <div
          ><router-link to="/" class="library">{{
            $t('common.library')
          }}</router-link></div
        >
        <el-divider
          direction="vertical"
          v-if="gostore.headerIndex !== 'booklist' && gostore.book?.title"
          class="header-title"
        />
        <div
          class="font-500 header-title"
          v-if="gostore.book?.title"
          style="cursor: pointer"
          @click="bookIndex()"
        >
          {{ gostore.book?.title }}
        </div>
      </div>
    </template>
    <template #extra>
      <BaseHeaderExtra />
    </template>
  </el-page-header>
  <el-divider style="margin-top: 10px" />
</template>
<script lang="ts" setup>
  import { useOptionsStore } from '~/stores'
  import { _t } from '~/locales'
  import BaseHeaderExtra from '~/components/layouts/BaseHeaderExtra.vue'

  const gostore = useOptionsStore()
  const router = useRouter()

  const isReadingChapter = () => {
    return (
      gostore.headerIndex === 'chapter' ||
      gostore.headerIndex === 'volumechapter' ||
      gostore.headerIndex === 'volumes' ||
      gostore.headerIndex === 'editchapter' ||
      gostore.headerIndex === 'searchinbook'
    )
  }

  // 页头按钮
  const goBack = () => {
    if (isReadingChapter()) {
      bookIndex()
    } else if (
      gostore.headerIndex === 'book' ||
      gostore.headerIndex === 'search'
    ) {
      bookList()
    }
  }

  const backTitle = () => {
    return isReadingChapter() ? _t('common.bookindex') : _t('common.booklist')
  }

  const backIcon = () => {
    return gostore.headerIndex === 'booklist'
      ? 'IconoirBook'
      : 'IconoirArrowLeftCircle'
  }

  // 某本书的目录
  const bookIndex = () => {
    router.push({ name: 'book', params: { bookid: gostore.book?.id } })
  }

  // 图书列表
  const bookList = () => {
    router.push({
      name: 'booklist',
      query: { p: localStorage.getItem('topage') },
    })
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
