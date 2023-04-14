import { getCronJobsInfo } from '@/api/kubernetes/workload/cronJob'

const actions = {
  getCronJobsInfo(context, namespace) {
    return new Promise((resolve, reject) => {
      getCronJobsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETCRONJOBSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETCRONJOBSINFO(state, data) {
    state.cronJobsInfo = data
  }
}

// state中的数据只能通过mutation去改变
const state = {
  // axios响应数据中的pod信息
  cronJobsInfo: []
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
