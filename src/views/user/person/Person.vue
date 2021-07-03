<template>
  <div class="user">
    <div class="title">头像</div>
    <div class="desc">
      <el-image style="width: 200px; height: 200px" :src="admin_phont_url+admin.photo" fit="cover"></el-image>
    </div>
    <div class="title">账号</div>
    <div class="desc">{{admin.loginId}}</div>
    <div class="title">姓名</div>
    <div class="desc">{{admin.name}}</div>
    <div class="title">电话</div>
    <div class="desc">{{admin.phone}}</div>
    <div class="title">角色</div>
    <!-- 子组件会先于父组件渲染出来,下面在父组件调用也在本组件调用,即调用了两次,父组件调用时为
      空,浏览器会报错,所以在下面进行一个判断
    -->
    <div class="desc">{{admin.role?admin.role.roleName:''}}</div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  //获取图片上传地址
  import { admin_phont_url } from '../../../configs'
  export default {
    name: '',
    props: {},
    data() {
      return {
        //头像路径
        admin_phont_url,
      };
    },
    computed: {
      //获取user下面的admin
      ...mapState('user', ['admin'])
    },
    methods: {
    },

  }
</script>
<style scoped>
  .user {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .title {
    font-weight: bold;

    padding: 10px 0;
  }

  .desc {
    border-bottom: 1px solid #eee;
    padding: 5px 0;
  }
</style>