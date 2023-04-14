import { userLogin, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(), // 用户登录后得到token
    name: '', // 用户姓名
    avatar: '' // 用户头像
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    // 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象,可以实现对象合并
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login(context, verifyInfo) {
    return new Promise((resolve, reject) => {
      // promise异步处理，处理结束后调用resolve或reject
      userLogin(verifyInfo).then(response => {
        if (response.token) {
          context.commit('SET_TOKEN', response.token)
          // 将token存储到cookies中，key为jwtAuthToken
          setToken(response.token)
        } else {
          context.commit('SET_TOKEN', '')
          // 将token存储到cookies中，key为jwtAuthToken
          setToken('')
        }
        resolve(response)
      }).catch(error => {
        context.commit('SET_TOKEN', '')
        // 将token存储到cookies中，key为jwtAuthToken
        setToken('')
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       removeToken() // must remove  token  first
  //       resetRouter()
  //       commit('RESET_STATE')
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

