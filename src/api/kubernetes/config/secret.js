import request from '@/utils/request'

export function getSecretsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/config/secrets?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteSecret(namespace, secret) {
  return request({
    url: `/config/secret/delete?namespace=${namespace}&secret=${secret}`,
    method: 'post'
  })
}

export function updateSecret(secretInfo) {
  return request({
    url: '/config/secret/update',
    method: 'post',
    data: secretInfo
  })
}

export function getSecret(namespace, secret) {
  return request({
    url: `/config/secret/get?namespace=${namespace}&secret=${secret}`,
    method: 'get'
  })
}
