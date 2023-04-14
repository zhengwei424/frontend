import request from '@/utils/request'

export function getJobsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/jobs?namespace=${namespace}`,
    method: 'get'
  })
}

