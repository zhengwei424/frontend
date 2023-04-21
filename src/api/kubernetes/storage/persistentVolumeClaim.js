import request from '@/utils/request'

export function getPersistentVolumeClaimsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/storage/persistentVolumeClaims?namespace=${namespace}`,
    method: 'get'
  })
}

export function deletePersistentVolumeClaim(namespace, persistentVolumeClaim) {
  return request({
    url: `/storage/persistentVolumeClaim/delete?namespace=${namespace}&persistentVolumeClaim=${persistentVolumeClaim}`,
    method: 'post'
  })
}

export function updatePersistentVolumeClaim(persistentVolumeClaimInfo) {
  return request({
    url: '/storage/persistentVolumeClaim/update',
    method: 'post',
    data: persistentVolumeClaimInfo
  })
}

export function getPersistentVolumeClaim(namespace, persistentVolumeClaim) {
  return request({
    url: `/storage/persistentVolumeClaim/get?namespace=${namespace}&persistentVolumeClaim=${persistentVolumeClaim}`,
    method: 'get'
  })
}
