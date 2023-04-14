import shortid from 'shortid'

const mutations = {
  // 增加一个tab
  ADDTAB(state, tab) {
    // 添加id字段
    tab.id = shortid.generate()
    state.tabsList.push(tab)
  },
  // 删除一个指定索引的tab
  REMOVETAB(state, index) {
    state.tabsList.splice(index, 1)
  }
}

const state = {
  tabsList: []
}

export default {
  namespaced: true,
  mutations,
  state
}
