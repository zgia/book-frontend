<template>
  <h1
    >{{ pageTitle }} <xxsmall>{{ currentBook.title }}</xxsmall>
  </h1>
  <el-form
    class="editchapter"
    :model="opForm"
    ref="ruleFormRef"
    :label-position="lblPos"
    label-width="auto"
    :rules="rules"
    size="large"
  >
    <el-form-item :label="$t('volume.volume')">
      <el-select v-model="opForm.volumeid" clearable placeholder="选择卷">
        <el-option
          v-for="item in volumeData"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('chapter.edit_title_label')" prop="title">
      <el-input
        ref="titleRef"
        v-model.trim="opForm.title"
        clearable
        :autofocus="true"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item :label="$t('chapter.edit_content_label')" prop="content">
      <el-input
        type="textarea"
        v-model="opForm.content"
        :rows="16"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item :label="$t('chapter.edit_ext_label')">
      <el-col :span="replaSpan">
        <el-input
          clearable
          v-model="repla.searchValue"
          :placeholder="$t('chapter.edit_ext_search_select_placeholder')"
          autocomplete="off"
        >
          <template #append>
            <el-select
              clearable
              v-model="selectsv"
              :placeholder="$t('chapter.edit_ext_search_input_placeholder')"
              @change="selectSv()"
              style="width: 120px"
            >
              <el-option
                v-for="(key, item) in searchValues"
                :key="key"
                :label="key"
                :value="item"
              />
            </el-select>
          </template>
        </el-input>
      </el-col>
      <el-col :span="replaSpan" :offset="replaOffset">
        <el-input
          v-model="repla.replaceValue"
          clearable
          :placeholder="$t('chapter.edit_ext_replace_select_placeholder')"
          autocomplete="off"
        >
          <template #append>
            <el-select
              v-model="selectrv"
              clearable
              :placeholder="$t('chapter.edit_ext_replace_input_placeholder')"
              @change="selectRv()"
              style="width: 120px"
            >
              <el-option
                v-for="(key, item) in replaceValues"
                :key="key"
                :label="key"
                :value="item"
              />
            </el-select>
          </template>
        </el-input>
      </el-col>
    </el-form-item>
  </el-form>
  <div>
    <el-button-group>
      <el-button
        icon="IconoirPageSearch"
        type="primary"
        style="width: 100px"
        @click="replaceText()"
        >{{ $t('chapter.btn_replace') }}</el-button
      >
      <el-button
        icon="IconoirInfinite"
        type="primary"
        style="width: 100px"
        @click="formatContent()"
        >{{ $t('chapter.btn_format') }}</el-button
      >
      <el-button
        icon="IconoirRefreshDouble"
        type="primary"
        style="width: 100px"
        @click="restoreText()"
        >{{ $t('chapter.btn_restore') }}</el-button
      >
    </el-button-group>
  </div>
  <div style="padding-top: 10px">
    <el-button
      icon="IconoirCheck"
      type="success"
      style="width: 300px"
      @click="submitForm(ruleFormRef)"
      >{{ $t('common.btn_save') }}</el-button
    >
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, nextTick } from 'vue'
  import type { Ref } from 'vue'
  import type { ElInput, FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { BookService } from '~/http'
  import { intval } from '~/utils'
  import { Book, Volume, setBookInfo } from '~/models'
  import { useOptionsStore } from '~/stores'
  import { _t } from '~/locales'

  const gostore = useOptionsStore()
  gostore.headerIndex = 'editchapter'

  const router = useRouter()
  const route = useRoute()
  const bookid = intval(route.params.bookid)
  const chapterid = intval(route.params.chapterid)

  const pageTitle = chapterid
    ? _t('chapter.pagetitle_edit_chapter')
    : _t('chapter.pagetitle_add_chapter')

  const indent = '　　'

  // 扩展区域编辑框的长度
  const replaSpan = ref(10)
  const replaOffset = ref(1)
  const lblPos: Ref<'top' | 'right' | 'left'> = ref('left' as const)
  watch(
    () => gostore.clientWidth,
    (sw) => {
      lblPos.value = sw < 640 ? 'top' : 'left'

      replaSpan.value = sw < 640 ? 24 : 10
      replaOffset.value = sw < 640 ? 0 : 1
    },
    { immediate: true, deep: true },
  )

  const currentBook: Book = reactive({
    id: 0,
    title: '',
  })

  const searchValues = { '/^/': '/^/' }
  const replaceValues = { indent: indent }
  const repla = reactive({ searchValue: '/^/', replaceValue: indent })

  const selectsv = ref('')
  const selectrv = ref('')
  const selectSv = () => {
    repla.searchValue = selectsv.value
  }
  const selectRv = () => {
    repla.replaceValue = selectrv.value
  }

  const replaceText = () => {
    const p = repla.searchValue
    if (p.length < 1) {
      return
    }

    if (p[0] === '/' && p[p.length - 1] === '/') {
      const re = new RegExp(p.substring(1, p.length - 1), 'gm')
      opForm.content = opForm.content.replaceAll(re, repla.replaceValue)
    } else {
      opForm.content = opForm.content.replaceAll(p, repla.replaceValue)
    }
  }

  const restoreText = () => {
    opForm.content = originContent.value
  }

  const titleRef = ref<InstanceType<typeof ElInput>>()
  // 自动焦点
  onMounted(() => {
    nextTick(() => {
      titleRef.value!.input!.focus()
    })
  })

  const ruleFormRef = ref<FormInstance>()
  const opForm = reactive({
    id: chapterid,
    title: '',
    content: '',
    volumeid: 0,
    bookid: bookid,
  })
  const originContent = ref('')

  const rules = reactive<FormRules>({
    title: [
      {
        required: true,
        message: _t('chapter.edit_title_is_empty'),
        trigger: 'blur',
      },
    ],
    content: [
      {
        required: true,
        message: _t('chapter.edit_content_is_empty'),
        trigger: 'blur',
      },
    ],
  })

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        update()
      } else {
        console.log('CHAPERR: ' + _t('common.validated_error'), fields)
      }
    })
  }

  const update = () => {
    BookService.updateChapter(opForm)
      .then(() => {
        ElMessage.success(_t('chapter.saved_ok', { title: opForm.title }))

        if (chapterid) {
          router.push({
            name: 'chapter',
            params: { bookid: bookid, chapterid: chapterid },
          })
        } else {
          router.push({ name: 'book', params: { bookid: bookid } })
        }
      })
      .catch((err) => {
        ElMessage.error(
          'CHAPERR: ' +
            _t('chapter.saved_error', { err: err.messge || err.msg }),
        )
      })
  }

  const formatContent = () => {
    // 方法1
    // const reg = /([~|～|"|”|。|！｜」|？|…])\n/ug
    // opForm.content = opForm.content.replaceAll(reg, '$1' + '<br>').replaceAll(/\n/g, '').replaceAll('<br>', '\n')
    // 方法2
    // let txt = ''
    // opForm.content.split('\n').forEach((line) => {
    //   txt = txt + line
    //   if (line.length < 35) {
    //     txt = txt + '\n'
    //   }
    // })
    // 方法3
    opForm.content = opForm.content
      .replaceAll(/\n/g, '')
      .replaceAll(indent, '\n' + indent)
      .replace(/^\n/, '')
  }

  const getChapter = () => {
    if (chapterid === 0) {
      return
    }

    BookService.getChapter({ bookid: bookid, id: chapterid })
      .then((resp) => {
        const d = resp.data

        if (d.current) {
          opForm.title = d.current.title
          opForm.content = d.current.content as string
          opForm.volumeid = d.current.volumeid as number

          originContent.value = d.current.content as string
        }

        setBookInfo(currentBook, d.book)
      })
      .catch((err) => {
        ElMessage.error('CHAPERR: ' + (err.messge || err.msg))
      })
  }
  getChapter()

  const volumeData: Volume[] = reactive([])
  const getVolumes = () => {
    BookService.getVolumes({ bookid: bookid })
      .then((resp) => {
        const d = resp.data

        if (d.items.length === 0) {
          ElMessage.error('CHAPERR: ' + _t('chapter.add_volume_first'))

          router.push({ name: 'volumes', params: { bookid: bookid } })

          return
        }

        volumeData.push(...d.items)

        if (chapterid === 0) {
          opForm.volumeid = d.items[d.items.length - 1].id

          setBookInfo(currentBook, d.book)
        }
      })
      .catch((err) => {
        ElMessage.error('CHAPERR: ' + (err.messge || err.msg))
      })
  }

  getVolumes()
</script>
<style scoped>
  .editchapter .ep-input,
  .editchapter .ep-textarea {
    width: 100% !important;
  }

  .editchapter :deep(input.ep-input__inner) {
    font-size: 18px;
  }

  .editchapter :deep(textarea) {
    font-size: 18px;
  }
</style>
