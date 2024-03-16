<template>
  <div class="flex items-center pageheader-extra">
    <el-button circle size="small" icon="Search" @click="showSearchDialog()" :title="searchShortKey" />
    <el-button circle size="small" icon="Plus" @click="showNewBookDialog()" :title="newbookShortKey" />
    <el-dropdown trigger="click" @command="handleCommand" class="dropdown">
      <el-button circle size="small" icon="ArrowDown" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item icon="Setting" command="pwd">{{ $t('config.edit_pwd') }}</el-dropdown-item>
          <el-dropdown-item :icon="isDark ? 'Sunny' : 'Moon'" command="color" divided>{{ isDark ?
            $t('config.color_light') : $t('config.color_dark') }}</el-dropdown-item>
          <el-dropdown-item icon="Guide" command="locale">{{ localeTitle }}</el-dropdown-item>
          <el-dropdown-item icon="Setting" command="sysp">{{ $t('config.system_preferences') }}</el-dropdown-item>
          <el-dropdown-item icon="SwitchButton" command="exit" divided>{{ $t('config.exit') }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <Suspense v-if="pwdDialogVisible">
    <template #default>
      <editPwdDialog @hide="pwdDialogVisible = false" @close-loading="closeLoading" :dgwidth="dgWidth" />
    </template>
  </Suspense>
  <Suspense v-if="searchDialogVisible">
    <template #default>
      <searchDialog @hide="searchDialogVisible = false" @close-loading="closeLoading" :dgwidth="dgWidth" />
    </template>
  </Suspense>
  <Suspense v-if="bookDialogVisible">
    <template #default>
      <newBookDialog @hide="bookDialogVisible = false" @close-loading="closeLoading" :dgwidth="dgWidth" :book="newBook"
        @update="afterUpdated" />
    </template>
  </Suspense>
  <Suspense v-if="sysPrefDialogVisible">
    <template #default>
      <sysPrefDialog @hide="sysPrefDialogVisible = false" @close-loading="closeLoading" :dgwidth="dgWidth"
        @update="afterUpdated" />
    </template>
  </Suspense>
</template>
<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { toggleDark, isDark } from '~/composables';
import { Book } from '~/models'
import { useOptionsStore, useLocaleStore } from '~/stores'
import i18n from '~/locales';
import { metaKey, dialogWidth } from '~/utils';

const searchShortKey = '快捷键: ' + metaKey() + ' + K'
const newbookShortKey = '快捷键: ' + metaKey() + ' + B'

const gostore = useOptionsStore()
const locstore = useLocaleStore()
const router = useRouter()

// 对话框宽度
const dgWidth = ref('50%')
watch(() => gostore.clientWidth, (sw: number) => {
  dgWidth.value = dialogWidth(sw)
}, { immediate: true, deep: true })

// 加载动画
const fsLoading = ref(false)
const openLoading = () => {
  fsLoading.value = true
}
const closeLoading = () => {
  fsLoading.value = false
}

// 参考：https://juejin.cn/post/7127606944184926245
const localeTitle = computed(() => (locstore.locale === 'zhCn' ? i18n.global.t('config.locale_en') : i18n.global.t('config.locale_zhcn')))

const toggleLang = () => {
  locstore.locale = locstore.locale === 'zhCn' ? 'en' : 'zhCn'
  locstore.setLocale(locstore.locale)
}

const handleCommand = (cmd: string | number | object) => {
  if (cmd == 'pwd') {
    showEditPwdDialog()
  } else if (cmd == 'exit') {
    exit()
  } else if (cmd == 'color') {
    toggleDark()
  } else if (cmd == 'locale') {
    toggleLang()
  } else if (cmd == 'sysp') {
    showSystemPreferencesDialog()
  }
}

// ***************** 退出 ***************** //
const exit = async () => {
  ElMessageBox.confirm(
    i18n.global.t('common.confirm_exit'),
    i18n.global.t('common.btn_exit'),
    {
      confirmButtonText: i18n.global.t('common.btn_exit'),
      cancelButtonText: i18n.global.t('common.btn_cancel'),
      type: 'warning',
    }
  )
    .then(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('mobile')

      router.push({ name: 'login' })
    })
    .catch(() => {
      // 放弃
    })
}

// ***************** 发布新书 ***************** //
const newBook: Book = reactive({ id: 0, title: '' })
const newBookDialog = defineAsyncComponent(() => import('~/components/book/EditBookDialog.vue'))
const bookDialogVisible = ref(false)

const showNewBookDialog = () => {
  openLoading()
  bookDialogVisible.value = true
}
const afterUpdated = (book: Book) => {
  router.push({ name: 'books', hash: '#newbook=' + book.id })
}

// ***************** 更改密码 ***************** //
const editPwdDialog = defineAsyncComponent(() => import('~/components/user/EditPwdDialog.vue'))
const pwdDialogVisible = ref(false)
const showEditPwdDialog = () => {
  openLoading()
  pwdDialogVisible.value = true
}

// ***************** 更改密码 ***************** //
const sysPrefDialog = defineAsyncComponent(() => import('~/components/preference/SystemPreferences.vue'))
const sysPrefDialogVisible = ref(false)
const showSystemPreferencesDialog = () => {
  openLoading()
  sysPrefDialogVisible.value = true
}

// ***************** 搜索 ***************** //
const searchDialog = defineAsyncComponent(() => import('~/components/SearchDialog.vue'))
const searchDialogVisible = ref(false)
const showSearchDialog = () => {
  openLoading()
  searchDialogVisible.value = true
}

// 快捷键
document.onkeydown = (e) => {
  if (!e) {
    return
  }

  if (e.metaKey && e.code == 'KeyK') {
    showSearchDialog()
  }
  else if (e.metaKey && e.code == 'KeyB') {
    showNewBookDialog()
  }

}
</script>
<style scoped>
.pageheader-extra .ep-button+.ep-button {
  margin-left: 5px;
}

.pageheader-extra .dropdown {
  margin-left: 5px;
}
</style>