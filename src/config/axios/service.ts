import axios, { AxiosError } from 'axios'
import config, { defaultRequestInterceptors, defaultResponseInterceptors } from './config'

import { AxiosInstance, InternalAxiosRequestConfig, RequestConfig, AxiosResponse } from './types'
import { ElMessage } from 'element-plus'
// 导入 useRouter
import router from '@/router/index'
import { resetRouter } from '@/router'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useStorage } from '@/hooks/web/useStorage'

const { clear } = useStorage()
const tagsViewStore = useTagsViewStore()

import { TokenStore } from '@/store/modules/login'
const store = TokenStore()

const { interceptors } = config
export const PATH_URL = import.meta.env.VITE_API_BASE_PATH

const { requestInterceptors, responseInterceptors } = interceptors

const abortControllerMap: Map<string, AbortController> = new Map()

const axiosInstance: AxiosInstance = axios.create({
  ...config,
  baseURL: PATH_URL
})

axiosInstance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
  const controller = new AbortController()
  const url = res.url || ''
  res.signal = controller.signal
  abortControllerMap.set(url, controller)
  return res
})

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    const url = res.config.url || ''
    abortControllerMap.delete(url)
    // 这里不能做任何处理，否则后面的 interceptors 拿不到完整的上下文了
    return res
  },
  (error: AxiosError) => {
    console.log('err： ' + error) // for debug
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.request.use(requestInterceptors || defaultRequestInterceptors)
axiosInstance.interceptors.response.use(responseInterceptors || defaultResponseInterceptors)

const service = {
  request: (config: RequestConfig) => {
    return new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config as any)
      }
      axiosInstance
        .request(config)
        .then((res) => {
          resolve(res)
        })
        .catch((err: any) => {
          // 处理token过期报错
          if (err.response?.status === 401) {
            ElMessage.error(err.response?.data?.message)
            store.token = ''            
            clear()
            tagsViewStore.delAllViews()
            resetRouter() // 重置静态路由表
            router.replace('/login')
          }
          reject(err)
        })
    })
  },
  cancelRequest: (url: string | string[]) => {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      abortControllerMap.get(_url)?.abort()
      abortControllerMap.delete(_url)
    }
  },
  cancelAllRequest() {
    for (const [_, controller] of abortControllerMap) {
      controller.abort()
    }
    abortControllerMap.clear()
  }
}

export default service
