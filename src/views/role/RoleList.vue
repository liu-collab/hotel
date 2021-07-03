<template>
  <div>
    <!-- 添加 -->
    <div class="add">
      <el-button type="primary" @click="btnclick">添加角色</el-button>
    </div>
    <!-- 表格 -->
    <el-table size="mini" :data="tableData" style="width: 99%">
      <el-table-column prop="roleId" label="ID" width="180">
      </el-table-column>
      <el-table-column prop="roleName" label="姓名" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleEdit(scope.row.roleId)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete( scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 抽屉 -->
    <el-drawer :title="title" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item :label="label" prop="roleName">
          <el-input v-model="ruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex'
  export default {
    name: '',
    props: {},
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入名称'));
        } else {
          callback();
        }
      };
      return {
        //表格数据
        tableData: [],
        drawer: false,
        direction: 'rtl',
        title: '添加角色',
        label: "角色名称",
        isadd: true,
        ruleForm: {
          roleName: "",
        },
        rules: {
          //光标离开时调用的方法
          roleName: [{ validator: validatePass, trigger: 'blur' }],
        }
      };
    },
    created() {
      //获取表格数据
      this.getdata()
    },
    methods: {
      ...mapMutations('user', ['setAdmin']),
      //获取表格数据方法
      async getdata() {
        const res = await this.$get('/Role/List')
        this.tableData = res
      },
      //添加方法
      btnclick() {
        this.drawer = true
        this.title = "添加角色"
        this.label = "角色名称"
        this.isadd = true
      },
      //编辑方法
      async handleEdit(roleId) {
        //获取数据
        const res = await this.$get('/Role/GetOne', { roleId })
        this.isadd = false
        this.ruleForm = res
        //打开抽屉
        this.drawer = true
        //
        this.title = "修改角色"
        this.label = "修改的名称"
      },
      //删除
      async handleDelete(roleId) {
        //等待确认框弹出执行下一步
        await this.$c_f('确认删除吗？')
        //等待执行完成 获取数据后进行下一步
        let { success, message } = await this.$post('Role/Delete', { roleId })
        if (success) {
          this.$msg_s(message)
          //刷新表格数据
          this.getdata()
        } else {
          this.$msg_e(message)
        }
      },
      //重置提交框
      resetForm(formName) {
        //重置表单
        this.$refs[formName].resetFields();
        //清空数据
        this.ruleForm = {
          roleName: "",
          roleId: ""
        }
      },
      //关闭抽屉的方法
      handleClose(done) {
        // await this.$c_f('确认关闭吗？')
        //关闭抽屉
        done()
        //清空提交框
        this.resetForm('ruleForm')
      },
      //提交修改名称
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            //弹出框切换添加或者修改
            if (this.isadd) {
              let { success, message } = await this.$post("/Role/Add", this.ruleForm)
              if (success) {
                //成功通知消息
                this.$msg_s(message)
              } else {
                this.$msg_w(message)
              }
            } else {
              //修改角色的方法
              let { success, message } = await this.$post("/Role/Update", this.ruleForm)
              if (success) {

                //成功通知消息
                this.$msg_s(message)
                //判断修改的是不是自己
                if (sessionStorage.getItem('loginId') === this.ruleForm.loginId) {
                  const admin = await this.$get('Admin/GetOne', { loginId: this.ruleForm.loginId })
                  this.setAdmin(admin)

                }
                // //刷新表格数据
                // this.getdata()
                // //清空提交框
                // this.resetForm("ruleForm")
              } else {
                this.$msg_w(message)
              }
            }
            //刷新表格数据
            this.getdata()
            //清空提交框
            this.resetForm("ruleForm")
          } else {
            this.$msg_e('添加错误')
            return false
          }
        });
      },
    },
  }
</script>
<style scoped>
  .add {
    margin: 20px;
  }
</style>