import { getNamespacesInfo } from '@/api/kubernetes/namespace/namespace'

const actions = {
  getNamespacesInfo(context) {
    return new Promise((resolve, reject) => {
      getNamespacesInfo().then(response => {
        const { data } = response
        context.commit('GETNAMESPACESINFO', data)
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const mutations = {
  GETNAMESPACESINFO(state, data) {
    state.namespacesInfo = data
    // 解决当刷新集群namespace页面时，namespace下拉选择框namespace重复问题
    state.namespacesName = []
    for (let i = 0; i < data.length; i++) {
      state.namespacesName.push(data[i].name)
    }
  }
}

// state中的数据只能通过mutation去改变
const state = {
  // axios响应数据中的pod信息
  namespacesInfo: [],
  namespacesName: []
}

const getters = {
  namespacesOptions(state) {
    return [{
      label: 'All Namespaces',
      options: ['all']
    },
    {
      label: 'Namespaces',
      options: state.namespacesName
    }]
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
