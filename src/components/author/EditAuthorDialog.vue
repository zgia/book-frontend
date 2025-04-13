<template>
  <el-dialog
    :model-value="true"
    top="8vh"
    close-icon="IconoirXmarkCircle"
    :width="props.dgwidth"
    :close-on-press-escape="false"
    :before-close="handleClose"
    @opened="closeLoading"
    :title="pageTitle"
  >
    <el-form
      :inline="true"
      :model="authorForm"
      ref="ruleFormRef"
      label-position="top"
      label-width="auto"
      :rules="rules"
      size="large"
    >
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form-item :label="$t('author.name')" prop="name">
          <el-input
            v-model.trim="authorForm.name"
            ref="titleRef"
            clearable
            autocomplete="off"
            :placeholder="$t('author.name_placeholder')"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form-item :label="$t('author.former_name')">
          <el-input
            v-model.trim="authorForm.former_name"
            clearable
            autocomplete="off"
            :placeholder="$t('author.former_name_placeholder')"
          />
        </el-form-item>
      </el-col>
    </el-form>
    <template #footer>
      <el-divider class="dialog-divider" />
      <span class="dialog-footer">
        <span>
          <el-button size="small" icon="IconoirXmark" @click="hideme()">{{
            $t('common.btn_cancel')
          }}</el-button>
          <el-button
            size="small"
            icon="IconoirCheck"
            type="primary"
            @click="submitForm(ruleFormRef)"
            >{{ $t('common.btn_save') }}</el-button
          >
        </span>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { onMounted, nextTick } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { AuthorService } from '~/http'
  import { Author } from '~/models'
  import { useOptionsStore } from '~/stores'
  import { _t } from '~/locales'

  const gostore = useOptionsStore()

  // 关闭窗口
  const handleClose = (done: () => void) => {
    hideme()
    done()
  }

  const titleRef = ref<HTMLInputElement | null>(null)
  const ruleFormRef = ref<FormInstance>()
  const authorForm: Author = reactive({
    id: 0,
    name: '',
    former_name: '',
  })

  const vForm = defineModel() as any
  const props = defineProps(['dgwidth'])
  const pageTitle = vForm.value.id
    ? _t('author.dialog_edit_author')
    : _t('author.dialog_add_author')

  authorForm.id = vForm.value.id
  authorForm.name = vForm.value.name
  authorForm.former_name = vForm.value.former_name

  const rules = reactive<FormRules>({
    name: [
      {
        required: true,
        message: _t('author.dialog_author_name_is_empty'),
        trigger: 'blur',
      },
    ],
  })

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        update()
      } else {
        console.log('AUTHORCERR: ' + _t('common.validated_error'), fields)
      }
    })
  }

  const emit = defineEmits(['hide', 'closeLoading', 'update'])

  const update = () => {
    AuthorService.updateAuthor(authorForm)
      .then((resp) => {
        ElMessage.success(_t('author.saved_ok', { title: authorForm.name }))
        vForm.value.id = resp.data.id
        vForm.value.name = authorForm.name
        vForm.value.former_name = authorForm.former_name

        emit('update', vForm.value)
        hideme()
      })
      .catch((err) => {
        ElMessage.error(
          'AUTHORCERR: ' +
            _t('author.saved_error', { err: err.messge || err.msg }),
        )
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
      ;(titleRef.value as HTMLInputElement).focus()
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
