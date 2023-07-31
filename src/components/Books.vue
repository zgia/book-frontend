<template>
  <el-form :inline="true" :model="searchForm" @submit.prevent @keyup.enter="handleSearch()" size="default">
    <el-form-item class="search-area">
      <el-input v-model="searchForm.title" placeholder="输入书名，比如：百年孤独">
        <template #prepend>
          <el-tooltip content="点击列出全部图书" placement="bottom-start">
            <el-button icon="Reading" @click="handleSearch(true)" class="btn-search" />
          </el-tooltip>
        </template>
        <template #append>
          <el-button icon="Search" @click="handleSearch()" class="btn-search" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button icon="Plus" @click="handleNew()" class="btn-search">新增图书</el-button>
    </el-form-item>
  </el-form>
  <el-table v-loading="fsLoading" :header-row-class-name="tableHeadClass" :data="bookData" :highlight-current-row="true"
    tripe border>
    <el-table-column label="书名">
      <template #default="scope">
        <el-link @click="readBook(scope.row)"><strong>{{ scope.row.title }}</strong></el-link>
      </template>
    </el-table-column>
    <el-table-column label="作者" width="140" v-if="showAuthor">
      <template #default="scope">
        <div v-if="scope.row.author">{{ scope.row.author }}</div>
        <div v-else>佚名</div>
      </template>
    </el-table-column>
    <el-table-column label="字数" width="100" v-if="showAuthor">
      <template #default="scope">
        <div v-html="wc2Wan(scope.row.wordcount)"></div>
      </template>
    </el-table-column>
    <el-table-column label="简介" v-if="showSummary">
      <template #default="scope">
        <div style="text-align: left;" v-html="subSummary(scope.row, 100)"></div>
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
    <el-pagination background layout="total, prev, pager, next" :pager-count="pagerCount" :page-size="gostore.pagesize"
      :total="total" :hide-on-single-page="true" :small="pagerSmall" v-model:current-page="page"
      @current-change="handlePageChange" />
  </div>
  <Suspense v-if="showEditDialog">
    <template #default>
      <editDialog :book="currentBook" :dgwidth="editDialogWidth" @hide="showEditDialog = false" @update="afterUpdated"
        @close-loading="closeLoading" />
    </template>
  </Suspense>
  <el-backtop />
</template>
<script lang="ts">
export default {
  // 直接载入带页码的URL
  beforeRouteEnter(to) {
    localStorage.topage = to.query.page ?? 1
  }
}
</script>

<script lang="ts" setup>
import { onBeforeRouteUpdate } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { BookService } from '~/utils/api'
import { Book } from '~/models/book'
import { intval, wc2Wan } from '~/utils/tools'
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

// 分页导航
const page = ref(1)
const total = ref(0)
const pagerCount = ref(7)
const pagerSmall = ref(false)

const router = useRouter()

// 翻页时，更新路由
page.value = intval(localStorage.topage)
onBeforeRouteUpdate(async (to, from) => {
  if (to.query.page !== from.query.page) {
    page.value = intval(to.query.page ?? 1)

    getBooks()
  }
})

// 调整页面宽度
const screenWidth = ref(document.body.clientWidth)
window.onresize = () => {
  screenWidth.value = document.body.clientWidth
}

const showSummary = ref(true)
const showAuthor = ref(true)
const editDialogWidth = ref('50%')
watch(screenWidth, (sw) => {
  showSummary.value = sw < 1024 ? false : true
  showAuthor.value = sw < 640 ? false : true
  // 小屏幕时，增大编辑图书对话框的宽度
  editDialogWidth.value = sw < 640 ? '90%' : '50%'
  // 小屏幕时，使用小型的页面导航
  pagerCount.value = sw < 640 ? 3 : 7
  pagerSmall.value = sw < 640 ? true : false
}, { immediate: true, deep: true })

// 取简介的第一行
const subSummary = (book: Book, len: number) => {
  let su = ''
  if (book.summary) {
    const ss = book.summary.split('\n')
    if (ss[0]) {
      su = ss[0] ? ((ss[0].length > len) ? ss[0].substring(0, len) + '......' : ss[0]) : ''
    }
  }
  return su + (su ? '<br />' : '') + '最新：' + book.latestChapter
}

// 搜索
const searchForm = reactive({ title: '' })
const handleSearch = (all = false) => {
  if (all) {
    searchForm.title = ''
  }
  getBooks()
}

// 当前操作的
const currentBook: Book = reactive({ id: 0, title: '' })
const currentBookIdx = ref(0)

// ***************** 新建/编辑 ***************** //
const EditDialog = defineAsyncComponent(() => import('./EditBook.vue'))
const showEditDialog = ref(false)

// 更新列表
const afterUpdated = (book: Book) => {
  if (currentBook.id == 0) {
    bookData.unshift(book)
  } else {
    bookData[currentBookIdx.value] = book
  }
}

const handleNew = () => {
  const row: Book = {
    id: 0,
    title: '',
    author: '',
    summary: '',
    source: ''
  }

  openEditDialog(0, row)
}

const handleEdit = (index: number, row: Book) => {
  openEditDialog(index, row)
}

const openEditDialog = (index: number, row: Book) => {
  openLoading()

  for (var i in row) {
    currentBook[i] = row[i]
  }

  currentBookIdx.value = index
  showEditDialog.value = true
}

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
          bookData.splice(index, 1)
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

// ***************** 某本书 ***************** //
const readBook = (row: Book) => {
  router.push({ name: 'chapters', params: { 'bookid': row.id } })
}

// ***************** 翻页 ***************** //
const handlePageChange = (val: number) => {
  router.push({ name: 'books', query: { 'page': val } })
}

// ***************** 列表 ***************** //
const bookData: Book[] = reactive([])
const getBooks = () => {
  let title = searchForm.title || ''
  BookService.list({ p: page.value, title: title }).then(
    resp => {
      const d = resp.data

      total.value = d.total

      bookData.length = 0
      bookData.push(...d.items)
    }
  ).catch(
    err => {
      ElMessage.error('BOOKERR: ' + (err.messge || err.msg))
    }
  )
}

getBooks()
</script>