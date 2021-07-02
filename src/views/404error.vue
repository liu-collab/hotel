<template>
  <div class="error">
    <img src="../assets/img/404.jpg" alt="" @click="goback">
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
      goback() {
        this.$router.replace('/Login')
      }
    },
  }
</script>
<style scoped>
  .error {
    width: 100vw;
    height: 100vh;
  }

  .error img {
    width: 100%;
    height: 100%;
  }
</style>