<template>
  <div class="login">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="用户名" prop="loginId">
        <el-input type="string" v-model="ruleForm.loginId"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="loginPwd">
        <el-input type="password" v-model="ruleForm.loginPwd"></el-input>
      </el-form-item>
      <el-form-item label="" prop="checkme">
        <el-checkbox v-model="ruleForm.checkme">记住我</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { str2md2 } from '../utils/utils'
  export default {
    name: '',
    props: {},
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          loginId: '',
          loginPwd: '',
          checkme: false
        },
        rules: {
          //光标离开时调用的方法
          loginId: [
            { validator: validatePass, trigger: 'blur' }
          ],
          loginPwd: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      };
    },

    methods: {

      //登录
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            //对密码进行加密
            this.ruleForm.loginPwd = str2md2(this.ruleForm.loginPwd);
            this.login() //调用登录方法
          } else {
            this.$msg_e(res.message)
            this.$router.push('/Login')
            return false
          }
        });
      },
      //重置账号和密码
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //登录方法
      async login() {
        let res = await this.$get('/Admin/Login', {
          loginId: this.ruleForm.loginId,
          loginPwd: this.ruleForm.loginPwd
        })
        if (res.success) {
          this.$msg_s(res.message)
          //保存登录信息
          sessionStorage.setItem("loginId", this.ruleForm.loginId)

          //用sessionStorag.setItem来保存令牌
          sessionStorage.setItem('token', res.token)
          // 将token信息放到请求头中
          this.$setToken();
          //登录成功跳转主页
          this.$router.push('/home')
          //getItem获取token
          // const token = sessionStorage.getItem('token')
          //发送请求时在headers添加token
          // this.$get('/admin/', { token: token })
          //是否需要记住我
          if (this.ruleForm.checkme) {
            //用locaStorage来永久保存登录信息
            localStorage.setItem('loginId', this.ruleForm.loginId)
            localStorage.setItem('loginPwd', this.ruleForm.loginPwd)
            localStorage.setItem('checkme', this.ruleForm.checkme)
          } else {
            //清除的登录相关信息
            localStorage.clear()
            // localStorage.removeItem('loginId')
            // localStorage.removeItem('loginPwd')
            // localStorage.removeItem('checkme')
            //sessionStorage.removeItem('token')
          }
        } else {

          this.$msg_w(res.message)
          this.$router.push('/Login')
        }
      },
      //检查是否需要自动登录
      checkmeAuto() {
        this.ruleForm = {
          //获取本地存储的登录信息
          loginId: localStorage.getItem('loginId'),
          loginPwd: localStorage.getItem('loginPwd'),
          //需要将字符串转为布尔类型
          checkme: Boolean(localStorage.getItem('checkme')),
        }
        //判断登录信息是否正确,正确调用登录方法
        if (this.ruleForm.loginPwd) {
          this.login()
        }
      }
    },
    mounted() {
      //调用是否需要自动登录
      this.checkmeAuto()
    }
  }
</script>
<style scoped>
  .login {
    position: absolute;
    width: 350px;
    height: 200px;
    top: 50%;
    left: 50%;
    padding: 40px 40px 70px 10px;
    border: 1px solid #eee;
    transform: translate(-60%, -50%);
  }
</style>