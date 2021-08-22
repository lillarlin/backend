import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUi from 'element-ui'
import axios from 'axios'
import tabletree from 'vue-table-with-tree-grid'
Vue.config.productionTip = false
import 'element-ui/lib/theme-chalk/index.css'
import 'assets/font/iconfont.css'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(ElementUi)
Vue.use( VueQuillEditor)
axios.defaults.baseURL="http://timemeetyou.com:8889/api/private/v1/"
//请求拦截器，给请求对象挂载一个令牌即token，这样才可以访问一些有权限的的接口
axios.interceptors.request.use(config=>{
 
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http=axios
//$message弹窗提示
Vue.prototype.$message=ElementUi.Message
//弹框提示
Vue.prototype.$comfirm=ElementUi.MessageBox
//全局注册插件
Vue.component('table-tree',tabletree)
//定义时间过滤器，把时间戳转换成当前时间
Vue.filter('dateFormat',function(originVal){
  const dt=new Date(originVal)

  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')

  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')
  //padStart,保证字符串两位，不够用0补充
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  render: h => h(App),
  router,
 
  
}).$mount('#app')
