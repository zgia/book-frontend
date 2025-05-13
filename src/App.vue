<template>
  <el-config-provider size="default" namespace="ep" :locale="locale">
    <el-container direction="vertical">
      <el-header>
        <router-view name="header" />
      </el-header>
      <el-main>
        <router-view v-slot="{ Component }">
          <keep-alive include="Book">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
      <el-footer>
        <el-divider border-style="dashed">
          <span>{{ VITE_COPYRIGHT }}</span> @
          <span class="copy-year">{{ new Date().getFullYear() }} </span>
        </el-divider>
      </el-footer>
    </el-container>
  </el-config-provider>
</template>
<script lang="ts" setup>
  import { useTitle } from '@vueuse/core'
  import { ElConfigProvider } from 'element-plus'
  import { useOptionsStore, useLocaleStore } from './stores'
  import zhCN from 'element-plus/dist/locale/zh-cn'
  import zhTW from 'element-plus/dist/locale/zh-tw'
  import enUS from 'element-plus/dist/locale/en'
  import { _t } from '~/locales'

  const gostore = useOptionsStore()
  const lostore = useLocaleStore()

  const VITE_COPYRIGHT = import.meta.env.VITE_COPYRIGHT

  // // 更改分页导航中文短语
  // zhCN.el.pagination.total = '共 {total} 部书'
  // zhTW.el.pagination.total = '共 {total} 部書'

  // 设置网页Title
  const setWebTitle = () => {
    useTitle(_t('app.title'))
  }

  // 初始化
  setWebTitle()

  // 监控 BaseHeaderExtra.vue toggleLang()
  const locale = computed(() =>
    lostore.locale === 'enUS' ? enUS : lostore.locale === 'zhTW' ? zhTW : zhCN
  )
  watch(
    () => lostore.locale,
    () => {
      setWebTitle()
    }
  )

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
