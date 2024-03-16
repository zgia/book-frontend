<template>
  <el-table v-loading="fsLoading" :header-row-class-name="tableHeadClass" :data="bookData" :highlight-current-row="true"
    tripe border>
    <el-table-column :label="$t('book.title')">
      <template #default="scope">
        <router-link :to="bookUrl(scope.row)" class="ep-link book-url font-500">{{ scope.row.title }}</router-link>
      </template>
    </el-table-column>
    <el-table-column :label="$t('book.category')" width="140" v-if="showAuthor">
      <template #default="scope">
        <router-link :to="categoryUrl(scope.row)" class="ep-link author-url">{{ categoryTitle(scope.row) }}</router-link>
      </template>
    </el-table-column>
    <el-table-column :label="$t('book.author')" width="140" v-if="showAuthor">
      <template #default="scope">
        <div v-if="scope.row.author"><router-link :to="authorUrl(scope.row)" class="ep-link author-url">{{
    scope.row.author }}</router-link></div>
        <div v-else>{{ $t('book.unkown_author') }}</div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('book.wordcount')" width="100" v-if="showAuthor">
      <template #default="scope">
        <div v-html="wc2Wan(scope.row.wordcount)"></div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('book.latest')" width="100" v-if="showAuthor">
      <template #default="scope">
        <div v-if="scope.row.done" :title="$t('book.finished_book')"><el-icon>
            <Check />
          </el-icon></div>
        <div :title="scope.row.latestChapter" v-else @click="handleDone(scope.$index, scope.row)"><small>{{
    latestChapter(scope.row) }}</small></div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('book.summary')" v-if="showSummary">
      <template #default="scope">
        <div style="text-align: left;" v-html="subSummary(scope.row.summary)"></div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('common.operation')" width="120">
      <template #default="scope">
        <el-button text size="small" icon="Edit" @click="handleEdit(scope.$index, scope.row)">{{ $t('book.op_edit')
          }}</el-button>
        <br />
        <el-button text size="small" icon="Delete" @click="handleDelete(scope.$index, scope.row)">{{
    $t('book.op_delete') }}</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="padding-top:15px;display: inline-flex" v-if="total">
    <el-pagination background layout="total, prev, pager, next" :pager-count="pagerCount" :page-size="gostore.pagesize"
      :small="pagerSmall" :total="total" v-model:current-page="page" @current-change="handleChangePage" />
  </div>
  <Suspense v-if="editBookVisible">
    <template #default>
      <editBookDialog :book="currentBook" :dgwidth="dgWidth" @hide="editBookVisible = false" @update="afterUpdated"
        @close-loading="closeLoading" />
    </template>
  </Suspense>
  <el-backtop />
</template>
<script lang="ts">
export default {
  // 直接载入带页码的URL
  beforeRouteEnter(to) {
    localStorage.topage = to.query.p ?? 1
    localStorage.keywords = to.query.q ?? ''
    localStorage.smode = to.query.sm ?? 'title'
  }
}
</script>
<script lang="ts" setup>
import { onBeforeRouteUpdate } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { BookService } from '~/http'
import { Book, wc2Wan } from '~/models'
import { intval, isEmpty, dialogWidth } from '~/utils'
import { useOptionsStore } from '~/stores'
import i18n from '~/locales';

const gostore = useOptionsStore()
gostore.headerIndex = 'books'
if (gostore.book) {
  gostore.book.id = 0
  gostore.book.title = ''
}

const router = useRouter()

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
// 总条目数
const total = ref(0)
// 5 | 7 | 9 | 11 | 13 | 15 | 17 | 19 | 21
const pagerCount = ref(7)
// 是否使用小型分页样式
const pagerSmall = ref(false)

// 搜索
const searchForm = reactive({ title: '', smode: 'title' })

// 翻页时，更新路由
page.value = intval(localStorage.topage)
onBeforeRouteUpdate(async (to, from) => {
  console.log('onBeforeRouteUpdate', to)

  if (to.fullPath == '/') {
    searchForm.title = ''
  }

  if (to.hash.startsWith('#newbook')) {
    // '#newbook'.length + 1 = 9
    getBookAfterAddedNewBook(intval(to.hash.substring(9)))
  }
  // 翻页
  else if (to.query.p !== from.query.p) {
    page.value = intval(to.query.p ?? 1)

    getBooks()
  }
  // 搜索
  else if (to.query.q !== from.query.q || to.query.sm !== from.query.sm) {
    searchForm.title = (to.query.q ?? '') + ''
    searchForm.smode = (to.query.sm ?? 'title') + ''
    getBooks()
  }

  else if (!to.query.sm) {
    searchForm.smode = 'title'
  }
})

// 调整页面宽度
const showSummary = ref(true)
const showAuthor = ref(true)
const dgWidth = ref('50%')
watch(() => gostore.clientWidth, (sw: number) => {
  showSummary.value = sw < 1024 ? false : true
  showAuthor.value = sw < 640 ? false : true

  // 小屏幕时，使用小型的页面导航
  pagerCount.value = sw < 640 ? 5 : 7
  pagerSmall.value = sw < 640 ? true : false

  // 小屏幕时，增大编辑图书对话框的宽度
  dgWidth.value = dialogWidth(sw)
}, { immediate: true, deep: true })

// ***************** 图书信息 ***************** //
const categoryTitle = (row: Book) => {
  return row.categoryid ? gostore.categoryMap[row.categoryid] : ''
}
const categoryUrl = (row: Book) => {
  return '/?sm=categ&q=' + row.categoryid
}
const bookUrl = (row: Book) => {
  return '/book/' + row.id + '/index'
}
const authorUrl = (row: Book) => {
  return '/?sm=author&q=' + row.author
}

// 取简介的第一行
const subSummary = (summary: string, len = 100) => {
  if (!summary) {
    return ''
  }

  const ss = summary.split('\n')
  return ss[0] ? ((ss[0].length > len) ? ss[0].substring(0, len) + '...' : ss[0]) : summary
}

// 是否完本、最新章节
const isDone = ref(false)
const latestChapter = (book: Book) => {
  if (book.done == 1) {
    isDone.value = true
    return ''
  }

  isDone.value = false

  // 不要章节名称，只要：第xxx章
  let lc = ''
  if (book.latestChapter) {
    // eslint-disable-next-line no-irregular-whitespace
    const match = book.latestChapter.match(/(.*?)(章|回|　| |:|：|、|）)/) || [book.latestChapter.substring(0, 9)]
    lc = match[0]
  }

  return lc
}

// 当前操作的图书
const currentBook: Book = reactive({ id: 0, title: '' })
const currentBookIdx = ref(0)

// ***************** 编辑 ***************** //
const editBookDialog = defineAsyncComponent(() => import('./EditBookDialog.vue'))
const editBookVisible = ref(false)

// 更新列表
const afterUpdated = (book: Book) => {
  if (currentBook.id == 0) {
    bookData.unshift(book)
  } else {
    bookData[currentBookIdx.value] = book
  }
}

const handleEdit = (index: number, row: Book) => {
  openLoading()

  for (var i in row) {
    currentBook[i] = row[i]
  }

  currentBookIdx.value = index
  editBookVisible.value = true
}

const handleDone = (index: number, row: Book) => {
  ElMessageBox.confirm(
    i18n.global.t('book.confirm_finish_book', { 'title': row.title }),
    row.title,
    {
      confirmButtonText: i18n.global.t('common.btn_done'),
      cancelButtonText: i18n.global.t('common.btn_cancel'),
      type: 'info',
    }
  )
    .then(() => {
      BookService.done({ id: row.id })
        .then(() => {
          row.done = 1
          ElMessage.success(i18n.global.t('book.book_finished_ok'))
        })
        .catch(err => {
          ElMessage.error(i18n.global.t('book.book_finished_error', { 'err': (err.messge || err.msg) }))
        })
    })
    .catch(() => {
      // 放弃
    })
}

// ***************** 删除 ***************** //
const handleDelete = (index: number, row: Book) => {

  ElMessageBox.confirm(
    i18n.global.t('book.confirm_delete_book', { 'title': row.title }),
    i18n.global.t('common.library'),
    {
      confirmButtonText: i18n.global.t('common.btn_delete'),
      confirmButtonClass: 'ep-button--danger',
      cancelButtonText: i18n.global.t('common.btn_cancel'),
      type: 'warning',
    }
  )
    .then(() => {
      BookService.deleteBook({ id: row.id })
        .then(() => {
          bookData.splice(index, 1)
          ElMessage.success(i18n.global.t('book.book_deleted_ok', { 'title': row.title }))
        })
        .catch(err => {
          ElMessage.error('BOOKERR: ' + i18n.global.t('common.deleted_error', { 'err': (err.messge || err.msg) }))
        })
    })
    .catch(() => {
      // 不删除
    })
}

// ***************** 翻页 ***************** //
const handleChangePage = (p: number) => {
  localStorage.topage = p

  let query = { 'p': p }
  if (searchForm.title) {
    query['q'] = searchForm.title
    query['sm'] = searchForm.smode
  }

  router.push({ name: 'books', query: query })
}

// ***************** 添加图书后，获取图书信息 ***************** //
const getBookAfterAddedNewBook = (bookid: number) => {
  if (bookid == 0) {
    return
  }

  BookService.getBook({ id: bookid })
    .then(resp => {
      afterUpdated(resp.data)

      total.value += 1
    })
    .catch(err => {
      ElMessage.error('NEWBOOKERR: ' + (err.messge || err.msg || err))
    })
}

// ***************** 列表 ***************** //
const bookData: Book[] = reactive([])
const getBooks = () => {

  if (!searchForm.title) {
    searchForm.title = isEmpty(localStorage.keywords) ? '' : localStorage.keywords.trim() + ''
    searchForm.smode = isEmpty(localStorage.smode) ? '' : localStorage.smode + ''
  }
  delete localStorage.keywords, localStorage.smode

  if (searchForm.smode == 'content') {
    // 搜索内容
    router.push({ name: 'search', query: { q: searchForm.title } })

  } else {

    BookService.list({ p: page.value, title: searchForm.title, smode: searchForm.smode })
      .then(resp => {
        const d = resp.data

        total.value = d.total

        bookData.length = 0
        bookData.push(...d.items)
      })
      .catch(err => {
        ElMessage.error('BOOKERR: ' + (err.messge || err.msg))
      })
  }
}

getBooks()
</script>
<style scoped>
.book-url {
  color: var(--ep-text-color-primary);
  font-size: 16px;
  text-decoration: none;
}

.book-url:hover {
  text-decoration: underline;
}

.author-url {
  color: var(--ep-text-color-primary);
  font-weight: normal;
  text-decoration: none;
}

.author-url:hover {
  text-decoration: underline;
}
</style>