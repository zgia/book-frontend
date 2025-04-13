<template>
  <el-dialog
    :model-value="true"
    top="8vh"
    close-icon="IconoirXmarkCircle"
    :close-on-press-escape="false"
    :before-close="handleClose"
    @opened="closeLoading"
    :title="$t('user.pagetitle_edit_pwd')"
    :width="props.dgwidth"
  >
    <el-form
      :model="pwdForm"
      ref="ruleFormRef"
      label-position="top"
      label-width="auto"
      :rules="rules"
      size="large"
      class="edit-doctor"
    >
      <el-form-item
        :label="$t('user.edit_pwd_old_pwd')"
        label-width="140px"
        prop="password"
      >
        <el-input
          v-model="pwdForm.password"
          type="password"
          clearable
          show-password
          autocomplete="off"
          :placeholder="$t('user.edit_pwd_old_pwd_placeholder')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.edit_pwd_new_pwd')"
        label-width="140px"
        prop="password1"
      >
        <el-input
          v-model="pwdForm.password1"
          type="password"
          clearable
          show-password
          minlength="6"
          autocomplete="off"
          :placeholder="pwd1ph"
        />
      </el-form-item>
      <el-form-item
        :label="$t('user.edit_pwd_confirm_pwd')"
        label-width="140px"
        prop="password2"
      >
        <el-input
          v-model="pwdForm.password2"
          type="password"
          clearable
          show-password
          minlength="6"
          autocomplete="off"
          :placeholder="pwd2ph"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-divider />
      <span class="dialog-footer">
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
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import md5 from 'md5'
  import { useOptionsStore } from '~/stores'
  import { UserService } from '~/http'
  import { _t } from '~/locales'

  const gostore = useOptionsStore()

  // 对话框宽度
  const props = defineProps(['dgwidth'])

  // 关闭窗口
  const handleClose = (done: () => void) => {
    hideme()
    done()
  }

  const pwdminlen = 6
  const pwd1ph = _t('user.edit_pwd_new_pwd_placeholder', { len: pwdminlen })
  const pwd2ph = _t('user.edit_pwd_confirm_pwd_placeholder')
  const pwdisnotmatch = _t('user.pwd_is_not_match')
  const pwdissame = _t('user.pwd_is_same')

  const ruleFormRef = ref<FormInstance>()
  const pwdForm = reactive({
    password: '',
    password1: '',
    password2: '',
  })

  type validatorCallbackFunc = (error?: string | Error) => void

  const validatePass1 = (
    rule: unknown,
    value: string,
    callback: validatorCallbackFunc,
  ) => {
    if (value === '' || value.length < pwdminlen) {
      callback(new Error(pwd1ph))
    } else if (value === pwdForm.password) {
      callback(new Error(pwdissame))
    } else {
      if (pwdForm.password2 !== '') {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validateField('password2', () => {})
      }
      callback()
    }
  }
  const validatePass2 = (
    rule: unknown,
    value: string,
    callback: validatorCallbackFunc,
  ) => {
    if (value === '' || value.length < pwdminlen) {
      callback(new Error(pwd2ph))
    } else if (value === pwdForm.password) {
      callback(new Error(pwdissame))
    } else if (value !== pwdForm.password1) {
      callback(new Error(pwdisnotmatch))
    } else {
      callback()
    }
  }

  const rules = reactive<FormRules>({
    password: [
      { required: true, message: _t('user.old_pwd_is_empty'), trigger: 'blur' },
    ],
    password1: [{ validator: validatePass1, required: true, trigger: 'blur' }],
    password2: [{ validator: validatePass2, required: true, trigger: 'blur' }],
  })

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        update()
      } else {
        console.log('UCPERR: ' + _t('common.validated_error'), fields)
      }
    })
  }

  const update = () => {
    Object.keys(pwdForm).map((key) => {
      pwdForm[key] = md5(pwdForm[key])
    })

    UserService.changePassword(pwdForm)
      .then(() => {
        Object.keys(pwdForm).map((key) => {
          pwdForm[key] = ''
        })

        ElMessage.success(_t('user.pwd_is_changed_ok'))

        hideme()
      })
      .catch((err) => {
        ElMessage.error('UCPERR: ' + (err.messge || err.msg))
      })
  }

  const emit = defineEmits(['hide', 'closeLoading'])
  const closeLoading = () => {
    emit('closeLoading')
  }

  const hideme = () => {
    gostore.dialogPopup = false
    emit('hide')
  }
</script>
