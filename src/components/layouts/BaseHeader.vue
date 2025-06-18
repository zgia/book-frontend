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
          v-if="routeName !== 'booklist'"
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
  const routeName = computed(() => router.currentRoute.value.name)

  const isReadingChapter = computed(
    () =>
      routeName.value === 'bookchapters' ||
      routeName.value === 'volumechapters' ||
      routeName.value === 'bookvolumes' ||
      routeName.value === 'editchapter'
  )

  // 页头按钮
  const goBack = () => {
    if (isReadingChapter.value) {
      bookIndex()
    } else if (routeName.value === 'bookindex' || routeName.value === 'search') {
      bookList()
    }
  }

  const backTitle = () => {
    return isReadingChapter.value
      ? _t('common.bookindex')
      : _t('common.library')
  }

  const backIcon = () => {
    return routeName.value === 'booklist' ? 'IconoirBook' : 'IconoirArrowLeftCircle'
  }

  // 某本书的目录
  const bookIndex = () => {
    router.push({ name: 'bookindex', params: { bookid: gostore.book?.id } })
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
