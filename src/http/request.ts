import axios from 'axios'
import { getToken, isEmpty } from '~/utils'
import { _t } from '~/locales'

// 设置接口超时时间
axios.defaults.timeout = 60000
axios.defaults.baseURL = import.meta.env.VITE_API_URL

// Request 拦截器
axios.interceptors.request.use(
  (config) => {
    // 表单
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // JSON
    //config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    // 验证方式
    config.headers.Authorization = 'Bearer ' + getToken()
    // 日志的Request Token
    config.headers.RequestToken = localStorage.getItem('reqtoken')

    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)

// Response 拦截器
axios.interceptors.response.use(
  (resp) => {
    const data = resp.data
    // 非0表示错误
    if (data.code) {
      return Promise.reject(data)
    } else {
      return data
    }
  },
  (err) => {
    const { response } = err

    if (response) {
      const newErr = (key: string) => {
        return _t(key, {
          code: response.status,
          text: response.statusText,
          err: err.message,
        })
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
        msg: 'HTTPERR: ' + (err.message || err || _t('common.unknown_error')),
        data: err,
      }

      return Promise.reject(data)
    }
  },
)

interface ResponseData<T> {
  code: number
  msg: string
  data: T
  status?: number
}

const actionToURL = (action = '') => {
  if (isEmpty(action)) {
    return ''
  }

  action = action.trim()
  return action[0] !== '/' ? '/' + action : action
}

// URL处理
export const request = <T>(
  action = '',
  params = {},
  type = 'get',
): Promise<ResponseData<T>> => {
  const url = actionToURL(action)
  type = type.toLowerCase()
  const config =
    type === 'get' ? { url, params } : { method: type, url, data: params }

  console.log('request', config)

  return axios.request(config)
}

// 单独处理下载操作
export const download = (action = '', params = {}, fileName = '') => {
  const dl = (): Promise<Blob> => {
    return axios.post(actionToURL(action), params, { responseType: 'blob' })
  }

  dl()
    .then((resp) => {
      // <a download="命运.zip" href="blob:http://url/x-x-x" style="display: none;"></a>
      const link = document.createElement('a')
      link.download = fileName
      link.style.display = 'none'
      link.href = URL.createObjectURL(resp)

      document.body.appendChild(link)
      link.click()

      // 释放URL 对象
      URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
    })
    .catch((err) => {
      console.log(err)
    })
}
