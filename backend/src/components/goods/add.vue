<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
  <el-breadcrumb-item :to="{path:'/homemain'}">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加用户</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
   <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon :closable="false">
  </el-alert>

  <el-steps :space="200" :active="activeindex-0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>

<el-form :model="addForm" :rules="addFormRul" ref="addFormRef" label-width="100px" label-position="top">
 <el-tabs :tab-position="'left'" v-model="activeindex" :before-leave="beforetableave" @tab-click="tabclick">
    <el-tab-pane label="基本信息" name="0">
       <el-form-item label="商品名称" prop="goods_name">
         <el-input v-model="addForm.goods_name"></el-input>
       </el-form-item>
       <el-form-item label="商品价格" prop="goods_price" type="number">
         <el-input v-model="addForm.goods_price"></el-input>
       </el-form-item>
       <el-form-item label="商品重量" prop="goods_weight">
         <el-input v-model="addForm.goods_weight"></el-input>
       </el-form-item>
       <el-form-item label="商品数量" prop="goods_number">
         <el-input v-model="addForm.goods_number"></el-input>
       
       </el-form-item>
       <el-form-item label=“商品分类 prop="goods_cat">
         <el-cascader
           v-model="addForm.goods_cat"
           :options="catelist"
          expandTrigger= 'hover'
          :props="cateprops"
            @change="handleChange"></el-cascader>
               <!-- v-model为选中的商品的id，而且会保存在一个数组中 -->
       </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
      <el-form-item v-for="item in manytabledata" :key="item.attr_id" :label="item.attr_name">
        <el-checkbox-group v-model="item.attr_vals">
    <el-checkbox :label="item1" v-for="(item1 ,index) in item.attr_vals" :key="index" border ></el-checkbox>
    
  </el-checkbox-group>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">
      <el-form-item v-for="item in onlytabledata" :key="item.attr_id" :label="item.attr_name">
        <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
      <el-upload
            class="upload-demo"
            action="http://timemeetyou.com:8889/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :headers="headerobj"
            :on-success="loadimg"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          
        </el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
      <quill-editor v-model="addForm.goods_introduce"></quill-editor>
      <el-button type="primary" @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
 </el-form>
</el-card>
<el-dialog
  title="图片预览"
  :visible.sync="imgVisible"
  width="50%"
  >
  <img :src="perviewpath" alt="">
  
</el-dialog>
  </div>
</template>

<script>
import  _ from "lodash";
export default {
 name:'add',
 data(){
   return{
     activeindex:'0',
     addForm:{
       goods_name:'',
       goods_price:0,
       goods_weight:0,
       goods_number:0,
       goods_cat:[],
       pics:[],
       goods_introduce:'',
       attrs:[]
     },
     addFormRul:{
       goods_name:[
         {required: true, message:'请输入商品名称', trigger: 'blur'}
       ],
       goods_price:[
         {required: true, message:'请输入商品价格', trigger: 'blur'}
       ],
       goods_weight:[
         {required: true, message:'请输入商品重量', trigger: 'blur'}
       ],
       goods_number:[
         {required: true, message:'请输入商品数量', trigger: 'blur'}
       ],
        goods_cat:[
         {required: true, message:'请输入商品分类', trigger: 'blur'}
       ],
     },
     catelist:[],
     cateprops:{
       label:'cat_name',
       value:'cat_id',
       children:'children'
     },
     manytabledata:[],
      onlytabledata:[],
      perviewpath:'',
      imgVisible:false,
      // 给上传图片数据请求添加请求头
      headerobj:{
        Authorization:window.sessionStorage.getItem('token')
      }
   }
 },
 created(){
   this.getcatelist()
 },
 methods:{
  async getcatelist(){
 const {data:res}=await this.$http.get('categories')
 if(res.meta.status!==200){
   return this.$message.error('获取商品分类列表失败')
 }
 this.catelist=res.data
 console.log(this.catelist);
   },
   handleChange(){
     if(this.addForm.goods_cat.length!==3){
       this.addForm.goods_cat=[]
     }
   },
   //阻止标签页的切换
   beforetableave(activeName,oldActiveName){
     if(oldActiveName==='0'&& this.addForm.goods_cat.length!==3){
       this.$message.error('请选择商品分类')
       return false
     }
   },
  async tabclick(){
     if(this.activeindex==='1'){
       const {data:res}=await this.$http.get(`categories/${this.cateid}/attributes`,{params:{sel:'many'}})
       if(res.meta.status!==200){
         return this.$message.error('获取动态参数失败')
       }
       
    res.data.forEach(item=>{
    item.attr_vals= item.attr_vals.length===0?[]:item.attr_vals.split(' ')
    })
    this.manytabledata=res.data
    console.log(this.manytabledata);
     }
     else if(this.activeindex==='2'){
        const {data:res}=await this.$http.get(`categories/${this.cateid}/attributes`,{params:{sel:'only'}})
       if(res.meta.status!==200){
         return this.$message.error('获取静态参数失败')
       }
       
    this.onlytabledata=res.data
    console.log(this.onlytabledata);
     }
   },
  //  图片预览效果
   handlePreview(file){
   this.perviewpath=file.response.data.url
   this.imgVisible=true
   },
   //图片移除操作
   handleRemove(file){
      //1获取将要移除的图片的临时路劲
      const filepath=file.response.data.tem_path
      //2从pics数组中，找到这个图片的索引值
      const i=this.addForm.pics.findIndex(x=>x.pic===filepath)
      //3调用splice方法。从数组中删除该元素
      this.addForm.pics.splice(i,1)
   },
   //图片上传成功
   loadimg(response){
      const queryinfo={pic:response.data.tem_path}
      this.addForm.pics.push(queryinfo)
      console.log(this.addForm);
   },
   add(){
    //表单预验证
    this.$refs.addFormRef.validate(async  valid=>{
      if(!valid){
      return  this.$message.error('请填写必要的表单项')
      }
      //安装lodash包，使用clonedeep深拷贝一个addForm
      const form=_.cloneDeep(this.addForm)
      //用join把goods_cat数组转换为字符串
      form.goods_cat=form.goods_cat.join(',')
      // 处理动态参数
      this.manytabledata.forEach(item=>{
            const newinfo={
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newinfo)
      })
      //处理静态属性
       this.onlytabledata.forEach(item=>{
            const newinfo={
              attr_id:item.attr_id,
              attr_value:item.attr_vals
            }
            this.addForm.attrs.push(newinfo)
      })
      form.attrs=this.addForm.attrs
      console.log(form);
      //发起添加商品请求
  const {data:res}=await this.$http.post('goods',form)
      if(res.meta.status!==201){
        return this.$message.error('添加商品失败')
      }
      this.$message.success('添加商品成功')
      this.$router.push('/goods')
    })
   }
 },
 computed:{
   cateid(){
     if(this.addForm.goods_cat.length===3){
       return this.addForm.goods_cat[2]
     }
     return null
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
.el-steps{
  margin: 20px 0;
}
.ql-editor{
  height: 300px;
}
.el-button{
margin-top: 15px;
}
</style>