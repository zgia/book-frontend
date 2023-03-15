<template>
  <h1>{{ currentChapter.title }}</h1>
  <h4>{{ currentBook.title }} <small v-if="currentBook.title != currentChapter.volumeTitle">{{ currentChapter.volumeTitle
  }}</small></h4>
  <el-row>
    <el-col>
      <div style="text-align:left;line-height:40px;font-size:larger;" v-html="nl2br(currentChapter.content)" />
    </el-col>
  </el-row>
  <el-divider />
  <el-row style="padding-top: 20px;">
    <el-col :span="24">
      <el-button icon="ArrowLeft" @click="handleBNChapter(beforeChap.id)" v-if="beforeChap.id" />
      <el-button icon="Edit"
              @click="$router.push({ name: 'editchapter', params: { 'bookid': bookid, chapterid: currentChapter.id } })" />
      <el-button icon="ArrowRight" @click="handleBNChapter(nextChap.id)" v-if="nextChap.id" />
    </el-col>
  </el-row>
  <el-backtop />
</template>

<script lang="ts" setup>
import { onBeforeRouteUpdate } from 'vue-router'
import { ElMessage } from 'element-plus'
import { BookService } from '~/utils/api'
import { nl2br, intval } from '~/utils/tools'
import { Book } from '~/models/book'
import useOptionsStore from '~/stores/options'
const gostore = useOptionsStore()
gostore.headerIndex = 'content'

const router = useRouter()
const route = useRoute()
const bookid = ref(intval(route.params.bookid))
const chapterid = ref(intval(route.params.chapterid))

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.chapterid !== from.params.chapterid) {
    bookid.value = intval(to.params.bookid)
    chapterid.value = intval(to.params.chapterid)

    getChapter(bookid.value, chapterid.value)

    window.scrollTo(0, 0)
  }
})

console.log('setup: ', bookid, chapterid)

const currentBook: Book = reactive({
  id: 0,
  title: '',
})

const beforeChap = reactive({
  id: 0,
  title: '',
})
const nextChap = reactive({
  id: 0,
  title: '',
})

const currentChapter = reactive({
  id: 0,
  title: '',
  content: '',
  volumeid: '',
  volumeTitle: '',
})

const handleBNChapter = (chapterid: number) => {
  router.push({ name: 'content', params: { 'bookid': bookid.value, 'chapterid': chapterid } })
}

// ***************** 章节 ***************** //
const getChapter = (bookid: number, chapterid: number) => {
  console.log('getChapter: ', bookid, chapterid)

  BookService.getChapter({ bookid: bookid, id: chapterid, next: 1 }).then(
    resp => {
      if (resp.data.before) {
        beforeChap.id = resp.data.before.id
        beforeChap.title = resp.data.before.title
      } else {
        beforeChap.id = 0
        beforeChap.title = ''
      }
      if (resp.data.next) {
        nextChap.id = resp.data.next.id
        nextChap.title = resp.data.next.title
      } else {
        nextChap.id = 0
        nextChap.title = ''
      }

      for (var i in resp.data.current) {
        currentChapter[i] = resp.data.current[i]
      }

      currentBook.title = resp.data.book.title
      currentBook.id = bookid

      if (!gostore.book) {
        gostore.book = currentBook
      }
    }
  ).catch(
    err => {
      ElMessage.error('CONTENTERR: ' + (err.messge || err.msg))
    }
  )
}

getChapter(bookid.value, chapterid.value)
</script>