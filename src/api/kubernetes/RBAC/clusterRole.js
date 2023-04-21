import request from '@/utils/request'

export function getClusterRolesInfo() {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/rbac/clusterRoles`,
    method: 'get'
  })
}

export function deleteClusterRole(clusterRole) {
  return request({
    url: `/rbac/clusterRole/delete?clusterRole=${clusterRole}`,
    method: 'post'
  })
}

export function updateClusterRole(clusterRoleInfo) {
  return request({
    url: '/rbac/clusterRole/update',
    method: 'post',
    data: clusterRoleInfo
  })
}

export function getClusterRole(clusterRole) {
  return request({
    url: `/rbac/clusterRole/get?clusterRole=${clusterRole}`,
    method: 'get'
  })
}
