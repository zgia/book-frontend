<template>
  <h1>{{ currentChapter.title }}</h1>
  <h4>{{ currentBook.title }} <small v-if="currentBook.title != currentChapter.volumeTitle">{{ currentChapter.volumeTitle
  }}</small></h4>
  <el-row>
    <el-col :span="colSpan" :offset="colOffset">
      <div class="content" v-html="nl2br(currentChapter.content)" />
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

<style scoped>
div.content {
  text-align: left;
  line-height: 40px;
  font-size: larger;
}

div.content p {
  font-size: 22px;
}
</style>

<script lang="ts" setup>
import { onUnmounted } from 'vue'
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

// 翻页时，更新路由；或者加载带页码的URL
onBeforeRouteUpdate(async (to, from) => {
  if (to.params.chapterid !== from.params.chapterid) {
    bookid.value = intval(to.params.bookid)
    chapterid.value = intval(to.params.chapterid)

    getChapter(bookid.value, chapterid.value)
  }
})

// 调整页面宽度
const screenWidth = ref(document.body.clientWidth)
window.onresize = () => {
  return (() => {
    screenWidth.value = document.body.clientWidth
  })()
}

const colSpan = ref(16)
const colOffset = ref(4)
watch(screenWidth, (sw) => {
  colSpan.value = sw < 640 ? 22 : 16
  colOffset.value = sw < 640 ? 1 : 4
}, { immediate: true, deep: true })

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

const bookIndex = () => {
  router.push({ name: 'chapters', params: { 'bookid': bookid.value } }).then(() => {
    beforeChap.id = 0
    nextChap.id = 0
  })
}

const handleBNChapter = (chapterid: number) => {
  if (chapterid) {
    router.push({ name: 'content', params: { 'bookid': bookid.value, 'chapterid': chapterid } })
  } else {
    bookIndex()
  }
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

// 按键翻页
// https://www.zhangxinxu.com/wordpress/2021/01/js-keycode-deprecated/
document.onkeydown = (e) => {
  if (!e) {
    return
  }

  switch (e.key) {
    case 'ArrowLeft':
      handleBNChapter(beforeChap.id)
      break
    case 'ArrowRight':
      handleBNChapter(nextChap.id)
      break
    default:
      break;
  }
}
// 避免其他页面也响应
onUnmounted(() => {
  document.onkeydown = null
})
</script>