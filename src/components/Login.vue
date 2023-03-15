<template>
  <el-row>
    <el-col :span="8" :offset="8">
      <el-image style="width: 100px; height: 100px; padding-bottom: 20px;" src="logo.png" fit="cover" />
      <el-form hide-required-asterisk :model="loginForm" ref="ruleFormRef" :rules="rules" label-width="120px"
        label-position="top" size="large" class="login">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="loginForm.mobile" maxlength="11" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" show-password autocomplete="off" />
        </el-form-item>
        <el-form-item class="btn-login">
          <el-button type="primary" @click="submitForm(ruleFormRef)">登 录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style>
.ep-row {
  padding-top: 5%;
}

.grid-content {
  display: inline-block;
}

.login .ep-input {
  width: 100% !important;
}

.btn-login .ep-form-item__content {
  justify-content: right;
}
</style>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { validateMobile } from '~/utils/tools'
import useUserStore from '~/stores/user'

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
    { required: true, message: '需要填写登录密码', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      dologin()
    } else {
      console.log('LOGINERR: 验证出错，请重新输入。', fields)
    }
  })
}

const dologin = () => {
  useUserStore().dologin({ username: loginForm.mobile, password: loginForm.password })
    .then(
      () => { router.push({ name: 'books' }) }
    ).catch(
      err => { ElMessage.error('LOGINERR: ' + (err.messge || err.msg)) }
    )
}
</script>