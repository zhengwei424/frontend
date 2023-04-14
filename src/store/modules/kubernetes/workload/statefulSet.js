import { getStatefulSetsInfo } from '@/api/kubernetes/workload/statefulSet'

const actions = {
  getStatefulSetsInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getStatefulSetsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETSTATEFULSETSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETSTATEFULSETSINFO(state, data) {
    state.statefulSetsInfo = data
  }
}

const state = {
  statefulSetsInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
