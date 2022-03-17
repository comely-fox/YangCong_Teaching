<template>
  <div class="app-container">
    <el-card style="height: 100%">
      <template v-slot:header>
        <h1 class="title">洋葱教学视频下载</h1>
      </template>
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学科" :label-width="60">
              <el-select
                placeholder="请选择学科"
                v-model="subject.name"
                :disabled="button.loading"
              >
                <el-option
                  v-for="(item, index) in subject.data"
                  :value="item.name"
                  :label="item.name"
                  :key="item.id"
                  @click="setDefault(index, 0, 0, 0)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级" :label-width="60">
              <el-select
                placeholder="请选择年级"
                v-model="stage.name"
                :disabled="button.loading"
              >
                <el-option
                  v-for="(item, index) in stage.data"
                  :key="item.id"
                  :value="item.name"
                  :label="item.name"
                  @click="setDefault(null, index, 0, 0)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出版者" :label-width="60">
              <el-select
                placeholder="请选择出版社"
                v-model="publisher.name"
                :disabled="button.loading"
              >
                <el-option
                  v-for="(item, index) in publisher.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                  @click="setDefault(null, null, index, 0)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学期" :label-width="60">
              <el-select
                v-model="semester.name"
                placeholder="请选择学期"
                :disabled="button.loading"
              >
                <el-option
                  v-for="(item, index) in semester.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                  @click="setDefault(null, null, null, index)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :style="{
              'text-align': 'center',
              'justify-content': 'center',
              'margin-top': '20px'
            }"
          >
            <el-button
              type="primary"
              @click="onSubmit"
              style="width: 120px"
              :loading="button.loading"
              :disabled="button.disabled"
              >{{ button.loading ? '下载中' : '下载' }}</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <el-progress
        :percentage="percentage"
        :style="{ marginTop: '30px' }"
      ></el-progress>

      <ToDownloadList :data="tableData" :index="listIndex"></ToDownloadList>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import ToDownloadList from '@/components/ToDownloadList.vue'
import { inject, reactive, ref, computed, toRaw } from 'vue'
import { io, Socket } from 'socket.io-client'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { mapMutations, useStore } from 'vuex'
import {
  VideosResult,
  StoreBooksIds,
  AllInterface,
  FormFeild,
  ButtonStatus
} from 'index'
import { AxiosResponse } from 'axios'

let allBooks: FormFeild[]
const tableData = ref<VideosResult[]>([])
const store = useStore()
const $thisStore = { $store: store }
const $books = toRaw<StoreBooksIds>(store.state.books)
let { setData: setStore } = mapMutations(['setData'])

// methods
setStore = setStore.bind($thisStore)
const $api = inject<AllInterface>('$api')

const subject = reactive<FormFeild>({
  id: 0,
  index: 0,
  name: '',
  data: []
})
const stage = reactive<FormFeild>({
  id: 0,
  index: 0,
  name: '',
  data: []
})
const publisher = reactive<FormFeild>({
  id: 0,
  index: 0,
  name: '',
  data: []
})
const semester = reactive<FormFeild>({
  id: 0,
  index: 0,
  name: '',
  data: []
})

function setDefault(i: number, k: number, j: number, n: number): void {
  // subjects
  i = i === null ? subject.index : i
  const selectedSubject = allBooks[i]
  subject.data = allBooks
  subject.name = selectedSubject.name
  subject.id = selectedSubject.id
  subject.index = i

  // stages
  k = k === null ? stage.index : k
  const selectedStage = selectedSubject.stages[k]
  stage.data = selectedSubject.stages
  stage.name = selectedStage.name
  stage.id = selectedStage.id
  stage.index = k

  // publishers
  j = j === null ? publisher.index : j
  const selectedPublisher = selectedStage.publishers[j]
  publisher.data = selectedStage.publishers
  publisher.name = selectedPublisher.name
  publisher.id = selectedPublisher.id
  publisher.index = j

  // semesters
  n = n === null ? semester.index : n
  const selectedSemester = selectedPublisher.semesters[n]
  semester.data = selectedPublisher.semesters
  semester.name = selectedSemester.name
  semester.id = selectedSemester.id
  semester.index = n

  initVidoeList()

  percentage.value = 0

  // 提交mutation
  setStore({
    subject: subject.id,
    stage: stage.id,
    publisher: publisher.id,
    semester: semester.id
  })
}

async function loadBooks() {
  try {
    const { data } = (await $api?.getBooks()) as AxiosResponse<FormFeild[]>
    const { subject, stage, publisher, semester } = $books
    allBooks = data

    // 首次使用
    if (subject === 0 && stage === 0 && publisher === 0 && semester === 0) {
      setDefault(subject, stage, publisher, semester)
    } else {
      setDefault(...getBooksIndexByIds(data, $books))
    }
  } catch (e) {}
}

loadBooks()

// 根据id获取其在数组中对应的索引
function getBooksIndexByIds(data: any[], booksIds: StoreBooksIds) {
  const { subject, stage, publisher, semester } = booksIds
  let indexs: [number, number, number, number]
  const subjectIndex: number = data.findIndex(
    (row: FormFeild) => row.id === subject
  )
  const stageIndex: number = data[subjectIndex].stages.findIndex(
    (row: FormFeild) => row.id === stage
  )
  const publisherIndex: number = data[subjectIndex].stages[
    stageIndex
  ].publishers.findIndex((row: FormFeild) => row.id === publisher)
  const semesterIndex: number = data[subjectIndex].stages[
    stageIndex
  ].publishers[publisherIndex].semesters.findIndex(
    (row: FormFeild) => row.id === semester
  )

  indexs = [subjectIndex, stageIndex, publisherIndex, semesterIndex]

  return indexs
}

async function initVidoeList() {
  try {
    const { data } = (await $api?.showVideos({
      subject: {
        name: subject.name,
        id: subject.id
      },
      stage: {
        name: stage.name,
        id: stage.id
      },
      publisher: {
        name: publisher.name,
        id: publisher.id
      },
      semester: {
        name: semester.name,
        id: semester.id
      }
    })) as AxiosResponse<VideosResult[]>

    tableData.value = data
  } catch (e) {}
}

// 百分比进度
const percentage = ref(0)
const button = reactive<ButtonStatus>({ disabled: false, loading: false })
const downloadStatus = {
  loading() {
    button.disabled = true
    button.loading = true
  },

  loaded() {
    button.disabled = false
    button.loading = false
  }
}

// 提交下载任务
function onSubmit() {
  downloadStatus.loading()
  $api?.download()
}

function getRowIndexById(id: number) {
  return tableData.value.findIndex((row) => row.id === id)
}

// Socket
const socket: Socket = io('ws://localhost:3000')
socket.on('progress', ({ id, percent }) => {
  const index: number = getRowIndexById(id)
  for (let i = 0; i < index; i++) {
    tableData.value[i].percent = 100
  }
  listIndex.value = index
  tableData.value[index] && (tableData.value[index].percent = percent)
})
const listIndex = ref(0)
socket.on('loaded', ({ count, id, total }) => {
  downloadStatus.loading()
  const index: number = getRowIndexById(id)
  for (let i = 0; i <= index; i++) {
    tableData.value[i].loaded = true
  }
  percentage.value = Math.round((count * 100) / total)
})

socket.on('error', () => {
  downloadStatus.loaded()
  ElMessage.error('下载失败，请刷新后重试。')
})

socket.on('complete', ({ message }) => {
  downloadStatus.loaded()
  ElMessage.success(message)
})
</script>

<style lang="scss">
html {
  font-size: 14px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.app-container {
  position: fixed;
  width: 50rem;
  margin: auto;
  left: 0;
  right: 0;
  top: 20px;
  bottom: 20px;

  .el-card__header {
    background-color: #303133;
  }

  .title {
    color: #fff;
  }

  .el-card__body {
    position: static;
  }
}
</style>
