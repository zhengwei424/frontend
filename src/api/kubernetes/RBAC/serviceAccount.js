import request from '@/utils/request'

export function getServiceAccountsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/rbac/serviceAccounts?namespace=${namespace}`,
    method: 'get'
  })
}
