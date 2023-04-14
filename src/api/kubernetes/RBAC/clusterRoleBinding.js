import request from '@/utils/request'

export function getClusterRoleBindingsInfo() {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/rbac/clusterRoleBindings`,
    method: 'get'
  })
}
