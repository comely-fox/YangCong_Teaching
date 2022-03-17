import request from '../request'



interface Videos {
  id: number,
  path: string
}

type ShowVideosItemsOptions = {
  name: string
  id: number
}

interface ShowVideosOptions {
  subject: ShowVideosItemsOptions,
  stage: ShowVideosItemsOptions,
  publisher: ShowVideosItemsOptions,
  semester: ShowVideosItemsOptions,
}


export const showVideos = (params: ShowVideosOptions): Promise<Videos[]> => request.get('/videos', { params })