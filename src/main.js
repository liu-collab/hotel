import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入插件
import './plugin'


Vue.config.productionTip = false
//设置中央事件总线
Vue.prototype.$bus = new Vue()



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
