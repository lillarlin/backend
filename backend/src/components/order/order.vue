<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
  <el-breadcrumb-item :to="{path:'/homemain'}">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
      <el-table
    :data="orderlist"
    border
    style="width: 100%">
    <el-table-column type="index"></el-table-column>
     <el-table-column label="订单编号" prop="order_number"></el-table-column>
     <el-table-column label="订单价格" prop="order_price"></el-table-column>
     <el-table-column label="是否付款" prop="pay_status">
      <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.pay_status==1">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
      </template>
     </el-table-column>
     <el-table-column label="是否发货" prop="is_send"></el-table-column>
     <el-table-column label="下单时间" prop="create_time">
       <template slot-scope="scope">
        {{scope.row.create_time | dateFormat}}
       </template>
     </el-table-column>
     <el-table-column label="操作">
       <template >
         <el-button type="primary">地址</el-button>
         <el-button type="success">物流</el-button>
       </template>
     </el-table-column>
  </el-table>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="orderlist.pagenum"
      :page-sizes="[1, 3, 7, 10]"
      :page-size="orderlist.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
  </div>
</template>

<script>
export default {
name:'order',
data(){
  return {
    orderlist:[],
    total:0,
    queryinfo:{
      query:'',
      pagenum:1,
      pagesize:10
    }
  }
},
created(){
  this.getorderlist()
},
methods:{
 async getorderlist(){
 const {data:res} =await this.$http.get('orders',{params:this.queryinfo})
 if(res.meta.status!==200){
   return this.$message.error('获取订单数据失败')
 }
 console.log(res);
 this.orderlist=res.data.goods
 this.total=res.data.total
  },
  handleSizeChange(newsize){
       this.orderlist.pagesize=newsize
  },
  handleCurrentChange(newnum){
  this.orderlist.pagenum=newnum
  }
}
}
</script>

<style>
.el-table{
  margin: 15px 0;
}
.breadcrumb{
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
}
</style>