<template>
  <el-dialog :model-value="true" top="8vh" close-icon="IconoirXmarkCircle" :width="props.dgwidth" :close-on-press-escape="false" :before-close="handleClose" @opened="closeLoading" :title="pageTitle">
    <el-form :inline="true" :model="bookForm" ref="ruleFormRef" label-position="top" label-width="auto" :rules="rules" size="large">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item :label="$t('book.title')" prop="title">
          <el-input v-model.trim="bookForm.title" ref="titleRef" clearable autocomplete="off" :placeholder="$t('book.title_placeholder')" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item :label="$t('book.alias')" prop="alias">
          <el-input v-model.trim="bookForm.alias" clearable autocomplete="off" :placeholder="$t('book.alias_placeholder')" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item :label="$t('book.author')" prop="author">
          <el-input v-model="bookForm.author" clearable autocomplete="off" :placeholder="$t('book.author_placeholder')" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item :label="$t('book.rate')" prop="rate">
          <el-rate v-model="bookForm.rate" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item :label="$t('book.category')" prop="source">
          <el-select v-model="bookForm.categoryid" clearable :placeholder="$t('book.select_category_placeholder')">
            <el-option v-for="item, key in gostore.categories" :key="key" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-form-item :label="$t('book.source')" prop="source">
          <el-input v-model="bookForm.source" clearable autocomplete="off" :placeholder="$t('book.source_placeholder')" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('book.summary')" prop="summary">
          <el-input type="textarea" v-model="bookForm.summary" :rows="6" autocomplete="off" />
        </el-form-item>
      </el-col>
    </el-form>
    <template #footer>
      <el-divider class="dialog-divider" />
      <span class="dialog-footer cp-footer ">
        <el-tag round effect="plain" type="info" size="small">{{ newbookShortcut() }}</el-tag>
        <span>
          <el-button size="small" icon="IconoirXmark" @click="hideme()">{{ $t('common.btn_cancel') }}</el-button>
          <el-button size="small" icon="IconoirCheck" type="primary" @click="submitForm(ruleFormRef)">{{ $t('common.btn_save') }}</el-button>
        </span>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { BookService } from '~/http'
import { Book } from '~/models'
import { newbookShortcut } from '~/utils';
import { useOptionsStore } from '~/stores'
import { _t } from '~/locales';

const gostore = useOptionsStore()

// 关闭窗口
const handleClose = (done: () => void) => {
  hideme()
  done()
}

const titleRef = ref<HTMLInputElement | null>(null)
const ruleFormRef = ref<FormInstance>()
const bookForm: Book = reactive({
  id: 0,
  title: '',
})

const props = defineProps(['book', 'dgwidth'])
const pageTitle = props.book.id ? _t('book.dialog_edit_book') : _t('book.dialog_add_book')
for (var i in props.book) {
  bookForm[i] = props.book[i]
}
if (!bookForm.categoryid) {
  bookForm.categoryid = ''
}

const rules = reactive<FormRules>({
  title: [{ required: true, message: _t('book.dialog_book_title_is_empty'), trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      update()
    } else {
      console.log('BOOKCERR: ' + _t('common.validated_error'), fields)
    }
  })
}

const emit = defineEmits(['hide', 'closeLoading', 'update'])

const update = () => {
  BookService.updateBook(bookForm)
    .then(resp => {
      ElMessage.success(_t('book.saved_ok', { 'title': bookForm.title }))
      bookForm.id = resp.data.id

      emit('update', bookForm)
      hideme()
    })
    .catch(err => {
      ElMessage.error('BOOKCERR: ' + _t('book.saved_error', { 'err': (err.messge || err.msg) }))
    })
}

const closeLoading = () => {
  emit('closeLoading')
}

const hideme = () => {
  gostore.dialogPopup = false
  emit('hide')
}

// 自动焦点
onMounted(() => {
  nextTick(() => {
    (titleRef.value as HTMLInputElement).focus()
  })
})
</script>
<style scoped>
.dialog-footer.cp-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>