import request from '@/utils/request'

export function getServicesInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/svc/services?namespace=${namespace}`,
    method: 'get'
  })
}
