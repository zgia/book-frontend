<template>
  <el-config-provider size="default" namespace="ep">
    <el-container direction="vertical">
      <el-header>
        <router-view name="header" />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>
        <el-divider border-style="dashed"> zGia! <button @click="toggleDark()" class="border-none bg-transparent cursor-pointer"><i inline-flex
              i="dark:ep-moon ep-sunny" /></button> {{ (new Date()).getFullYear() }} </el-divider>
      </el-footer>
    </el-container>
  </el-config-provider>
</template>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}
</style>

<script lang="ts" setup>
import { toggleDark } from '~/composables';
</script>