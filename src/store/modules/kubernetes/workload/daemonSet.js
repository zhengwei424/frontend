import { getDaemonSetsInfo } from '@/api/kubernetes/workload/daemonSet'

const actions = {
  getDaemonSetsInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getDaemonSetsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETDAEMONSETSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETDAEMONSETSINFO(state, data) {
    state.daemonSetsInfo = data
  }
}

const state = {
  daemonSetsInfo: []
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
