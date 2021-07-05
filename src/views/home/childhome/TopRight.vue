<template>
  <div class="top-right">
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
      background-color="#8076a3" text-color="#fff" active-text-color="#ffd04b" router>
      <el-menu-item index="/home/homepage">
        <i class="el-icon-s-home"></i>
        Home
      </el-menu-item>
      <el-menu-item index="/home/message">
        <i class="el-icon-s-promotion"></i>
        Email
      </el-menu-item>
      <el-menu-item index="/home/email">
        <i class="el-icon-message-solid"></i>
        Message
      </el-menu-item>
      <el-submenu index="4">
        <template slot="title"><i class="el-icon-user-solid"></i>
          {{admin.name}}</template>
        <el-menu-item index="/home/person">个人中心</el-menu-item>
        <el-menu-item index="/home/modify">修改密码</el-menu-item>
        <el-menu-item @click="exit">退出系统</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
  import { mapMutations, mapState } from 'vuex'

  export default {

    name: '',
    props: {},
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    async created() {
      //记住用户名模块
      let loginId = sessionStorage.getItem('loginId')

      let admin = await this.$get('/Admin/GetOne', { loginId })
      this.setAdmin(admin)
    },
    computed: {
      //获取user下面的admin
      ...mapState('user', ['admin'])
    },
    methods: {
      ...mapMutations('user', ['setAdmin']),
      handleSelect(key, keyPath) {
      },
      exit() {
        localStorage.clear();
        sessionStorage.clear();
        this.$router.replace('/Login')
      }
    },
  }
</script>
<style scoped>
  .right .top-right {
    float: right;
    margin-right: 30px;

  }
</style>