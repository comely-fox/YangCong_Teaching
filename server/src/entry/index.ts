import { url, user } from './config'
import login from './request/login';
export * from './request/allBooks'
export * from './request/allVideo'
export * from './request/getVideoM3U8'
export * from './request/download'

async function entry() {
  await login(url.login, user);
}

export { entry as default }