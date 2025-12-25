import axios from 'axios';
const URL = 'http://localhost:5000'

export const $app = axios.create({
  withCredentials: true,
  baseURL: URL
})
