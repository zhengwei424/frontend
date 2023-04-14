import request from '@/utils/request'

export function getRoleBindingsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/rbac/roleBindings?namespace=${namespace}`,
    method: 'get'
  })
}
