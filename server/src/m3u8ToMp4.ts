/**
 * @description M3U8 to MP4 Converter
 * @author Furkan Inanc
 * @version 1.0.0
 */

let ffmpeg = require("fluent-ffmpeg");

/**
 * A class to convert M3U8 to MP4
 * @class
 */
class M3u8ToMp4Converter {
  #M3U8_FILE: string = ''
  #OUTPUT_FILE: string = ''
  #progressCallback: (message: ProgressMessage) => void = () => { }

  /**
   * Sets the input file
   * @param {String} filename M3U8 file path. You can use remote URL
   * @returns {Function}
   */
  setInputFile(filename: string): M3u8ToMp4Converter {
    if (!filename) throw new Error("You must specify the M3U8 file address");
    this.#M3U8_FILE = filename;

    return this;
  }

  /**
   * Sets the output file
   * @param {String} filename Output file path. Has to be local :)
   * @returns {Function}
   */
  setOutputFile(filename: string): M3u8ToMp4Converter {
    if (!filename) throw new Error("You must specify the file path and name");
    this.#OUTPUT_FILE = filename;

    return this;
  }

  onProgress(callback: (message: ProgressMessage) => void): M3u8ToMp4Converter {
    if ('function' !== 'function') throw new TypeError(callback + "is not a function");
    this.#progressCallback = callback;
    return this
  }

  /**
   * Starts the process
   */
  start(): Promise<undefined> {
    return new Promise((resolve, reject) => {
      if (!this.#M3U8_FILE || !this.#OUTPUT_FILE) {
        reject(new Error("You must specify the input and the output files"));
        return;
      }

      ffmpeg(this.#M3U8_FILE)
        .on("error", (error: string) => {
          reject(new Error(error));
        })
        .on("end", () => {
          resolve(void 0);
        })
        .on('progress', this.#progressCallback)
        .outputOptions("-c copy")
        .outputOptions("-bsf:a aac_adtstoasc")
        .output(this.#OUTPUT_FILE)
        .run();
    });
  }
}

export default M3u8ToMp4Converter;
