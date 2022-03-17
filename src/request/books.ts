import request from '../request'

export const getBooks = (): Promise<any> => request.get('/books')