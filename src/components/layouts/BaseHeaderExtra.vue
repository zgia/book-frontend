<template>
  <div class="flex items-center pageheader-extra">
    <div style="margin-right: 50px" v-if="showSearch">
      <el-form
        :model="searchForm"
        :rules="{}"
        @submit.prevent
        @keyup.enter="submitForm()"
      >
        <el-input
          v-model.trim="gostore.query"
          clearable
          :placeholder="$t('search.header_placeholder')"
        >
          <template #append>
            <el-button
              icon="IconoirSearch"
              @click="submitForm()"
              class="btn-search"
            />
          </template>
        </el-input>
      </el-form>
    </div>
    <div>
      <el-button
        circle
        size="small"
        icon="IconoirSearch"
        @click="handleSearchDialog()"
        :title="searchBookTitle()"
      />
      <el-button
        circle
        size="small"
        icon="IconCustomAddBook"
        @click="handleNewBookDialog()"
        :title="newBookTitle()"
      />
      <el-dropdown trigger="click" @command="handleCommand" class="dropdown">
        <el-button circle size="small" icon="IconoirNavArrowDown" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="IconoirPeopleTag" command="user"
              >{{ $t('common.welcome') }}, {{ mobile }}</el-dropdown-item
            >
            <el-dropdown-item icon="IconoirKey" command="pwd">{{
              $t('config.edit_pwd')
            }}</el-dropdown-item>
            <el-dropdown-item :icon="darkIcon()" command="color" divided>{{
              darkMenuTitle()
            }}</el-dropdown-item>
            <el-dropdown-item
              :icon="localeIcon('zhCN')"
              command="locale_zhcn"
              divided
              >{{ $t('config.locale_zhcn') }}</el-dropdown-item
            >
            <el-dropdown-item
              :icon="localeIcon('zhTW')"
              command="locale_zhtw"
              >{{ $t('config.locale_zhtw') }}</el-dropdown-item
            >
            <el-dropdown-item :icon="localeIcon('en')" command="locale_en">{{
              $t('config.locale_en')
            }}</el-dropdown-item>
            <el-dropdown-item icon="IconoirSettings" command="sysp" divided>{{
              $t('config.system_preferences')
            }}</el-dropdown-item>
            <el-dropdown-item icon="IconoirGroup" command="author" divided>{{
              $t('config.author_mgmt')
            }}</el-dropdown-item>
            <el-dropdown-item icon="IconCustomExit" command="exit" divided>{{
              $t('config.exit')
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <editPwdDialog
    v-if="pwdDialogVisible"
    @hide="pwdDialogVisible = false"
    @close-loading="closeLoading"
    :dgwidth="dgWidth"
  />
  <searchDialog
    v-if="searchDialogVisible"
    @hide="searchDialogVisible = false"
    @close-loading="closeLoading"
    :dgwidth="dgWidth"
  />
  <newBookDialog
    v-if="bookDialogVisible"
    @hide="bookDialogVisible = false"
    @close-loading="closeLoading"
    :dgwidth="dgWidth"
    :book="newBook"
    @update="afterBookUpdated"
  />
  <sysPrefDialog
    v-if="sysPrefDialogVisible"
    @hide="sysPrefDialogVisible = false"
    @close-loading="closeLoading"
    :dgwidth="dgWidth"
  />
</template>
<script lang="ts" setup>
  import { useMagicKeys } from '@vueuse/core'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import {
    dialogWidth,
    defaultDialogWidth,
    newbookShortcut,
    searchShortcut,
  } from '~/utils'
  import { toggleDark, isDark } from '~/composables'
  import {
    IconoirSunLight,
    IconoirHalfMoon,
    IconoirTranslate,
    IconoirCheck,
  } from '~/composables'
  import { Book } from '~/models'
  import { useOptionsStore, useLocaleStore } from '~/stores'
  import { _t } from '~/locales'

  const gostore = useOptionsStore()
  const lostore = useLocaleStore()
  const router = useRouter()

  const mobile = localStorage.getItem('mobile')

  const searchForm = reactive({ q: '', sm: 'title' })
  const submitForm = async () => {
    searchForm.q = gostore.query
    router.push({ name: 'booklist', query: searchForm })
  }
  const showSearch = ref(true)

  // 对话框宽度
  const dgWidth = ref(defaultDialogWidth)
  watch(
    () => gostore.clientWidth,
    (sw: number) => {
      dgWidth.value = dialogWidth(sw)

      showSearch.value = sw > 1024
    },
    { immediate: true, deep: true },
  )

  // 加载动画
  const fsLoading = ref(false)
  const openLoading = () => {
    fsLoading.value = true
  }
  const closeLoading = () => {
    fsLoading.value = false
  }

  const searchBookTitle = () => {
    return _t('book.dialog_search_book') + ' ' + searchShortcut()
  }
  const newBookTitle = () => {
    return _t('book.dialog_add_book') + ' ' + newbookShortcut()
  }

  const darkIcon = () => {
    return isDark.value ? IconoirSunLight : IconoirHalfMoon
  }
  const darkMenuTitle = () => {
    return isDark.value ? _t('config.color_light') : _t('config.color_dark')
  }

  const localeIcon = (lang: string) => {
    return lostore.locale === lang ? IconoirCheck : IconoirTranslate
  }
  const toggleLang = (lang) => {
    lostore.setLocale(lang)
  }

  const handleCommand = (cmd: string | number | object) => {
    switch (cmd) {
      case 'pwd':
        handleEditPwdDialog()
        break
      case 'exit':
        exit()
        break
      case 'color':
        toggleDark()
        break
      case 'locale_zhcn':
        toggleLang('zhCN')
        break
      case 'locale_zhtw':
        toggleLang('zhTW')
        break
      case 'locale_en':
        toggleLang('enUS')
        break
      case 'sysp':
        showSystemPreferencesDialog()
        break
      case 'author':
        router.push({ name: 'author' })
        break
      case 'user':
        break
      default:
        ElMessage.error(_t('common.unknown_menu_item'))
        break
    }
  }

  // ***************** 退出 ***************** //
  const exit = async () => {
    ElMessageBox.confirm(_t('common.confirm_exit'), _t('common.btn_exit'), {
      buttonSize: 'small',
      showClose: false,
      confirmButtonText: _t('common.btn_exit'),
      cancelButtonText: _t('common.btn_cancel'),
      type: 'warning',
    })
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
  const newBookDialog = defineAsyncComponent(
    () => import('~/components/book/EditBookDialog.vue'),
  )
  const bookDialogVisible = ref(false)

  const handleNewBookDialog = () => {
    openLoading()
    bookDialogVisible.value = true
    gostore.dialogPopup = true
  }
  const afterBookUpdated = (book: Book) => {
    router.push({ name: 'booklist', hash: '#newbook=' + book.id })
  }

  // ***************** 更改密码 ***************** //
  const editPwdDialog = defineAsyncComponent(
    () => import('~/components/user/EditPwdDialog.vue'),
  )
  const pwdDialogVisible = ref(false)
  const handleEditPwdDialog = () => {
    openLoading()
    pwdDialogVisible.value = true
    gostore.dialogPopup = true
  }

  // ***************** 更改密码 ***************** //
  const sysPrefDialog = defineAsyncComponent(
    () => import('~/components/preference/SystemPreferences.vue'),
  )
  const sysPrefDialogVisible = ref(false)
  const showSystemPreferencesDialog = () => {
    openLoading()
    sysPrefDialogVisible.value = true
    gostore.dialogPopup = true
  }

  // ***************** 搜索 ***************** //
  const searchDialog = defineAsyncComponent(
    () => import('~/components/SearchDialog.vue'),
  )
  const searchDialogVisible = ref(false)
  const handleSearchDialog = () => {
    openLoading()
    searchDialogVisible.value = true
    gostore.dialogPopup = true
  }

  // 对话框快捷键
  // @see searchShortcut，newbookShortcut
  const { meta_k, meta_b } = useMagicKeys()
  watch(meta_k, (v) => {
    if (v) {
      handleSearchDialog()
    }
  })
  watch(meta_b, (v) => {
    if (v) {
      handleNewBookDialog()
    }
  })
</script>
<style scoped>
  .pageheader-extra .ep-button + .ep-button {
    margin-left: 5px;
  }

  .pageheader-extra .dropdown {
    margin-left: 5px;
  }
</style>
