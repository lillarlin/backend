<template>
  <div>
  <el-card>
     <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
  </div>
</template>

<script>
import * as  echarts from 'echarts'
export default {
 name:'repots',
 data(){
   return {

   }
 },
 created(){

 },
async  mounted(){
   //初始化echarts实例
   var myChart = echarts.init(document.getElementById('main'));
   // 指定图表的配置项和数据
      const {data:res}=await this.$http.get('reports/type/1') 
      if(res.meta.status!==200){
        return this.$message.error('获取数据失败')
      }

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(res.data);
 }
 
 

       
}
</script>

<style>

</style>
