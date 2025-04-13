<template>
  <el-dialog
    :model-value="true"
    top="8vh"
    close-icon="IconoirXmarkCircle"
    :close-on-press-escape="false"
    :before-close="handleClose"
    @opened="closeLoading"
    :title="pageTitle"
  >
    <el-form
      :model="volForm"
      ref="volFormRef"
      label-position="top"
      label-width="auto"
      :rules="rules"
      size="large"
      @submit.prevent
      @keyup.enter="submitForm(volFormRef)"
    >
      <el-form-item :label="$t('volume.title')" prop="title">
        <el-input
          v-model="volForm.title"
          clearable
          ref="titleRef"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item :label="$t('volume.summary')" prop="summary">
        <el-input
          type="textarea"
          v-model="volForm.summary"
          :rows="6"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-divider class="dialog-divider" />
      <span class="dialog-footer">
        <el-button size="small" icon="IconoirXmark" @click="hideme()">{{
          $t('common.btn_cancel')
        }}</el-button>
        <el-button
          size="small"
          icon="IconoirCheck"
          type="primary"
          @click="submitForm(volFormRef)"
          >{{ $t('common.btn_ok') }}</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { onMounted, nextTick } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { BookService } from '~/http'
  import { Volume } from '~/models'
  import { _t } from '~/locales'

  // 关闭窗口
  const handleClose = (done: () => void) => {
    hideme()
    done()
  }

  const volFormRef = ref<FormInstance>()
  const volForm: Volume = reactive({
    id: 0,
    bookid: 0,
    title: '',
    summary: '',
  })

  const props = defineProps(['volume'])
  const pageTitle = props.volume.id
    ? _t('volume.pagetitle_edit_volume')
    : _t('volume.pagetitle_add_volume')
  for (var i in props.volume) {
    volForm[i] = props.volume[i]
  }

  const rules = reactive<FormRules>({
    title: [
      {
        required: true,
        message: _t('volume.dialog_volume_title_is_empty'),
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
        console.log('VOLCERR: ' + _t('common.validated_error'), fields)
      }
    })
  }

  const emit = defineEmits(['hide', 'closeLoading', 'update'])

  const update = () => {
    BookService.updateVolume(volForm)
      .then((resp) => {
        ElMessage.success(_t('volume.saved_ok', { title: volForm.title }))
        volForm.id = resp.data.id

        emit('update', volForm)
        hideme()
      })
      .catch((err) => {
        ElMessage.error(
          'VOLCERR: ' +
            _t('volume.saved_error', { err: err.messge || err.msg }),
        )
      })
  }

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
