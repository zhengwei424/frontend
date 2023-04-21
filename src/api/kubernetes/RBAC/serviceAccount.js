import request from '@/utils/request'

export function getServiceAccountsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/rbac/serviceAccounts?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteServiceAccount(namespace, serviceAccount) {
  return request({
    url: `/rbac/serviceAccount/delete?namespace=${namespace}&serviceAccount=${serviceAccount}`,
    method: 'post'
  })
}

export function updateServiceAccount(serviceAccountInfo) {
  return request({
    url: '/rbac/serviceAccount/update',
    method: 'post',
    data: serviceAccountInfo
  })
}

export function getServiceAccount(namespace, serviceAccount) {
  return request({
    url: `/rbac/serviceAccount/get?namespace=${namespace}&serviceAccount=${serviceAccount}`,
    method: 'get'
  })
}
