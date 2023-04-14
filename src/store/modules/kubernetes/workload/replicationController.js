import { getReplicationControllersInfo } from '@/api/kubernetes/workload/replicationController'

const actions = {
  getReplicationControllersInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getReplicationControllersInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETREPLICATIONCONTROLLERSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETREPLICATIONCONTROLLERSINFO(state, data) {
    state.replicationControllersInfo = data
  }
}

const state = {
  replicationControllersInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
