import { getNodesInfo } from '@/api/kubernetes/node/node'

const actions = {
  getNodesInfo(context) {
    return new Promise((resolve, reject) => {
      getNodesInfo().then(response => {
        const { data } = response
        context.commit('GETNODESINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETNODESINFO(state, data) {
    state.nodesInfo = data
  }
}

// state中的数据只能通过mutation去改变
const state = {
  // axios响应数据中的pod信息
  nodesInfo: []
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
