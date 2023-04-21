import request from '@/utils/request'

export function getNetworkPoliciesInfo(namespace) {
  return request({
    url: `/svc/networkPolicies?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteNetworkPolicy(namespace, networkPolicy) {
  return request({
    url: `/svc/networkPolicy/delete?namespace=${namespace}&networkPolicy=${networkPolicy}`,
    method: 'post'
  })
}

export function updateNetworkPolicy(networkPolicyInfo) {
  return request({
    url: '/svc/networkPolicy/update',
    method: 'post',
    data: networkPolicyInfo
  })
}

export function getNetworkPolicy(namespace, networkPolicy) {
  return request({
    url: `/svc/networkPolicy/get?namespace=${namespace}&networkPolicy=${networkPolicy}`,
    method: 'get'
  })
}
