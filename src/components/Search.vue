<template>
  <el-form
    :inline="true"
    :model="searchForm"
    ref="searchFormRef"
    :rules="rules"
    @submit.prevent
    @keyup.enter="submitForm(searchFormRef)"
    size="default"
  >
    <el-form-item class="search-area" prop="q">
      <el-input
        size="large"
        v-model.trim="searchForm.q"
        :placeholder="$t('search.content_input_placeholder')"
      >
        <template #append>
          <el-button
            icon="IconoirSearch"
            @click="submitForm(searchFormRef)"
            class="btn-search"
          />
        </template>
      </el-input>
      <el-checkbox
        v-if="showSearchInBook"
        v-model="inbook"
        :label="searchInBookLabel"
        size="large"
      />
    </el-form-item>
  </el-form>
  <el-divider />
  <el-skeleton animated v-if="showSkeleton" style="text-align: left" />
  <el-alert
    :title="$t('search.result_is_empty')"
    type="warning"
    center
    :closable="false"
    style="height: 100px"
    v-if="notFound"
  />
  <el-descriptions
    :column="1"
    v-for="(result, index) in resultData"
    :index="result.chaId"
    :key="index"
    style="padding-bottom: 15px"
  >
    <template #title>
      <el-icon class="book-icon">
        <IconoirPage />
      </el-icon>
      <router-link :to="chapterUrl(result)" class="ep-link cha-url">{{
        result.chaTitle
      }}</router-link>
    </template>
    <el-descriptions-item>
      <el-icon class="book-icon">
        <IconoirPeopleTag />
      </el-icon>
      <router-link :to="authorUrl(result)" class="ep-link book-url">{{
        result.author
      }}</router-link>
      <span> · </span>
      <el-icon class="book-icon">
        <IconoirBook />
      </el-icon>
      <router-link :to="bookUrl(result)" class="ep-link book-url">{{
        result.bookTitle
      }}</router-link>
      <span v-if="showVolTitle(result)">
        ·
        <el-icon class="book-icon">
          <IconoirMultiplePages />
        </el-icon>
        <router-link :to="volchaUrl(result)" class="ep-link book-url">{{
          result.volTitle
        }}</router-link>
      </span>
    </el-descriptions-item>
    <el-descriptions-item>
      <div v-html="colorWords(result.content)" />
    </el-descriptions-item>
  </el-descriptions>
  <el-backtop />
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { onBeforeRouteUpdate } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { BookService } from '~/http'
  import { SearchResult, Book } from '~/models'
  import { useOptionsStore } from '~/stores'
  import { intval, isEmpty } from '~/utils'
  import { _t } from '~/locales'

  const gostore = useOptionsStore()
  gostore.headerIndex = 'searchinbook'

  const currentBook: Book = reactive({
    id: 0,
    title: '',
  })

  const router = useRouter()
  const route = useRoute()

  // 是否显示“在xxx中搜索”
  const showSearchInBook = ref(true)
  const searchInBookLabel = computed(() => {
    return _t('search.search_in_book', { title: currentBook.title })
  })
  // 显示搜索结果前的骨架屏
  const showSkeleton = ref(true)
  // 搜索
  const notFound = ref(false)
  const searchFormRef = ref<FormInstance>()
  const searchForm = reactive({ q: '', bookid: 0 })
  const inbook = ref(true)

  const rules = reactive<FormRules>({
    q: [
      { required: true, message: _t('search.query_is_empty'), trigger: 'blur' },
    ],
  })

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        handleSearch()
      } else {
        console.log('SEARCHERR: ' + _t('common.validated_error'), fields)
      }
    })
  }

  onBeforeRouteUpdate(async (to, from) => {
    console.log('Search.onBeforeRouteUpdate', to, from)

    if (!from.query.q) {
      from.query.q = ''
    }

    if (to.query.q !== from.query.q || to.query.bookid !== from.query.bookid) {
      searchForm.q = to.query.q?.toString() ?? ''
      searchForm.bookid = intval(to.query.bookid?.toString())

      searchBooks()
    }
  })

  // 从页头搜索框跳转到搜索页；或者浏览器直接输入URL
  const bookid = intval(route.query.bookid)
  // 用于导航栏后退按钮
  if (!bookid) {
    gostore.book = { id: 0, title: '' }

    // 是否显示“在xxx中搜索”
    showSearchInBook.value = false

    gostore.headerIndex = 'search'
  }

  // 点击搜索按钮
  const handleSearch = () => {
    if (isEmpty(searchForm.q)) {
      return
    }

    // 是否搜索某本图书中的内容
    searchForm.bookid = inbook.value ? bookid : 0

    router.push({ name: 'search', query: searchForm })
  }

  // 搜索结果中的各种URL
  const bookUrl = (result: SearchResult) => {
    return '/book/' + result.bookId + '/index'
  }
  const chapterUrl = (result: SearchResult) => {
    return '/book/' + result.bookId + '/chapter/' + result.chaId
  }
  const volchaUrl = (result: SearchResult) => {
    return '/book/' + result.bookId + '/volcha/' + result.volId
  }
  const authorUrl = (result: SearchResult) => {
    return '/?sm=author&q=' + result.author
  }

  const showVolTitle = (result) => {
    return result.bookTitle !== result.volTitle
  }

  // 高亮搜索关键字
  const colorWords = (words: string) => {
    return words
      .replaceAll(
        searchForm.q,
        '<span style="color:#ff7866;">' + searchForm.q + '</span>',
      )
      .replaceAll('　', '')
  }

  const getBook = (bookid: number) => {
    BookService.getBook({ id: bookid })
      .then((resp) => {
        currentBook.title = resp.data.title
        currentBook.id = resp.data.id

        if (!gostore.book) {
          gostore.book = currentBook
        }
      })
      .catch((err) => {
        ElMessage.error('CHAPBOOKERR: ' + (err.messge || err.msg || err))
      })
  }

  // ***************** 列表 ***************** //
  const resultData: SearchResult[] = reactive([])
  const searchBooks = () => {
    resultData.length = 0

    if (!searchForm.q) {
      ElMessage.error(_t('search.query_is_empty'))

      return
    }

    inbook.value = searchForm.bookid ? true : false

    BookService.search(searchForm)
      .then((resp) => {
        showSkeleton.value = false

        if (!resp.data) {
          notFound.value = true
        } else {
          notFound.value = false
          resultData.push(...resp.data)
        }
      })
      .catch((err) => {
        ElMessage.error('SEARCHERR: ' + (err.messge || err.msg))
      })
  }

  if (gostore.book && gostore.book.id === bookid) {
    currentBook.id = gostore.book.id
    currentBook.title = gostore.book.title
  } else if (bookid) {
    getBook(bookid)
  }

  onMounted(() => {
    const { q, bookid = 0 } = router.currentRoute.value.query

    searchForm.q = q?.toString() || ''
    searchForm.bookid = intval(bookid)

    console.log('Search.onMounted', searchForm)

    searchBooks()
  })
</script>
<style scoped>
  .book-icon {
    vertical-align: text-bottom;
  }

  .cha-url {
    margin-left: 10px;
    font-size: 18px;
    text-decoration: none;
  }

  .cha-url:hover {
    text-decoration: underline;
  }

  .book-url {
    font-size: 14px;
    text-decoration: none;
  }

  .book-url:hover {
    text-decoration: underline;
  }

  .ep-alert {
    --ep-alert-title-font-size: 18px;
  }
</style>
