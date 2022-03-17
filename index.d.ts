
import { AxiosResponse } from 'axios'

// apis
export interface AllInterface {
  getBooks(): Promise<AxiosResponse>,
  showVideos(options: ShowVideosOptions): Promise<AxiosResponse<Videos[]>>
  download(): Promise<AxiosResponse>
}

export type ShowVideosItemsOptions = {
  name: string
  id: number
}

export interface ShowVideosOptions {
  subject: ShowVideosItemsOptions,
  stage: ShowVideosItemsOptions,
  publisher: ShowVideosItemsOptions,
  semester: ShowVideosItemsOptions,
}

export interface FormFeild {
  id: number
  index: number
  name: string
  data: Array<any>
  [props: string]: any
}

export type StoreBooksIds = {
  subject: number
  stage: number
  publisher: number
  semester: number
}

export interface VideosResult {
  id: number
  path: string
  loaded: boolean
  percent: number
}

export type ButtonStatus = {
  disabled: boolean
  loading: boolean
}

export { }