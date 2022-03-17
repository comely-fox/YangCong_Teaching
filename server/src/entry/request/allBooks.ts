
import fetch, { Response } from 'node-fetch'
import { headers, url } from "../config"

export const allBooks = (): Promise<AllBooks[]> => {
  return new Promise(async (resolve, reject) => {
    const response: Response = await fetch(url.subjects, {
      headers
    })
    const result: AllBooks[] = await response.json()
    response.ok ? resolve(result) : reject(result)
  })
}