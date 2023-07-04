import axios from 'axios'
import { getToken } from '~/utils/tools'

// 设置接口超时时间
axios.defaults.timeout = 60000
//axios.defaults.baseURL = import.meta.env.VITE_API_URL

// Request 拦截器
axios.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',   // 表单
      //'Content-Type': 'application/json;charset=UTF-8',   // json
      'Authorization': 'Bearer ' + getToken(),
      'RequestToken': localStorage.reqtoken
    };
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// Response 拦截器
axios.interceptors.response.use(
  resp => {
    const data = resp.data
    if (data.code) {
      return Promise.reject(data)
    } else {
      return data
    }
  },
  err => {
    const { response } = err

    if (response) {
      const data = response.data
      data.status = response.status

      return Promise.reject(data)
    } else {
      const data = {
        code: 1,
        msg: 'HTTPERR: ' + (err.message || '未知错误'),
        data: err
      }

      return Promise.reject(data)
    }
  }
)

interface ResponseData {
  code: number
  msg: string
  data: any,
  status?: number
}

// 封装 GET POST 请求并导出
export const request = (action = '', params = {}, type = 'GET'): Promise<ResponseData> => {
  const url = '/api' + action
  type = type.toUpperCase()

  console.log('request', url, params)

  return new Promise((resolve, reject) => {

    const config = type === 'GET' ? { url, params } : { method: type, url, data: params }

    axios.request(config)
      .then((res: any) => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const download = (action = '', params = {}, fileName = '') => {
  axios({
    method: 'post',
    url: '/api' + action,
    data: params,
    responseType: 'blob'
  }).then(res => {
    const blob = new Blob([res])

    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    // 释放URL 对象
    URL.revokeObjectURL(elink.href)
    document.body.removeChild(elink)

  }).catch((error) => {
    console.log(error)
  })

}