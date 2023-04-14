import { getRolesInfo } from '@/api/kubernetes/RBAC/role'

const actions = {
  getRolesInfo(context, namespace) {
    new Promise((resolve, reject) => {
      getRolesInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETROLESINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETROLESINFO(state, data) {
    state.rolesInfo = data
  }
}

const state = {
  rolesInfo: []
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
