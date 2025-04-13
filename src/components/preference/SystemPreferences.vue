<template>
  <el-dialog
    :model-value="true"
    top="8vh"
    close-icon="IconoirXmarkCircle"
    :close-on-press-escape="false"
    :before-close="handleClose"
    @opened="closeLoading"
    :title="$t('config.system_preferences')"
    :width="props.dgwidth"
  >
    <el-tabs
      v-model="activeTabName"
      class="demo-tabs"
      @tab-click="handleClickTab"
    >
      <el-tab-pane :label="$t('config.category')" name="category">
        <CategoryForm />
      </el-tab-pane>
      <el-tab-pane label="Other" name="other">
        <el-descriptions title="">
          <el-descriptions-item label="Data Size"
            >{{ dataSize }} MB</el-descriptions-item
          >
        </el-descriptions>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-divider />
      <span class="dialog-footer">
        <el-button size="small" icon="IconoirXmark" @click="hideme()">{{
          $t('common.btn_cancel')
        }}</el-button>
        <el-button
          size="small"
          icon="IconoirCheck"
          type="primary"
          @click="hideme()"
          >{{ $t('common.btn_save') }}</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import type { TabsPaneContext } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { useOptionsStore } from '~/stores'
  import CategoryForm from '~/components/preference/CategoryForm.vue'
  import { BookService } from '~/http'

  const gostore = useOptionsStore()

  const activeTabName = ref('category')
  // 对话框宽度
  const props = defineProps(['dgwidth'])

  const handleClickTab = (tab: TabsPaneContext, event: Event) => {
    console.log('system preferences', tab, event)
  }

  const dataSize = ref(0)
  const getBooksSize = () => {
    BookService.booksSize()
      .then((resp) => {
        dataSize.value = resp.data.data_size
      })
      .catch((err) => {
        ElMessage.error('BooksSize: ' + (err.messge || err.msg))
      })
  }

  getBooksSize()

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
    gostore.dialogPopup = false
    emit('hide')
  }
</script>
