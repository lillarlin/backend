<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
  <el-breadcrumb-item :to="{path:'/homemain'}">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>

   <el-card>
     <el-alert
    title="注意：只允许为第三级分类设置相关参数"
    type="warning" :closable="false" show-icon>
  </el-alert>
   <el-row>
     <el-col>
       <span>选择商品分类：</span>
        <!-- 级联选择器 -->
    <el-cascader
    v-model= "selectkeys"
    :options="catelist"
    expandTrigger='hover'
  
    :props="cascaderprops"
    @change="parentcatechange"  ></el-cascader>
     </el-col>
   </el-row>
   <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" :disabled="isbtndisable" @click="adddialogVisible = true">添加参数</el-button>
      <el-table :data="manydata" border>
        <el-table-column type="expand" >
          <template slot-scope="scope"> 
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleclose(index,scope.row)">{{item}}</el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                     ref="saveTagInput"
                      size="small"
                 @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                        >
               </el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

          </template>
        </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column  label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="scope" >
                 <el-button type="primary" icon="el-icon-edit" size="mini" @click="editform(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete"  size="mini">删除</el-button>
              </template>
            </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
      <el-button type="primary" :disabled="isbtndisable" @click="adddialogVisible = true">添加属性</el-button>
       <el-table :data="onlydata" border>
        <el-table-column type="expand" >
          <template slot-scope="scope"> 
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleclose(index,scope.row)">{{item}}</el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                     ref="saveTagInput"
                      size="small"
                 @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                        >
               </el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

          </template>
        </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column  label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="scope">
                 <el-button type="primary" icon="el-icon-edit" size="mini" @click="editform(scope.row.attr_id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete"  size="mini">删除</el-button>
              </template>
            </el-table-column>
      </el-table>
    </el-tab-pane>
   
  </el-tabs>
 </el-card>
 <!-- 添加参数对话框 -->
 <el-dialog
  :title="'添加'+titletext"
  :visible.sync="adddialogVisible"
  width="50%" @close="adddialogclose"
 >
 <el-form :model="addForm" :rules="addFormRul" ref="addFormRef" label-width="100px" >
  <el-form-item :label="titletext" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addparams">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改参数对话框 -->
 <el-dialog
  :title="'修改'+titletext"
  :visible.sync="editdialogVisible"
  width="50%" @close="editdialogclose"
 >
 <el-form :model="editForm" :rules="editFormRul" ref="editFormRef" label-width="100px" >
  <el-form-item :label="titletext" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editparams">确 定</el-button>
  </span>
</el-dialog>
  </div> 
</template>

<script>
export default {
 name:'params',
 data(){
  return {
     catelist:[],
     cascaderprops:{
           value:'cat_id',
           label:'cat_name',
           children:'children'
     },
     selectkeys:[],
     activeName:'many',
     manydata:[],
     onlydata:[],
    
     adddialogVisible:false,
      editdialogVisible:false,
    
      editattr_id:0,
     addForm:{
       attr_name:''
     },
      editForm:{
       attr_name:''
     },
     addFormRul:{
       attr_name:[
         {required: true, message:'请输入参数', trigger: 'blur'}
       ]
     },
    editFormRul:{
       attr_name:[
         {required: true, message:'请输入参数', trigger: 'blur'}
       ]
     }, 
  }
 },
 created(){
 this.getcatelist()
 },
 methods:{
  async getcatelist(){
    const {data:res} =await this.$http.get('/categories')
    if(res.meta.status!==200)
    {
      return this.$message.error('获取用户列表失败');
    }
    this.catelist=res.data
    console.log(this.catelist);
  },
    parentcatechange(){
    // 判断选中的是否是3级分类
    this.getcateparams()
  },
handleClick(){
  this.getcateparams()
},
 async getcateparams(){
  if(this.selectkeys.length!==3){
          this.selectkeys=[]
          return
    }
   const {data:res}=await this.$http.get(`categories/${this.cateid}/attributes`,{params:{sel:this.activeName}})
   if(res.meta.status!==200){
     return this.$message.error('获取三级参数失败')
   }
   res.data.forEach(item=>{
      item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
      item.inputVisible=false
      item.inputValue=''
   })
   console.log(res.data);
   if(this.activeName==='many'){
     this.manydata=res.data
   }else{
     this.onlydata=res.data
   }
},
adddialogclose(){
  this.$refs.addFormRef.resetFields()
},
editdialogclose(){
  this.$refs.editFormRef.resetFields()
},
 addparams(){
  this.$refs.addFormRef.validate( async valid=>{
    if(!valid) return
    const {data:res} =await this.$http.post(`categories/${this.cateid}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.activeName})
    if(res.meta.status!==201){
      return this.$message.error('添加参数失败')
    }
    this.$message.success('添加参数成功')
    this.getcateparams()
    this.adddialogVisible=false
  })
},
 async editform(attrid){
     this.editdialogVisible=true
  const {data:res}=await  this.$http.get(`categories/${this.cateid}/attributes/${attrid}`,{params:{attr_sel:this.activeName}})
   if(res.meta.status!==200){
     return this.$message.error('获取参数失败')
   }
   this.editForm=res.data
   this.editattr_id=attrid

 },
 editparams(){
   this.$refs.editFormRef.validate( async valid=>{
    if(!valid) return
    const {data:res} =await this.$http.put(`categories/${this.cateid}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name,attr_sel:this.activeName})
    if(res.meta.status!==200){
      return this.$message.error('添加参数失败')
    }
    this.$message.success('添加参数成功')
    this.getcateparams()
    this.editdialogVisible=false
  })
 },
 async handleInputConfirm(row){
  if(row.inputValue.trim().length===0){
    row.inputValue=''
    row.inputVisible=false
    return
  }
  row.attr_vals.push(row.inputValue.trim())
   row.inputValue=''
    row.inputVisible=false
   this.saveattr_val(row)
 },
 showInput(row){
   row.inputVisible=true
    this.$nextTick(_ => {
      // $nextTick作用，当页面被重新渲染后，才调用里面的回调函数
          this.$refs.saveTagInput.$refs.input.focus();
          // 获取焦点
        });
 },
//  将输入的参数保存到数据库中
  async saveattr_val(row){
    const {data:res}=await this.$http.put(`categories/${this.cateid}/attributes/${row.attr_id}`,{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')})
   if(res.meta.status!==200){
     this.$message.error('修改参数失败')
   }
   this.$message.success('修改参数成功')

  },
  handleclose(index,row){
     row.attr_vals.splice(index,1)
     this.saveattr_val(row)
  }
 },
 computed:{
    isbtndisable(){
      if(this.selectkeys.length!==3){
        return true
      }
      else{
        return false
      }
    },
    // 分类id
    cateid(){
      if(this.selectkeys.length==3){
      return  this.selectkeys[2]
      }
      return null
    },
    titletext(){
      if(this.activeName==='many'){
        return '动态参数'
      }
      else{
        return '静态属性'
      }
    }
 }
}
</script>

<style scoped>
.breadcrumb{
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
}
.el-alert{
  margin-bottom: 15px;
}
.el-row{
  margin-bottom: 15px;
}
.el-tag{
  margin-right: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>