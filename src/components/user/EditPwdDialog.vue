<template>
  <el-dialog :model-value="true" top="8vh" :close-on-press-escape="false" :before-close="handleClose"
    @opened="closeLoading" :title="$t('user.pagetitle_edit_pwd')" :width="props.dgwidth">
    <el-form :model="pwdForm" ref="ruleFormRef" label-position="top" label-width="auto" :rules="rules" size="large"
      class="edit-doctor">
      <el-form-item :label="$t('user.edit_pwd_old_pwd')" label-width="140px" prop="password">
        <el-input v-model="pwdForm.password" type="password" clearable show-password autocomplete="off"
          :placeholder="$t('user.edit_pwd_old_pwd_placeholder')" />
      </el-form-item>
      <el-form-item :label="$t('user.edit_pwd_new_pwd')" label-width="140px" prop="password1">
        <el-input v-model="pwdForm.password1" type="password" clearable show-password minlength="6" autocomplete="off"
          :placeholder="pwd1ph" />
      </el-form-item>
      <el-form-item :label="$t('user.edit_pwd_confirm_pwd')" label-width="140px" prop="password2">
        <el-input v-model="pwdForm.password2" type="password" clearable show-password minlength="6" autocomplete="off"
          :placeholder="pwd2ph" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-divider />
      <span class="dialog-footer">
        <el-button size="small" icon="Close" @click="hideme()">{{ $t('common.btn_cancel') }}</el-button>
        <el-button size="small" icon="Check" type="primary" @click="submitForm(ruleFormRef)">{{ $t('common.btn_save')
          }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import md5 from 'md5'
import { UserService } from '~/http'
import i18n from '~/locales';

// 对话框宽度
const props = defineProps(['dgwidth'])

// 关闭窗口
const handleClose = (done: () => void) => {
  hideme()
  done()
}

const pwdminlen = 6
const pwd1ph = i18n.global.t('user.edit_pwd_new_pwd_placeholder', { 'len': pwdminlen })
const pwd2ph = i18n.global.t('user.edit_pwd_confirm_pwd_placeholder')
const pwdisnotmatch = i18n.global.t('user.pwd_is_not_match')
const pwdissame = i18n.global.t('user.pwd_is_same')

const ruleFormRef = ref<FormInstance>()
const pwdForm = reactive({
  password: '',
  password1: '',
  password2: ''
})

type validatorCallbackFunc = (error?: string | Error) => void

const validatePass1 = (rule: unknown, value: string, callback: validatorCallbackFunc) => {
  if (value === '' || value.length < pwdminlen) {
    callback(new Error(pwd1ph))
  } else if (value == pwdForm.password) {
    callback(new Error(pwdissame))
  } else {
    if (pwdForm.password2 !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('password2', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: unknown, value: string, callback: validatorCallbackFunc) => {
  if (value === '' || value.length < pwdminlen) {
    callback(new Error(pwd2ph))
  } else if (value == pwdForm.password) {
    callback(new Error(pwdissame))
  } else if (value !== pwdForm.password1) {
    callback(new Error(pwdisnotmatch))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  password: [
    { required: true, message: i18n.global.t('user.old_pwd_is_empty'), trigger: 'blur' },
  ],
  password1: [
    { validator: validatePass1, required: true, trigger: 'blur' },
  ],
  password2: [
    { validator: validatePass2, required: true, trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      update()
    } else {
      console.log('UCPERR: ' + i18n.global.t('common.validated_error'), fields)
    }
  })
}

const update = () => {
  Object.keys(pwdForm).map((key,) => { pwdForm[key] = md5(pwdForm[key]) })

  UserService.changePassword(pwdForm)
    .then(() => {
      Object.keys(pwdForm).map((key,) => { pwdForm[key] = '' })

      ElMessage.success(i18n.global.t('user.pwd_is_changed_ok'))

      hideme()
    })
    .catch(err => {
      ElMessage.error('UCPERR: ' + (err.messge || err.msg))
    })
}

const emit = defineEmits(['hide', 'closeLoading'])
const closeLoading = () => {
  emit('closeLoading')
}

const hideme = () => {
  emit('hide')
}

</script>
