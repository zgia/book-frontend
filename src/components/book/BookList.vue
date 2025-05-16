<template>
  <div class="book-categ">
    <el-segmented
      v-model="searchForm.q"
      :options="categories"
      size="small"
      block
      @change="handleChangeCateg"
      style="margin-bottom: 5px"
    >
      <template #default="{ item }">
        <div class="hidden-xs-only" v-if="isObject(item)">
          {{ item.value ? item.label : $t('book.all_category') }}
          <small class="hidden-sm-and-down">({{ item.total }})</small></div
        >
        <div class="hidden-sm-and-up" v-if="isObject(item) && item.value">{{
          item.small
        }}</div>
        <div class="hidden-sm-and-up" v-else
          ><el-icon> <IconoirBook /> </el-icon
        ></div>
      </template>
    </el-segmented>
  </div>
  <el-table
    v-loading="fsLoading"
    ref="tableRef"
    :header-row-class-name="tableHeadClass"
    :data="bookData"
    :highlight-current-row="true"
    :default-sort="defaultSort"
    @sort-change="handleSortChange"
    tripe
    border
  >
    <el-table-column
      label="ID"
      width="80"
      :sort-orders="sortOrders"
      prop="id"
      sortable="custom"
    >
      <template #default="scope"> {{ scope.row.id }} </template>
    </el-table-column>
    <el-table-column :label="$t('book.title')">
      <template #default="scope">
        <router-link :to="bookUrl(scope.row)" class="ep-link book-url font-500"
          >{{ scope.row.title }}
          <div v-if="scope.row.alias" style="font-size: 12px">{{
            scope.row.alias
          }}</div>
        </router-link>
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('book.rate')"
      width="100"
      v-if="showRate"
      prop="rate"
      column-key="rate"
      :filters="rateFilters"
      :filter-method="handleRateFilter"
      :sort-orders="sortOrders"
      sortable="custom"
    >
      <template #default="scope">
        <div
          @click="handleRate(scope.$index, scope.row)"
          class="ep-rate book-rate"
        >
          <div
            :title="$t('book.stars_x', { star: scope.row.rate })"
            v-if="scope.row.rate"
          >
            <el-icon>
              <component :is="iconRate(scope.row)" />
            </el-icon>
          </div>
          <div :title="$t('book.rate')" v-else>
            <el-icon>
              <IconoirStarDashed />
            </el-icon>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('book.category')" width="100" v-if="showAuthor">
      <template #default="scope">
        <router-link :to="categoryUrl(scope.row)" class="ep-link author-url">
          <el-tag round :type="bookTag(scope.row)">{{ bookCategory(scope.row) }}</el-tag>
        </router-link>
      </template>
    </el-table-column>
    <el-table-column :label="$t('book.author')" width="120" v-if="showAuthor">
      <template #default="scope">
        <div v-if="scope.row.author">
          <router-link :to="authorUrl(scope.row)" class="ep-link author-url">{{
            scope.row.author
          }}</router-link>
        </div>
        <div v-else>{{ $t('book.unkown_author') }}</div>
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('book.wordcount')"
      width="100"
      v-if="showWordcount"
      :sort-orders="sortOrders"
      prop="wordcount"
      sortable="custom"
    >
      <template #default="scope">
        <div class="book-wordcount" :title="scope.row.wordcount">{{
          wc2Wan(scope.row.wordcount)
        }}</div>
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('book.latest')"
      width="120"
      v-if="showAuthor"
      :sort-orders="sortOrders"
      prop="updatedat"
      sortable="custom"
    >
      <template #default="scope">
        <div v-if="scope.row.isfinished" :title="$t('book.finished_book')">
          <el-icon>
            <IconoirCheckCircled />
          </el-icon>
        </div>
        <div :title="scope.row.latest" v-else
          ><small>{{ latestChapter(scope.row) }}</small></div
        >
      </template>
    </el-table-column>
    <el-table-column :label="$t('book.summary')" v-if="showSummary">
      <template #default="scope">
        <div class="book-summary" v-html="subSummary(scope.row.summary)"></div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('common.operation')" width="120">
      <template #default="scope">
        <el-button
          text
          size="small"
          icon="IconoirEdit"
          @click="handleEdit(scope.$index, scope.row)"
          >{{ $t('book.op_edit') }}</el-button
        >
        <br />
        <el-popover
          trigger="click"
          placement="left"
          :width="90"
          popperClass="small-popper-rate"
        >
          <div>
            <p v-if="!scope.row.isfinished">
              <el-button
                text
                size="small"
                icon="IconoirCheck"
                @click="handleFinish(scope.$index, scope.row)"
                >{{ $t('book.op_finish') }}</el-button
              >
            </p>
            <p>
              <el-button
                text
                size="small"
                icon="IconoirEmoji"
                @click="handleRate(scope.$index, scope.row)"
                >{{ $t('book.op_rate') }}</el-button
              >
            </p>
            <p>
              <el-button
                text
                size="small"
                type="danger"
                icon="IconoirTrash"
                @click="handleDelete(scope.$index, scope.row)"
                >{{ $t('book.op_delete') }}</el-button
              >
            </p>
          </div>
          <template #reference>
            <el-button text size="small" icon="IconoirMore">{{
              $t('book.op_more')
            }}</el-button>
          </template>
        </el-popover>
      </template>
    </el-table-column>
  </el-table>
  <div style="padding-top: 15px; display: inline-flex" v-if="total">
    <el-pagination
      background
      layout="total, prev, pager, next"
      :pager-count="pagerCount"
      :page-size="gostore.pagesize"
      :small="pagerSmall"
      :total="total"
      v-model:current-page="page"
      @current-change="handleChangePage"
    />
  </div>
  <el-backtop />
  <editBookDialog
    v-if="editBookVisible"
    :book="currentBook"
    :dgwidth="dgWidth"
    @hide="editBookVisible = false"
    @update="afterBookUpdated"
    @close-loading="closeLoading"
  />
</template>
<script lang="ts" setup>
  import { h, onMounted } from 'vue'
  // eslint-disable-next-line vue/prefer-import-from-vue
  import { isObject } from '@vue/shared'
  import { onBeforeRouteUpdate } from 'vue-router'
  import { ElMessage, ElMessageBox, ElRate, TableInstance } from 'element-plus'
  import { BookService } from '~/http'
  import { Book, wc2Wan, santSearchMode } from '~/models'
  import {
    cleanShallow,
    intval,
    isEmpty,
    dialogWidth,
    defaultDialogWidth,
  } from '~/utils'
  import { useOptionsStore } from '~/stores'
  import { _t } from '~/locales'

  const gostore = useOptionsStore()
  gostore.headerIndex = 'booklist'
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
  const tableHeadClass = () => {
    return 'table-head'
  }

  // 分页导航
  const page = ref(intval(localStorage.getItem('topage')))
  // 总条目数
  const total = ref(0)
  // 5 | 7 | 9 | 11 | 13 | 15 | 17 | 19 | 21
  const pagerCount = ref(7)
  // 是否使用小型分页样式
  const pagerSmall = ref(false)

  const searchForm = reactive({
    p: 1,
    q: '',
    sm: '',
    ob: '', // 排序列
    dt: '', // 排序方向
    rate: '', // 列出指定评分
  })

  // 翻页时，更新路由
  onBeforeRouteUpdate(async (to, from) => {
    console.log('onBeforeRouteUpdate', to, from)

    if (to.fullPath === '/') {
      searchForm.p = 1
      searchForm.q = ''
      searchForm.sm = ''
      searchForm.ob = ''
      searchForm.dt = ''
      searchForm.rate = ''

      clearFilter()
      clearSort()
    }

    if (!from.query.q) {
      from.query.q = ''
    }
    if (!from.query.sm) {
      from.query.sm = ''
    }

    // 添加新书，不做判断直接加到当前页的顶部
    if (to.hash.startsWith('#newbook')) {
      // '#newbook=123456'
      getBookAfterAddedBook(intval(to.hash.substring(9)))
    }
    // 搜索（改变关键字或者搜索类型）
    else if (to.query.q !== from.query.q || to.query.sm !== from.query.sm) {
      searchForm.p = 1
      searchForm.q = to.query.q?.toString() ?? ''
      searchForm.sm = santSearchMode(`${to.query.sm}`)

      getBooks()
    }
    // 排序
    else if (to.query.ob !== from.query.ob || to.query.dt !== from.query.dt) {
      getBooks()
    }
    // 翻页
    else if (to.query.p !== from.query.p) {
      searchForm.p = intval(to.query.p?.toString() ?? 1)

      getBooks()
    }
  })

  // 调整页面宽度
  const showSummary = ref(true)
  const showAuthor = ref(true)
  const showRate = ref(true)
  const showWordcount = ref(true)
  const dgWidth = ref(defaultDialogWidth)
  watch(
    () => gostore.clientWidth,
    (sw: number) => {
      showSummary.value = sw > 1024
      showAuthor.value = sw > 768
      showRate.value = sw > 640
      showWordcount.value = sw > 640

      // 小屏幕时，使用小型的页面导航
      pagerCount.value = sw < 768 ? 5 : 7
      pagerSmall.value = sw < 768

      // 小屏幕时，增大编辑图书对话框的宽度
      dgWidth.value = dialogWidth(sw)
    },
    { immediate: true, deep: true }
  )

  // ***************** 分类导航 ***************** //
  const allTotal = ref(0)
  const categories = reactive([]) as any
  gostore.categories.forEach((val) => {
    categories.push({
      label: val.title,
      value: `${val.id}`,
      total: val.bookcount || 0,
      small: val.title.substring(0, 1),
    })

    allTotal.value += val.bookcount || 0
  })
  categories.unshift({
    label: _t('book.all_category'),
    value: '',
    total: allTotal.value,
    small: 'All',
  })

  const handleChangeCateg = (categ: string) => {
    if (categ) {
      searchForm.p = 1
      searchForm.q = categ
      searchForm.sm = 'categ'

      router.push({ name: 'booklist', query: searchForm })
    } else {
      router.push({ name: 'booklist' })
    }
  }

  // ***************** 图书信息 ***************** //
  const bookTag = (row: Book) => {
    let tag = 'primary'
    switch (row.categoryid) {
      case 8:
      case 3:
        tag = 'danger'
        break;
      case 6:
      case 7:
        tag = 'success'
        break;
      case 2:
      case 5:
        tag = 'warning'
        break;
      case 10:
        tag = 'info'
        break;
      default:
        tag = 'primary'
        break;
    }

    return tag
  }
  const bookCategory = (row: Book) => {
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
    return ss[0]
      ? ss[0].length > len
        ? ss[0].substring(0, len) + '...'
        : ss[0]
      : summary
  }

  // 是否完本、最新章节
  const isFinished = ref(false)
  const latestChapter = (book: Book) => {
    if (book.isfinished === 1) {
      isFinished.value = true
      return ''
    }

    isFinished.value = false

    // 不要章节名称，只要：第xxx章
    let lc = ''
    if (book.latest) {
      // eslint-disable-next-line no-irregular-whitespace
      const match = book.latest.match(/(.*?)(章|回|　| |:|：|、|）)/) || [
        book.latest.substring(0, 9),
      ]
      lc = match[0]
    }

    return lc
  }

  // 当前操作的图书
  const currentBook: Book = reactive({ id: 0, title: '' })
  const currentBookIdx = ref(0)

  // ***************** 编辑 ***************** //
  const editBookDialog = defineAsyncComponent(
    () => import('./EditBookDialog.vue')
  )
  const editBookVisible = ref(false)

  // 更新列表
  const afterBookUpdated = (book: Book) => {
    if (currentBook.id === 0) {
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

  const handleFinish = (index: number, row: Book) => {
    ElMessageBox.confirm(
      _t('book.confirm_finish_book', { title: row.title }),
      row.title,
      {
        buttonSize: 'small',
        showClose: false,
        confirmButtonText: _t('common.btn_finish'),
        cancelButtonText: _t('common.btn_cancel'),
        type: 'info',
      }
    )
      .then(() => {
        BookService.finish({ id: row.id })
          .then(() => {
            row.isfinished = 1
            ElMessage.success(_t('book.book_finished_ok'))
          })
          .catch((err) => {
            ElMessage.error(
              _t('book.book_finished_error', { err: err.messge || err.msg })
            )
          })
      })
      .catch(() => {
        // 放弃
      })
  }

  // ***************** 评分 ***************** //
  const iconRate = (row: Book) => {
    return 'IconoirRate' + row.rate
  }
  const rateVal = ref(0)
  const handleRate = (index: number, row: Book) => {
    rateVal.value = row.rate ?? 0

    ElMessageBox({
      title: _t('book.msgbox_rate_book_title'),
      message: () =>
        h(ElRate, {
          'modelValue': rateVal.value,
          'onUpdate:modelValue': (val: number) => {
            rateVal.value = val
          },
        }),
      customClass: 'small-msgbox-rate',
      center: true,
      buttonSize: 'small',
      showCancelButton: true,
      showClose: false,
      confirmButtonText: _t('common.btn_ok'),
      cancelButtonText: _t('common.btn_cancel'),
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          BookService.rateBook({ id: row.id, rate: rateVal.value })
            .then(() => {
              row.rate = rateVal.value
              ElMessage.success(
                _t('book.book_rated_ok', {
                  title: row.title,
                  rate: rateVal.value,
                })
              )
            })
            .catch((err) => {
              ElMessage.error(
                _t('book.book_rated_error', { err: err.messge || err.msg })
              )
            })
        }

        done()
      },
    }).then((action) => {
      console.log(`action: ${action}`)
    })
  }

  // ***************** 删除 ***************** //
  const handleDelete = (index: number, row: Book) => {
    ElMessageBox.confirm(
      _t('book.confirm_delete_book', { title: row.title }),
      _t('common.library'),
      {
        buttonSize: 'small',
        showClose: false,
        confirmButtonText: _t('common.btn_delete'),
        confirmButtonClass: 'ep-button--danger',
        cancelButtonText: _t('common.btn_cancel'),
        type: 'warning',
      }
    )
      .then(() => {
        BookService.deleteBook({ id: row.id })
          .then(() => {
            bookData.splice(index, 1)
            ElMessage.success(_t('book.book_deleted_ok', { title: row.title }))
          })
          .catch((err) => {
            ElMessage.error(
              'BOOKERR: ' +
                _t('common.deleted_error', { err: err.messge || err.msg })
            )
          })
      })
      .catch(() => {
        // 不删除
      })
  }

  // ***************** 翻页 ***************** //
  const handleChangePage = (p: number) => {
    searchForm.p = p

    console.log('handleChangePage', searchForm, cleanShallow(searchForm))
    router.push({ name: 'booklist', query: searchForm })
  }

  // ***************** 添加图书后，获取图书信息 ***************** //
  const getBookAfterAddedBook = (bookid: number) => {
    if (bookid === 0) {
      return
    }

    BookService.getBook({ id: bookid })
      .then((resp) => {
        afterBookUpdated(resp.data)

        total.value += 1
      })
      .catch((err) => {
        ElMessage.error('NEWBOOKERR: ' + (err.messge || err.msg || err))
      })
  }

  const defaultSort: { prop: string; order: 'descending' | 'ascending' } = {
    prop: 'updatedat',
    order: 'descending',
  }
  const sortOrders: Array<'descending' | 'ascending' | null> = [
    'descending',
    'ascending',
    null,
  ]
  const handleSortChange = ({ column, prop, order }) => {
    console.log(
      'handleSortChange',
      column['property'],
      column['order'],
      prop,
      order
    )

    if (
      isEmpty(searchForm.ob) &&
      isEmpty(searchForm.dt) &&
      prop === 'updatedat' &&
      order === 'descending'
    ) {
      return
    }

    if (isEmpty(order)) {
      prop = null
    }
    searchForm.ob = prop
    searchForm.dt = order

    router.push({ name: 'booklist', query: searchForm })
  }

  const rateFilters = [
    { text: '5 分', value: '5' },
    { text: '4 分', value: '4' },
    { text: '3 分', value: '3' },
    { text: '2 分', value: '2' },
    { text: '1 分', value: '1' },
    { text: '未评分', value: '0' },
  ]
  const handleRateFilter = (value: any, row: any, column: any) => {
    console.log(
      'handleRateFilter',
      value,
      column['property'],
      row[column['property']]
    )

    // return `${row[column['property']]}` === value
    return true
  }

  const clearSort = () => {
    tableRef.value!.clearSort()
  }
  const clearFilter = () => {
    tableRef.value!.clearFilter()
  }

  const tableRef = ref<TableInstance>()
  // ***************** 列表 ***************** //
  const bookData: Book[] = reactive([])
  const getBooks = () => {
    page.value = intval(searchForm.p)
    localStorage.setItem('topage', `${searchForm.p}`)

    if (searchForm.sm === 'content') {
      // 搜索内容
      router.push({ name: 'search', query: { q: searchForm.q } })
    } else {
      console.log('getBooks', searchForm)

      BookService.list(searchForm)
        .then((resp) => {
          const d = resp.data

          total.value = d.total

          bookData.length = 0
          bookData.push(...d.items)
        })
        .catch((err) => {
          ElMessage.error('BOOKERR: ' + (err.messge || err.msg))
        })
    }
  }

  onMounted(() => {
    const { q, sm, p = 1, ob, dt, rate } = router.currentRoute.value.query

    searchForm.q = q?.toString() || ''
    searchForm.p = intval(p)
    searchForm.sm = sm?.toString() || ''
    searchForm.ob = ob?.toString() || ''
    searchForm.dt = dt?.toString() || ''
    searchForm.rate = rate?.toString() || ''

    console.log('BookList.onMounted', searchForm)

    getBooks()
  })
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
    font-size: smaller;
    text-decoration: none;
  }

  .author-url:hover {
    text-decoration: underline;
  }

  .book-summary {
    text-align: left;
    font-size: smaller;
  }

  .book-wordcount {
    font-size: smaller;
  }

  .book-rate {
    cursor: pointer;
  }

  .book-rate .ep-icon:hover {
    color: var(--ep-rate-fill-color);
    transform: scale(1.15);
  }

  .book-categ .ep-segmented {
    --ep-segmented-item-selected-color: var(--ep-color-white);
    --ep-segmented-item-selected-bg-color: var(--ep-color-primary);
    --ep-border-radius-base: 10px;
  }

  .book-categ .ep-segmented :deep(.ep-segmented__item.is-selected) {
    font-weight: 900;
  }
</style>
<style>
  .small-msgbox-rate {
    width: 300px !important;
  }

  .small-popper-rate {
    min-width: 90px !important;
  }
</style>
