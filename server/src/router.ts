import { Router } from 'express';
import { url } from './entry/config';
import entry, { allBooks, getAllVideo, getVideoM3U8, download } from './entry/index'
import event from './event';

const router: Router = Router();

entry()

interface VideosQueryItem {
  id: number
  name: string
}

router.get('/books', async (req, res) => {
  const books = await allBooks()
  res.send(books)
})

let selectedVideos: VideosResult[], downloadDir: string

router.get('/videos', async (req, res) => {
  const query = req.query as any
  const subject: VideosQueryItem = JSON.parse(query.subject)
  const stage: VideosQueryItem = JSON.parse(query.stage)
  const publisher: VideosQueryItem = JSON.parse(query.publisher)
  const semester: VideosQueryItem = JSON.parse(query.semester)
  const bookDetailId: BookDetailId = {
    subjectId: subject.id,
    stageId: stage.id,
    publisherId: publisher.id,
    semesterId: semester.id
  }
  const ret: VideosResult[] = await getAllVideo(bookDetailId)
  res.send(ret)

  downloadDir = `videos/${subject.name}/${stage.name}/${publisher.name}/${semester.name}`
  selectedVideos = ret
})



router.post('/download', async (req, res) => {
  let index: number = 0, size: number = selectedVideos.length
  for (let video of selectedVideos) {
    try {
      index += 1
      const m3u8Address: string = await getVideoM3U8(url.videoDetail(video.id))
      const filePath: string = downloadDir + video.path
      const _filePath: string[] = filePath.split('/')
      const fileName: string = _filePath.pop() as string
      const output: string = _filePath.join('/')
      await download(m3u8Address, output, fileName, (message: ProgressMessage) => {
        let percent = Math.round(message.percent || 0)
        console.log(`共${size}个视频，正在下载${index}个视频, 当前进度：${percent}%`);
        event.emit('onDownloadProgress', {
          index: index - 1,
          id: video.id,
          percent
        })
      })
      event.emit('onDownloaded', {
        index: index - 1,
        id: video.id,
        path: filePath,
        count: index,
        total: size
      })
    } catch (err) {
      event.emit('onDownloadError', selectedVideos)
    }
  }

  event.emit('onDownloadComplete', { ok: true, message: '全部下载完成' })
  res.send({ ok: true, message: '全部下载完成' })
})
export default router