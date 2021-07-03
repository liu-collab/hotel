import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//导入记住用户名模块
import user from './user'
export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user
  }
})
