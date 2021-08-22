<template>

  <div>
    <el-container class="home-container">
      <!-- 标题 -->
  <el-header>
    <div>
      <span class="text">后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
    </el-header>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="iscollapse ? '64px':'200px'  ">
      <div class="tog-button" @click="toggle">| | |</div>
        <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EEF" :unique-opened='true' :collapse="iscollapse" 
      :collapse-transition="false" router :default-active="activepath">
      <!-- router 开启路有导航模式，整个菜单都具有路由模式。他的路由地址即当前菜单的index
      -->

      <!-- 一级菜单 -->
    
      <el-submenu :index="item.id+'' " v-for="item in menulist" :key="item.id">
        <!-- index相同会造成点一个选项，所有的都二级菜单都展开，所以给他动态添加一个数值，且index只接受字符串 -->
        <template slot="title">
          <!-- 图标文本 -->
          <i :class="icon[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+subitem.path " v-for="subitem in item.children" :key="subitem.id">
        <!-- 动态给菜单的index赋值，作为路由地址 -->
           <template slot="title">
          <!-- 图标文本 -->
          <i class="el-icon-menu">{{subitem.authName}}</i>
          <span></span>
        </template>
        </el-menu-item>

      </el-submenu>
     
    </el-menu>
    </el-aside>
    <!-- 主页 -->
    <el-main>
     <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
   
  </div>
</template>

<script>
export default {
  name:'Home',
  data(){
    return {
       menulist:[],
       icon:{
         '125':'iconfont icon-icon-user',
         '103':'iconfont icon-quanxian',
         '101':'iconfont icon-shangpin',
         '102':'iconfont icon-dingdan',
         '145':'iconfont icon-shujutongji'
       },
      iscollapse:false,
      activepath:this.$route.path
    }
  },
  created(){
    this.getMenulist()
  },
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenulist(){
      const {data:res} =  await this.$http.get('menus')
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      this.menulist=res.data
      console.log(res);
    },
    toggle(){
      this.iscollapse=!this.iscollapse
    }
  }
}
</script>

<style scoped>

.el-header{
     background-color: #373D41;
     display: flex;
     justify-content: space-between;
     align-items: center;
    
}
.el-aside{
  background-color: #333744;
 
 
}
.el-main{
  background-color: #eaedf1;
}
.home-container{
  height: 100vh;
}
.text{
  font-size: 22px;
  color: #fff;
}
.iconfont{
  margin-right: 5px;
}
.el-menu{
  border-right: 0;
}
.tog-button{
  line-height: 24px;
  text-align: center;
  color: #fff;
  background-color: #4a5064;
  cursor: pointer;
}
</style>