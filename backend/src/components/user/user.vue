<template>
  <div class="user">
    <!-- 面包屑导航区域 -->
   <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
  <el-breadcrumb-item :to="{path:'/homemain'}">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card class="box-card">
  <el-row :gutter="20">
  <el-col :span="8">
    <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getUserList">
    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
    </el-input>
  </el-col>
  <el-col :span="4">
    <el-button type="primary" @click="adduser">添加用户</el-button>
  </el-col>
  </el-row>
  <el-table :data="UserList" border>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态" prop="mg_state">
        <template slot-scope="scope">
          <!-- 作用域插槽，通过 slot-scope="scope" 可以接收插槽的的数据，scope.row获取该行的数据-->
            <el-switch
              v-model="scope.row.mg_state" @change="userstatechange(scope.row)">
            </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px" >
        <template slot-scope="scope">

          <!-- 修改按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)"></el-button>
          <!-- 删除按钮 -->
           <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row.id)">

           </el-button>

           <el-tooltip  effect="dark" content="创建角色" placement="top" :enterable="false">
             <!-- 创建角色 -->
          <el-button type="warning" icon="el-icon-setting" size="mini" @click="setroles(scope.row)"></el-button>
           </el-tooltip>
         </template>
      </el-table-column>
  </el-table>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryinfo.pagenum"
      :page-size="queryinfo.pagesize"
      :page-sizes="[2, 4, 6, 10]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="usertotal">
    </el-pagination>
 </el-card>
 <!-- 点击添加用户，弹出对话框 -->
 <el-dialog
  title="添加用户"
  :visible.sync="isvisible"
  width="50%" @close="addformclose"
  >
 <!-- 添加用户主题区 -->
 <el-form :model="addform" :rules="addformRul" ref="addformRef" label-width="70px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addform.username"></el-input>
  </el-form-item>

   <el-form-item label="密码" prop="password">
    <el-input v-model="addform.password"></el-input>
  </el-form-item>

   <el-form-item label="邮箱" prop="email">
    <el-input v-model="addform.email"></el-input>
  </el-form-item>

   <el-form-item label="手机号" prop="phone">
    <el-input v-model="addform.phone"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="isvisible=false">取 消</el-button>
    <el-button type="primary" @click="isadduser">确 定</el-button>
  </span>
</el-dialog>
<!-- 点击修改按钮，弹出对话框 -->
<el-dialog
  title="修改信息"
  :visible.sync="editdialogVisible"
  width="50%"
 @close="editformclose"
  >
  <!-- 修改用户信息 -->
  <el-form :model="editform" :rules="editformRul" ref="editformRef" label-width="70px" >
  <el-form-item label="用户名" >
    <el-input v-model="editform.username" disabled></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="editform.email"></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="mobile">
    <el-input v-model="editform.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary"  @click="isedituser">确 定</el-button>
  </span>
</el-dialog>
<!-- 点击删除按钮牛，弹出提示框 -->

<!-- 点击分配角色弹出对话框 -->
 <el-dialog
  title="分配角色"
  :visible.sync="setrolesdialog"
  width="50%" @close="setroleclose">
       <div>
         <p>当前的用户：{{setrolesinfo.username}}</p>
         <p>当前的角色：{{setrolesinfo.role_name}}</p>
         <p>分配新角色：
           <el-select v-model="setrolesbyid" placeholder="请选择">
           <el-option
             v-for="item in setroleslist"
             :key="item.id"
            :label="item.roleName"
            :value="item.id">
           </el-option>
           </el-select>
         </p>
       </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="setrolesdialog = false">取 消</el-button>
    <el-button type="primary" @click="saveroleinfo">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
 name:'user',
 data(){
   var checkemail=( rules,value,cd)=>{
          const regemail=/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
          if(regemail.test(value)){
            return cd()
          }
          cd(new Error('请输入合法邮箱'))
   }
   var checkphone=(rules,value,cd)=>{
        const regphone=/^[1][3,4,5,7,8][0-9]{9}$/
         if(regphone.test(value)){
            return cd()
          }
          cd(new Error('请输入合法手机号'))
   }
   return {
 queryinfo:{
   query:'',
  //  当前的页数
   pagenum:1,
  //  当前页数显示多少条数据
   pagesize:2
 },
   UserList:[],
   usertotal:0,
   isvisible:false,
   editdialogVisible:false,
   setrolesdialog:false,
  setrolesinfo:{},
  setroleslist:[],
  // 已选中的角色ID值
 setrolesbyid:'',
  

   //查询到的用户信息
   editform:{},
  //  添加用户的表单数据
   addform:{
     username:'',
     password:'',
     email:'',
     phone:''
   },
   //表单的验证规则
   addformRul:{
    //  表单项的验证
     username:[
       { required: true, message: '请输入用户名称', trigger: 'blur' },
       { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
     ],
     password:[
        { required: true, message: '请输入用户密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
     ],
     email:[
       //用正则表达式自定义邮箱和手机项的验证规则
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { validator:checkemail, trigger: 'blur' }
     ],
     phone:[
       { required: true, message: '请输入用户手机号', trigger: 'blur' },
        { validator:checkphone, trigger: 'blur' }
     ]
   },
   editformRul:{
    email:[
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { validator:checkemail, trigger: 'blur' }
     ],
     mobile:[
       { required: true, message: '请输入用户手机号', trigger: 'blur' },
        { validator:checkphone, trigger: 'blur' }
     ]
   }
   }
   },
   created(){
     this.getUserList()
   },
   methods:{
     async getUserList(){
       const {data:res}=await this.$http.get('users',{params:this.queryinfo})
       if(res.meta.status!==200) return this.$message.error("获取用户列表失败")
       this.UserList=res.data.users
       this.usertotal=res.data.total
       console.log(res);
     },
    //  监听pagesize改变触发的事件
     handleSizeChange(newsize){
          this.queryinfo.pagesize=newsize
          this.getUserList()
     },
    //  监听页数改变触发的事件
     handleCurrentChange(newpage){
      this.queryinfo.pagenum=newpage
      this.getUserList()
     },
    //  监听开关事件的状态的改变
    async  userstatechange(info){
       console.log(info);
        const {data:res}= await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
        //用put发送网络请求，修改开关状态
        if(res.meta.status!==200) {
          info.mg_state=!info.mg_state
          return this.$message.error('更改用户状态失败')
        }
        this.$message.success('更改用户状态成功')
     },
     adduser(){
       this.isvisible=true
     },
     //添加用户表单重置
      addformclose(){
         this.$refs.addformRef.resetFields()
      },
      //修改用户表单重置
      editformclose(){
        this.$refs.editformRef.resetFields()
      },
      //预校验添加用户表单
      isadduser(){
        this.$refs.addformRef.validate( async vaild=>{
          if(!vaild) return
          //预校验通过后，就可以发送网络请求，添加用户
            const {data:res} =await  this.$http.post('users', this.addform)
            if(res.meta.status!==201){
              this.$message.error('添加用户失败')
            }
            this.$message.success('添加用户成功')
            this.getUserList()
            this.isvisible=false
        })
      },
      async edit(id){
        this.editdialogVisible=true
       const {data:res}=await  this.$http.get('users/'+id)
       if(res.meta.status!==200){
        return this.$message.error('查询用户信息失败')
       }
       this.editform=res.data
      },
      //预校验修改用户表单
      isedituser(){
        this.$refs.editformRef.validate(async vaild=>{
         if(!vaild) return
         //修改用户信息
         const {data:res} =await this.$http.put('users/'+this.editform.id,{email:this.editform.email,mobile:this.editform.mobile})
           if(res.meta.status!==200){
          return this.$message.error('更新用户失败')
        }
        this.editdialogVisible=false
        this.getUserList()
        this.$message.success('更新成功')
        })
       
      },
      //根据id值删除用户信息
      del(id){
         this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
      const{data:res} =await   this.$http.delete('users/'+id)
      if  (res.meta.status!==200){
        return this.$message.error('删除失败')
      }
      this.getUserList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 分配角色
     async setroles(setrolesinfo){
        this.setrolesdialog=true
        this.setrolesinfo=setrolesinfo
        // 获取所有角色列表
      const {data:res}=await this.$http.get('roles')
          if (res.meta.status!==200){
            return this.$message.error('获取角色列表失败')
          }
          this.setroleslist=res.data
      },
      // 保存新角色
     async saveroleinfo (){
       if(!this.setrolesbyid){
         return this.$message.error('请选择新角色')
       }
       const {data:res}=await this.$http.put(`users/${this.setrolesinfo.id}/role`,{rid:this.setrolesbyid})
       if(res.meta.status!==200){
         return this.$message.error('更新角色失败')
       }
       this.getUserList()
       this.setrolesdialog=false
       this.$message.success('更新角色成功')
     },
    //  监听关闭创建新角色对话框
    setroleclose(){
      this.setrolesbyid=''
      this.setrolesinfo={}
    }
   }
}
</script>

<style scoped>
.breadcrumb{
  font-size: 18px;
  font-weight: 700;
}
.text {
    font-size: 16px;
  }

 
 .el-breadcrumb{
 margin-bottom: 15px;
 }
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .el-row{
    margin-bottom: 15px;
  }
  .el-table{
    margin-bottom: 15px;
  }
</style>