import fetch from 'node-fetch'
import { headers, url } from '../config'

export const getAllVideo = (body: BookDetailId): Promise<VideosResult[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url.subjectURL(body), { headers, method: 'GET' })
      const result: { [props: string]: any }[] | any = await response.json()
      response.ok ? resolve(paths(result)) : reject(result)
    } catch (e) {
      reject(e);
    }
  })
}

function paths(result: { [props: string]: any }[]): VideosResult[] {
  let res: VideosResult[] = []
  function step(result: { [props: string]: any }[], paths: string, id: number, flag: boolean) {
    if (flag) {
      let VideosResult: VideosResult = {
        id,
        path: paths.slice(0, -1).replace(/[\:\?\s\、]/g, '_').replace(/\"(.+)\"/g, `【$1】`),
        loaded: false,
        percent: 0
      }
      res.push(VideosResult)
    }
    result.forEach((obj, index: number) => {
      for (let k in obj) {
        let filename = `${paths}${index + 1}-${obj.name}/`
        if (Array.isArray(obj[k])) {
          step(obj[k], filename, obj.id, k === 'typeTags')
        }
      }
    })
  }

  step(result, '/', -1, false)
  return res
}
