import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/x-www-from-urlencoded' }
})

export default request