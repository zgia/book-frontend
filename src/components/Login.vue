<template>
  <el-row class="login-page">
    <el-col :xs="0" :sm="6" :md="8" :lg="8" :xl="8"></el-col>
    <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
      <el-image class="logo" src="logo.png" fit="cover" />
      <el-form hide-required-asterisk :model="loginForm" @keyup.enter="submitForm(ruleFormRef)" ref="ruleFormRef"
        :rules="rules" label-width="120px" label-position="top" size="large" class="login-form">
        <el-form-item :label="$t('login.mobile')" prop="mobile">
          <el-input v-model.trim="loginForm.mobile" maxlength="11" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t('login.password')" prop="password">
          <el-input type="password" v-model="loginForm.password" clearable show-password autocomplete="off" />
        </el-form-item>
        <el-form-item class="btn-login">
          <el-button type="primary" @click="submitForm(ruleFormRef)">{{ $t('login.btn_login') }}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import md5 from 'md5'
import { validateMobile } from '~/utils'
import { useUserStore } from '~/stores'
import i18n from '~/locales';

const router = useRouter()

const ruleFormRef = ref<FormInstance>()
const loginForm = reactive({
  mobile: '',
  password: '',
})

const rules = reactive<FormRules>({
  mobile: [
    { validator: validateMobile, trigger: 'blur' },
  ],
  password: [
    { required: true, message: i18n.global.t('login.password_is_empty'), trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      dologin()
    } else {
      console.log('LOGINERR: ' + i18n.global.t('common.validated_error'), fields)
    }
  })
}

const dologin = () => {
  useUserStore().dologin({ username: loginForm.mobile, password: md5(loginForm.password) })
    .then(() => {
      router.push({ name: 'books' })
    })
    .catch(err => {
      ElMessage.error('LOGINERR: ' + i18n.global.t('login.login_error', { 'err': (err.messge || err.msg || err) }))
    })
}
</script>

<style scoped>
.login-page {
  padding-top: 5%;

  .logo {
    width: 100px;
    height: 100px;
    padding-bottom: 20px;
  }

  .login-form {

    .ep-input {
      width: 100% !important;
    }

    .btn-login :deep(.ep-form-item__content) {
      justify-content: center;
    }
  }
}
</style>