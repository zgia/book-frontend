<template>
  <el-form
    :inline="true"
    :model="searchForm"
    ref="searchFormRef"
    :rules="rules"
    @submit.prevent
    @keyup.enter="submitForm()"
    size="default"
  >
    <el-form-item class="search-area" prop="q">
      <el-input
        size="large"
        v-model.trim="searchForm.q"
        :placeholder="$t('author.search_placeholder')"
      >
        <template #append>
          <el-button
            icon="IconoirSearch"
            @click="submitForm()"
            class="btn-search"
          />
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <el-table
    v-loading="fsLoading"
    :header-row-class-name="tableHeadClass"
    :data="authorData"
    :highlight-current-row="true"
    tripe
    border
  >
    <el-table-column :label="$t('author.name')" width="200">
      <template #default="scope"> {{ scope.row.name }} </template>
    </el-table-column>
    <el-table-column :label="$t('author.former_name')" v-if="showAuthor">
      <template #default="scope"> {{ scope.row.former_name || '-' }} </template>
    </el-table-column>
    <el-table-column :label="$t('author.books')" v-if="showAuthor">
      <template #default="scope">
        <div v-for="book in scope.row.books" :key="book.id">
          <router-link :to="bookUrl(book.id)" class="ep-link author-url">
            <el-icon class="book-icon">
              <IconoirBook />
            </el-icon>
            {{ book.title }}
          </router-link>
        </div>
        <div v-if="!scope.row.books">-</div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('common.operation')" width="120">
      <template #default="scope">
        <el-button
          text
          size="small"
          icon="IconoirEdit"
          @click="handleEdit(scope.$index, scope.row)"
          >{{ $t('common.btn_edit') }}</el-button
        >
        <br />
        <el-button
          text
          size="small"
          type="danger"
          icon="IconoirTrash"
          @click="handleDelete(scope.$index, scope.row)"
          >{{ $t('common.btn_delete') }}</el-button
        >
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
  <editAuthorDialog
    v-if="editAuthorVisible"
    @hide="editAuthorVisible = false"
    v-model="current.author"
    :dgwidth="dgWidth"
    @update="afterAuthorUpdated"
    @close-loading="closeLoading"
  />
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue'
  import {
    ElMessage,
    ElMessageBox,
    FormInstance,
    FormRules,
  } from 'element-plus'
  import { AuthorService } from '~/http'
  import { Author } from '~/models'
  import { intval, dialogWidth, defaultDialogWidth } from '~/utils'
  import { useOptionsStore } from '~/stores'
  import { _t } from '~/locales'

  const gostore = useOptionsStore()

  const router = useRouter()

  // 加载动画
  const fsLoading = ref(false)
  const openLoading = () => {
    fsLoading.value = true
  }
  const closeLoading = () => {
    fsLoading.value = false
  }

  const searchFormRef = ref<FormInstance>()
  const searchForm = reactive({
    p: 0 as any,
    q: '' as any,
  })
  const rules = reactive<FormRules>({})
  const submitForm = async () => {
    getAuthors()
  }

  // 表格标题行样式
  const tableHeadClass = () => {
    return 'table-head'
  }

  // 分页导航
  const page = ref(0)
  // 总条目数
  const total = ref(0)
  // 5 | 7 | 9 | 11 | 13 | 15 | 17 | 19 | 21
  const pagerCount = ref(7)
  // 是否使用小型分页样式
  const pagerSmall = ref(false)

  // 调整页面宽度
  const showAuthor = ref(true)
  const dgWidth = ref(defaultDialogWidth)
  watch(
    () => gostore.clientWidth,
    (sw: number) => {
      showAuthor.value = sw > 640

      // 小屏幕时，使用小型的页面导航
      pagerCount.value = sw < 640 ? 5 : 7
      pagerSmall.value = sw < 640

      // 小屏幕时，增大编辑图书对话框的宽度
      dgWidth.value = dialogWidth(sw)
    },
    { immediate: true, deep: true },
  )

  // ***************** 图书信息 ***************** //
  const bookUrl = (bookId) => {
    return `/book/${bookId}/index`
  }

  // 当前操作的作者
  const current = reactive({ author: {} as any })
  const currentAuthorIdx = ref(0)

  // ***************** 编辑 ***************** //
  const editAuthorDialog = defineAsyncComponent(
    () => import('./EditAuthorDialog.vue'),
  )
  const editAuthorVisible = ref(false)

  // 更新列表
  const afterAuthorUpdated = (author: Author) => {
    if (current.author.id === 0) {
      authorData.unshift(author)
    } else {
      authorData[currentAuthorIdx.value] = author
    }
  }

  const handleEdit = (index: number, row: Author) => {
    openLoading()

    current.author = row

    currentAuthorIdx.value = index
    editAuthorVisible.value = true
  }

  // ***************** 删除 ***************** //
  const handleDelete = (index: number, row: Author) => {
    ElMessageBox.confirm(
      _t('author.confirm_delete_author', { title: row.name }),
      _t('common.library'),
      {
        buttonSize: 'small',
        showClose: false,
        confirmButtonText: _t('common.btn_delete'),
        confirmButtonClass: 'ep-button--danger',
        cancelButtonText: _t('common.btn_cancel'),
        type: 'warning',
      },
    )
      .then(() => {
        AuthorService.deleteAuthor({ id: row.id })
          .then(() => {
            authorData.splice(index, 1)
            ElMessage.success(
              _t('author.author_deleted_ok', { title: row.name }),
            )
          })
          .catch((err) => {
            ElMessage.error(
              'AUTHORERR: ' +
                _t('common.deleted_error', { err: err.messge || err.msg }),
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
    router.push({ name: 'author', query: searchForm })
    getAuthors()
  }

  // ***************** 列表 ***************** //
  const authorData: Author[] = reactive([])
  const getAuthors = () => {
    AuthorService.list(searchForm)
      .then((resp) => {
        const d = resp.data

        total.value = d.total

        authorData.length = 0
        authorData.push(...d.items)
      })
      .catch((err) => {
        ElMessage.error('AUTHORERR: ' + (err.messge || err.msg))
      })
  }

  onMounted(() => {
    const { p, q } = router.currentRoute.value.query
    searchForm.p = p || 1
    searchForm.q = q || ''

    page.value = intval(searchForm.p)

    getAuthors()
  })
</script>
<style scoped>
  .author-url {
    color: var(--ep-text-color-primary);
    text-decoration: none;
  }

  .author-url:hover {
    text-decoration: underline;
  }
</style>
