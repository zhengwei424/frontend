import { getJobsInfo } from '@/api/kubernetes/workload/job'

const actions = {
  getJobsInfo(context, namespace) {
    return new Promise((resolve, reject) => {
      getJobsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETJOBSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETJOBSINFO(state, data) {
    state.jobsInfo = data
  }
}

// state中的数据只能通过mutation去改变
const state = {
  // axios响应数据中的pod信息
  jobsInfo: []
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
