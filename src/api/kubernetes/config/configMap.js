import request from '@/utils/request'

export function getConfigMapsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/config/configMaps?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteConfigMap(namespace, configMap) {
  return request({
    url: `/config/configMap/delete?namespace=${namespace}&configMap=${configMap}`,
    method: 'post'
  })
}

export function updateConfigMap(configMapInfo) {
  return request({
    url: '/config/configMap/update',
    method: 'post',
    data: configMapInfo
  })
}

export function getConfigMap(namespace, configMap) {
  return request({
    url: `/config/configMap/get?namespace=${namespace}&configMap=${configMap}`,
    method: 'get'
  })
}
