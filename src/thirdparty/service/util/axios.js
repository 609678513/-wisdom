const axios = require('axios')
// import axios from 'axios'
//将被添加到`url`前面，通常为访问的服务端地址
axios.defaults.baseURL = 'https://aip.baidubce.com'
// `timeout`指定请求超时之前的毫秒数。
axios.defaults.timeout = 100000
// `withCredentials`指示是否跨站点访问控制请求，默认为false
axios.defaults.withCredentials = true

axios.defaults.headers['Content-Type'] = 'application/json'
// axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
// axios.defaults.headers['Cache-Control'] = 'no-cache,no-store,must-revalidate,max-age=-1,private'
// axios.defaults.fileUploadUrl = localStorage.getItem('fileUploadUrl')
// axios.defaults.fileLoadUrl = localStorage.getItem('fileLoadUrl')
//
// axios.defaults.headers.common.token = localStorage.getItem('token')


 exports.axiosGet= async (url, params = {}) => {
    return axios.get(url, {params: params}).then(response => {
      return response
    }).catch(err => {
      throw err
    })
  },
  exports.axiosPost = async (url, data) => {
    return axios.post(url, data).then(response => {
      return response
    }).catch(err => {
      throw err
    })
  },
  // 更新全部
  exports.axiosPut = async  (url, data) => {
    return axios.put(url, data).then(response => {
      return response
    }).catch(err => {
      throw err
    })
  },
  exports.axiosDelete = async (url, data) => {
    return axios.delete(url, {data: data}).then(response => {
      return response
    }).catch(err => {
      throw err
    })
  }

// export default {
//   axiosGet: (url, params = {}) => {
//     return axios.get(url, {params: params}).then(response => {
//       return response
//     }).catch(err => {
//       throw err
//     })
//   },
//   axiosPost: (url, data) => {
//     return axios.post(url, data).then(response => {
//       return response
//     }).catch(err => {
//       throw err
//     })
//   },
//   // 更新全部
//   axiosPut: (url, data) => {
//     return axios.put(url, data).then(response => {
//       return response
//     }).catch(err => {
//       throw err
//     })
//   },
//   axiosDelete: (url, data) => {
//     return axios.delete(url, {data: data}).then(response => {
//       return response
//     }).catch(err => {
//       throw err
//     })
//   }
// }
