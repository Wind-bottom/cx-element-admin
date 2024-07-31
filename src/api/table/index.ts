import request from '@/config/axios'
import type { TableData } from './types'

export const getTableListApi = (params: any) => {
  return request.get({ url: '/example/list', params })
}

export const getTreeTableListApi = (params: any) => {
  return request.get({ url: '/example/treeList', params })
}

export const saveTableApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/example/save', data })
}

export const getTableDetApi = (id: string): Promise<IResponse<TableData>> => {
  return request.get({ url: '/example/detail', params: { id } })
}

export const delTableListApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.post({ url: '/example/delete', data: { ids } })
}
// 链接管理
export const getAdUrlListApi = (params: any) => {
  return request.get({ url: '/api/', params })
}

export const updateAdFieldApi = (data: object): Promise<IResponse> => {
  return request.post({ url: '/api/', data })
}

export const saveAdApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/api/', data })
}

// 客服软件管理

export const getAdAppListApi = (params: any) => {
  return request.get({ url: '/api/', params })
}

export const postAdAppListApi = (data: object): Promise<IResponse> => {
  return request.post({ url: '/api/', data })
}

export const updateAppFieldApi = (data: object): Promise<IResponse> => {
  return request.post({ url: '/api/', data })
}

export const getPopinApi = (params: any) => {
  return request.get({ url: '/popin_api/', params })
}

export const PostPopinApi = (data: object) => {
  return request.post({ url: '/popin_api/', data })
}

