/**
  封装发送ajax请求的函数模块
  封装axios库
  函数返回值是promise对象
  1、统一处理请求异常
 */
import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise;
    //执行异步ajax请求
    if (type === 'GET') {
      promise = axios.get(url, {
        params: data  //请求参数
      })
    } else {
      promise = axios.post(url, data)
    }

    //成功，调用resolve(value)
    promise.then(res => {
      resolve(res.data)

    //失败，不调用reject(reason), 提示错误信息
    }).catch(error => {
      message.error('请求出错了:' + error.message)
    })
  })
}