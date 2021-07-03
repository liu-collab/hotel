<template>
  <div>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      background-color="#8076a3" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse" router>
      <div class="tltle">
        <span>酒店管理系统</span>
      </div>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span>账号管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/home/admin">账号管理</el-menu-item>
          <el-menu-item index="/home/rolelist">角色管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span>客房管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/home/roomtype">类型管理</el-menu-item>
          <el-menu-item index="/home/room">客房管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span>客户管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1">客户管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="4-1">权限管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: '',
    props: {
    },
    data() {
      return {
        isCollapse: false
      }
    },
    methods: {
      handleOpen(key, keyPath) {

      },
      handleClose(key, keyPath) {

      },
      receive() {
        //接收相应事件，并且回调相应函数
        this.$bus.$on('btn', () => { this.isCollapse = !this.isCollapse })

      }
    },
    mounted() {
      //调用函数
      this.receive()
    }
  }
</script>
<style scoped>
  .tltle {
    padding: 15px;
    height: 30px;
    border-bottom: 1px solid #eee;
    text-align: center;
    line-height: 30px;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100%;
  }
</style>