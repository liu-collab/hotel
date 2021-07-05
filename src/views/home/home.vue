<template>
  <div class="contentier  ">
    <div class="left">
      <LeftHome></LeftHome>
    </div>
    <div class="right">
      <div class="top">
        <div class="top-left">
          <i :class="isactive?'el-icon-s-unfold':'el-icon-s-fold'" @click="leftbtn"></i>
        </div>
        <TopRight></TopRight>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import LeftHome from './childhome/LeftHome'
  import TopRight from './childhome/TopRight'
  export default {
    name: '',
    props: {},
    components: {
      LeftHome,
      TopRight
    },
    data() {
      return {
        isactive: false
      };
    },
    methods: {
      leftbtn() {
        //利用事件总线发射btn事件
        this.$bus.$emit('btn');
        this.isactive = !this.isactive
      }
    }
  }
</script>
<style scoped>
  * {
    border: 0;
    padding: 0;
  }

  .contentier {
    display: flex;
    width: 100vw;
    height: 100vh;

  }

  .left {
    float: left;
    height: 100%;
    background-color: #8076a3;
  }

  .right {
    flex: 1;
    background-color: #fff;
  }

  .right .top {
    width: 100%;
    height: 60px;
    background-color: #8076a3;


  }

  .right .top-left {
    float: left;
  }

  .top-left {
    width: 50px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-size: 30px;
    background-color: #8076a3;
  }
</style>