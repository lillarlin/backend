<template>
  <div>
   <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
  <el-breadcrumb-item :to="{path:'/homemain'}">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="addcate">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <table-tree :data="cateList" :columns="columns" 
    :selection-type="false" :expand-type="false" show-index
    index-text="#"  border
    >
       <template slot="isok" slot-scope="scope">
             <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
              <i class="el-icon-error" v-else style="color:lightred"></i>
       </template>

       <template slot="order" slot-scope="scope">
             <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
             <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
             <el-tag type="warning" v-else>三级</el-tag>
       </template>

        <template slot="option">
             <el-button type="primary" icon="el-icon-edit">编辑</el-button>
             <el-button type="primary" icon="el-icon-delete">删除</el-button>
       </template>
    </table-tree>


      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  <!-- 添加分类对话框 -->
  <el-dialog
  title="添加分类"
  :visible.sync="addcatedialog"
  width="50%"
  @close="addcateclose"
  >
 <el-form :model="addcateForm" :rules="addcateRul" ref="addcateFormRef" label-width="100px" >
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addcateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类" >
    <el-cascader
    v-model= "selectkeys"
    :options="parentcatelist"
    expandTrigger='hover'
  
    :props="cascaderprops"
    @change="parentcatechange" clearable change-on-select ></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addcatedialog = false">取 消</el-button>
    <el-button type="primary" @click="AddCate">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
 name:'cate',
 data(){
   return {
     cateList:[],
     total:0,
     addcatedialog:false,
     selectkeys:[],
     parentcatelist:[],
     cascaderprops:{
           value:'cat_id',
           label:'cat_name',
           children:'children'
     },
     queryinfo:{
       type:3,
       pagenum:1,
       pagesize:5
     },
    //  添加分类的表单数据对象
    addcateForm:{
      cat_name:'',
      // 父级分类id
      cat_pid:0,
      // 分类的等级
      cat_level:0
    },
    // 添加分类表单的验证规则
    addcateRul:{
   cat_name:[
     {required: true, message:'请输入分类名称', trigger: 'blur'}

   ]
    },
     //指定列的内容
     columns:[
       {
          label:'分类名称',
          prop:'cat_name'
       },
       {
         label :'是否有效',
         type:'template',
         template:'isok'
         
       },
       {
         label :'排序',
         type:'template',
         template:'order'
         
       },
       {
         label :'操作',
         type:'template',
         template:'option'
         
       }
     ]
   }
 },
 created(){
   this.getcateList()
 },
 methods:{
   async getcateList(){
   const {data:res}= await this.$http.get('/categories',{params:this.queryinfo})
   if(res.meta.status!==200){
     return this.$message.error('获取商品列表失败')
   }
   this.cateList=res.data.result
   this.total=res.data.total

   console.log(this.cateList);
 },
 //监听pagesize改变
 handleSizeChange(newsize){
    this.queryinfo.pagesize=newsize
    this.getcateList()
 },
 //监听pagenum的改变
 handleCurrentChange(newpagenum){
    this.queryinfo.pagenum=newpagenum
    this.getcateList()
 },
//  添加分类
addcate(){
  this.addcatedialog=true
  this.getparentcatelist()
},
// 获取父级分类数据
  async getparentcatelist(){
  const {data:res}=await this.$http.get('/categories',{params:{
    type:2
  }})
  if(res.meta.status!==200){
    return this.$message.erroe('获取父级列表失败')
  }
  this.parentcatelist=res.data
},
parentcatechange(){
  console.log(this.selectkeys);
  if(this.selectkeys.length>0){
    this.addcateForm.cat_pid=this.selectkeys[this.selectkeys.length-1]
    this.addcateForm.cat_level=this.selectkeys.length
    return
  }else{
    this.addcateForm.cat_pid=0
    this.addcateForm.cat_level=0
  }
},
AddCate(){
  this.$refs.addcateFormRef.validate(async valid=>{
    if(!valid){
      return this.$message.error('预校验失败');
    }
    const {data:res} =await this.$http.post('categories',this.addcateForm)
    if(res.meta.status!==201){
      return this.$message.error('添加分类失败')
    }
    this.getparentcatelist()
  })
 this.addcatedialog=false
 
  
},
addcateclose(){
  this.$refs.addcateFormRef.resetFields()
  this.selectkeys=[]
  this.addcateForm.cat_pid=0
  this.addcateForm.cat_level=0
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
.el-cascader{
  width: 100%;
}
</style>