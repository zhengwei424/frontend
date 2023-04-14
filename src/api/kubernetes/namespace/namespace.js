import request from '@/utils/request'

export function getNamespacesInfo() {
  return request({
    url: '/cluster/namespaces',
    method: 'get'
  })
}
