import request from '@/utils/request'

export function getServicesInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/svc/services?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteService(namespace, service) {
  return request({
    url: `/svc/service/delete?namespace=${namespace}&service=${service}`,
    method: 'post'
  })
}

export function updateService(serviceInfo) {
  return request({
    url: '/svc/service/update',
    method: 'post',
    data: serviceInfo
  })
}

export function getService(namespace, service) {
  return request({
    url: `/svc/service/get?namespace=${namespace}&service=${service}`,
    method: 'get'
  })
}
