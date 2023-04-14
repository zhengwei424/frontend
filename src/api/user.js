import request from '@/utils/request'

export function userLogin(data) {
  return request({
    // url: '/vue-admin-template/user/login',
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: '/login',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

