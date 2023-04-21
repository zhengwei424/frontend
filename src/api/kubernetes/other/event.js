import request from '@/utils/request'

export function getEventsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/other/events?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteEvent(namespace, event) {
  return request({
    url: `/other/event/delete?namespace=${namespace}&event=${event}`,
    method: 'post'
  })
}

export function updateEvent(eventInfo) {
  return request({
    url: '/other/event/update',
    method: 'post',
    data: eventInfo
  })
}

export function getEvent(namespace, event) {
  return request({
    url: `/other/event/get?namespace=${namespace}&event=${event}`,
    method: 'get'
  })
}
