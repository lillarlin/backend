<template>
  <div class="roles">
      <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
  <el-breadcrumb-item :to="{path:'/homemain'}">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
   </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
       <el-row>
        <el-col >
          <el-button type="primary">添加用户</el-button>
        </el-col>
       </el-row>
       <el-table :data="rolesList" border stripe>
         <!-- 展开列 -->
          <el-table-column type="expand" >
         <template slot-scope="scope">
              <el-row v-for="item1 in scope.row.children" :key="item1.id">
                <!-- 一级权限 -->
                <el-col :span="5">
               <el-tag>
                 {{item1.authName}}
               </el-tag>
               <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级和三级权限 -->
                  <el-col :span="19">
                    <el-row v-for="item2 in item1.children" :key="item2.id">
                      <!-- 二级权限 -->
                      <el-col :span="6">
                         <el-tag type="success">
                            {{item2.authName}}
                         </el-tag>
                           <i class="el-icon-caret-right"></i>
                      </el-col>
                       <!-- 三级权限 -->
                      <el-col :span="18">
                        <el-tag v-for="item3 in item2.children " :key="item3.id" type="warning" closable @close="removebyid(scope.row,item3.id)">
                          {{item3.authName}}
                        </el-tag>
                      </el-col>

                    </el-row>
                  </el-col>
              </el-row>
         </template>
          </el-table-column>
         <!-- 索引列 -->
           <el-table-column type="index" label="#"></el-table-column>
           <el-table-column  label="角色名称" prop="roleName"></el-table-column>
           <el-table-column  label="角色描述" prop="roleDesc"></el-table-column>
           <el-table-column  label="操作" width="300px">
             <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete"  size="mini">删除</el-button>
              <el-button type="warning" icon="el-icon-setting"  size="mini" @click="setright(scope.row)">分配权限</el-button>
             </template>
           </el-table-column>
       </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
  title="分配权限"
  :visible.sync="setrightdialog"
  width="50%" @close="setrightclose">
  <!-- 树形控件 -->
   <el-tree :data="setrightList" :props="setrightProps" show-checkbox  node-key="id" :default-checked-keys="defkeys"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setrightdialog = false">取 消</el-button>
    <el-button type="primary" @click="setrightdialog = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
 name:'Roles',
 data(){
   return{
     rolesList:[],
     setrightdialog:false,
     setrightList:[],
     setrightProps:{
       label:'authName',
       children:'children'
     },
    //  三级权限id
     defkeys:[]
   }
 },
 created(){
   this.getrolesList()
 },
 methods:{
  async getrolesList(){
        const {data:res}=await this.$http.get('roles')
        if(res.meta.status!==200){
          return this.$message.console.error('获取角色列表失败');
        }
        this.rolesList=res.data
        console.log(this.rolesList);
   },
   //删除标签
   removebyid(roles,rightid){
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data:res} =await this.$http.delete(`roles/${roles.id}/rights/${rightid}`)
            if(res.meta.status!==200){
              return this.$message.error('删除权限失败')
            }
            //this.getrolesList()  这样会使整个页面发生刷新
            roles.children=res.data
            //把删除后的数据直接赋值给roles.children，完成刷新
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
   //分配权限
   async setright(role){
        this.setrightdialog=true  
     const {data:res} =await  this.$http.get('rights/tree')
     if(res.meta.status!==200){
       return this.$message.error('获取权限列表失败')
     }
     //调用getrightkey获取三级权限
     this.getrightkey(role,this.defkeys)
     this.setrightList=res.data
     console.log(this.setrightList);
   },
   //通过递归获取三级权限的id
   getrightkey(node,arr){
     //如果是三级权限
          if(!node.children){
            return arr.push(node.id)
          }
          // 不是三级权限
          node.children.forEach(item => {
            this.getrightkey(item,arr)
          });
   },
   //关闭分配权限对话框，是id重置
   setrightclose(){
     this.defkeys=[]
   }
 }
}
</script>

<style>
.breadcrumb{
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
}
.el-tag{
  margin: 7px;
}
</style>