import request from '../request'
export const download = (): Promise<any> => request.post('/download')