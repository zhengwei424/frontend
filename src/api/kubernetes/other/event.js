import request from '@/utils/request'

export function getEventsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/other/events?namespace=${namespace}`,
    method: 'get'
  })
}
