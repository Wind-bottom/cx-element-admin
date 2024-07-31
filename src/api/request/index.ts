import request from '@/config/axios'
import { RequestResponse } from './types'
import axios from "axios";

export const request1 = () => {
  return request.get<IResponse<RequestResponse>>({
    url: '/request/1'
  })
}

export const request2 = () => {
  return request.get<IResponse<RequestResponse>>({
    url: '/request/2'
  })
}

export const request3 = () => {
  return request.get<IResponse<RequestResponse>>({
    url: '/request/3'
  })
}

export const request4 = () => {
  return request.get<IResponse<RequestResponse>>({
    url: '/request/4'
  })
}

export const request5 = () => {
  return request.get<IResponse<RequestResponse>>({
    url: '/api/BT/'
  })
}

export const rq_bt = (data={}) => {
  // 使用request.post请求, 将data作为参数传入
    return request.post<IResponse<RequestResponse>>({
        url: '/api/BT/',
        data: data
    })
}

export const apiGet = (url, config={}) => {
  let diy_header = {'headers': {'Authorization': `Bearer ${localStorage.getItem('Authorization')}`}}
  let conf = Object.assign(config, diy_header);
  return axios.get(url, conf);
};

export const apiPost = (url, data={}) => {
  return axios.post(url, data);
};
