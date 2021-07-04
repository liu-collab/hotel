<template>
  <div>
    <el-pagination background layout="prev, pager, next" @current-change="change" class="page" :total="count">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    name: '',
    props: {},
    data() {
      return {
        //总数量
        count: 1,
        //页码
        pageIndex: 1,
      };
    },
    methods: {
      //分页功能
      change(pageIndex) {
        this.pageIndex = pageIndex
        this.getdata()
      },
    },
  }
</script>
<style scoped>
  .page {
    display: flex;
    align-content: center;
    justify-content: center;
  }
</style>