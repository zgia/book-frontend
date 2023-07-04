<template>
  <h1>{{ pageTitle }} <xxsmall>{{ currentBook.title }}</xxsmall>
  </h1>
  <el-form class="editchapter" :model="opForm" ref="ruleFormRef" :label-position="lblPos" label-width="auto"
    :rules="rules" size="large">
    <el-form-item label="卷">
      <el-select size="large" v-model="opForm.volumeid" placeholder="选择卷">
        <el-option v-for="item in volumeData" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="章节名" prop="title">
      <el-input size="large" v-model="opForm.title" autocomplete="off" />
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input type="textarea" v-model="opForm.content" rows="20" autocomplete="off" />
    </el-form-item>
  </el-form>
  <el-button size="large" :icon="Finished" type="success" @click="formatContent()">格式化</el-button>
  <el-button size="large" icon="Check" type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
</template>

<style scoped>
.editchapter .ep-input,
.editchapter .ep-textarea {
  width: 100% !important;
}
</style>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { Finished } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { BookService } from '~/utils/api'
import { intval } from '~/utils/tools'
import { Book, Volume } from '~/models/book'
import useOptionsStore from '~/stores/options'
const gostore = useOptionsStore()
gostore.headerIndex = 'editchapter'

const router = useRouter()
const route = useRoute()
const bookid = intval(route.params.bookid)
const chapterid = intval(route.params.chapterid)

const pageTitle = chapterid ? '编辑文章' : '新文章'

const screenWidth = ref(document.body.clientWidth)
window.onresize = () => {
  screenWidth.value = document.body.clientWidth
}

const lblPos: Ref<'top' | 'right' | 'left'> = ref('left' as const)
watch(screenWidth, (sw) => {
  lblPos.value = sw < 640 ? 'top' : 'left'
}, { immediate: true, deep: true })

const currentBook: Book = reactive({
  id: 0,
  title: '',
})

const ruleFormRef = ref<FormInstance>()
const opForm = reactive({
  id: chapterid,
  title: '',
  content: '',
  volumeid: '',
  bookid: bookid
})

const rules = reactive<FormRules>({
  title: [
    { required: true, message: '需要填写章节名称', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '需要填写章节内容', trigger: 'blur' },
  ]

})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      update()
    } else {
      console.log('CONTERR: 验证出错，请重新输入。', fields)
    }
  })
}

const update = () => {
  BookService.updateChapter(opForm).then(
    () => {
      ElMessage.success('图书（' + opForm.title + '）信息保存成功。')

      router.push({ name: 'chapters', params: { 'bookid': bookid } })
    }
  ).catch(
    err => {
      ElMessage.error('CONTCERR: ' + (err.messge || err.msg))
    }
  )
}

const formatContent = () => {
  const reg = /([~|～|"|”|。|！｜」|？|…])\n/ug
  opForm.content = opForm.content.replaceAll(reg, '$1' + '<br>').replaceAll(/\n/g, '').replaceAll('<br>', '\n')
}

const getChapter = () => {
  if (chapterid == 0) { return }

  BookService.getChapter({ bookid: bookid, id: chapterid }).then(
    resp => {
      const d = resp.data

      if (d.current) {
        opForm.title = d.current.title
        opForm.content = d.current.content
        opForm.volumeid = d.current.volumeid
      }

      currentBook.id = bookid
      currentBook.title = d.book.title

      if (!gostore.book) {
        gostore.book = currentBook
      }
    }
  ).catch(
    err => {
      ElMessage.error('CONTERR: ' + (err.messge || err.msg))
    }
  )
}
getChapter()

const volumeData: Volume[] = reactive([])
const getVolumes = () => {
  BookService.getVolumes({ bookid: bookid }).then(
    resp => {
      const d = resp.data
      volumeData.push(...d.items)

      if (chapterid == 0) {
        if (d.items.length == 1) {
          opForm.volumeid = d.items[0].id
        }

        currentBook.id = bookid
        currentBook.title = d.book.title

        if (!gostore.book) {
          gostore.book = currentBook
        }
      }
    }
  ).catch(
    err => {
      ElMessage.error('CONTVERR: ' + (err.messge || err.msg))
    }
  )
}

getVolumes()

</script>
