const mutations = {
  SETCURRENTNAMESPACE(state, data) {
    // 解决初次computed获取currentNamespace为undefined的问题，感觉时获取state值时，会调用mutations，而不是直接只用state的初始值，而此时mutations的data值为空
    // 有点问题？？？？？？？？？？？？？？？？？
    if (data) {
      state.currentNamespace = data
    } else {
      state.currentNamespace = 'default'
    }
  }
}

const state = {
  currentNamespace: 'default'
}

export default {
  namespaced: true,
  mutations,
  state
}
