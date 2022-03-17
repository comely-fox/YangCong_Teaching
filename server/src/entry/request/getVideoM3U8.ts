import fetch, { Response } from "node-fetch"
import { headers } from "../config"

/**
 * 获取指定要下载的视频的m3u8文件地址
 * @param url 
 * @returns 
 */
const getVideoM3U8 = (url: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response: Response = await fetch(url, { headers })
      const result: any = await response.json()
      const videoUrl = filterAdress(result.video.addresses)
      response.ok ? resolve(videoUrl) : reject(result)
    } catch (err) {
      reject(err)
    }
  })
}


function filterAdress(address: any[]): string {
  let videoUrl: string = ''
  address.forEach((address: any) => {
    if (address.platform === 'pc' && address.clarity === 'high' && address.format === 'hls') {
      videoUrl = address.url
    }
  })

  return videoUrl
}


export { getVideoM3U8 }