import request from '@/utils/request'

export function getStorageClassesInfo() {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/storage/storageClasses`,
    method: 'get'
  })
}

export function deleteStorageClass(storageClass) {
  return request({
    url: `/storage/storageClass/delete?storageClass=${storageClass}`,
    method: 'post'
  })
}

export function updateStorageClass(storageClassInfo) {
  return request({
    url: '/storage/storageClass/update',
    method: 'post',
    data: storageClassInfo
  })
}

export function getStorageClass(storageClass) {
  return request({
    url: `/storage/storageClass/get?storageClass=${storageClass}`,
    method: 'get'
  })
}
