<template>
  <h1>{{ currentBook.title }} <xxsmall>{{ currentBook.author }}</xxsmall>
  </h1>
  <div class="summary" v-html="nl2br(currentBook.summary)"></div>
  <div class="summary" v-if="currentBook.source">来源: {{ currentBook.source }}</div>
  <el-row><el-col style="text-align: right;">
      <el-button-group>
        <el-button icon="Management" type="primary"
          @click="$router.push({ name: 'volumes', params: { 'bookid': bookid } })" />
        <el-button icon="Download" type="primary" @click="handleDownload" />
      </el-button-group>
      <el-button-group style="margin-left:5px;">
        <el-button icon="DocumentAdd" type="success"
          @click="$router.push({ name: 'editchapter', params: { 'bookid': bookid, chapterid: 0 } })" />
        <el-button icon="Edit" type="success" @click="editMode = !editMode" />
      </el-button-group>
    </el-col>
  </el-row>
  <el-row v-for="(volume, vidx) in volumeData" :index="volume.id" :key="vidx">
    <el-col :span="24" style="text-align: left;border-bottom: 1px solid #999;">
      <h4>{{ volume.title == currentBook.title ? '目录' : volume.title }}<xxsmall v-if="chapterData[volume.id]"> (共{{
        chapterData[volume.id].length }}章)</xxsmall>
      </h4>
      <xxsmall style="color: #999;" v-if="volume.summary" v-html="nl2br(volume.summary)" />
    </el-col>
    <el-col style="line-height:25px;padding:10px; border-bottom: 1px solid #ddd;" :span="8"
      v-for="(chapter, index) in chapterData[volume.id]" :index="chapter.id" :key="index">
      <el-link v-if="chapter"
        @click="$router.push({ name: 'content', params: { 'bookid': bookid, 'chapterid': chapter.id } })">{{ chapter.title
        }}</el-link>
      <p v-if="editMode">
        <el-button-group>
          <el-button icon="Edit"
            @click="$router.push({ name: 'editchapter', params: { 'bookid': bookid, chapterid: chapter.id } })" />
          <el-button icon="Delete" @click="handleDelete(index, chapter, volume.id)" />
        </el-button-group>
      </p>
    </el-col>
  </el-row>
  <el-backtop />
</template>

<style scoped>
.summary {
  color: var(--ep-text-color-regular);
  font-size: 12px;
}
</style>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { BookService } from '~/utils/api'
import { Book, Chapter, Volume } from '~/models/book'
import { nl2br, intval } from '~/utils/tools'
import useOptionsStore from '~/stores/options'

const gostore = useOptionsStore()
gostore.headerIndex = 'chapters'

const route = useRoute()
const bookid = intval(route.params.bookid)

const editMode = ref(false)

// 当前操作的
const currentBook: Book = reactive({
  id: 0,
  title: '',
  author: '',
  summary: '',
  source: '',
})

// ***************** 删除 ***************** //
const handleDelete = (index: number, row: Chapter, volumeid: number) => {

  ElMessageBox.confirm(
    '确认删除章节 <' + row.title + '> 吗？注：删除后无法恢复。',
    currentBook.title,
    {
      confirmButtonText: '确定删除',
      confirmButtonClass: 'ep-button--danger',
      cancelButtonText: '不删除',
      type: 'warning',
    }
  )
    .then(() => {
      BookService.deleteChapter({ bookid: bookid, id: row.id })
        .then(() => {
          chapterData[volumeid].splice(index, 1)
          ElMessage.success('已经成功删除。')
        })
        .catch(
          err => {
            ElMessage.error('CHAPERR: 删除失败，请稍后重试。失败原因：' + (err.messge || err.msg))
          }
        )
    })
    .catch(() => {
      // 不删除
    })
}

// ***************** 下载 ***************** //
const handleDownload = () => {
  ElMessageBox.confirm(
    '确认下载图书 《' + currentBook.title + '》 吗？下载保存格式：txt。',
    currentBook.title,
    {
      confirmButtonText: '下载',
      cancelButtonText: '放弃',
      type: 'info',
    }
  )
    .then(() => {
      BookService.download({ id: bookid }, currentBook.title + '.txt')
    })
    .catch(() => {
      // 放弃下载
    })
}

// ***************** 章节 ***************** //
const chapterData = reactive({ string: [] })
const volumeData: Volume[] = reactive([])

const getChapters = () => {
  BookService.getChapters({ bookid: bookid }).then(
    resp => {

      volumeData.length = 0
      volumeData.push(...resp.data.volumes)

      for (var i in resp.data.items) {
        chapterData[i] = resp.data.items[i]
      }

      for (var j in resp.data.book) {
        currentBook[j] = resp.data.book[j]
      }

      gostore.book = currentBook
    }
  ).catch(
    err => {
      ElMessage.error('CHAPERR: ' + (err.messge || err.msg))
    }
  )
}

getChapters()
</script>