<template>
  <div class="flex gap-2" style="flex-wrap: wrap">
    <el-tag
      v-for="(cat, id) in gostore.categories"
      :key="id"
      type="info"
      effect="plain"
      closable
      :disable-transitions="false"
      @close="handleDelete(cat, id)"
      @click="handleEditCategory(cat, id)"
      style="cursor: pointer"
    >
      {{ cat.title }} ({{ cat.bookcount }})
    </el-tag>
    <el-input
      v-if="newCatVisible"
      ref="newCatRef"
      v-model="newCatVal"
      class="w-20"
      size="small"
      @keyup.enter="saveNewCategory"
      @blur="saveNewCategory"
    />
    <el-button
      v-else
      size="small"
      icon="IconoirGridAdd"
      @click="handleNewCategoryInput"
      >{{ $t('config.btn_new_category') }}
    </el-button>
  </div>
  <div style="margin-top: 20px; text-align: left">
    <el-text class="mx-1" size="small"
      ><el-icon>
        <i-iconoir-info-circle />
      </el-icon>
      {{ $t('config.category_edition_click_to_edit') }}</el-text
    >
  </div>
</template>
<script lang="ts" setup>
  import { nextTick } from 'vue'
  import { ElInput, ElMessage, ElMessageBox } from 'element-plus'
  import { ConfigService } from '~/http'
  import { useOptionsStore } from '~/stores'
  import { Category } from '~/models'
  import { _t } from '~/locales'

  const gostore = useOptionsStore()

  const newCatVal = ref('')
  const newCatVisible = ref(false)
  const newCatRef = ref<InstanceType<typeof ElInput>>()

  const handleDelete = (cat: Category, idx: number) => {
    ElMessageBox.confirm(
      _t('config.confirm_delete_category', { title: cat.title }),
      {
        buttonSize: 'small',
        showClose: false,
        confirmButtonText: _t('common.btn_delete'),
        cancelButtonText: _t('common.btn_cancel'),
        type: 'warning',
      },
    )
      .then(() => {
        deleteCategory(cat, idx)
      })
      .catch(() => {
        // 放弃
      })
  }

  const deleteCategory = (cat: Category, idx: number) => {
    ConfigService.deleteCategory({ id: cat.id })
      .then(() => {
        gostore.categories.splice(idx, 1)

        ElMessage.success(_t('config.category_deleted_ok'))
      })
      .catch((err) => {
        ElMessage.error('CNFERR: ' + (err.messge || err.msg))
      })
  }

  const handleEditCategory = (cat: Category, idx: number) => {
    ElMessageBox.prompt(_t('config.category_edition'), {
      buttonSize: 'small',
      showClose: false,
      confirmButtonText: _t('common.btn_save'),
      cancelButtonText: _t('common.btn_cancel'),
      inputValue: cat.title,
      inputValidator: (val) => {
        return val ? true : _t('config.category_edition_title_is_empy')
      },
    })
      .then(({ value }) => {
        console.log(value, cat.title)
        if (value && value !== cat.title) {
          updateCategory({ id: cat.id, parentid: cat.parentid, title: value })

          // 更新原来的分类名称
          gostore.categories[idx].title = value
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const saveNewCategory = () => {
    if (newCatVal.value) {
      const cat = { id: 0, parentid: 0, title: newCatVal.value }
      updateCategory(cat)

      // 新加一个分类
      gostore.categories.push(cat)
    }

    newCatVisible.value = false
    newCatVal.value = ''
  }

  const handleNewCategoryInput = () => {
    newCatVisible.value = true
    nextTick(() => {
      newCatRef.value!.input!.focus()
    })
  }

  const updateCategory = (cat: Category) => {
    ConfigService.updateCategory(cat)
      .then(() => {
        const msg = cat.id
          ? 'config.category_edited_ok'
          : 'config.category_added_ok'
        ElMessage.success(_t(msg))
      })
      .catch((err) => {
        ElMessage.error('UCPERR: ' + (err.messge || err.msg))
      })
  }

  // 进入就，重新加载
  useOptionsStore().getOptions()
</script>
