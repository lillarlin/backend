import Vue from 'vue'
import router from 'vue-router'


const Login=()=>import ('components/Login.vue')
const Home=()=>import ('components/Home.vue')
const HomeMain=()=>import('components/HomeMain.vue')
const User=()=>import ('components/user/user.vue')
const Right=()=>import ('components/power/Right.vue')
const Roles=()=>import ('components/power/Roles.vue')
const Cate=()=>import('components/goods/cate.vue')
const Params=()=>import ('components/goods/params.vue')
const List=()=>import ('components/goods/list.vue')
const Add=()=>import ('components/goods/add.vue')
const Order=()=>import ('components/order/order.vue')
const Reports=()=>import ('components/reports/reports.vue')
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
      component:Home,
      redirect:'/homemain',
      children:[
        {
          path:'/homemain',
          component:HomeMain
        },
        // 在Home的页面下添加子路由
        {
          path:'/users',
          component:User
        },
        {
          path:'/rights',
          component:Right
        },
        {
            path:'/roles',
            component:Roles
        },
        {
          path:'/categories',
          component:Cate
        },
        {
          path:'/params',
          component:Params
        },
        {
          path:'/goods',
          component:List
        },
        {
          path:'/goods/add',
          component:Add
        },
        {
          path:'/orders',
          component:Order
        },
        {
          path:'/reports',
          component:Reports
        }
      ]
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