import axios from 'axios'
import { getToken } from '~/utils'
import i18n from '~/locales';

// 设置接口超时时间
axios.defaults.timeout = 60000
//axios.defaults.baseURL = import.meta.env.VITE_API_URL

// Request 拦截器
axios.interceptors.request.use(
  config => {
    // 表单
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // JSON
    //config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    // 验证方式
    config.headers.Authorization = 'Bearer ' + getToken()
    // 日志的Request Token
    config.headers.RequestToken = localStorage.reqtoken

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
    // 非0表示错误
    if (data.code) {
      return Promise.reject(data)
    } else {
      return data
    }
  },
  err => {
    const { response } = err

    if (response) {
      const newErr = (key: string) => {
        return i18n.global.t(key, { 'code': response.status, 'text': response.statusText, 'err': err.message })
      }

      if (/50\d/.test(response.status)) {
        return Promise.reject(newErr('common.resp_50x'))
      }

      const data = response.data
      if (!data) {
        return Promise.reject(newErr('common.resp_nodata'))
      }

      data.status = response.status

      return Promise.reject(data)
    } else {
      const data = {
        code: 1,
        msg: 'HTTPERR: ' + (err.message || err || i18n.global.t('common.unknown_error')),
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
  if (action[0] !== '/') {
    action = '/' + action
  }
  const url = '/api' + action
  type = type.toUpperCase()
  const config = type === 'GET' ? { url, params } : { method: type, url, data: params }

  console.log('request', url, config)

  return axios.request(config)
}

export const download = (action = '', params = {}, fileName = '') => {
  axios({
    method: 'post',
    url: '/api' + action,
    data: params,
    responseType: 'blob'
  })
    .then(resp => {
      // <a download="命运.zip" href="blob:http://url/x-x-x" style="display: none;"></a>
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(resp)

      document.body.appendChild(elink)
      elink.click()

      // 释放URL 对象
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)

    })
    .catch(err => {
      console.log(err)
    })

}