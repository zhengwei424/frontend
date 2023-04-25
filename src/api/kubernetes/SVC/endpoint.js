import request from '@/utils/request'

export function getEndpointsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/svc/endpoints?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteEndpoint(namespace, endpoint) {
  return request({
    url: `/svc/endpoint/delete?namespace=${namespace}&endpoint=${endpoint}`,
    method: 'post'
  })
}

export function updateEndpoint(endpointInfo) {
  return request({
    url: '/svc/endpoint/update',
    method: 'post',
    data: endpointInfo
  })
}

export function getEndpoint(namespace, endpoint) {
  return request({
    url: `/svc/endpoint/get?namespace=${namespace}&endpoint=${endpoint}`,
    method: 'get'
  })
}
