import axios from 'axios';
import qs from 'qs'
import { Message } from 'element-ui'

const instance = axios.create({
  timeout: 40000,
  // baseURL: process.env.VUE_APP_BASE_API
  baseURL: '/center'
});

let pending = []; // 请求标识
let cancelToken = axios.CancelToken; // 请求取消函数

// 防止重复请求
let removePending = (ever) => {
  for (let p in pending) {
    if (pending[p].u === ever.url + '&' + ever.method) {
      pending[p].f();
      pending.splice(p, 1);
    }
  }
}

// request拦截器
instance.interceptors.request.use(
  config => {
    removePending(config);
    config.cancelToken = new cancelToken(c => {
      pending.push({
        u: config.url + '&' + config.method,
        f: c
      });
    });
    const token = localStorage.getItem('token')
    if(config.url !== '/login'){
      config.headers.Authorization = token
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// response拦截器
instance.interceptors.response.use(
  response => {
    removePending(response.config);
    if(response.data.type === 'application/octet-stream'){
      return response.data
    }
    if(response.data.code !== 200){
      Message.error(response.data.message)
      if(response.data.code === 403){   //重新登录
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("realname");
        localStorage.removeItem("userid");
        Message.error('请先登录');
        location.href = ''
      }
    }
    return response.data
  },
  error => {
    if (error.response.status == 302 || error.response.status == 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("realname");
      localStorage.removeItem("userid");
      Message.error('请先登录');
      location.href = ''
    } else {
      Message.error(error.response.data.message || '系统错误');
    }
    return Promise.reject(error)
  }
)

export default {
  formPost(url, data={}) {
    return instance({
      method: 'post',
      url,
      data: qs.stringify(data),
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  },
  formGet(url, params={}) {
    return instance({
      method: 'get',
      url,
      withCredentials: true,
      params,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  },
  download(url, params={}) {
    return instance({
      method: 'get',
      url,
      params,
      timeout: 10000000,
      responseType: 'blob'
    })
  },
  xml(url, params={}) {
    return instance({
      method: 'post',
      url,
      params,
      timeout: 10000000,
      responseType: 'document',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  },
  formPut(url, data={}) {
    return instance({
      method: 'put',
      url,
      data: qs.stringify(data),
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  },
  formDelete(url, data={}) {
    return instance({
      method: 'delete',
      url,
      data: qs.stringify(data),
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  },
  jsonGet(url, params={}) {
    return instance({
      method: 'get',
      url,
      withCredentials: true,
      params,
      paramsSerializer: params => {
        qs.stringify(params, { arrayFormat: 'repeat' })
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      }
    })
  },
  jsonPost(url, data={}) {
    return instance({
      method: 'post',
      url,
      data: JSON.stringify(data),
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      }
    })
  },
  uploadPost(url, data={}) {
    return instance({
      method: 'post',
      url,
      data: data,
      timeout: 100000,
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  jsonPut(url, data={}) {
    return instance({
      method: 'put',
      url,
      data: JSON.stringify(data),
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      }
    })
  },
  jsonDelete(url, data={}) {
    return instance({
      method: 'delete',
      url,
      data: JSON.stringify(data),
      withCredentials: true,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      }
    })
  },
}