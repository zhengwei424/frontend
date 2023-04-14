import request from '@/utils/request'

export function getIngressesInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/svc/ingresses?namespace=${namespace}`,
    method: 'get'
  })
}
