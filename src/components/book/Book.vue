<template>
  <h1>{{ currentBook.title }} </h1>
  <h4>{{ currentBook.author }} </h4>
  <div class="book-info text-left">
    <h2>{{ $t('chapter.summary') }} <el-tag round effect="plain" type="info">{{ bookCategory }}</el-tag></h2>
    <div class="book-summary">
      <div class="summary">
        <div v-html="summary()"></div>
        <p class="source" v-if="currentBook.source">{{ $t('book.book_source', { 'source': currentBook.source }) }}</p>
      </div>
      <p class="cover" v-if="currentBook.cover">
        <el-image :src="currentBook.cover" :preview-src-list=[currentBook.cover] fit="cover" />
      </p>
    </div>
  </div>
  <div class="book-func text-right">
    <el-button-group>
      <el-button icon="Reading" type="primary" @click="handleEditBook()">{{ $t('common.btn_edit')
        }}</el-button>
      <el-button icon="Management" type="primary" @click="handleVolume(bookid)">{{
        $t('common.btn_volume') }}</el-button>
      <el-button icon="Download" type="primary" @click="handleDownload" />
    </el-button-group>
    <el-button-group style="margin-left:5px;">
      <el-button icon="Plus" type="primary" @click="handleEditChapter(bookid)" :disabled="noVolume">{{
        $t('common.btn_new_chapter') }}</el-button>
      <el-button icon="Edit" type="primary" @click="editMode = !editMode" />
    </el-button-group>
  </div>
  <h2 class="text-left">{{ $t('common.bookindex') }} <xxsmall> {{ $t('chapter.beupto') }} {{ latestChapter }}</xxsmall>
  </h2>
  <el-row v-for="(volume, vidx) in volumeData" :index="volume.id" :key="vidx">
    <el-col class="text-left">
      <div class="volinfo is-light volinfo-bgimg" :style="{ backgroundImage: 'url(' + volume.cover + ')' }">
        <div class="volinfo-content">
          <h2 class="volinfo-title">
            <el-icon @click="readVol(volume)" :title="$t('chapter.read_volume_chapters')" class="read-btn">
              <Memo />
            </el-icon> {{ volume.title == currentBook.title ? $t('chapter.default_volume') : volume.title }} <xxsmall
              v-if="chapterData[volume.id]"> ({{ $t('chapter.total', { 'total': chapterData[volume.id].length }) }})
            </xxsmall>
          </h2>
          <div class="volinfo-description">
            <xxsmall v-if="volume.summary" v-html="nl2br(volume.summary)" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col class="chapters-list" :xs="24" :sm="12" :md="8" :lg="6" :xl="3"
      v-for="(chapter, index) in chapterData[volume.id]" :index="chapter.id" :key="index">
      <el-button class="chapter-link" v-if="chapter" @click="handleReadChapter(bookid, chapter.id)">{{
        subTitle(chapter.title) }}</el-button>
      <p v-if="editMode">
        <el-button-group>
          <el-button text size="small" icon="Edit" @click="handleEditChapter(bookid, chapter.id)" />
          <el-button text size="small" icon="Delete" @click="handleDelete(index, chapter, volume.id)" />
        </el-button-group>
      </p>
    </el-col>
  </el-row>
  <el-backtop />
  <Suspense v-if="editBookVisible">
    <template #default>
      <editBookDialog :book="currentBook" @hide="editBookVisible = false" @update="afterUpdated"
        @close-loading="closeLoading" />
    </template>
  </Suspense>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Memo } from '@element-plus/icons-vue'
import { BookService } from '~/http'
import { Book, Chapter, Volume, setBookInfo } from '~/models'
import { nl2br, intval } from '~/utils'
import { useOptionsStore } from '~/stores'
import i18n from '~/locales';

const gostore = useOptionsStore()
gostore.headerIndex = 'book'

const router = useRouter()
const route = useRoute()
const bookid = intval(route.params.bookid)

// 加载动画
const fsLoading = ref(false)
const openLoading = () => {
  fsLoading.value = true
}
const closeLoading = () => {
  fsLoading.value = false
}

const editMode = ref(false)

// 调整页面宽度
const screenWidth = ref(document.body.clientWidth)
window.onresize = () => {
  screenWidth.value = document.body.clientWidth
}

// 当前操作的
const currentBook: Book = reactive({
  id: 0,
  categoryid: '',
  title: '',
  author: '',
  summary: '',
  source: '',
  cover: '',
})

const readVol = (vol: Volume) => {
  router.push({ name: 'volumechapters', params: { 'bookid': currentBook.id, volumeid: vol.id } })
}

const bookCategory = computed(() => {
  return currentBook.categoryid ? gostore.categoryMap[currentBook.categoryid] : ''
})

const subTitle = (title: string, len = 20) => {
  if (screenWidth.value <= 992) {
    len = 25
  }

  return title.length > len ? title.substring(0, len) + '...' : title
}

const summary = () => {
  return nl2br(currentBook.summary);
}

// ***************** 编辑 ***************** //
const editBookDialog = defineAsyncComponent(() => import('./EditBookDialog.vue'))
const editBookVisible = ref(false)

// 更新图书信息
const afterUpdated = (book: Book) => {
  setBookInfo(currentBook, book)
}

const handleEditBook = () => {
  openLoading()

  editBookVisible.value = true
}

// ***************** 删除 ***************** //
const handleDelete = (index: number, row: Chapter, volumeid: number) => {

  ElMessageBox.confirm(
    i18n.global.t('chapter.confirm_delete_chapter', { 'title': row.title }),
    currentBook.title,
    {
      confirmButtonText: i18n.global.t('common.btn_delete'),
      confirmButtonClass: 'ep-button--danger',
      cancelButtonText: i18n.global.t('common.btn_cancel'),
      type: 'warning',
    }
  )
    .then(() => {
      BookService.deleteChapter({ bookid: bookid, id: row.id })
        .then(() => {
          chapterData[volumeid].splice(index, 1)
          ElMessage.success(i18n.global.t('chapter.chapter_deleted_ok'))
        })
        .catch(err => {
          ElMessage.error('CHAPERR: ' + i18n.global.t('common.deleted_error', { 'err': (err.messge || err.msg) }))
        })
    })
    .catch(() => {
      // 不删除
    })
}

const handleVolume = (bookid: number) => {
  router.push({ name: 'volumes', params: { 'bookid': bookid } })
}

// ***************** 下载 ***************** //
const downloading = ref(false)
const handleDownload = () => {
  ElMessageBox.confirm(
    i18n.global.t('chapter.confirm_download_chapter', { 'title': currentBook.title }),
    currentBook.title,
    {
      confirmButtonText: i18n.global.t('common.btn_download'),
      cancelButtonText: i18n.global.t('common.btn_cancel'),
      type: 'info',
    }
  )
    .then(() => {
      downloading.value = true

      ElMessage.info(i18n.global.t('book.start_downloading'))

      const filename = currentBook.title + '.zip'
      BookService.download({ id: bookid }, filename)
        .then(() => {
          ElMessage.success(i18n.global.t('book.books_downloaded_ok', { 'title': filename }))
        })
        .catch(err => {
          ElMessage.error(i18n.global.t('book.books_downloaded_error', { 'title': (err.messge || err.msg) }))
        })
        .finally(() => {
          downloading.value = false
        })
    })
    .catch(() => {
      // 放弃下载
    })
}

const handleEditChapter = (bookid: number, chapterid = 0) => {
  router.push({ name: 'editchapter', params: { 'bookid': bookid, chapterid: chapterid } })
}

const handleReadChapter = (bookid: number, chapterid: number) => {
  router.push({ name: 'chapter', params: { 'bookid': bookid, chapterid: chapterid } })
}

// ***************** 章节 ***************** //
const chapterData = reactive({ string: [] })
const volumeData: Volume[] = reactive([])

const latestChapter = ref('~')
// 用于处理新章节的按钮是否可以点击
const noVolume = ref(false)

const getChapters = () => {
  BookService.getChapters({ bookid: bookid })
    .then(resp => {
      setBookInfo(currentBook, resp.data.book)

      if (resp.data.volumes.length == 1 && resp.data.volumes[0].id == 0) {
        noVolume.value = true

        ElMessage.error('CHAPERR：' + i18n.global.t('chapter.add_volume_first'))

        return
      }

      volumeData.length = 0
      volumeData.push(...resp.data.volumes)

      for (var i in resp.data.items) {
        if (resp.data.items[i]) {
          chapterData[i] = resp.data.items[i]
        }
      }

      // 最终章节
      let latestVolumeTitle = volumeData[volumeData.length - 1].title
      latestVolumeTitle = latestVolumeTitle == currentBook.title ? '' : latestVolumeTitle

      let lvid = volumeData[volumeData.length - 1].id
      let latestChapterTitle = '~'
      if (resp.data.items[lvid]) {
        latestChapterTitle = resp.data.items[lvid][resp.data.items[lvid].length - 1]['title']
      }
      latestChapter.value = latestVolumeTitle + ' ' + latestChapterTitle

    })
    .catch(err => {
      ElMessage.error('CHAPERR: ' + (err.messge || err.msg))
    })
}

getChapters()
</script>
<style scoped>
h1 {
  font-size: 2.5em;
}

.book-info .book-summary {
  display: flex;
  justify-content: space-between;
}

.book-info .summary {
  color: var(--ep-text-color-regular);
  font-size: 12px;
  width: fit-content;
}

.book-info .cover {
  width: 200px;
  text-align: right;
}

.chapters-list {
  line-height: 25px;
  padding: 5px 0;
}

.chapters-list .chapter-link {
  border: 0 !important;
  height: 40px !important;
  width: 100%;
}

.volinfo.is-light {
  background-color: var(--ep-color-info-light-9);
  color: var(--ep-color-info);
}

.volinfo {
  --volinfo-padding: 8px 16px;
  --volinfo-border-radius-base: var(--ep-border-radius-base);
  --volinfo-title-font-size: 18px;
  --volinfo-description-font-size: 12px;
  --volinfo-read-font-size: 12px;
  width: 100%;
  padding: var(--volinfo-padding);
  margin: 0;
  box-sizing: border-box;
  border-radius: var(--volinfo-border-radius-base);
  position: relative;
  background-color: var(--ep-color-white);
  overflow: hidden;
  opacity: 1;
  display: flex;
  align-items: center;
  transition: opacity var(--ep-transition-duration-fast);
}

.volinfo-bgimg {
  background-repeat: no-repeat;
  background-position-x: right;
  background-size: 100px;
}

.volinfo-title {
  font-size: var(--volinfo-title-font-size);
  line-height: 18px;
  font-weight: bold;
  vertical-align: text-top;
}

.volinfo-content {
  display: table-cell;
  padding: 0 8px;
}

.volinfo.is-light .volinfo-description {
  color: var(--ep-color-info);
}

.volinfo .volinfo-description {
  font-size: var(--volinfo-description-font-size);
  margin: 5px 0 0 0;
  padding-right: 120px;
}

.volinfo .read-btn {
  vertical-align: text-bottom;
  cursor: pointer;
}
</style>