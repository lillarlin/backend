import Vue from 'vue'
import router from 'vue-router'

const Login=()=>import ('components/Login.vue')
const Home=()=>import ('components/Home.vue')
Vue.use(router)
  const Router=  new router({
  routes:[
    {
           path:'',
           redirect:'/login'
    },

    {
          path:'/login',
          component:Login
    },
    {
      path:'/home',
      component:Home
    }
  ]
})
//挂载路由导航守卫，
Router.beforeEach((to,from,next)=>{
//to 将要访问的路径
//from代表从哪个路径跳转而来
//next是一个函数，表示放行next()  next('/login')强制跳转
if(to.path==='/login') return next()
const tokenstr=window.sessionStorage.getItem('token')
if(!tokenstr) return next('/login')
next()
})

export default Router