import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUi from 'element-ui'
import axios from 'axios'
Vue.config.productionTip = false
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUi)
axios.defaults.baseURL="https://lianghj.top:8888/api/private/v1/"
Vue.prototype.$http=axios
Vue.prototype.$message=ElementUi.Message
new Vue({
  render: h => h(App),
  router,
 
  
}).$mount('#app')
