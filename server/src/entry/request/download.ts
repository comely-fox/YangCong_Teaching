import M3u8ToMp4 from '../../m3u8ToMp4'
import path from 'path'
import fs from 'fs'

function _download(m3u8URL: string, dir: string, fileName: string, onProgress?: (msg: ProgressMessage) => void): Promise<boolean> {
  const converter = new M3u8ToMp4();
  return new Promise(async (resolve, reject) => {

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    try {
      await converter
        .setInputFile(m3u8URL)
        .setOutputFile(path.join(dir, fileName + '.mp4'))
        .onProgress(onProgress || (() => { }))
        .start()

      resolve(true)
    } catch (err) { reject(err) }
    // try {
    //   download({
    //     url: m3u8URL,
    //     // processNum: 15,
    //     filePath: dir,
    //     filmName: fileName
    //   }, () => {
    //     resolve(true)
    //   })
    // } catch (err) {
    //   reject(err)
    // }
  })

}

export { _download as download };

function start() {
  throw new Error('Function not implemented.');
}
