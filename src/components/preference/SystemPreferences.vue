<template>
  <el-dialog :model-value="true" top="8vh" :close-on-press-escape="false" :before-close="handleClose"
    @opened="closeLoading" :title="$t('config.system_preferences')" :width="props.dgwidth">
    <el-tabs v-model="activeTabName" class="demo-tabs" @tab-click="handleClickTab">
      <el-tab-pane :label="$t('config.category')" name="category">
        <CategoryForm />
      </el-tab-pane>
      <el-tab-pane label="Other" name="other">Other</el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-divider />
      <span class="dialog-footer">
        <el-button size="small" icon="Close" @click="hideme()">{{ $t('common.btn_cancel') }}</el-button>
        <el-button size="small" icon="Check" type="primary" @click="hideme()">{{ $t('common.btn_save') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'
import CategoryForm from '~/components/preference/CategoryForm.vue'

const activeTabName = ref('category')
// 对话框宽度
const props = defineProps(['dgwidth'])

const handleClickTab = (tab: TabsPaneContext, event: Event) => {
  console.log('system preferences', tab, event)
}

// 关闭窗口
const handleClose = (done: () => void) => {
  hideme()
  done()
}

const emit = defineEmits(['hide', 'closeLoading'])
const closeLoading = () => {
  emit('closeLoading')
}

const hideme = () => {
  emit('hide')
}

</script>
