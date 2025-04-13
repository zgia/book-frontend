<template>
  <h1
    >{{ currentBook.title }}<xxsmall>{{ currentBook.alias }}</xxsmall>
  </h1>
  <h2
    >{{ currentBook.author }}
    <xxsmall v-if="currentBook.author_former_name"
      >曾用名: {{ currentBook.author_former_name }}</xxsmall
    >
  </h2>
  <div class="book-info text-left">
    <h2
      >{{ $t('chapter.summary') }}
      <el-tag round effect="plain" type="info">{{ bookCategory() }}</el-tag></h2
    >
    <div v-if="currentBook.rate">
      评分：
      <component
        v-for="item in [1, 2, 3, 4, 5]"
        :key="item"
        :is="iconRateStar(currentBook.rate, item)"
        :class="iconRateStarClass(currentBook.rate, item)"
      />
    </div>
    <div class="book-summary">
      <div class="summary">
        <div v-html="summary()"></div>
        <p class="source" v-if="currentBook.source">{{
          $t('book.book_source', { source: currentBook.source })
        }}</p>
      </div>
      <p class="cover" v-if="currentBook.cover">
        <el-image
          :src="currentBook.cover"
          :preview-src-list="[currentBook.cover]"
          fit="cover"
        />
      </p>
    </div>
  </div>
  <div class="book-func text-right">
    <el-button-group>
      <el-button icon="IconoirEdit" type="primary" @click="handleEditBook()">{{
        $t('book.btn_edit_book')
      }}</el-button>
      <el-button
        icon="IconoirMultiplePages"
        type="primary"
        @click="handleVolume(bookid)"
        >{{ $t('common.btn_volume') }}</el-button
      >
      <el-button
        :icon="IconoirDownloadCircle"
        type="primary"
        @click="handleDownload"
      />
    </el-button-group>
    <el-button-group style="margin-left: 5px">
      <el-button
        icon="IconoirAddPage"
        type="primary"
        @click="handleEdit(bookid)"
        :disabled="noVolume"
        >{{ $t('common.btn_new_chapter') }}</el-button
      >
      <el-button
        icon="IconoirPageEdit"
        type="primary"
        @click="editMode = !editMode"
      />
    </el-button-group>
  </div>
  <h2 class="text-left"
    >{{ $t('common.bookindex') }}
    <xxsmall v-if="currentBook.isfinished"
      >{{ $t('book.finished_book') }}
    </xxsmall>
    <xxsmall v-else>
      {{ $t('chapter.beupto') }} {{ currentBook.latest }}</xxsmall
    >
  </h2>
  <el-row v-for="(volume, vidx) in volumeData" :index="volume.id" :key="vidx">
    <el-col class="text-left">
      <div
        class="volinfo is-light volinfo-bgimg"
        :style="{ backgroundImage: 'url(' + volume.cover + ')' }"
      >
        <div class="volinfo-content">
          <h2 class="volinfo-title">
            <el-icon
              @click="handleReadVol(volume)"
              :title="$t('chapter.read_volume_chapters')"
              class="read-btn"
            >
              <IconoirMultiplePages />
            </el-icon>
            {{
              volume.title === currentBook.title
                ? $t('chapter.default_volume')
                : volume.title
            }}
            <xxsmall v-if="chapterData[volume.id]">
              ({{
                $t('chapter.total', {
                  total: chapterData[volume.id].length,
                })
              }})
            </xxsmall>
          </h2>
          <div class="volinfo-description">
            <xxsmall v-if="volume.summary" v-html="nl2br(volume.summary)" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col
      class="chapters-list"
      :xs="24"
      :sm="12"
      :md="8"
      :lg="6"
      :xl="3"
      v-for="(chapter, index) in chapterData[volume.id]"
      :index="chapter.id"
      :key="index"
    >
      <el-button
        class="chapter-link"
        v-if="chapter"
        @click="handleRead(bookid, chapter.id)"
        >{{ subTitle(chapter.title) }}</el-button
      >
      <p v-if="editMode">
        <el-button-group>
          <el-button
            text
            size="small"
            icon="IconoirPageEdit"
            @click="handleEdit(bookid, chapter.id)"
          />
          <el-button
            text
            size="small"
            icon="IconoirTrash"
            @click="handleDelete(index, chapter, volume.id)"
          />
        </el-button-group>
      </p>
    </el-col>
  </el-row>
  <el-backtop />
  <editBookDialog
    v-if="editBookVisible"
    :book="currentBook"
    @hide="editBookVisible = false"
    @update="afterBookUpdated"
    @close-loading="closeLoading"
  />
</template>
<script lang="ts" setup>
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { IconoirDownloadCircle } from '~/composables'
  import { BookService } from '~/http'
  import { Book, Chapter, Volume, setBookInfo } from '~/models'
  import { nl2br, intval } from '~/utils'
  import { useOptionsStore } from '~/stores'
  import { _t } from '~/locales'

  const gostore = useOptionsStore()
  gostore.headerIndex = 'book'

  const router = useRouter()
  const route = useRoute()
  const bookid = intval(route.params.bookid)

  // 加载动画
  const fsLoading = ref(false)
  const openLoading = () => {
    fsLoading.value = true
  }
  const closeLoading = () => {
    fsLoading.value = false
  }

  const editMode = ref(false)

  // 调整页面宽度
  const screenWidth = ref(document.body.clientWidth)
  window.onresize = () => {
    screenWidth.value = document.body.clientWidth
  }

  // 当前操作的
  const currentBook: Book = reactive({
    id: 0,
    categoryid: '',
    title: '',
    author: '',
    author_former_name: '',
    summary: '',
    source: '',
    cover: '',
  })

  const bookCategory = () => {
    return currentBook.categoryid
      ? gostore.categoryMap[currentBook.categoryid]
      : ''
  }

  const iconRateStar = (rate: number, idx: number) => {
    return idx <= rate ? 'IconoirStarSolid' : 'IconoirStar'
  }
  const iconRateStarClass = (rate: number, idx: number) => {
    return idx <= rate ? 'is-active-rate' : 'is-unactive-rate'
  }

  // 缩短字数过长的标题
  const subTitle = (title: string, len = 20) => {
    if (screenWidth.value <= 992) {
      len = 25
    }

    return title.length > len ? title.substring(0, len) + '...' : title
  }

  const summary = () => {
    return nl2br(currentBook.summary)
  }

  // ***************** 编辑图书 ***************** //
  const editBookDialog = defineAsyncComponent(
    () => import('./EditBookDialog.vue'),
  )
  const editBookVisible = ref(false)

  // 更新图书信息
  const afterBookUpdated = (book: Book) => {
    setBookInfo(currentBook, book)
  }

  // 编辑图书
  const handleEditBook = () => {
    openLoading()

    editBookVisible.value = true
  }

  // ***************** 下载图书 ***************** //
  const downloading = ref(false)
  const handleDownload = () => {
    ElMessageBox.confirm(
      _t('chapter.confirm_download_chapter', { title: currentBook.title }),
      currentBook.title,
      {
        buttonSize: 'small',
        showClose: false,
        confirmButtonText: _t('common.btn_download'),
        cancelButtonText: _t('common.btn_cancel'),
        type: 'info',
        icon: markRaw(IconoirDownloadCircle),
      },
    )
      .then(() => {
        downloading.value = true

        ElMessage.info(_t('book.start_downloading'))

        const filename = currentBook.title + '.zip'
        BookService.download({ id: bookid }, filename)
          .then(() => {
            ElMessage.success(
              _t('book.book_downloaded_ok', { title: filename }),
            )
          })
          .catch((err) => {
            ElMessage.error(
              _t('book.book_downloaded_error', {
                title: err.messge || err.msg,
              }),
            )
          })
          .finally(() => {
            downloading.value = false
          })
      })
      .catch(() => {
        // 放弃下载
      })
  }

  // ***************** 删除章节 ***************** //
  const handleDelete = (index: number, row: Chapter, volumeid: number) => {
    ElMessageBox.confirm(
      _t('chapter.confirm_delete_chapter', { title: row.title }),
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
        BookService.deleteChapter({ bookid: bookid, id: row.id })
          .then(() => {
            chapterData[volumeid].splice(index, 1)
            ElMessage.success(_t('chapter.chapter_deleted_ok'))
          })
          .catch((err) => {
            ElMessage.error(
              'CHAPERR: ' +
                _t('common.deleted_error', { err: err.messge || err.msg }),
            )
          })
      })
      .catch(() => {
        // 不删除
      })
  }

  // 编辑章节
  const handleEdit = (bookid: number, chapterid = 0) => {
    router.push({
      name: 'editchapter',
      params: { bookid: bookid, chapterid: chapterid },
    })
  }

  // 阅读某章节
  const handleRead = (bookid: number, chapterid: number) => {
    router.push({
      name: 'chapter',
      params: { bookid: bookid, chapterid: chapterid },
    })
  }

  // 读当前卷
  const handleReadVol = (vol: Volume) => {
    router.push({
      name: 'volumechapters',
      params: { bookid: currentBook.id, volumeid: vol.id },
    })
  }

  // 卷管理
  const handleVolume = (bookid: number) => {
    router.push({ name: 'volumes', params: { bookid: bookid } })
  }

  // ***************** 章节 ***************** //
  const chapterData = reactive({ string: [] })
  const volumeData: Volume[] = reactive([])

  // 没有卷，需要添加一个卷，才能添加新的章节
  const noVolume = ref(false)

  const getChapters = () => {
    BookService.getChapters({ bookid: bookid })
      .then((resp) => {
        setBookInfo(currentBook, resp.data.book)

        if (resp.data.volumes.length === 1 && resp.data.volumes[0].id === 0) {
          noVolume.value = true

          ElMessage.error('CHAPERR：' + _t('chapter.add_volume_first'))

          return
        }

        volumeData.length = 0
        volumeData.push(...resp.data.volumes)

        for (var i in resp.data.items) {
          if (resp.data.items[i]) {
            chapterData[i] = resp.data.items[i]
          }
        }
      })
      .catch((err) => {
        ElMessage.error('CHAPERR: ' + (err.messge || err.msg))
      })
  }

  getChapters()
</script>
<style scoped>
  h1 {
    font-size: 2.5em;
  }

  .book-info .is-active-rate {
    color: #f7ba2a;
    vertical-align: text-bottom;
  }

  .book-info .is-unactive-rate {
    color: #cccccc;
    vertical-align: text-bottom;
  }

  .book-info .book-summary {
    display: flex;
    justify-content: space-between;
  }

  .book-info .summary {
    color: var(--ep-text-color-regular);
    font-size: 12px;
    width: fit-content;
  }

  .book-info .cover {
    width: 200px;
    text-align: right;
  }

  .chapters-list {
    line-height: 25px;
    padding: 5px 0;
  }

  .chapters-list .chapter-link {
    border: 0 !important;
    height: 40px !important;
    width: 100%;
  }

  .volinfo.is-light {
    background-color: var(--ep-color-info-light-9);
    color: var(--ep-color-info);
  }

  .volinfo {
    --volinfo-padding: 8px 16px;
    --volinfo-border-radius-base: var(--ep-border-radius-base);
    --volinfo-title-font-size: 18px;
    --volinfo-description-font-size: 12px;
    --volinfo-read-font-size: 12px;
    width: 100%;
    padding: var(--volinfo-padding);
    margin: 0;
    box-sizing: border-box;
    border-radius: var(--volinfo-border-radius-base);
    position: relative;
    background-color: var(--ep-color-white);
    overflow: hidden;
    opacity: 1;
    display: flex;
    align-items: center;
    transition: opacity var(--ep-transition-duration-fast);
  }

  .volinfo-bgimg {
    background-repeat: no-repeat;
    background-position-x: right;
    background-size: 100px;
  }

  .volinfo-title {
    font-size: var(--volinfo-title-font-size);
    line-height: 18px;
    font-weight: bold;
    vertical-align: text-top;
  }

  .volinfo-content {
    display: table-cell;
    padding: 0 8px;
  }

  .volinfo.is-light .volinfo-description {
    color: var(--ep-color-info);
  }

  .volinfo .volinfo-description {
    font-size: var(--volinfo-description-font-size);
    margin: 5px 0 0 0;
    padding-right: 120px;
  }

  .volinfo .read-btn {
    vertical-align: text-bottom;
    cursor: pointer;
  }
</style>
