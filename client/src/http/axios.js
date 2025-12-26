import axios from 'axios';
const URL = 'http://localhost:5000'

export const $app = axios.create({
  withCredentials: true,
  baseURL: URL
})

$app.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config;
})
