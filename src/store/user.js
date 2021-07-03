//登录记住用户名模块

export default {
  //设置为私有命名空间
  namespaced: true,
  state: {
    admin: {}
  },
  mutations: {
    setAdmin(state, value) {
      state.admin = value
    }
  }
}