<template>
  <h1 @dblclick="handleEdit(currentChapter.id)">{{ currentChapter.title }}</h1>
  <h4
    >{{ currentBook.title }}
    <small v-if="currentBook.title !== currentChapter.volumeTitle">{{
      currentChapter.volumeTitle
    }}</small></h4
  >
  <el-button
    circle
    type="warning"
    size="large"
    :icon="flippingIcon"
    v-if="showFlipping"
    style="top: 50px; position: fixed"
  />
  <el-row @dblclick="onDoubleClick">
    <el-col :xs="0" :sm="2" :md="4"></el-col>
    <el-col :xs="24" :sm="20" :md="16">
      <div
        class="content"
        v-html="nl2br(currentChapter.content)"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      />
    </el-col>
  </el-row>
  <el-divider />
  <el-row style="padding-top: 20px">
    <el-col :span="24">
      <el-button
        icon="IconoirNavArrowLeft"
        type="primary"
        @click="handleFlip('right')"
        v-if="prevChap.id"
        >{{ $t('chapter.previous') }}</el-button
      >
      <el-button
        icon="IconoirPageEdit"
        type="primary"
        @click="handleEdit(currentChapter.id)"
        v-if="currentChapter.id"
      />
      <el-button type="primary" @click="handleFlip('left')" v-if="nextChap.id"
        >{{ $t('chapter.next') }}
        <el-icon class="ep-icon--right"> <IconoirNavArrowRight /> </el-icon
      ></el-button>
    </el-col>
  </el-row>
  <el-backtop />
</template>
<script lang="ts" setup>
  import { useMagicKeys } from '@vueuse/core'
  import { onBeforeRouteUpdate } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { BookService } from '~/http'
  import {
    nl2br,
    intval,
    handleDoubleClick,
    handleTouchEnd,
    handleTouchMove,
    handleTouchStart,
    flippingIcon,
    showFlipping,
  } from '~/utils'
  import { Book, Chapter, setBookInfo, setChapInfo } from '~/models'
  import { useOptionsStore } from '~/stores'

  const gostore = useOptionsStore()
  gostore.headerIndex = 'bookchapters'

  const router = useRouter()
  const route = useRoute()
  const bookid = ref(intval(route.params.bookid))
  const chapterid = ref(intval(route.params.chapterid))

  // 翻页时，更新路由；或者加载带页码的URL
  onBeforeRouteUpdate(async (to, from) => {
    if (to.params.chapterid !== from.params.chapterid) {
      bookid.value = intval(to.params.bookid)
      chapterid.value = intval(to.params.chapterid)

      getChapter(bookid.value, chapterid.value)
    }
  })

  const currentBook: Book = reactive({
    id: 0,
    title: '',
  })

  // 上一章
  const prevChap: Chapter = reactive({
    id: 0,
    title: '',
  })
  // 下一章
  const nextChap: Chapter = reactive({
    id: 0,
    title: '',
  })
  // 当前章
  const currentChapter = reactive({
    id: 0,
    title: '',
    content: '',
    volumeid: '',
    volumeTitle: '',
  })

  // 翻页
  const flipping = (chapterid: number) => {
    if (chapterid) {
      router.push({
        name: 'bookchapters',
        params: { bookid: bookid.value, chapterid: chapterid },
      })
    } else {
      router
        .push({ name: 'bookindex', params: { bookid: bookid.value } })
        .then(() => {
          setChapInfo(prevChap)
          setChapInfo(nextChap)
        })
    }
  }

  // 监听翻页的动作
  const handleFlip = (direction: string) => {
    if (direction === 'left') {
      flipping(nextChap.id)
    } else if (direction === 'right') {
      flipping(prevChap.id)
    }
  }

  const onTouchStart = (e: TouchEvent) => {
    handleTouchStart(e)
  }

  const onTouchMove = (e: TouchEvent) => {
    handleTouchMove(e)
  }

  const onTouchEnd = () => {
    handleTouchEnd(handleFlip)
  }

  const onDoubleClick = (e: MouseEvent) => {
    handleDoubleClick(e, handleFlip)
  }

  const handleEdit = (chapterid: number) => {
    router.push({
      name: 'editchapter',
      params: { bookid: bookid.value, chapterid: chapterid },
    })
  }

  const getBook = (bookid: number) => {
    BookService.getBook({ id: bookid })
      .then((resp) => {
        setBookInfo(currentBook, resp.data)
      })
      .catch((err) => {
        ElMessage.error('CHAPBOOKERR: ' + (err.messge || err.msg || err))
      })
  }

  // ***************** 章节 ***************** //
  const getChapter = (bookid: number, chapterid: number) => {
    BookService.getChapter({ bookid: bookid, id: chapterid, next: 1 })
      .then((resp) => {
        setChapInfo(prevChap, resp.data.prev)
        setChapInfo(nextChap, resp.data.next)
        setChapInfo(currentChapter, resp.data.current)

        setBookInfo(currentBook, resp.data.book)
      })
      .catch((err) => {
        if (err.status === 404) {
          getBook(bookid)
        }
        const msg = err.messge || err.msg || err
        currentChapter.content = msg
        ElMessage.error('CHAPERR: ' + msg)
      })
  }

  getChapter(bookid.value, chapterid.value)

  // 前后翻页快捷键
  const keys = useMagicKeys()
  const KeyArrowLeft = keys['ArrowLeft']
  const KeyArrowRight = keys['ArrowRight']
  watch(KeyArrowLeft, (v) => {
    if (v && !gostore.dialogPopup) {
      handleFlip('right')
    }
  })
  watch(KeyArrowRight, (v) => {
    if (v && !gostore.dialogPopup) {
      handleFlip('left')
    }
  })
</script>
<style scoped>
  h1 {
    font-size: 28px;
  }

  div.content {
    text-align: left;
    line-height: 40px;
  }

  div.content :deep(p) {
    font-size: x-large;
  }

  .ep-icon--right {
    margin-left: 6px;
  }
</style>
