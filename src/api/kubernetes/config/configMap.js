import request from '@/utils/request'

export function getConfigMapsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/config/configMaps?namespace=${namespace}`,
    method: 'get'
  })
}
