import { getReplicaSetsInfo } from '@/api/kubernetes/workload/replicaSet'

const actions = {
  getReplicaSetsInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getReplicaSetsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETREPLICASETSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETREPLICASETSINFO(state, data) {
    state.replicaSetsInfo = data
  }
}

const state = {
  replicaSetsInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
