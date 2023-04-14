import request from '@/utils/request'

export function getNetworkPoliciesInfo(namespace) {
  return request({
    url: `/svc/networkPolicies?namespace=${namespace}`,
    method: 'get'
  })
}
