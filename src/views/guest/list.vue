<template>
  <div>
    <!-- 房间 -->
    <div class="searcher">
      <div class="search">
        <span style="padding: 10px;">客户姓名:</span>
        <el-input size="mini" style="width: 220px;" clearable v-model="guestName" placeholder="请输入姓名"></el-input>
      </div>
      <div class="search">
        <span style="padding: 10px;">结账状态:</span>
        <el-select v-model="resideStateId" clearable size="mini" clearable placeholder="请选择状态">
          <el-option v-for="item in guestStateList" :key="item.resideStateId" :label="item.resideStateName"
            :value="item.resideStateId">
          </el-option>
        </el-select>
      </div>
      <div class="add">
        <el-button type="primary" size="mini" @click="btnsearch">搜索</el-button>
        <el-button type="primary" size="mini" @click="btnclick">添加</el-button>
        <el-button type="primary" size="mini" @click="exportExcel">导出Excel</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <el-table size="mini" :data="tableData" style="width: 99%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table size="mini" :data="props.row.subList" style="width: 99%">
            <el-table-column width="80"></el-table-column>
            <el-table-column label="姓名" prop="guestName" width="100">
            </el-table-column>
            <el-table-column label="电话" prop="phone" width="140">
            </el-table-column>
            <el-table-column label="身份证" prop="identityId" width="100">
            </el-table-column>
            <el-table-column label="操作" v-if="props.row.resideState.resideStateId===1">
              <template slot-scope="scope">
                <el-button size="mini" type="text" style="color: #E6A23C;"
                  @click="handleEdit2(scope.$index ,scope.row)">编辑
                </el-button>
                <el-button size="mini" type="text" style="color: #F56C6C;"
                  @click="handleDelete2(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="客户姓名" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.guestName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户电话" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.identityId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入住房间" width="80">
        <template slot-scope="scope">
          {{ scope.row.roomId }}
        </template>
      </el-table-column>
      <el-table-column label="房间类型" width="80">
        <template slot-scope="scope">
          {{ scope.row.room.roomType.roomTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="床位数" width="60">
        <template slot-scope="scope">
          {{ scope.row.room.roomType.bedNum }}
        </template>
      </el-table-column>
      <el-table-column label="房间价格" width="70">
        <template slot-scope="scope">
          {{ scope.row.room.roomType.roomTypePrice }}
        </template>
      </el-table-column>
      <el-table-column label="入住日期" width="140">
        <template slot-scope="scope">
          {{ scope.row.resideDate }}
        </template>
      </el-table-column>
      <el-table-column label="离开日期" width="140">
        <template slot-scope="scope">
          {{ scope.row.leaveDate }}
        </template>
      </el-table-column>
      <el-table-column label="押金" width="60">
        <template slot-scope="scope">
          {{ scope.row.deposit }}
        </template>
      </el-table-column>
      <el-table-column label="消费" width="60">
        <template slot-scope="scope">
          {{ scope.row.totalMoney }}
        </template>
      </el-table-column>
      <el-table-column label="人数" width="50">
        <template slot-scope="scope">
          {{ scope.row.guestNum }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="70">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.resideStateId === 1 ? 'danger' : 'success'" disable-transitions>
            {{ scope.row.resideState.resideStateName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" style="color: #E6A23C;" v-if="scope.row.resideState.resideStateId===1"
            @click="btnclick2(scope.$index ,scope.row)">+
          </el-button>
          <el-button size="mini" type="text" style="color: #409EFF;" v-if="scope.row.resideState.resideStateId===1"
            @click="checkout(scope.$index, scope.row)">结账
          </el-button>

          <el-button size="mini" type="text" style="color: #E6A23C;" v-if="scope.row.resideState.resideStateId===1"
            @click="handleEdit(scope.$index ,scope.row)">编辑
          </el-button>
          <el-button size="mini" type="text" style="color: #F56C6C;" v-if="scope.row.resideState.resideStateId===2"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background layout="prev, pager, next" @current-change="change" class="page" :total="count">
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :title="title" :visible.sync="drawer" :direction="direction" size="30%" :before-close="handleClose">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">


        <el-form-item label="姓名" prop="guestName">
          <el-input v-model="ruleForm.guestName"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model.number="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="identityId">
          <el-input v-model="ruleForm.identityId"></el-input>
        </el-form-item>
        <el-form-item label="房间类型" prop="roomTypeId">
          <el-select v-model="ruleForm.roomTypeId" @change="changeRoomType" size="mini" clearable placeholder="请选择房间类型">
            <el-option v-for="item in typeList" :key="item.roomTypeId" :label="item.roomTypeName"
              :value="item.roomTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间" prop="roomId">
          <el-select v-model="ruleForm.roomId" size="mini" clearable placeholder="请选择房间">
            <el-option v-for="item in  roomList" :key="item.roomId" :label="item.roomId" :value="item.roomId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入住日期" prop="resideDate">
          <el-date-picker v-model="ruleForm.resideDate" format="yyyy-MM-dd HH:mm:ss" type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="押金" prop="deposit">
          <el-input v-model.number="ruleForm.deposit"></el-input>
        </el-form-item>
        <el-form-item label="入住人数" prop="guestNum">
          <el-input v-model="ruleForm.guestNum"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!-- 子抽屉 -->
    <el-drawer :title="title" :visible.sync="drawer2" :direction="direction" size="30%" :before-close="handleClose2">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px">
        <el-form-item label="姓名" prop="guestName">
          <el-input v-model="ruleForm2.guestName"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model.number="ruleForm2.phone"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="identityId">
          <el-input v-model="ruleForm2.identityId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormChild('ruleForm2')">提交</el-button>
          <el-button @click="resetForm2('ruleForm2')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
  //导出Excel表格
  import { xlsx } from "../../utils/xlsx"
  //获取图片上传地址
  export default {
    name: '',
    props: {},
    data() {


      var checkidentifyId = (rule, value, callback) => {
        if (value === '') {

          callback(new Error('身份证不能为空'));
        }
        else {
          callback();
        }
      };
      var checkguestName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('姓名不能为空'));
        }
        else {
          callback();
        }
      };
      var checkphone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('电话不能为空'));
        } else if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        }
        else {
          callback();
        }
      };
      var checkroomTypeId = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('房间类型不能为空'));
        }
        else {
          callback();
        }
      };
      var checkroomId = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('房间不能为空'));
        }
        else {
          callback();
        }
      };
      var checkdeposit = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('押金不能为空'));
        } else if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        }
        else {
          callback();
        }
      };
      var checkresideDate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('日期不能为空'));
        }
        else {
          callback();
        }
      };


      return {
        subList: [],
        //顾客编号
        guestId: "",
        //客户姓名
        guestName: "",
        // 客户状态
        resideStateId: "",
        //结账状态
        guestStateList: [],

        //总数量
        count: 1,
        //页码
        pageIndex: 1,
        //房间编号
        roomTypeId: "",
        // 房间类型
        typeList: "",
        //房间抽屉状态
        roomList: [],
        //表格数据
        tableData: [],

        //打开抽屉
        drawer: false,
        //打开子抽屉
        drawer2: false,
        //抽屉方向
        direction: 'rtl',
        title: '添加客户',

        isadd: true,

        editorOption: {
          placeholder: '请输入内容'
        },
        //表单数据
        ruleForm: {

          // 身份证
          identityId: "",
          // 姓名
          guestName: "",
          // 电话
          phone: "",
          // 房间类型编号
          roomTypeId: "",
          // 房间号
          roomId: "",
          // 入住日期
          resideDate: "",
          // 押金
          deposit: "",
          // 入住人数
          guestNum: "",
        },
        //表单数据
        ruleForm2: {
          //顾客编号
          guestId: "",
          // 身份证
          identityId: "",
          // 姓名
          guestName: "",
          // 电话
          phone: "",

        },
        rules: {
          //光标离开时调用的方法

          identifyId: [{ validator: checkidentifyId, trigger: 'blur' }],
          guestName: [{ validator: checkguestName, trigger: 'blur' }],
          phone: [{ validator: checkphone, trigger: 'blur' }],
          resideDate: [{ validator: checkresideDate, trigger: 'blur' }],
          deposit: [{ validator: checkdeposit, trigger: 'blur' }],
          roomId: [{ validator: checkroomId, trigger: 'change' }],
          roomTypeId: [{ validator: checkroomTypeId, trigger: 'change' }],

        },
        rules2: {
          //光标离开时调用的方法
          identifyId: [{ validator: checkidentifyId, trigger: 'blur' }],
          guestName: [{ validator: checkguestName, trigger: 'blur' }],
          phone: [{ validator: checkphone, trigger: 'blur' }],
        }
      };

    },
    created() {
      //获取结账状态数据
      this.getguestStateList()

      //获取表格数据
      this.getdata()
      //获取房间类型数据
      this.gettypelist()
    },
    methods: {
      //结账功能
      async checkout(index, row) {
        // 获取编号
        const guestId = row.guestId
        let { totalMoney } = await this.$post('/GuestRecord/Checkout', { guestId })
        if (totalMoney) {
          this.$msg_s("结账成功!你需要支付:" + totalMoney + "元")
          //获取表格数据
          this.getdata()
        }
      },
      //分页功能
      change(pageIndex) {
        this.pageIndex = pageIndex
        this.getdata()
      },
      //搜索按钮
      btnsearch() {
        //获取表格数据
        this.getdata()
      },
      //获取结账状态
      async getguestStateList() {
        const res = await this.$get('/ResideState/List')

        this.guestStateList = res
      },

      //获取房间类型
      async gettypelist() {
        const res = await this.$get('/RoomType/List')
        this.typeList = res
      },
      //获取表格数据方法
      async getdata() {
        const { data, count } = await this.$get('/GuestRecord/List', {

          //客户姓名
          guestName: this.guestName,
          //结账状态编号
          resideStateId: (this.resideStateId || 0),
          //页码
          pageIndex: this.pageIndex,
        })
        // console.log(data)
        //获取页码
        this.count = count
        //获取子表格数据
        data.forEach(async r => {
          r.subList = await this.$get('/GuestRecordSub/List', { guestId: r.guestId })
          console.log(r.subList)
          this.subList = r.subList
        })

        //获取表格数据
        this.tableData = data

      },
      //添加方法
      btnclick() {
        this.drawer = true
        this.title = "添加客户"
        this.label = "添加账号",
          this.isadd = true
      },
      //添加子方法
      btnclick2(index, row) {
        // 获取编号
        const guestId = row.guestId

        this.isadd = true
        this.ruleForm2.guestId = guestId
        //打开抽屉
        this.drawer2 = true
        //
        this.title = "添加跟随的顾客"
        this.label = "修改的客户"
      },


      //编辑方法
      async handleEdit(index, row) {
        // 获取编号
        const guestId = row.guestId
        //获取数据
        const res = await this.$get('/GuestRecord/GetOne', { guestId })
        this.isadd = false
        this.ruleForm = res
        //给表单添加房间类型编号
        this.ruleForm.roomTypeId = res.room.roomType.roomTypeId

        //根据房间类型编号获取房间编号
        const roomTypeId = res.room.roomType.roomTypeId
        //判断类型是否为空
        if (roomTypeId) {
          //根据房间类型获取房间编号
          let { data } = await this.$get('/Room/List', { roomTypeId })
          //获取房间号
          this.roomList = data
        } else {
          this.roomList = []
        }
        //打开抽屉
        this.drawer = true
        //
        this.title = "修改的顾客"
        this.label = "修改的客户"
      },
      //编辑子方法
      async handleEdit2(index, row) {
        // 获取编号
        const guestSubId = row.guestSubId
        //获取数据
        const res = await this.$get('/GuestRecordSub/GetOne', { guestSubId })

        this.isadd = false
        this.ruleForm2 = res

        //打开抽屉
        this.drawer2 = true
        //
        this.title = "修改跟随的顾客"
        this.label = "修改的客户"
      },
      //删除
      async handleDelete(guestId) {

        //等待确认框弹出执行下一步
        await this.$c_f('确认删除吗？')

        //等待执行完成 获取数据后进行下一步
        let { success, message } = await this.$post('/GuestRecord/Delete', { guestId })
        if (success) {
          this.$msg_s(message)
          //刷新表格数据
          this.getdata()
        } else {
          this.$msg_e(message)
        }
      },
      //删除子表格
      async handleDelete2(index, row) {
        // 获取编号
        const guestSubId = row.guestSubId
        //等待确认框弹出执行下一步
        await this.$c_f('确认删除吗？')

        //等待执行完成 获取数据后进行下一步
        let { success, message } = await this.$post('/GuestRecordSub/Delete', { guestSubId })
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
          // 身份证
          identityId: "",
          // 姓名
          guestName: "",
          // 电话
          phone: "",
          // 房间类型编号
          roomTypeId: "",
          // 房间号
          roomId: "",
          // 入住日期
          resideDate: "",
          // 押金
          deposit: "",
          // 入住人数
          guestNum: "",
        }
        this.roomList = []
      },
      //重置子提交框
      resetForm2(formName2) {
        //重置表单
        this.$refs[formName2].resetFields();
        //清空数据
        this.ruleForm2 = {
          //顾客编号
          guestId: "",
          // 身份证
          identityId: "",
          // 姓名
          guestName: "",
          // 电话
          phone: "",

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
      //关闭子抽屉的方法
      handleClose2(done) {
        // await this.$c_f('确认关闭吗？')
        //关闭抽屉
        done()
        //清空提交框
        this.resetForm2('ruleForm2')
      },


      //导出Excel表格
      exportExcel() {
        //遍历表数据
        let json = this.tableData.map(r => {
          return {
            guestName: r.guestName,
            phone: r.phone,
            identityId: r.identityId,
            roomId: r.roomId,
            roomTypeName: r.room.roomType.roomTypeName,
            bedNum: r.room.roomType.bedNum,
            price: r.room.roomType.roomTypePrice,
            resideDate: r.resideDate,
            leaveDate: r.leaveDate,
            deposit: r.deposit,
            totalMoney: r.totalMoney,
            guestNum: r.guestNum,
            resideStateName: r.resideState.resideStateName,
          }
        })
        //生成表头
        let fields = {
          guestName: "客户姓名",
          phone: "客户电话",
          identityId: "身份证号",
          roomId: "入住房间",
          roomTypeName: "房间类型",
          bedNum: "床位数",
          price: "房间价格",
          resideDate: "入住日期",
          leaveDate: "离开日志",
          deposit: "押金",
          totalMoney: "消费金额",
          guestNum: "入住人数",
          resideStateName: "结账状态",
        }
        xlsx(json, fields, "顾客信息表")
      },
      //房间类型下拉框更改时
      async changeRoomType(roomTypeId) {
        //清空房间号
        this.ruleForm.roomId = ""
        //判断类型是否为空
        if (roomTypeId) {
          //根据房间类型获取房间编号
          //roomStateId:1 表示获取空闲房间
          let { data } = await this.$get('/Room/List', { roomTypeId, roomStateId: 1 })
          //获取房间号
          this.roomList = data
        } else {
          this.roomList = []
        }



      },
      //提交修改名称
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {

            //弹出框切换添加或者修改
            if (this.isadd) {
              let { success, message } = await this.$post("/GuestRecord/Add", this.ruleForm)
              if (success) {
                //成功通知消息
                this.$msg_s(message)
              } else {
                this.$msg_w(message)
              }
            } else {
              //修改角色的方法
              let { success, message } = await this.$post("/GuestRecord/Update", this.ruleForm)
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

      //子抽屉提交修改名称
      submitFormChild(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {

            //弹出框切换添加或者修改
            if (this.isadd) {
              let { success, message } = await this.$post("/GuestRecordSub/Add", this.ruleForm2)
              if (success) {
                //成功通知消息
                this.$msg_s(message)
              } else {
                this.$msg_w(message)
              }
            } else {
              //修改角色的方法
              let { success, message } = await this.$post("/GuestRecordSub/Update", this.ruleForm2)
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
            this.resetForm2("ruleForm2")
          } else {
            this.$msg_e('添加错误')
            return false
          }
        });
      },
    }
  }
</script>
<style scoped>
  .add {

    margin-left: 10px;
    display: flex;
    align-content: center;
    justify-content: center;
  }

  .searcher {
    width: 100%;
    padding: 20px;
    display: flex;
    align-content: center;

  }

  .page {
    display: flex;
    align-content: center;
    justify-content: center;
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