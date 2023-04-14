import { getClusterRolesInfo } from '@/api/kubernetes/RBAC/clusterRole'

const actions = {
  getClusterRolesInfo(context) {
    new Promise((resolve, reject) => {
      getClusterRolesInfo().then(response => {
        const { data } = response
        context.commit('GETCLUSTERROLESINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETCLUSTERROLESINFO(state, data) {
    state.clusterRolesInfo = data
  }
}

const state = {
  clusterRolesInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
