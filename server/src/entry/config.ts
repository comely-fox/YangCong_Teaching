import { HeadersInit } from "node-fetch"

export const url = {
  login: 'https://school-api.yangcong345.com/public/login', // 1
  subjects: 'https://school-api.yangcong345.com/course/subjects', // 2
  subjectURL(options: BookDetailId): string { // 3
    const { publisherId, semesterId, subjectId, stageId } = options
    return `https://school-api.yangcong345.com/course/chapters-with-section/publisher/${publisherId}/semester/${semesterId}/subject/${subjectId}/stage/${stageId}`
  },

  subjectPath(options: BookDetailName): string {
    const { publisherName, semesterName, subjectName, stageName } = options
    return `${subjectName}/${stageName}/${publisherName}/${semesterName}`
  },

  videoDetail(id: number): string {
    return `https://school-api.yangcong345.com/course/topics/${id}/detail-universal`
  }
}


export const user = {
  name: '',
  password: ''
}

export const headers: HeadersInit = {
  Authorization: '',
  'Content-Type': 'application/json'
}

export function setToken(token: string) {
  (headers as any).Authorization = token
  return token
}