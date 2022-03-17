// declare module 'm3u8-to-mp4' {
//   export default class M3u8ToMP4 {
//     setInputFile(url: string): this
//     setOutputFile(output: string): this
//     onProgress(callback: (msg: ProgressMessage) => void): this
//     start(): Promise<any>
//   }
// }

interface ProgressMessage {
  frames: number
  currentFps: number
  currentKbps: number
  targetSize: number
  timemark: string
  percent: number
}

// 用户接口
interface User {
  name: string;
  password: string;
}


interface AllBooks {
  id: number
  name: string
  data: Array<any>
  [props: string]: any
}


interface BookItemDetail {
  name: string,
  id: number
}


// 每本书都有 年级、学期、科目、发布者
type BookDetail = {
  subjects: BookItemDetail,
  publishers: BookItemDetail,
  semesters: BookItemDetail,
  stages: BookItemDetail,
}

type BookDetailKey = 'subjects' | 'stages' | 'publishers' | 'semesters'

interface BookAddress {
  url: string,
  dir: string
}

interface BookDetailId {
  publisherId: number;
  semesterId: number;
  subjectId: number;
  stageId: number
}

interface BookDetailName {
  publisherName: string;
  semesterName: string;
  subjectName: string;
  stageName: string
}


interface VideosResult {
  id: number
  path: string
  loaded: boolean
  percent: number
}
