import request from '@/utils/request'

export function getRolesInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/rbac/roles?namespace=${namespace}`,
    method: 'get'
  })
}
