import request from '@/utils/request'

export function getIngressesInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/svc/ingresses?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteIngress(namespace, ingress) {
  return request({
    url: `/svc/ingress/delete?namespace=${namespace}&ingress=${ingress}`,
    method: 'post'
  })
}

export function updateIngress(ingressInfo) {
  return request({
    url: '/svc/ingress/update',
    method: 'post',
    data: ingressInfo
  })
}

export function getIngress(namespace, ingress) {
  return request({
    url: `/svc/ingress/get?namespace=${namespace}&ingress=${ingress}`,
    method: 'get'
  })
}
