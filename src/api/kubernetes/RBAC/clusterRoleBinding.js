import request from '@/utils/request'

export function getClusterRoleBindingsInfo() {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/rbac/clusterRoleBindings`,
    method: 'get'
  })
}

export function deleteClusterRoleBinding(clusterRoleBinding) {
  return request({
    url: `/rbac/clusterRoleBinding/delete?clusterRoleBinding=${clusterRoleBinding}`,
    method: 'post'
  })
}

export function updateClusterRoleBinding(clusterRoleBindingInfo) {
  return request({
    url: '/rbac/clusterRoleBinding/update',
    method: 'post',
    data: clusterRoleBindingInfo
  })
}

export function getClusterRoleBinding(clusterRoleBinding) {
  return request({
    url: `/rbac/clusterRoleBinding/get?clusterRoleBinding=${clusterRoleBinding}`,
    method: 'get'
  })
}
