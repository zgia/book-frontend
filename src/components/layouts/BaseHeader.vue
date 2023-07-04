<template>
  <el-page-header :icon="null" @back="goBack" style="padding-top: 10px;">
    <template #title>
      <div v-if="gostore.headerIndex == 'books'"><el-icon :size="10">
          <Reading />
        </el-icon> 首页</div>
      <div v-else><el-icon :size="10">
          <ArrowLeft />
        </el-icon> 返回</div>
    </template>
    <template #content>
      <div class="flex items-center">
        <span @click="$router.push({ name: 'books' })" style="cursor: pointer;">图书馆</span>
        <el-divider direction="vertical" v-if="gostore.headerIndex != 'books'" class="header-title" />
        <span class="text-large font-600 mr-3 header-title" style="cursor: pointer;" @click="bookIndex()"> {{
          gostore.book?.title }} </span>
        <span class="text-sm mr-2" style="color: var(--el-text-color-regular)"> </span>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button @click="showChangePasswordDialog()" icon="Setting" />
        <el-button @click="byebye()" icon="SwitchButton" />
      </div>
    </template>
  </el-page-header>
  <el-divider style="margin-top: 10px;" />
  <Suspense v-if="changePasswordVisible">
    <template #default>
      <changePasswordDialog @hide="changePasswordVisible = false" />
    </template>
  </Suspense>
</template>

<style></style>

<script lang="ts" setup>
import useOptionsStore from '~/stores/options'

const gostore = useOptionsStore()
const router = useRouter()

const goBack = () => {
  if (gostore.headerIndex == 'content' || gostore.headerIndex == 'volumes' || gostore.headerIndex == 'editchapter') {
    bookIndex()
  }
  else if (gostore.headerIndex == 'chapters') {
    router.push({ name: 'books' })
  }
}

const byebye = async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('mobile')

  router.push({ name: 'login' })
}

const bookIndex = () => {
  router.push({ name: 'chapters', params: { 'bookid': gostore.book?.id } })
}

// 未登录时，只显示退出按钮
//const isLogined = computed(() => { return !!localStorage.username })
// window.addEventListener('hashchange', () => {
//   console.log('window.location.hash: ' + window.location.hash)
// })

// ***************** 更改密码 ***************** //
const changePasswordDialog = defineAsyncComponent(() => import('~/components/user/ChangePassword.vue'))
const changePasswordVisible = ref(false)
const showChangePasswordDialog = () => {
  changePasswordVisible.value = true
}

</script>