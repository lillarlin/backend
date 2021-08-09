<template>
  <div class="login">
  <div class="login-box">
    <p>后台管理系统</p>
     <div>
       <!-- 用户名 -->
       <el-form class="login-form" :model="loginform" :rules="loginformrules" ref="loginformRef">
         <!-- 通过:model绑定一个数据对象给表单 -->
         <el-form-item class="name" prop='username'>
            <el-input prefix-icon='el-icon-user' v-model="loginform.username"></el-input>
            <!-- 通过v-model双向绑定，获取表单中的数据给表单项 -->
         </el-form-item>
       <!-- 密码 -->
       <el-form-item prop='password'>
            <el-input prefix-icon ='el-icon-lock' v-model="loginform.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
         <el-button type='primary' @click="login">登录</el-button>
          <el-button type='info' @click="reset">重置</el-button>
         </el-form-item>
       </el-form>
        
     </div>
  </div>
  </div>
</template>

<script>
export default {
  name:'Login',
  data(){
    return{
      loginform:{
          username:'admin',
          password:'123456'
      },
      loginformrules:{
        username:[
          {required: true, message:'请输入登录名称', trigger: 'blur'},
          {require: true, min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
           {required: true, message:'请输入密码', trigger: 'blur'},
          {require: true, min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    reset(){
      this.$refs.loginformRef.resetFields()
      // 获取表单的实例对象在调用resetFields重置表单
    },
    login(){
      this.$refs.loginformRef.validate( async valid=>{
        //登录验证，validate第一个参数是返回一个布尔值
        if(!valid) return
        //1,使用then方法处理请求的数据
     //this.$http.post('login',this.loginform).then(res=>console.log(res.data))
         //2使用await async处理
         const {data:res}= await this.$http.post('login',this.loginform)
        //  {data:res}解构对象中的data属性，就是取出data属性，并重命名为res
        if(res.meta.status!==200) return this.$message.error('登录失败');
        this.$message.success('登陆成功')
        //1.将登陆成功之后的token保存到客户端sessionStorge中
        //1.1项目中除了登录之外的其他api接口，必须要在登录之后才能访问，所以只有你登录成功后会获得一个token来证明你登录成功，才能接着请求其他数据
        //1.2token只应在当前网站打开期间生效，所以将token保存在sessionstorge
        window.sessionStorage.setItem("token",res.data.token)
        //2.通过编程导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
.login{
  background-color: #2b4b6b;
  height: 100vh;
}
.login-box{
  height: 300px;
  width: 450px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  border-radius: 10px;
}
.btns{
  display: flex;
  justify-content: flex-end;
}

.login-form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
}
p{
  text-align: center;
  margin-top: 50px;
  font-size: 20px;
}
</style>