<template>
  <el-dialog :model-value="true" top="8vh" :width="props.dgwidth" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false" @opened="closeLoading" :opened="closeLoading" :title="pageTitle">
    <el-form :model="bookForm" ref="ruleFormRef" label-position="top" label-width="auto" :rules="rules" size="large">
      <el-form-item label="书名" prop="title">
        <el-input v-model="bookForm.title" autocomplete="off" placeholder="书名" />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="bookForm.author" autocomplete="off" placeholder="作者" />
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-input v-model="bookForm.source" autocomplete="off" placeholder="链接之类的" />
      </el-form-item>
      <el-form-item label="简介" prop="summary">
        <el-input type="textarea" v-model="bookForm.summary" rows="6" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-divider class="dialog-divider" />
      <span class="dialog-footer">
        <el-button size="small" @click="hideme()" icon="Close">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm(ruleFormRef)" icon="Check">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { BookService } from '~/utils/api'
import { Book } from '~/models/book'

const ruleFormRef = ref<FormInstance>()
const bookForm: Book = reactive({
  id: 0,
  title: '',
  author: '',
  summary: '',
  source: ''
})

const props = defineProps(['book', 'dgwidth'])

const pageTitle = props.book.id ? '编辑图书' : '添加图书'

for (var i in props.book) {
  bookForm[i] = props.book[i]
}

const rules = reactive<FormRules>({
  title: [{ required: true, message: '需要填写书名', trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      update()
    } else {
      console.log('BOOKCERR: 验证出错，请重新输入。', fields)
    }
  })
}

const emit = defineEmits(['hide', 'closeLoading', 'update'])

const update = () => {
  BookService.updateBook(bookForm).then(
    resp => {
      ElMessage.success('图书（' + bookForm.title + '）信息保存成功。')
      bookForm.id = resp.data.id

      emit('update', bookForm)
      hideme()
    }
  ).catch(
    err => {
      ElMessage.error('BOOKCERR: ' + (err.messge || err.msg))
    }
  )
}

const closeLoading = () => {
  emit('closeLoading')
}

const hideme = () => {
  emit('hide')
}
</script>
