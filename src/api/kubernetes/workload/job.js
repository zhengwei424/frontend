import request from '@/utils/request'

export function getJobsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/jobs?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteJob(namespace, job) {
  return request({
    url: `/workload/job/delete?namespace=${namespace}&job=${job}`,
    method: 'post'
  })
}

export function updateJob(jobInfo) {
  return request({
    url: '/workload/job/update',
    method: 'post',
    data: jobInfo
  })
}

export function getJob(namespace, job) {
  return request({
    url: `/workload/job/get?namespace=${namespace}&job=${job}`,
    method: 'get'
  })
}
