import { getPodsInfo } from '@/api/kubernetes/workload/pod'

const actions = {
  getPodsInfo(context, namespace) {
    return new Promise((resolve, reject) => {
      getPodsInfo(namespace).then(response => {
        const { data } = response
        context.commit('GETPODSINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETPODSINFO(state, data) {
    state.podsInfo = data
  }
}

// state中的数据只能通过mutation去改变
const state = {
  // axios响应数据中的pod信息
  podsInfo: []
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
