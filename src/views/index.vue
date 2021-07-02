<template>
  <div>

  </div>
</template>
<script>
  export default {
    name: '',
    props: {},
    data() {
      return {
      };
    },
    methods: {

    },
    async created() {

      //获取本地存储的登录信息
      const loginId = localStorage.getItem('loginId')
      const loginPwd = localStorage.getItem('loginPwd')
      //判断登录信息是否为空
      if (!loginId || !loginPwd) {
        //为空跳转到登录页面
        this.$router.push('/Login')
      } else {
        //获取id和密码
        //对象进行解构
        let { success, token } = await this.$get("Admin/Login", {
          loginId,
          loginPwd,
        });
        //判断是否登录成功
        if (success) {
          // 保存token
          sessionStorage.setItem("token", token);
          // 将token信息放到请求头中
          this.$setToken();
          this.$router.push("/home");
        } else {
          this.$router.push("/Login");
        }
      }
    }
  }
</script>
<style scoped>

</style>