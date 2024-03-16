<template>
  <el-dialog :model-value="true" top="8vh" :width="props.dgwidth" :close-on-press-escape="false"
    :before-close="handleClose" @opened="closeLoading" :title="pageTitle">
    <el-form :model="bookForm" ref="ruleFormRef" label-position="top" label-width="auto" :rules="rules" size="large">
      <el-form-item :label="$t('book.title')" prop="title">
        <el-input v-model.trim="bookForm.title" ref="titleRef" clearable autocomplete="off"
          :placeholder="$t('book.title_placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('book.author')" prop="author">
        <el-input v-model="bookForm.author" clearable autocomplete="off" :placeholder="$t('book.author_placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('book.category')" prop="source">
        <el-select v-model="bookForm.categoryid" clearable :placeholder="$t('book.select_category_placeholder')">
          <el-option v-for="item, key in gostore.categories" :key="key" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('book.source')" prop="source">
        <el-input v-model="bookForm.source" clearable autocomplete="off" :placeholder="$t('book.source_placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('book.summary')" prop="summary">
        <el-input type="textarea" v-model="bookForm.summary" rows="6" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-divider class="dialog-divider" />
      <span class="dialog-footer cp-footer ">
        <el-tag round effect="plain" type="info" size="small">{{ shortKey }}</el-tag>
        <span>
          <el-button size="small" icon="Close" @click="hideme()">{{ $t('common.btn_cancel') }}</el-button>
          <el-button size="small" icon="Check" type="primary" @click="submitForm(ruleFormRef)">{{ $t('common.btn_save')
            }}</el-button>
        </span>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { sprintf } from 'sprintf-js'
import { BookService } from '~/http'
import { Book } from '~/models'
import { metaKey } from '~/utils';
import { useOptionsStore } from '~/stores'
import i18n from '~/locales';

const gostore = useOptionsStore()

// 关闭窗口
const handleClose = (done: () => void) => {
  hideme()
  done()
}

// 呼叫对话框快捷键
const shortKey = sprintf('快捷键: %s + B', metaKey())

const titleRef = ref<HTMLInputElement | null>(null)
const ruleFormRef = ref<FormInstance>()
const bookForm: Book = reactive({
  id: 0,
  title: '',
})

const props = defineProps(['book', 'dgwidth'])
const pageTitle = props.book.id ? i18n.global.t('book.dialog_edit_book') : i18n.global.t('book.dialog_add_book')
for (var i in props.book) {
  bookForm[i] = props.book[i]
}
if (!bookForm.categoryid) {
  bookForm.categoryid = ''
}

const rules = reactive<FormRules>({
  title: [{ required: true, message: i18n.global.t('book.dialog_book_title_is_empty'), trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      update()
    } else {
      console.log('BOOKCERR: ' + i18n.global.t('common.validated_error'), fields)
    }
  })
}

const emit = defineEmits(['hide', 'closeLoading', 'update'])

const update = () => {
  BookService.updateBook(bookForm)
    .then(resp => {
      ElMessage.success(i18n.global.t('book.saved_ok', { 'title': bookForm.title }))
      bookForm.id = resp.data.id

      emit('update', bookForm)
      hideme()
    })
    .catch(err => {
      ElMessage.error('BOOKCERR: ' + i18n.global.t('book.saved_error', { 'err': (err.messge || err.msg) }))
    })
}

const closeLoading = () => {
  emit('closeLoading')
}

const hideme = () => {
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