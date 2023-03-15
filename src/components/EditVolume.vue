<template>
  <el-dialog :model-value="true" top="8vh" :close-on-click-modal="false" :close-on-press-escape="false"
    :show-close="false" @opened="closeLoading" :opened="closeLoading" title="编辑卷">
    <el-form :model="opForm" ref="ruleFormRef" label-position="top" label-width="auto" :rules="rules" size="large">
      <el-form-item label="卷名" prop="title">
        <el-input v-model="opForm.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="简介" prop="summary">
        <el-input type="textarea" v-model="opForm.summary" rows="6" autocomplete="off" />
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

const ruleFormRef = ref<FormInstance>()
const opForm = reactive({
  id: 0,
  bookid: 0,
  title: '',
  summary: '',
})

const props = defineProps(['volume'])
for (var i in props.volume) {
  opForm[i] = props.volume[i]
}

const rules = reactive<FormRules>({
  title: [
    { required: true, message: '需要填写卷名', trigger: 'blur' },
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      update()
    } else {
      console.log('VOLCERR: 验证出错，请重新输入。', fields)
    }
  })
}

const emit = defineEmits(['hide', 'closeLoading', 'update'])

const update = () => {
  console.log('BookService.updateVolume', opForm)
  BookService.updateVolume(opForm).then(
    resp => {
      ElMessage.success('图书卷（' + opForm.title + '）信息保存成功。')
      opForm.id = resp.data.id

      emit('update', opForm)
      hideme()
    }
  ).catch(
    err => {
      ElMessage.error('VOLCERR: ' + (err.messge || err.msg))
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
