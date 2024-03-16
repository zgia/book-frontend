<template>
  <el-config-provider size="default" namespace="ep" :locale="locale">
    <el-container direction="vertical">
      <el-header>
        <router-view name="header" />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <el-divider border-style="dashed">
          <span>zGia!</span> @ <span class="copy-year">{{ (new Date()).getFullYear() }} </span>
        </el-divider>
      </el-footer>
    </el-container>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus'
import { useOptionsStore, useLocaleStore } from './stores'
import zhCn from 'element-plus/dist/locale/zh-cn'
import en from 'element-plus/dist/locale/en'
import i18n from '~/locales';

const gostore = useOptionsStore()
const locstore = useLocaleStore()

// 更改分页导航中文短语
zhCn.el.pagination.total = '共 {total} 部书'

// 设置网页Title
const setWebTitle = () => {
  document.title = i18n.global.t('app.title')
}

// 初始化
setWebTitle()

// 监控 BaseHeaderExtra.vue toggleLang()
const locale = computed(() => (locstore.locale === 'zhCn' ? zhCn : en))
watch(() => locstore.locale, () => {
  setWebTitle()
})

// 调整页面宽度
window.onresize = () => {
  gostore.clientWidth = document.body.clientWidth
}
</script>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}
</style>