import { getDeploymentsInfo } from '@/api/kubernetes/workload/deployment'

const actions = {
  getDeploymentsInfo(context, namespace) {
    return new Promise((resolve, reject) => {
      getDeploymentsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETDEPLOYMENTSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETDEPLOYMENTSINFO(state, data) {
    state.deploymentsInfo = data
  }
}

// state中的数据只能通过mutation去改变
const state = {
  // axios响应数据中的pod信息
  deploymentsInfo: []
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
