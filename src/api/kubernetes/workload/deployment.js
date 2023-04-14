import request from '@/utils/request'

export function getDeploymentsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/deployments?namespace=${namespace}`,
    method: 'get'
  })
}
