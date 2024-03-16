<template>
  <h1 @click="handleEdit()">{{ currentChapter.title }}</h1>
  <h4>{{ currentBook.title }} <small v-if="currentBook.title != currentChapter.volumeTitle">{{
    currentChapter.volumeTitle }}</small></h4>
  <el-button circle size="large" :icon="flippingActionIcon" type="warning" v-if="showFlippingAction"
    style="top:50px;position:fixed;" />
  <el-row @dblclick="onDoubleClick">
    <el-col :xs="0" :sm="2" :md="4"></el-col>
    <el-col :xs="24" :sm="20" :md="16">
      <div class="content" v-html="nl2br(currentChapter.content)" @touchstart="handleTouchStart"
        @touchmove="handleTouchMove" @touchend="handleTouchEnd" />
    </el-col>
  </el-row>
  <el-divider />
  <el-row style="padding-top: 20px;">
    <el-col :span="24">
      <el-button icon="ArrowLeft" type="primary" @click="handleFlip(prevChap.id)" v-if="prevChap.id">{{
    $t('chapter.previous') }}</el-button>
      <el-button icon="Edit" type="primary" @click="handleEdit()" v-if="currentChapter.id" :title="shortKey" />
      <el-button type="primary" @click="handleFlip(nextChap.id)" v-if="nextChap.id">{{ $t('chapter.next') }} <el-icon
          class="ep-icon--right">
          <ArrowRight />
        </el-icon></el-button>
    </el-col>
  </el-row>
  <el-backtop />
</template>
<script lang="ts" setup>
import { onUnmounted, shallowRef } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight, DArrowLeft, DArrowRight } from '@element-plus/icons-vue'
import { sprintf } from 'sprintf-js'
import { BookService } from '~/http'
import { nl2br, intval, altKey, metaKey } from '~/utils'
import { Book, Chapter, setBookInfo, setChapInfo } from '~/models'
import { useOptionsStore } from '~/stores'

const gostore = useOptionsStore()
gostore.headerIndex = 'chapter'

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

// DoubleTap 翻页
// 使用间隔>300ms的2次点击模拟移动端的双击
const hw = document.body.clientWidth / 2
const qw = document.body.clientWidth / 8
const tapTimes: number[] = []
// 用于处理2次Tap左右距离过远的问题
const tapPos: number[] = []
// 点击提示
const showFlippingAction = ref(false)
const flippingActionIcon = shallowRef(ArrowLeft)

const clearTap = () => {
  tapTimes.length = 0
  tapPos.length = 0

  showFlippingAction.value = false
}

// 左侧3/4区域
const isLeftArea = (pos: number) => {
  return pos < hw - qw
}
// 右侧3/4区域
const isRightArea = (pos: number) => {
  return pos > hw + qw
}

// 左右滑动翻页
const startX = ref(0)
const startY = ref(0)
const moveX = ref(0)
const moveY = ref(0)
const moveDistance = 150
const handleTouchStart = (e: TouchEvent) => {
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY

  // 防止第一次点击后，很久没有点击第二次
  let dn = Date.now()
  //dn = dn - (intval(dn / 10000) * 100000)
  if (tapTimes.length == 1 && (tapTimes[0] - dn) > 1000) {
    tapTimes[0] = dn

    tapPos[0] = startX.value
  } else {
    tapTimes.push(dn)
    tapPos.push(startX.value)
  }
}

const handleTouchMove = (e: TouchEvent) => {
  // 滑动后便清除点击操作
  clearTap()

  moveX.value = e.touches[0].clientX
  moveY.value = e.touches[0].clientY

  // 往右滑
  if (moveX.value - startX.value >= moveDistance) {
    handleFlip(prevChap.id)
  }
  // 往左滑
  else if (startX.value - moveX.value >= moveDistance) {
    handleFlip(nextChap.id)
  }
}

const handleTouchEnd = () => {
  //console.log('TOUCHEND: startX: ' + intval(startX.value) + ', startY: ' + intval(startY.value) + ', moveX: ' + intval(moveX.value) + ', moveY: ' + intval(moveY.value) + ', client: ' + document.body.clientWidth)

  // 显示提示
  if (tapTimes.length == 1) {
    showFlippingAction.value = true

    if (isRightArea(startX.value)) {
      flippingActionIcon.value = ArrowRight
    } else if (isLeftArea(startX.value)) {
      flippingActionIcon.value = ArrowLeft
    } else {
      showFlippingAction.value = false
    }
  }

  if (tapTimes.length < 2) {
    return
  }

  // 模拟双击，应该在同一位置。避免点一侧后再点击另一侧
  if (tapTimes[1] - tapTimes[0] < 1000 && Math.abs(tapPos[1] - tapPos[0]) < 20) {
    doFlip(startX.value)
  }
}

// PC端双击
const onDoubleClick = (e: MouseEvent) => {
  doFlip(e.pageX)

  // const t = `
  //   Offset X/Y: ${e.offsetX}, ${e.offsetY}
  //   Viewport X/Y: ${e.clientX}, ${e.clientY}
  //   Page X/Y: ${e.pageX}, ${e.pageY}
  //   Screen X/Y: ${e.screenX}, ${e.screenY}`
  // console.log('onDoubleClick', t, document.body.clientWidth)
}

const doFlip = (pos: number) => {
  let ok = false

  // 右半边3/4区域
  if (isRightArea(pos)) {
    ok = true
    flippingActionIcon.value = DArrowRight

    handleFlip(nextChap.id)
  }
  // 左半边3/4区域
  else if (isLeftArea(pos)) {
    ok = true
    flippingActionIcon.value = DArrowLeft

    handleFlip(prevChap.id)
  } else {
    ok = false
  }

  if (ok) {
    // 翻页后，延迟半秒隐藏指示图标
    setTimeout(clearTap, 500)
  } else {
    clearTap()
  }
}

const bookIndex = () => {
  router.push({ name: 'book', params: { 'bookid': bookid.value } })
    .then(() => {
      setChapInfo(prevChap)
      setChapInfo(nextChap)
    })
}

const handleFlip = (chapterid: number) => {
  if (chapterid) {
    router.push({ name: 'chapter', params: { 'bookid': bookid.value, 'chapterid': chapterid } })
  } else {
    bookIndex()
  }
}

const handleEdit = () => {
  router.push({ name: 'editchapter', params: { 'bookid': bookid.value, chapterid: currentChapter.id } })
}

const getBook = (bookid: number) => {
  BookService.getBook({ id: bookid })
    .then(resp => {
      setBookInfo(currentBook, resp.data)
    })
    .catch(err => {
      ElMessage.error('CHAPBOOKERR: ' + (err.messge || err.msg || err))
    })
}

// ***************** 章节 ***************** //
const getChapter = (bookid: number, chapterid: number) => {
  BookService.getChapter({ bookid: bookid, id: chapterid, next: 1 })
    .then(resp => {

      setChapInfo(prevChap, resp.data.prev)
      setChapInfo(nextChap, resp.data.next)
      setChapInfo(currentChapter, resp.data.current)

      setBookInfo(currentBook, resp.data.book)
    })
    .catch(err => {
      if (err.status == 404) {
        getBook(bookid)
      }
      const msg = err.messge || err.msg || err
      currentChapter.content = msg
      ElMessage.error('CHAPERR: ' + msg)
    })
}

getChapter(bookid.value, chapterid.value)

// 编辑文章的快捷键
const shortKey = sprintf('快捷键: %s + %s + E', metaKey(), altKey())

// 快捷键
document.onkeydown = (e) => {
  if (!e) {
    return
  }

  if (e.altKey && e.metaKey && e.code == 'KeyE') {
    handleEdit()
    return
  }

  switch (e.key) {
    case 'ArrowLeft':
      handleFlip(prevChap.id)
      break
    case 'ArrowRight':
      handleFlip(nextChap.id)
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