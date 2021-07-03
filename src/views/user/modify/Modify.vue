<template>
  <div class="modify">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="旧密码" prop="oldLoginPwd">
        <el-input type="password" v-model="ruleForm.oldLoginPwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newLoginPwd">
        <el-input type="password" v-model="ruleForm.newLoginPwd"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="newLoginPwd2">
        <el-input type="password" v-model="ruleForm.newLoginPwd2"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { str2md2 } from '../../../utils/utils'
  export default {
    name: '',
    props: {},
    data() {
      var ckeckoldpwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('旧密码不能为空'));
        } else {
          callback();
        }
      };
      var ckecknewpwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('新密码不能为空'));
        } else {
          callback();
        }
      };
      var ckecknewpwd2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('确认新密码不能为空'));
        } else if (value !== this.ruleForm.newLoginPwd2) {
          callback(new Error('两次密码不一致'));
        }
        else {
          callback();
        }
      };
      return {
        ruleForm: {

          oldLoginPwd: '',
          newLoginPwd: '',
          newLoginPwd2: '',
          id: this.$store.state.user.admin.id,
        },
        rules: {
          //光标离开时调用的方法
          oldLoginPwd: [
            { validator: ckeckoldpwd, trigger: 'blur' }
          ],
          newLoginPwd: [
            { validator: ckecknewpwd, trigger: 'blur' }
          ],
          newLoginPwd2: [
            { validator: ckecknewpwd2, trigger: 'blur' }
          ],
        }
      };
    },
    computed: {
      //获取user下面的admin
      ...mapState('user', ['admin'])
    },
    methods: {
      //修改
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            //对密码进行加密
            this.ruleForm.oldLoginPwd = str2md2(this.ruleForm.oldLoginPwd);
            this.ruleForm.newLoginPwd = str2md2(this.ruleForm.newLoginPwd);
            this.ruleForm.newLoginPwd2 = str2md2(this.ruleForm.newLoginPwd2);
            const { success, message } = await this.$post('/Admin/ResetPwd', this.ruleForm)
            if (success) {
              this.$msg_s(message)
              //清空表单
              this.resetForm('ruleForm')
            } else {
              this.$msg_e(message)
              this.resetForm('ruleForm')
            }

          } else {
            this.$msg_e(res.message)

            return false
          }
        });
      },
      //重置方法
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }
  }
</script>
<style scoped>
  .modify {
    position: absolute;
    width: 35%;
    top: 50%;
    left: 50%;
    padding: 40px 40px 40px 10px;
    border: 1px solid #eee;
    transform: translate(-50%, -50%);
  }
</style>