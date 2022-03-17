import fetch from 'node-fetch'
import { headers, setToken } from '../config'

function login(url: string, user: User): Promise<string> {
  return new Promise(async (resolve, reject) => {
    var response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: `${JSON.stringify(user)}`,
    })

    response.ok ? resolve(setToken(response.headers.get('Authorization') as string)) : reject(await response.json())
  })
}

export default login