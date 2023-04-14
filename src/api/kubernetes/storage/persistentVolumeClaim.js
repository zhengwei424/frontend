import request from '@/utils/request'

export function getPersistentVolumeClaimsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/storage/persistentVolumeClaims?namespace=${namespace}`,
    method: 'get'
  })
}
