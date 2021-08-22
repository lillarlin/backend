<template>
  <div class="rights">
    <!-- 面包屑导航区域 -->
   <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
  <el-breadcrumb-item :to="{path:'/homemain'}">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
     <el-table :data="rightList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
         <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="权限路径" prop="path"></el-table-column>
           <el-table-column label="权限等级" prop="level">
             <template slot-scope="scope">
               <el-tag v-if="scope.row.level=='0'">等级一</el-tag>
               <el-tag type="success" v-else-if="scope.row.level=='1'">等级二</el-tag>
               <el-tag type="info" v-else>等级三</el-tag>
             </template>
           </el-table-column>
     </el-table>
  </el-card>
  </div>
</template>

<script>
export default {
  name:'right',
  data(){
    return {
      rightList:[]
    }
  },
  created(){
    this.getRightList()
  },
  methods:{
   async getRightList(){
      const {data:res} =   await this.$http.get('rights/list')
        if(res.meta.status!==200){
          return this.$message.console.error('获取权限列表失败');
        }
        this.rightList=res.data
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
</style>