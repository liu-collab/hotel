<template>
  <div>
    <!-- 房间 -->
    <div class="searcher">
      <div class="search">
        <span style="padding: 10px;">类型:</span>
        <el-select v-model="roomTypeId" size="mini" clearable placeholder="请选择房间类型">
          <el-option v-for="item in typeList" :key="item.roomTypeId" :label="item.roomTypeName"
            :value="item.roomTypeId">
          </el-option>
        </el-select>
      </div>
      <div class="search">
        <span style="padding: 10px;">状态:</span>
        <el-select v-model="roomStateId" size="mini" clearable placeholder="请选择房间状态">
          <el-option v-for="item in stateList" :key="item.roomStateId" :label="item.roomStateName"
            :value="item.roomStateId">
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
    <el-table size="small" :data="tableData" style="width: 99%">
      <el-table-column prop="roomId" label="房间编号" width="180">
      </el-table-column>
      <el-table-column prop="roomType.roomTypeName" label="房间类型" width="180">
      </el-table-column>
      <el-table-column prop="roomType.bedNum" label="床位数" width="180">
      </el-table-column>
      <el-table-column prop="roomType.roomTypePrice" label="价格" width="180">
      </el-table-column>
      <el-table-column prop="roomState.roomStateName" label="房间状态" width="180">
        <template slot-scope="scope">
          <el-tag size="mini"
            :type="scope.row.roomStateId === 1 ? 'danger' : (scope.row.roomStateId === 2?'success':'warning')"
            disable-transitions>
            {{ scope.row.roomState.roomStateName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click=" handleShow(scope.$index, scope.row)">详情</el-button>
          <el-button size="mini" type="primary" @click=" handleShow2(scope.$index, scope.row)">图片</el-button>
          <el-button size="mini" type="warning" @click="handleEdit(scope.$index ,scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background layout="prev, pager, next" @current-change="change" class="page" :total="count">
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :title="title" :visible.sync="drawer" :direction="direction" size="60%" :before-close="handleClose">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">

        <el-form-item label="房间编号" prop="roomId">
          <el-input v-model="ruleForm.roomId"></el-input>
        </el-form-item>
        <el-form-item label="房间类型" prop="roomTypeId">
          <el-select v-model="ruleForm.roomTypeId" size="mini" clearable placeholder="请选择房间类型">
            <el-option v-for="item in typeList" :key="item.roomTypeId" :label="item.roomTypeName"
              :value="item.roomTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间状态" prop="roomStateId">
          <el-select v-model="ruleForm.roomStateId" size="mini" clearable placeholder="请选择房间状态">
            <el-option v-for="item in stateListtoupdate" :key="item.roomStateId" :label="item.roomStateName"
              :value="item.roomStateId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description" style="height: 420px;">
          <quill-editor v-model="ruleForm.description" :options="editorOption" style="height: 300px;" />
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
        <div class="title">房间编号</div>
        <div class="desc">{{ruleForm.roomId}}</div>
        <div class="title">房间类型</div>
        <div class="desc">{{ruleForm.roomType.roomTypeName}}</div>
        <div class="title">房间状态</div>
        <div class="desc">{{ruleForm.roomState.roomStateName}}</div>
        <div class="title">床位数</div>
        <div class="desc">{{ruleForm.roomType.bedNum}}</div>
        <div class="title">价格</div>
        <div class="desc" style="color: red;">￥<span>{{ruleForm.roomType.roomTypePrice}}</span>元</div>
        <div class="title">类型描述</div>
        <div class="desc" v-html="ruleForm.roomType.typeDescription"></div>
        <div class="title">房间描述</div>
        <div class="desc" v-html="ruleForm.description"></div>

      </div>

    </el-dialog>
    <!-- 图片详情 -->
    <el-dialog title="客房图片" :visible.sync="dialogVisible2" width="60%" :before-close="dialogClose2">
      <div>
        <el-upload :action="room_upload_url" list-type="picture-card" :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove" :limit='8' :file-list="ListImg" :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible3" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>

    </el-dialog>
  </div>
</template>
<script>
  //导出Excel表格
  import { xlsx } from "../../utils/xlsx"
  //获取图片上传地址
  import { room_upload_url, room_phont_url } from "../../configs/index"
  export default {
    name: '',
    props: {},
    data() {

      var checkroomId = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('房间编号不能为空'));
        } else {
          callback();
        }
      };
      var checkroomTypeId = (rule, value, callback) => {
        if (value === '') {
          //验证数据必须为数字型，在绑定的数据加v-model.number转为整型
          callback(new Error('房间类型不能为空'));
        }
        else {
          callback();
        }
      };
      var checkroomStateId = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('状态不能为空'));
        }
        else {
          callback();
        }
      };

      return {
        //图片列表
        ListImg: [],
        //图片上传地址
        room_upload_url,
        //图片访问地址
        room_phont_url,
        //总数量
        count: 1,
        //页码
        pageIndex: 1,
        //房间编号
        roomTypeId: "",
        //房间类型
        typeList: [],
        //房间状态编号
        roomStateId: "",
        //房间状态
        stateList: [],
        //房间抽屉状态
        stateListtoupdate: [],
        //表格数据
        tableData: [],
        //角色名
        roleList: [],
        value: "",
        drawer: false,
        direction: 'rtl',
        title: '添加房间',
        label: "添加房间",
        isadd: true,
        //详情
        dialogVisible: false,
        //图片详情
        dialogVisible2: false,
        //图片上传地址
        dialogImageUrl: '',
        //图片预览大图
        dialogVisible3: false,
        editorOption: {
          placeholder: '请输入内容'
        },
        //表单数据
        ruleForm: {
          id: "",
          //房间号
          roomId: "",
          //状态编号
          roomStateId: "",
          //类型编号
          roomTypeId: "",
          //房间描述
          description: "",
          roomType: {},
          roomState: {}

        },
        rules: {
          //光标离开时调用的方法
          roomId: [{ validator: checkroomId, trigger: 'blur' }],
          roomTypeId: [{ validator: checkroomTypeId, trigger: 'change' }],
          roomStateId: [{ validator: checkroomStateId, trigger: 'change' }],

        }
      };
    },
    created() {
      //获取房间状态数据
      this.getstatelist()
      //获取打开抽屉房间状态
      this.getstatelisttoudate()
      //获取表格数据
      this.getdata()
      //获取房间类型数据
      this.gettypelist()
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
      //获取房间状态
      async getstatelist() {
        const res = await this.$get('/RoomState/List')
        this.stateList = res
      },
      //获取抽屉房间状态
      async getstatelisttoudate() {
        const res = await this.$get('/RoomState/ListToUpdate')
        this.stateListtoupdate = res
      },
      //获取房间类型
      async gettypelist() {
        const res = await this.$get('/RoomType/List')
        this.typeList = res
      },
      //获取表格数据方法
      async getdata() {
        const { count, data, pageIndex, pageSize } = await this.$get('/Room/List', {
          roomTypeId: this.roomTypeId === "" ? 0 : this.roomTypeId,
          roomStateId: this.roomStateId === "" ? 0 : this.roomStateId,
          pageIndex: this.pageIndex,

        })
        //获取页码
        this.count = count
        //获取表格数据
        this.tableData = data

      },
      //添加方法
      btnclick() {
        this.drawer = true
        this.title = "添加房间"
        this.label = "添加账号",
          this.isadd = true
      },
      //详情方法
      async handleShow(index, row) {
        const roomId = row.roomId
        //根据id获取内容信息
        const res = await this.$get('/Room/GetOne', { roomId })
        this.ruleForm = res
        this.dialogVisible = true

      },
      //图片详情方法
      async handleShow2(index, row) {
        const roomId = row.roomId
        this.roomId = row.roomId
        //打开详情
        this.dialogVisible2 = true
        //获取图片
        let res = await this.$get('RoomImg/List', { roomId })
        //上传的图片需要一定的格式,对返回的数据解析结构
        this.ListImg = res.map(r => {
          return { name: r.imgUrl, url: room_phont_url + r.imgUrl, roomImgId: r.roomImgId }

        })

      },
      //编辑方法
      async handleEdit(index, row) {
        // 获取编号
        const roomId = row.roomId
        //获取数据
        const res = await this.$get('/Room/GetOne', { roomId })
        this.isadd = false
        this.ruleForm = res
        //备份编号,在修改时需要用到原来编号进行修改
        this.ruleForm.id = res.roomId
        //打开抽屉
        this.drawer = true
        //
        this.title = "修改类型"
        this.label = "修改的类型"
      },
      //删除
      async handleDelete(roomId) {

        //等待确认框弹出执行下一步
        await this.$c_f('确认删除吗？')

        //等待执行完成 获取数据后进行下一步
        let { success, message } = await this.$post('Room/Delete', { roomId })
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
          //房间号
          roomId: "",
          //状态编号
          roomStateId: "",
          //类型编号
          roomTypeId: "",
          //房间描述
          description: "",
          roomType: {},
          roomState: {}
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
      //关闭图片详情
      dialogClose2(done) {
        //清空图片
        this.ListImg = []

        setTimeout(() => {
          done()
        }, 200);
      },
      //移除图片
      async handleRemove(file, fileList) {

        let { roomImgId, name } = file

        await this.$post('/RoomImg/Delete', { roomImgId, filename: name })

      },
      //预览图片
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible3 = true;
      },
      //图片上传成功
      async handleAvatarSuccess(res, file) {
        let { success, filename } = res
        if (success) {
          let res = await this.$post('RoomImg/Add', { roomId: this.roomId, imgUrl: filename })

        }

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
      //导出Excel表格
      exportExcel() {
        //遍历表数据
        let json = this.tableData.map(r => {
          return {
            roomId: r.roomId,
            roomTypeName: r.roomType.roomTypeName,
            bedNum: r.roomType.bedNum,
            roomTypePrice: r.roomType.roomTypePrice,
            roomState: r.roomType.roomState
          }
        })
        //生成表头
        let fields = {
          roomId: "房间编号",
          roomTypeName: "房间类型",
          bedNum: "床位数",
          roomTypePrice: "价格",
          roomState: "状态"
        }
        xlsx(json, fields, "房间信息表")
      },
      //提交修改名称
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {

            //弹出框切换添加或者修改
            if (this.isadd) {
              let { success, message } = await this.$post("/Room/Add", this.ruleForm)
              if (success) {
                //成功通知消息
                this.$msg_s(message)
              } else {
                this.$msg_w(message)
              }
            } else {
              //修改角色的方法
              let { success, message } = await this.$post("/Room/Update", this.ruleForm)
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