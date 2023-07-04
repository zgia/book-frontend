<template>
  <el-menu mode="horizontal" :ellipsis="false" style="margin-bottom: 18px;">
    <div class="flex-grow" />
    <el-menu-item index="7" h="full" @click="toggleDark()">
      <button class="border-none w-full bg-transparent cursor-pointer" style="height: var(--ep-menu-item-height);">
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>
  </el-menu>
</template>


<script lang="ts" setup>
import { toggleDark } from '~/composables';
</script>