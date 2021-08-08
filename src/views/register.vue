<template>
  <div>
    <div class="login">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        style="width: 395px;"
      >
        <el-form-item label="头像" prop="photo" v-if="isadd">
          <el-upload
            class="avatar-uploader"
            :action="admin_upload_url"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="ruleForm.photo"
              :src="admin_phont_url + ruleForm.photo"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="账号" prop="loginId">
          <el-input v-model="ruleForm.loginId"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="loginPwd">
          <el-input type="password" v-model="ruleForm.loginPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="loginPwd2">
          <el-input type="password" v-model="ruleForm.loginPwd2"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId" v-if="isadd">
          <el-select v-model="ruleForm.roleId" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交注册</el-button
          >
          <el-button type="primary" @click="loginbtn">返回登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <landscape></landscape>
  </div>
</template>
<script>
import landscape from '../components/Landscape'
import { str2md2 } from '../utils/utils'

export default {
  name: '',
  props: {},
  components: {
    landscape,
  },
  data() {
    var checkloginId = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('账号不能为空'))
      } else {
        return callback()
      }
    }
    var checkloginPwd = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'))
      } else {
        return callback()
      }
    }
    var checkloginPwd2 = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'))
      } else if (value !== this.ruleForm.loginPwd) {
        return callback(new Error('两次密码不一致'))
      } else {
        return callback()
      }
    }
    var checkname = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('姓名不能为空'))
      } else {
        return callback()
      }
    }
    var checkphone = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('电话不能为空'))
      } else {
        return callback()
      }
    }
    return {
      //角色id
      roleId: '',
      isadd: false,
      //表单数据
      ruleForm: {
        id: '',
        loginId: '',
        loginPwd: '',
        loginPwd2: '',
        name: '',
        phone: '',
        roleId: '1',
        photo: '',
      },
      rules: {
        //光标离开时调用的方法
        loginId: [{ validator: checkloginId, trigger: 'blur' }],
        loginPwd: [{ validator: checkloginPwd, trigger: 'blur' }],
        loginPwd2: [{ validator: checkloginPwd2, trigger: 'blur' }],
        name: [{ validator: checkname, trigger: 'blur' }],
        phone: [{ validator: checkphone, trigger: 'blur' }],
      },
    }
  },
  created() {},
  methods: {
    loginbtn() {
      this.$router.replace('/Login')
    },
    //重置提交框
    resetForm(formName) {
      //重置表单
      this.$refs[formName].resetFields()
      //清空数据
      this.ruleForm = {
        id: '',
        loginId: '',
        loginPwd: '',
        loginPwd2: '',
        name: '',
        phone: '',
        roleId: '',
        photo: '',
      }
    },

    //提交修改名称
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //对密码进行加密
          this.ruleForm.loginPwd = str2md2(this.ruleForm.loginPwd)
          this.ruleForm.loginPwd2 = str2md2(this.ruleForm.loginPwd2)
          let { success, message } = await this.$post(
            '/Admin/Add',
            this.ruleForm
          )

          if (success) {
            //成功通知消息
            this.$msg_s('注册成功')
            //跳转登录页面
            this.$router.replace('/login')
          } else {
            this.$msg_w(message)
          }
          //清空提交框
          this.resetForm('ruleForm')
        } else {
          this.$msg_e('添加错误')
          return false
        }
      })
    },
  },
}
</script>
<style scoped>
@import '../assets/css/style.css';

.login {
  position: absolute;
  width: 350px;

  top: 50%;
  left: 50%;
  padding: 40px 40px 70px 10px;

  transform: translate(-60%, -50%);
  z-index: 99999;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.avatar-uploader :hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
