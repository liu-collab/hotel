import { get, post, setToken } from "../utils/request";

//定义一个插件
export default {
  install: function (Vue) {
    //给Vue混入set和get方法
    Vue.mixin({
      methods: {
        //混入get方法
        $get(url, params) {
          return get(url, params)
        },
        //混入post方法
        $post(url, params) {
          return post(url, params)
        },
        $setToken() {
          // 执行该方法，就会将浏览器缓存里面的token信息保存到ajax的请求头中
          setToken();
        },
        //混入成功消息提示
        $msg_s(message = "操作成功", duration = 3000) {
          return this.$message({
            message,
            type: 'success',
            duration
          });
        },
        //混入警告消息提示
        $msg_w(message = "操作异常", duration = 3000) {
          return this.$message({
            message,
            type: 'warning',
            duration
          });
        },
        //混入错误消息提示
        $msg_e(message = "操作失败", duration = 3000) {
          return this.$message({
            message,
            type: 'error',
            duration
          });
        },
        //确认关闭框
        //确认框
        $c_f(message) {
          return new Promise((resolve, reject) => {
            this.$confirm(message)
              .then(res => {
                resolve()
              })
              .catch((_) => { });
          })
        }
      },
    });
  }
}