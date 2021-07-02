<template>
  <div>
    <!-- 添加 -->
    <div class="add">
      <el-button type="primary" @click="btnclick">添加类型</el-button>
    </div>
    <!-- 表格 -->
    <el-table size="mini" :data="tableData" style="width: 99%">
      <el-table-column prop="roomTypeId" label="类型编号" width="180">
      </el-table-column>
      <el-table-column prop="roomTypeName" label="类型名称" width="180">
      </el-table-column>
      <el-table-column prop="bedNum" label="床位数" width="180">
      </el-table-column>
      <el-table-column prop="roomTypePrice" label="价格" width="180">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click=" handleShow(scope.$index, scope.row)">详情</el-button>
          <el-button size="mini" type="warning" @click="handleEdit(scope.$index ,scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 抽屉 -->
    <el-drawer :title="title" :visible.sync="drawer" :direction="direction" size="60%" :before-close="handleClose">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">

        <el-form-item label="类型名称" prop="roomTypeName">
          <el-input v-model="ruleForm.roomTypeName"></el-input>
        </el-form-item>
        <el-form-item label="床位数" prop="bedNum">
          <el-input v-model.number="ruleForm.bedNum"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="roomTypePrice">
          <el-input v-model.number="ruleForm.roomTypePrice"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="typeDescription" style="height: 420px;">
          <quill-editor v-model="ruleForm.typeDescription" :options="editorOption" style="height: 300px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!-- 详情页 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="dialogClose">
      <div>
        <div class="title">类型名称</div>
        <div class="desc">{{ruleForm.roomTypeId}}</div>
        <div class="title">床位数</div>
        <div class="desc">{{ruleForm.bedNum}}</div>
        <div class="title">价格</div>
        <div class="desc" style="color: red;">￥<span>{{ruleForm.roomTypePrice}}</span>元</div>
        <div class="title">描述</div>
        <div class="desc" v-html="ruleForm.typeDescription"></div>

      </div>

    </el-dialog>
  </div>
</template>
<script>


  export default {
    name: '',
    props: {},
    data() {

      var checkroomTypeName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('类型不能为空'));
        } else {
          callback();
        }
      };
      var checkroomTypePrice = (rule, value, callback) => {
        if (value === '') {
          //验证数据必须为数字型，在绑定的数据加v-model.number转为整型
          callback(new Error('价格不能为空'));
        } else if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        }
        else {
          callback();
        }
      };
      var checkbedNum = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('床位数不能为空'));
        } else if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else if (value > 10) {
          callback(new Error('床位数不能大于10'))

        }
        else {
          callback();
        }
      };

      return {
        //表格数据
        tableData: [],
        //角色名
        roleList: [],
        value: "",
        drawer: false,
        direction: 'rtl',
        title: '添加类型',
        label: "添加类型",
        isadd: true,
        //详情
        dialogVisible: false,
        editorOption: {
          placeholder: '请输入内容'
        },
        //表单数据
        ruleForm: {
          roomTypeId: "",
          roomTypeName: "",
          bedNum: "",
          roomTypePrice: "",
          typeDescription: "",
        },
        rules: {
          //光标离开时调用的方法
          roomTypeName: [{ validator: checkroomTypeName, trigger: 'blur' }],
          bedNum: [{ validator: checkbedNum, trigger: 'blur' }],
          roomTypePrice: [{ validator: checkroomTypePrice, trigger: 'blur' }],

        }
      };
    },
    created() {
      //获取表格数据
      this.getdata()
    },
    methods: {
      //获取表格数据方法
      async getdata() {
        const res = await this.$get('/RoomType/List')
        this.tableData = res
      },
      //添加方法
      btnclick() {
        this.drawer = true
        this.title = "添加类型"
        this.label = "添加账号",
          this.isadd = true
      },
      async handleShow(index, row) {
        const roomTypeId = row.roomTypeId
        //根据id获取内容信息
        const res = await this.$get('/RoomType/GetOne', { roomTypeId })
        this.ruleForm = res
        this.dialogVisible = true

      },
      //编辑方法
      async handleEdit(index, row) {
        // 获取编号
        const roomTypeId = row.roomTypeId
        //获取数据
        const res = await this.$get('/RoomType/GetOne', { roomTypeId })
        this.isadd = false
        this.ruleForm = res
        //打开抽屉
        this.drawer = true
        //
        this.title = "修改类型"
        this.label = "修改的类型"
      },
      //删除
      async handleDelete(roomTypeId) {

        //等待确认框弹出执行下一步
        await this.$c_f('确认删除吗？')

        //等待执行完成 获取数据后进行下一步
        let { success, message } = await this.$post('RoomType/Delete', { roomTypeId })
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
          roomTypeId: "",
          roomTypeName: "",
          bedNum: "",
          roomTypePrice: "",
          typeDescription: "",
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
      //关闭详情
      dialogClose(done) {
        done()
      },
      //提交修改名称
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {

            //弹出框切换添加或者修改
            if (this.isadd) {

              let { success, message } = await this.$post("/RoomType/Add", this.ruleForm)

              if (success) {
                //成功通知消息
                this.$msg_s(message)
              } else {
                this.$msg_w(message)
              }
            } else {
              //修改角色的方法
              let { success, message } = await this.$post("/RoomType/Update", this.ruleForm)
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
  .add {
    margin: 20px;
  }

  .title {
    font-weight: bold;
  }

  .desc {
    margin: 10px 0;
    border-bottom: 1px dashed #eee;
    padding-bottom: 10px
  }
</style>