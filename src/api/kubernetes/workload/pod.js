import request from '@/utils/request'

export function getPodsInfo(namespace) {
  return request({
    // baseURL: 'xxx', // 会直接覆盖anxios预设的baseURL
    url: `/workload/pods?namespace=${namespace}`,
    method: 'get'
  })
}

export function deletePod(namespace, pod) {
  return request({
    url: `/workload/pod/delete?namespace=${namespace}&pod=${pod}`,
    method: 'post'
  })
}

export function updatePod(podInfo) {
  return request({
    url: '/workload/pod/update',
    method: 'post',
    data: podInfo
  })
}

export function getPod(namespace, pod) {
  return request({
    url: `/workload/pod/get?namespace=${namespace}&pod=${pod}`,
    method: 'get'
  })
}

// export function getGenerateSessionID(namespace, pod, container, shell) {
export function getGenerateSessionID(namespace, pod, container) {
  return request({
    // url: `/workload/${namespace}/${pod}/${container}/exec?shell=${shell}`,
    url: `/workload/${namespace}/${pod}/${container}/exec`,
    method: 'get'
  })
}

export function getContainerLogFile(value) {
  const {
    namespace, pod, container, previous
  } = value
  return request({
    url: `/workload/logfile/${namespace}/${pod}/${container}?previous=${previous}`,
    method: 'get'
  })
}
