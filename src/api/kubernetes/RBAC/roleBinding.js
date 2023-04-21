import request from '@/utils/request'

export function getRoleBindingsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/rbac/roleBindings?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteRoleBinding(namespace, roleBinding) {
  return request({
    url: `/rbac/roleBinding/delete?namespace=${namespace}&roleBinding=${roleBinding}`,
    method: 'post'
  })
}

export function updateRoleBinding(roleBindingInfo) {
  return request({
    url: '/rbac/roleBinding/update',
    method: 'post',
    data: roleBindingInfo
  })
}

export function getRoleBinding(namespace, roleBinding) {
  return request({
    url: `/rbac/roleBinding/get?namespace=${namespace}&roleBinding=${roleBinding}`,
    method: 'get'
  })
}
