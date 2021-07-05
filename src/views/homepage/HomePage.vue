<template>
  <div>
    <div id="main"></div>
  </div>
</template>
<script>
  import * as echarts from 'echarts';
  export default {
    name: '',
    props: {},
    data() {
      return {
        myChart: null,
        data: [],
      };
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData() {
        let res = await this.$get('/RoomType/TotalTypePrice')
        this.data = res
        console.log(res)

        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(document.getElementById('main'));
        // 绘制图表
        this.myChart.setOption({
          title: {
            text: '酒店销售房间类型统计额'
          },
          tooltip: {},
          xAxis: {
            data: this.data.map((r) => r.roomtypeName)
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: this.data.map((r) => r.totalMoney)
          }]
        });
      }

    },
  }
</script>
<style scoped>
  #main {
    width: 600px;
    height: 600px;
  }
</style>