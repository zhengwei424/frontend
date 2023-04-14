import request from '@/utils/request'

export function getCronJobsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/cronJobs?namespace=${namespace}`,
    method: 'get'
  })
}

