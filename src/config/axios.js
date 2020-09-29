import { baseURL } from '@/global'
import axios from 'axios'

//axios.defaults.withCredentials = true
axios.defaults.baseURL = baseURL

const success = res => res
const error = err => {
  if (err.response.status === 401) {
    window.location = '/'
  } else {
    return Promise.reject(err)
  }
}

axios.interceptors.response.use(success, error)
