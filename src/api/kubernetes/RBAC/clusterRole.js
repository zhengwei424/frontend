import request from '@/utils/request'

export function getClusterRolesInfo() {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/rbac/clusterRoles`,
    method: 'get'
  })
}
