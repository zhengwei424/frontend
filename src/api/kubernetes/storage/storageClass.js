import request from '@/utils/request'

export function getStorageClassesInfo() {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/storage/storageClasses`,
    method: 'get'
  })
}
