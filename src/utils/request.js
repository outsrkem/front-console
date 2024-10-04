/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'
// import router from '@/router'
import { toLoginPage } from './common.js'
import { ElMessage } from 'element-plus'

const request = axios.create({
    baseURL: '/api/uias' // 请求的基础路径
})

request.interceptors.request.use(
    function (config) {
        if (config.method === 'get') {
            config.data = true
        }
        config.headers = {
            'Content-Type':'application/json;charset=utf-8'
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(function (response) {
    return response
}, function (error) {
    const { status } = error.response
    if (status === 401) {
        toLoginPage()
    } else if (status === 403) {
        ElMessage.warning({message: '没有操作权限'})
        return Promise.reject(error.response)
    } else if (status === 400) {
        // 客户端参数错误
        ElMessage.error('参数错误，请检查请求参数')
        return Promise.reject(error.response)
    } else if (status >= 500) {
        ElMessage.error('服务端内部异常，请稍后重试')
        return Promise.reject(error.response)
    }
    return Promise.reject(error.response)
})

// 导出请求方法
export default request