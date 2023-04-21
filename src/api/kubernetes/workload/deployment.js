import request from '@/utils/request'

export function getDeploymentsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/deployments?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteDeployment(namespace, deployment) {
  return request({
    url: `/workload/deployment/delete?namespace=${namespace}&deployment=${deployment}`,
    method: 'post'
  })
}

export function updateDeployment(deploymentInfo) {
  return request({
    url: '/workload/deployment/update',
    method: 'post',
    data: deploymentInfo
  })
}

export function getDeployment(namespace, deployment) {
  return request({
    url: `/workload/deployment/get?namespace=${namespace}&deployment=${deployment}`,
    method: 'get'
  })
}
