import request from '@/utils/request'

export function getRolesInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/rbac/roles?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteRole(namespace, role) {
  return request({
    url: `/rbac/role/delete?namespace=${namespace}&role=${role}`,
    method: 'post'
  })
}

export function updateRole(roleInfo) {
  return request({
    url: '/rbac/role/update',
    method: 'post',
    data: roleInfo
  })
}

export function getRole(namespace, role) {
  return request({
    url: `/rbac/role/get?namespace=${namespace}&role=${role}`,
    method: 'get'
  })
}
