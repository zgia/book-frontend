<template>
  <h1
    >{{ $t('volume.volume_management') }}
    <xxsmall>{{ currentBook.title }}</xxsmall>
  </h1>
  <el-row>
    <el-col :span="24" style="text-align: right; padding-bottom: 10px">
      <el-button
        type="primary"
        icon="IconCustomAddBook"
        @click="handleNewVolDialog()"
        class="btn-search"
        >{{ $t('volume.pagetitle_add_volume') }}</el-button
      >
    </el-col>
  </el-row>
  <el-table
    v-loading="fsLoading"
    :header-row-class-name="tableHeadClass"
    :data="tableData"
    :highlight-current-row="true"
    stripe
    border
  >
    <el-table-column prop="id" label="ID" width="100" />
    <el-table-column prop="title" :label="$t('volume.title')" width="300" />
    <el-table-column
      type="index"
      prop="cover"
      :label="$t('volume.cover')"
      width="300"
    >
      <template #default="scope">
        <el-image
          v-if="scope.row.cover"
          :preview-src-list="coverPreviewList"
          :initial-index="scope.$index"
          :src="scope.row.cover"
          fit="cover"
          loading="lazy"
          :preview-teleported="true"
        />
        <div v-else>-</div>
      </template>
    </el-table-column>
    <el-table-column :label="$t('volume.summary')">
      <template #default="scope">
        <div
          v-if="scope.row.summary"
          style="text-align: left; line-height: 40px; font-size: larger"
          v-html="nl2br(scope.row.summary)"
        />
        <div v-else>-</div>
      </template>
    </el-table-column>
    <el-table-column fixed="right" :label="$t('common.operation')" width="100">
      <template #default="scope">
        <el-button-group>
          <el-button
            text
            size="small"
            icon="IconoirEdit"
            @click="handleEdit(scope.$index, scope.row)"
          />
          <el-button
            text
            size="small"
            icon="IconoirTrash"
            @click="handleDelete(scope.$index, scope.row)"
          />
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
  <newVolumeDialog
    v-if="newVolumeVisible"
    :volume="currentVol"
    @hide="newVolumeVisible = false"
    @update="afterVolUpdated"
    @close-loading="closeLoading"
  />
</template>
<script lang="ts" setup>
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { BookService } from '~/http'
  import { Book, Volume, setBookInfo } from '~/models'
  import { nl2br, intval } from '~/utils'
  import { useOptionsStore } from '~/stores'
  import { _t } from '~/locales'

  const gostore = useOptionsStore()
  gostore.headerIndex = 'bookvolumes'

  const route = useRoute()
  const bookid = intval(route.params.bookid)

  const tableHeadClass = () => {
    return 'table-head'
  }

  // 加载动画
  const fsLoading = ref(false)
  const openLoading = () => {
    fsLoading.value = true
  }
  const closeLoading = () => {
    fsLoading.value = false
  }

  // 当前操作的
  const currentBook: Book = reactive({ id: 0, title: '' })
  const currentVol: Volume = reactive({ id: 0, title: '' })
  const currentVolIdx = ref(0)

  // ***************** 新建 ***************** //
  const newVolumeDialog = defineAsyncComponent(
    () => import('./EditVolumeDialog.vue'),
  )
  const newVolumeVisible = ref(false)

  // 打开新建对话框
  const handleNewVolDialog = () => {
    const row: Volume = {
      id: 0,
      bookid: bookid,
      title: '',
      summary: '',
    }

    showNewVolumeDialog(0, row)
  }

  const afterVolUpdated = (vol: Volume) => {
    if (currentVol.id === 0) {
      tableData.push(vol)
    } else {
      tableData[currentVolIdx.value] = vol
    }
  }

  const handleEdit = (index: number, row: Volume) => {
    showNewVolumeDialog(index, row)
  }

  const showNewVolumeDialog = (index: number, row: Volume) => {
    openLoading()

    row.bookid = bookid
    for (var i in row) {
      currentVol[i] = row[i]
    }

    currentVolIdx.value = index
    newVolumeVisible.value = true
  }
  // ***************** 编辑 ***************** //

  // ***************** 删除 ***************** //
  const handleDelete = (index: number, row) => {
    ElMessageBox.confirm(
      _t('volume.confirm_delete_volume', { title: row.title }),
      currentBook.title,
      {
        buttonSize: 'small',
        showClose: false,
        confirmButtonText: _t('common.btn_delete'),
        confirmButtonClass: 'ep-button--danger',
        cancelButtonText: _t('common.btn_cancel'),
        type: 'warning',
      },
    )
      .then(() => {
        BookService.deleteVolume({ bookid: bookid, id: row.id })
          .then(() => {
            tableData.splice(index, 1)
            ElMessage.success(_t('volume.volume_deleted_ok'))
          })
          .catch((err) => {
            ElMessage.error(
              'VOLDERR: ' +
                _t('common.deleted_error', { err: err.messge || err.msg }),
            )
          })
      })
      .catch(() => {
        // 不删除
      })
  }
  // ***************** 删除 ***************** //

  const coverPreviewList = reactive([]) as any
  const tableData: Volume[] = reactive([])

  const getVolumes = () => {
    BookService.getVolumes({ bookid: bookid })
      .then((resp) => {
        const d = resp.data

        tableData.length = 0
        tableData.push(...d.items)

        d.items.forEach((item) => {
          if (item.cover) {
            coverPreviewList.push(item.cover)
          }
        })

        setBookInfo(currentBook, d.book)
      })
      .catch((err) => {
        ElMessage.error('VOLSERR: ' + (err.messge || err.msg))
      })
  }

  getVolumes()
</script>
