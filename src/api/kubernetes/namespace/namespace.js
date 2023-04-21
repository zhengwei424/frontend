import request from '@/utils/request'

export function getNamespacesInfo() {
  return request({
    url: '/cluster/namespaces',
    method: 'get'
  })
}

export function deleteNamespace(namespace) {
  return request({
    url: `/cluster/namespace/delete?namespace=${namespace}`,
    method: 'post'
  })
}

export function updateNamespace(namespaceInfo) {
  return request({
    url: '/cluster/namespace/update',
    method: 'post',
    data: namespaceInfo
  })
}

export function getNamespace(namespace) {
  return request({
    url: `/cluster/namespace/get?namespace=${namespace}`,
    method: 'get'
  })
}
