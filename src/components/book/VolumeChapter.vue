<template>
  <h1>{{ currentVolume.title }}</h1>
  <h4 @click="bookIndex()">{{ currentBook.title }}</h4>
  <el-row>
    <el-col :xs="0" :sm="2" :md="4"></el-col>
    <el-col :xs="24" :sm="20" :md="16">
      <div class="content" v-html="nl2br(volContent)" />
    </el-col>
  </el-row>
  <el-backtop />
</template>
<script lang="ts" setup>
  import { ElMessage } from 'element-plus'
  import { BookService } from '~/http'
  import { nl2br, intval } from '~/utils'
  import { Book, Volume, setBookInfo } from '~/models'
  import { useOptionsStore } from '~/stores'
  const gostore = useOptionsStore()
  gostore.headerIndex = 'volumechapter'

  const router = useRouter()
  const route = useRoute()
  const bookid = ref(intval(route.params.bookid))
  const volumeid = ref(intval(route.params.volumeid))

  const currentBook: Book = reactive({
    id: 0,
    title: '',
  })

  const currentVolume: Volume = reactive({
    id: 0,
    title: '',
  })

  const volContent = ref('')

  const bookIndex = () => {
    router.push({ name: 'book', params: { bookid: bookid.value } })
  }

  const getBook = (bookid: number) => {
    BookService.getBook({ id: bookid })
      .then((resp) => {
        setBookInfo(currentBook, resp.data)
      })
      .catch((err) => {
        ElMessage.error('VOLCONTERR: ' + (err.messge || err.msg || err))
      })
  }

  const getVolume = (bookid: number, volumeid: number) => {
    BookService.getVolume({ bookid: bookid, id: volumeid })
      .then((resp) => {
        currentVolume.title = resp.data.title
        currentVolume.id = resp.data.id
      })
      .catch((err) => {
        ElMessage.error('VOLCONTERR: ' + (err.messge || err.msg || err))
      })
  }

  // ***************** 章节 ***************** //
  const getVolumeChapters = (bookid: number, volumeid: number) => {
    BookService.getVolumeChapters({ bookid: bookid, id: volumeid })
      .then((resp) => {
        volContent.value = resp.data.content
      })
      .catch((err) => {
        const msg = err.messge || err.msg || err
        ElMessage.error('VOLCONTERR: ' + msg)
      })
  }

  getBook(bookid.value)
  getVolume(bookid.value, volumeid.value)
  getVolumeChapters(bookid.value, volumeid.value)
</script>
<style scoped>
  div.content {
    text-align: left;
    line-height: 40px;
    font-size: x-large;
  }

  div.content p {
    font-size: 22px;
  }
</style>
