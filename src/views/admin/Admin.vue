<template>
  <div>
    <!-- 添加 -->
    <div class="searcher">

      <el-select v-model="roleId" placeholder="请选择角色">
        <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
        </el-option>
      </el-select>

      <div class="add">
        <el-button type="primary" size="mini" @click="btnsearch">搜索</el-button>
        <el-button type="primary" size="mini" @click="btnclick">添加</el-button>
        <el-button type="primary" size="mini" @click="exportExcel">导出Excel</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table size="small" :data="tableData" style="width: 99%" height="520">
      <el-table-column prop="id" label="编号" width="180">
      </el-table-column>
      <el-table-column prop="loginId" label="帐号" width="180">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="180">
      </el-table-column>
      <el-table-column prop="photo" label="头像" width="180">
        <template slot-scope="scope">
          <el-image style="width: 60px; height: 60px"
            :src="scope.row.photo?admin_phont_url+scope.row.photo:admin_phont_url+'admin_default.jpg'" fit="cover">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="role.roleName" label="角色" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="handleEdit(scope.row.loginId)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete( scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 抽屉 -->
    <el-drawer :title="title" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" style="width: 395px;">
        <el-form-item label="头像" prop="photo">
          <el-upload class="avatar-uploader" :action="admin_upload_url" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="ruleForm.photo" :src="admin_phont_url+ruleForm.photo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label="label" prop="loginId" v-if="isadd">
          <el-input v-model="ruleForm.loginId"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="loginPwd" v-if="isadd">
          <el-input type="password" v-model="ruleForm.loginPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="loginPwd2" v-if="isadd">
          <el-input type="password" v-model="ruleForm.loginPwd2"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="roleId">
          <el-select v-model="ruleForm.roleId" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!-- 分页 -->
    <el-pagination background layout="prev, pager, next" @current-change="change" class="page" :total="count">
    </el-pagination>
  </div>
</template>
<script>
  import { str2md2 } from '../../utils/utils'
  //获取图片上传地址
  import { admin_upload_url, admin_phont_url } from "../../configs/index"
  export default {
    name: '',
    props: {},
    data() {
      var checkloginId = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('账号不能为空'));
        } else {
          return callback();
        }
      };
      var checkloginPwd = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('密码不能为空'));
        } else {
          return callback();
        }
      };
      var checkloginPwd2 = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('密码不能为空'));
        } else if (value !== this.ruleForm.loginPwd) {
          return callback(new Error('两次密码不一致'));
        } else {
          return callback();
        }
      };
      var checkname = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('姓名不能为空'));
        } else {
          return callback();
        }
      };
      var checkphone = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('电话不能为空'));
        } else {
          return callback();
        }
      };
      var checkroleId = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('角色不能为空'));
        } else {
          return callback();
        }
      };

      return {
        //总数量
        count: 1,
        //页码
        pageIndex: 1,
        //角色id
        roleId: "",
        //表格数据
        tableData: [],
        //角色名
        roleList: [],
        value: "",
        drawer: false,
        direction: 'rtl',
        title: '添加账户',
        label: "添加账号",
        isadd: true,
        //图片上传地址
        admin_upload_url,
        //图片访问地址
        admin_phont_url,
        //表单数据
        ruleForm: {
          id: "",
          loginId: "",
          loginPwd: "",
          loginPwd2: "",
          name: "",
          phone: "",
          roleId: "",
          photo: "",
        },
        rules: {
          //光标离开时调用的方法
          loginId: [{ validator: checkloginId, trigger: 'blur' }],
          loginPwd: [{ validator: checkloginPwd, trigger: 'blur' }],
          loginPwd2: [{ validator: checkloginPwd2, trigger: 'blur' }],
          name: [{ validator: checkname, trigger: 'blur' }],
          phone: [{ validator: checkphone, trigger: 'blur' }],
          roleId: [{ validator: checkroleId, trigger: 'change' }],

        }
      };
    },
    created() {
      //获取表格数据
      this.getdata()
      //获取角色列表
      this.getroleList()
    },
    methods: {
      //分页功能
      change(pageIndex) {
        this.pageIndex = pageIndex
        this.getdata()
      },
      //搜索按钮
      btnsearch() {
        this.getdata()
      },
      //添加方法
      btnclick() {
        this.drawer = true
        this.title = "添加客户"
        this.label = "添加账号",
          this.isadd = true
      },
      //导出Excel表格
      exportExcel() {
        //遍历表数据
        let json = this.tableData.map(r => {
          return {
            // roomId: r.roomId,
            // roomTypeName: r.roomType.roomTypeName,
            // bedNum: r.roomType.bedNum,
            // roomTypePrice: r.roomType.roomTypePrice,
            // roomState: r.roomType.roomState
          }
        })
        //生成表头
        let fields = {
          // roomId: "房间编号",
          // roomTypeName: "房间类型",
          // bedNum: "床位数",
          // roomTypePrice: "价格",
          // roomState: "状态"
        }
        xlsx(json, fields, "房间信息表")
      },
      //图片上传成功
      handleAvatarSuccess(res, file) {
        console.log(res)
        this.ruleForm.photo = res.filename;
      },
      //获取表格数据方法
      async getroleList() {
        const res = await this.$get('/Role/List')

        this.roleList = res
      },
      //图片上传成功之前
      beforeAvatarUpload(file) {
        const cKlist = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        // const isJPG = file.type === 'image/jpeg';
        //检查图片格式
        const isJPG = cKlist.includes(file.type)
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$msg_e('上传头像图片格式错误!');
        }
        if (!isLt2M) {
          this.$msg_e('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      //获取表格数据方法
      async getdata() {
        //mock时用
        // const res = await this.$get('/Admin/List')
        // console.log(res)
        // this.tableData = res
        const { data, count } = await this.$get('/Admin/List', {
          roleId: this.roleId === "" ? 0 : this.roleId,
          //页码
          pageIndex: this.pageIndex,
        })
        //获取页码
        this.count = count
        this.tableData = data
      },

      //编辑方法
      async handleEdit(loginId) {
        //获取数据
        const res = await this.$get('/Admin/GetOne', { loginId })
        this.isadd = false
        this.ruleForm = res
        //打开抽屉
        this.drawer = true
        //
        this.title = "修改账户"
        this.label = "修改的账号"
      },
      //删除
      async handleDelete(row) {

        //等待确认框弹出执行下一步
        await this.$c_f('确认删除吗？')
        let id = row.id
        let photo = row.photo
        //等待执行完成 获取数据后进行下一步
        let { success, message } = await this.$post('Admin/Delete', { id, photo })
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
          id: "",
          loginId: "",
          loginPwd: "",
          loginPwd2: "",
          name: "",
          phone: "",
          roleId: "",
          photo: "",
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
              //对密码进行加密
              this.ruleForm.loginPwd = str2md2(this.ruleForm.loginPwd);
              let { success, message } = await this.$post("/Admin/Add", this.ruleForm)

              if (success) {
                //成功通知消息
                this.$msg_s(message)
              } else {
                this.$msg_w(message)
              }
            } else {
              //修改角色的方法
              let { success, message } = await this.$post("/Admin/Update", this.ruleForm)
              if (success) {
                //成功通知消息
                this.$msg_s(message)
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
  .searcher {
    width: 100%;
    padding: 20px;
    display: flex;
    align-content: center;

  }

  .add {

    margin-left: 10px;
    display: flex;
    align-content: center;
    justify-content: center;
  }

  .page {
    display: flex;
    align-content: center;
    justify-content: center;
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
    border-color: #409EFF;
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