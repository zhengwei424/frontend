import request from '@/utils/request'

export function getSecretsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/config/secrets?namespace=${namespace}`,
    method: 'get'
  })
}
