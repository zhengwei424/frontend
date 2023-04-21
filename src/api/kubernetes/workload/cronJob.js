import request from '@/utils/request'

export function getCronJobsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/cronJobs?namespace=${namespace}`,
    method: 'get'
  })
}

export function deleteCronJob(namespace, cronJob) {
  return request({
    url: `/workload/cronJob/delete?namespace=${namespace}&cronJob=${cronJob}`,
    method: 'post'
  })
}

export function updateCronJob(cronJobInfo) {
  return request({
    url: '/workload/cronJob/update',
    method: 'post',
    data: cronJobInfo
  })
}

export function getCronJob(namespace, cronJob) {
  return request({
    url: `/workload/cronJob/get?namespace=${namespace}&cronJob=${cronJob}`,
    method: 'get'
  })
}
