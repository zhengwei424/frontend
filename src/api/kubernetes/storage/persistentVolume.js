import request from '@/utils/request'

export function getPersistentVolumesInfo() {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/storage/persistentVolumes`,
    method: 'get'
  })
}

export function deletePersistentVolume(persistentVolume) {
  return request({
    url: `/storage/persistentVolume/delete?persistentVolume=${persistentVolume}`,
    method: 'post'
  })
}

export function updatePersistentVolume(persistentVolumeInfo) {
  return request({
    url: '/storage/persistentVolume/update',
    method: 'post',
    data: persistentVolumeInfo
  })
}

export function getPersistentVolume(persistentVolume) {
  return request({
    url: `/storage/persistentVolume/get?persistentVolume=${persistentVolume}`,
    method: 'get'
  })
}
