<template>
  <el-dialog :model-value="true" top="8vh" close-icon="IconoirXmarkCircle" :close-on-press-escape="false" :before-close="handleClose" @opened="closeLoading" :title="$t('search.search')"
    :width="props.dgwidth">
    <el-form :model="searchForm" ref="searchFormRef" :rules="rules" size="large" class="search-form" @submit.prevent @keyup.enter="submitForm(searchFormRef)">
      <el-form-item prop="keywords">
        <el-input clearable v-model.trim="searchForm.keywords" ref="keywordsRef" :placeholder="$t('search.dialog_input_placeholder')">
          <template #append>
            <el-button icon="IconoirSearch" @click="submitForm(searchFormRef)" class="btn-search" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="smode" style="margin-bottom:0;">
        <el-col :span="18" class="text-left">
          <el-radio-group v-model="searchForm.smode" :change="changeSearchMode()">
            <el-radio v-for="sml in searchModes" :value="sml" :key="sml">{{ $t('search.dialog_select_' + sml) }}</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-tag round effect="plain" type="info" size="small">{{ searchShortcut() }}</el-tag>
        </el-col>
      </el-form-item>
      <el-form-item prop="inbook" style="margin-bottom:0;">
        <el-checkbox v-if="showSearchInBook" v-model="searchForm.inbook" :label="$t('search.search_in_book', { 'title': gostore.book?.title })" size="large" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useOptionsStore } from '~/stores'
import { searchShortcut } from '~/utils';
import { searchModeList } from '~/models';
import { _t } from '~/locales';

const gostore = useOptionsStore()
const router = useRouter()

// 搜索类别，移除categ
const searchModes = JSON.parse(JSON.stringify(searchModeList))
searchModes.pop()

// 对话框宽度
const props = defineProps(['dgwidth'])

// 关闭窗口
const handleClose = (done: () => void) => {
  hideme()
  done()
}

const searchFormRef = ref<FormInstance>()
const searchForm = reactive({ keywords: '', smode: 'title', inbook: true })

const rules = reactive<FormRules>({
  keywords: [
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
      console.log('SEARCHERR: ' + _t('common.validated_error'), fields)
    }
  })
}

// 是否显示“在xxx中搜索”
const showSearchInBook = ref(false)
const changeSearchMode = () => {
  showSearchInBook.value = searchForm.smode == 'content' && (gostore.book?.id ? true : false)
}

const search = () => {
  const routeName = searchForm.smode == 'content' ? 'search' : 'booklist'
  const query = { q: searchForm.keywords, sm: searchForm.smode }
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
  gostore.dialogPopup = false
  emit('hide')
}

// 自动焦点
const keywordsRef = ref<HTMLInputElement | null>(null)
onMounted(() => {
  nextTick(() => {
    const keywordsInput = keywordsRef.value as HTMLInputElement
    keywordsInput.focus()
  })
})
</script>
