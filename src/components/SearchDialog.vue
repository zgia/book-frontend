<template>
  <el-dialog :model-value="true" top="8vh" :close-on-press-escape="false" :before-close="handleClose"
    @opened="closeLoading" :title="$t('search.search')" :width="props.dgwidth">
    <el-form :model="searchForm" ref="searchFormRef" :rules="rules" size="large" class="search-form" @submit.prevent
      @keyup.enter="submitForm(searchFormRef)">
      <el-form-item prop="title">
        <el-input clearable v-model.trim="searchForm.title" ref="titleRef"
          :placeholder="$t('search.dialog_input_placeholder')">
          <template #append>
            <el-button icon="Search" @click="submitForm(searchFormRef)" class="btn-search" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="smode" style="margin-bottom:0;">
        <el-col :span="18" class="text-left">
          <el-radio-group v-model="searchForm.smode" :change="changeSearchMode()">
            <el-radio label="title">{{ $t('search.dialog_select_title') }}</el-radio>
            <el-radio label="content">{{ $t('search.dialog_select_content') }}</el-radio>
            <el-radio label="author">{{ $t('search.dialog_select_author') }}</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-tag round effect="plain" type="info" size="small">{{ shortKey }}</el-tag>
        </el-col>
      </el-form-item>
      <el-form-item prop="inbook" style="margin-bottom:0;">
        <el-checkbox v-if="showSearchInBook" v-model="searchForm.inbook"
          :label="$t('search.search_in_book', { 'title': gostore.book?.title })" size="large" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { sprintf } from 'sprintf-js'
import { useOptionsStore } from '~/stores'
import { metaKey } from '~/utils';
import i18n from '~/locales';

const gostore = useOptionsStore()
const router = useRouter()

// 对话框宽度
const props = defineProps(['dgwidth'])

// 关闭窗口
const handleClose = (done: () => void) => {
  hideme()
  done()
}

// 呼叫对话框快捷键
const shortKey = sprintf('快捷键: %s + K', metaKey())

const searchFormRef = ref<FormInstance>()
const searchForm = reactive({ title: '', smode: 'title', inbook: true })

const rules = reactive<FormRules>({
  title: [
    { required: true, message: '', trigger: 'blur' },
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      search()
      hideme()
    } else {
      console.log('SEARCHERR: ' + i18n.global.t('common.validated_error'), fields)
    }
  })
}

// 是否显示“在xxx中搜索”
const showSearchInBook = ref(false)
const changeSearchMode = () => {
  showSearchInBook.value = searchForm.smode == 'content' && (gostore.book?.id ? true : false)
}

const search = () => {
  const routeName = searchForm.smode == 'content' ? 'search' : 'books'
  const query = { q: searchForm.title, sm: searchForm.smode }
  if (searchForm.smode == 'content' && searchForm.inbook) {
    query['bookid'] = gostore.book?.id
  }

  router.push({ name: routeName, query: query })
}

const emit = defineEmits(['hide', 'closeLoading'])
const closeLoading = () => {
  emit('closeLoading')
}

const hideme = () => {
  emit('hide')
}

// 自动焦点
const titleRef = ref<HTMLInputElement | null>(null)
onMounted(() => {
  nextTick(() => {
    const titleInput = titleRef.value as HTMLInputElement
    titleInput.focus()
  })
})
</script>
