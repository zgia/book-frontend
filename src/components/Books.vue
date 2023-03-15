<template>
  <el-form :inline="true" size="default" :model="searchForm" style="padding:0 5px;">
    <el-form-item class="search-area">
      <el-input v-model="searchForm.title" placeholder="输入书名，比如：百年孤独">
        <template #prepend>书名</template>
        <template #append>
          <el-button icon="Search" @click="onSearch()" class="btn-search" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="Reading" @click="onSearchAll()" class="btn-search">全部图书</el-button>
      <el-button type="primary" icon="Plus" @click="handleCreation()" class="btn-search">新增图书</el-button>
    </el-form-item>
  </el-form>
  <el-table v-loading="fsLoading" :header-row-class-name="tableHeadClass" :data="tableData" :highlight-current-row="true"
    tripe border>
    <el-table-column label="书名">
      <template #default="scope">
        <el-link @click="$router.push({ name: 'chapters', params: { 'bookid': scope.row.id } })"><strong>{{
          scope.row.title }}</strong></el-link>
      </template>
    </el-table-column>
    <el-table-column prop="author" label="作者" width="140" v-if="showAuthor" />
    <el-table-column label="简介" v-if="showSummary">
      <template #default="scope">
        <div style="text-align: left;" v-if="scope.row.summary" v-html="nl2br(subSummary(scope.row.summary, 100))"></div>
      </template>
    </el-table-column>
    <el-table-column label="管理" width="100">
      <template #default="scope">
        <el-button-group>
          <el-button size="small" icon="Edit" @click="handleEdit(scope.$index, scope.row)" />
          <el-button size="small" icon="Delete" @click="handleDelete(scope.$index, scope.row)" />
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
  <div style="padding-top:15px;display: inline-flex" v-if="total">
    <el-pagination background layout="total, prev, pager, next" :page-size="gostore.perpage" :total="total"
      :hide-on-single-page="true" v-model:current-page="page" @current-change="handlePageChange" />
  </div>
  <Suspense v-if="showCreationDialog">
    <template #default>
      <creationDialog :book="currentBook.row" :dgwidth="editBookDialogWidth" @hide="showCreationDialog = false"
        @update="afterUpdated" @close-loading="closeLoading" />
    </template>
  </Suspense>
  <el-backtop />
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { BookService } from '~/utils/api'
import { Book } from '~/models/book'
import { intval, nl2br } from '~/utils/tools'
import useOptionsStore from '~/stores/options'

const gostore = useOptionsStore()
gostore.headerIndex = 'books'
if (gostore.book) {
  gostore.book.title = ''
}

// 加载动画
const fsLoading = ref(false)
const openLoading = () => {
  fsLoading.value = true
}
const closeLoading = () => {
  fsLoading.value = false
}

// 表格标题行样式
const tableHeadClass = () => { return 'table-head' }

const screenWidth = ref(document.body.clientWidth)
window.onresize = () => {
  return (() => {
    screenWidth.value = document.body.clientWidth
  })()
}

const showSummary = ref(true)
const showAuthor = ref(true)
const editBookDialogWidth = ref('50%')
watch(screenWidth, (sw) => {
  console.log('screenWidth: ' + sw)
  showSummary.value = sw < 1024 ? false : true
  showAuthor.value = sw < 640 ? false : true
  // 小屏幕时，增大编辑图书对话框的宽度
  editBookDialogWidth.value = sw < 640 ? '90%' : '50%'
}, { immediate: true, deep: true })

// 分页导航
const page = ref(1)
const total = ref(0)

const router = useRouter()

let routeUpdated = false
onBeforeRouteUpdate(async (to, from) => {
  if (to.query.page !== from.query.page) {
    const p = intval(to.query.page)
    page.value = p ? p : 1

    routeUpdated = true
    getBooks()

    window.scrollTo(0, 0)
  }
})

// 当前操作的
const currentBook = reactive({
  row: null as Book | null
})

const subSummary = (summary: string, length: number) => {
  return summary ? ((summary.length > length) ? summary.substring(0, length) + '......' : summary) : ''
}

// 搜索
const searchForm = reactive({ title: '' })
const onSearch = () => {
  getBooks()
}
const onSearchAll = () => {
  searchForm.title = ''
  getBooks()
}

// ***************** 新建 ***************** //
const creationDialog = defineAsyncComponent(() => import('./EditBook.vue'))
const showCreationDialog = ref(false)
// 打开新建对话框
const handleCreation = () => {
  openLoading()

  currentBook.row = { id: 0, title: '' }

  showCreationDialog.value = true
}

// 更新列表
const afterUpdated = (book: Book) => {

  if (currentBook.row?.id == 0) {
    let newp: Book = {
      id: book.id,
      title: book.title,
      author: book.author,
      summary: book.summary,
    }

    tableData.unshift(newp)
  } else {
    currentBook.row.title = book.title
    currentBook.row.author = book.author
    currentBook.row.summary = book.summary
  }
}
const handleEdit = (index: number, row: Book) => {
  openLoading()

  currentBook.row = row

  showCreationDialog.value = true
}
// ***************** 编辑 ***************** //


// ***************** 删除 ***************** //
const handleDelete = (index: number, row: Book) => {

  ElMessageBox.confirm(
    '确认删除图书 《' + row.title + '》 吗？注：删除后无法恢复。',
    '图书馆',
    {
      confirmButtonText: '确定删除',
      confirmButtonClass: 'ep-button--danger',
      cancelButtonText: '不删除',
      type: 'warning',
    }
  )
    .then(() => {
      BookService.deleteBook({ id: row.id })
        .then(() => {
          tableData.splice(index, 1)
          ElMessage.success('已经成功删除。')
        })
        .catch(
          err => {
            ElMessage.error('BOOKERR: 删除失败，请稍后重试。失败原因：' + (err.messge || err.msg))
          }
        )
    })
    .catch(() => {
      // 不删除
    })
}
// ***************** 删除 ***************** //

// ***************** 翻页 ***************** //
const handlePageChange = (val: number) => {
  router.push({ name: 'books', query: { 'page': val } })
}
// ***************** 翻页 ***************** //


const tableData: Book[] = reactive([])

const getBooks = () => {
  let title = searchForm.title || ''
  BookService.list({ p: page.value, title: title }).then(
    resp => {
      const d = resp.data

      total.value = d.total

      tableData.length = 0
      tableData.push(...d.items)
    }
  ).catch(
    err => {
      ElMessage.error('BOOKERR: ' + (err.messge || err.msg))
    }
  )
}

// 使用 outer.beforeEach 传递的 to.query
if (!routeUpdated) {
  page.value = intval(localStorage.topage)
}
getBooks()
</script>