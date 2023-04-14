import request from '@/utils/request'

export function getPersistentVolumesInfo() {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/storage/persistentVolumes`,
    method: 'get'
  })
}
