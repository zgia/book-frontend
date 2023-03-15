<template>
  <h1>卷管理 <xxsmall>{{ currentBook.title }}</xxsmall>
  </h1>
  <el-row>
    <el-col :span="24" style="text-align: right;padding-bottom: 10px;">
      <el-button type="primary" icon="Plus" @click="handleCreation()" class="btn-search">新增卷</el-button>
    </el-col>
  </el-row>
  <el-table v-loading="fsLoading" :header-row-class-name="tableHeadClass" :data="tableData" :highlight-current-row="true"
    stripe border>
    <el-table-column prop="title" label="卷名" />
    <el-table-column label="简介">
      <template #default="scope">
        <div style="text-align:left;line-height:40px;font-size:larger;" v-html="nl2br(scope.row.summary)" />
      </template>
    </el-table-column>
    <el-table-column label="管理">
      <template #default="scope">
        <el-button-group>
          <el-button size="small" icon="Edit" @click="handleEdit(scope.$index, scope.row)" />
          <el-button size="small" icon="Delete" type="danger" @click="handleDelete(scope.$index, scope.row)" />
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
  <Suspense v-if="showCreationDialog">
    <template #default>
      <creationDialog :volume="currentVolume.row" @hide="showCreationDialog = false" @update="afterUpdated"
        @close-loading="closeLoading" />
    </template>
  </Suspense>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { BookService } from '~/utils/api'
import { Book, Volume } from '~/models/book'
import { nl2br, intval } from '~/utils/tools'
import useOptionsStore from '~/stores/options'

const gostore = useOptionsStore()
gostore.headerIndex = 'volumes'

const route = useRoute()
const bookid = intval(route.params.bookid)

const tableHeadClass = () => { return 'table-head' }

// 加载动画
const fsLoading = ref(false)
const openLoading = () => {
  fsLoading.value = true
}
const closeLoading = () => {
  fsLoading.value = false
}

const currentBook: Book = reactive({
  id: 0,
  title: '',
})

// 当前操作的
const currentVolume = reactive({
  row: null as Volume | null,
})

// ***************** 新建 ***************** //
const creationDialog = defineAsyncComponent(() => import('./EditVolume.vue'))
const showCreationDialog = ref(false)

// 打开新建对话框
const handleCreation = () => {
  openLoading()

  currentVolume.row = { id: 0, bookid: bookid, title: '' }

  showCreationDialog.value = true
}

const afterUpdated = (vol: Volume) => {
  if (currentVolume.row.id == 0) {
    tableData.push(vol)
  } else {
    currentVolume.row.title = vol.title
    currentVolume.row.summary = vol.summary
  }
}

const handleEdit = (index: number, row: Volume) => {
  row.bookid = bookid
  currentVolume.row = row

  openLoading()
  showCreationDialog.value = true
}
// ***************** 编辑 ***************** //


// ***************** 删除 ***************** //
const handleDelete = (index: number, row) => {

  ElMessageBox.confirm(
    '确认删除图书卷 <' + row.title + '> 吗？注：删除后无法恢复。',
    currentBook.title,
    {
      confirmButtonText: '确定删除',
      confirmButtonClass: 'ep-button--danger',
      cancelButtonText: '不删除',
      type: 'warning',
    }
  )
    .then(() => {
      BookService.deleteVolume({ bookid: bookid, id: row.id })
        .then(() => {
          tableData.splice(index, 1)
          ElMessage.success('已经成功删除。')
        })
        .catch(
          err => {
            ElMessage.error('VOLDERR: 删除失败，请稍后重试。失败原因：' + (err.messge || err.msg))
          }
        )
    })
    .catch(() => {
      // 不删除
    })
}
// ***************** 删除 ***************** //


const tableData: Volume[] = reactive([])

const getVolumes = () => {
  BookService.getVolumes({ bookid: bookid }).then(
    resp => {
      const d = resp.data

      tableData.length = 0
      tableData.push(...d.items)

      currentBook.id = bookid
      currentBook.title = d.book.title

      if (!gostore.book) {
        gostore.book = currentBook
      }
    }
  ).catch(
    err => {
      ElMessage.error('VOLSERR: ' + (err.messge || err.msg))
    }
  )
}

getVolumes()
</script>