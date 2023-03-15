<template>
  <el-dialog :model-value="true" top="8vh" :close-on-click-modal="false" :close-on-press-escape="false"
    :show-close="false" @opened="closeLoading" title="更改密码">
    <el-form :model="pwdForm" ref="ruleFormRef" label-position="top" label-width="auto" :rules="rules" size="large" class="edit-doctor">
      <el-form-item label="原来的密码" label-width="140px" prop="password">
        <el-input v-model="pwdForm.password" type="password" show-password autocomplete="off" placeholder="用来做身份验证" />
      </el-form-item>
      <el-form-item label="新密码" label-width="140px" prop="password1">
        <el-input v-model="pwdForm.password1" type="password" show-password minlength="6" autocomplete="off"
          :placeholder="pwd1ph" />
      </el-form-item>
      <el-form-item label="确认新密码" label-width="140px" prop="password2">
        <el-input v-model="pwdForm.password2" type="password" show-password minlength="6" autocomplete="off"
          :placeholder="pwd2ph" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-divider />
      <span class="dialog-footer">
        <el-button size="small" @click="hideme()" icon="Close">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm(ruleFormRef)" icon="Check">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { UserService } from '~/utils/api'

const pwdminlen = 6
const pwd1ph = '新的密码，注意长度不能小于' + pwdminlen
const pwd2ph = '确认新的密码，以防止错误，注意密码的长度不能小于' + pwdminlen
const pwdisnotmatch = '两次输入的密码不匹配'
const pwdissame = '新密码和原来的密码不能一样'

const ruleFormRef = ref<FormInstance>()
const pwdForm = reactive({
  password: '',
  password1: '',
  password2: ''
})

const validatePass1 = (rule: any, value: any, callback: any) => {
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
const validatePass2 = (rule: any, value: any, callback: any) => {
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
    { required: true, message: '需要输入原来的密码来做验证。', trigger: 'blur' },
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
      console.log('UCPERR: 验证出错，请重新输入。', fields)
    }
  })
}

const update = () => {
  UserService.changePassword(pwdForm).then(
    () => {
      pwdForm.password = ''
      pwdForm.password1 = ''
      pwdForm.password2 = ''

      ElMessage.success('密码已经更新，下次登录时，请使用新的密码。')

      hideme()
    }
  ).catch(
    err => {
      ElMessage.error('UCPERR: ' + (err.messge || err.msg))
    }
  )
}

const emit = defineEmits(['hide', 'closeLoading'])
const closeLoading = () => {
  emit('closeLoading')
}

const hideme = () => {
  emit('hide')
}

</script>
