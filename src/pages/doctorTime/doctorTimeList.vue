<template>
  <div class="userList">
    <div class="toolbar">
      <div class="tool-search">
        <el-input
          placeholder="请输入搜索关键字"
          v-model.trim="key"
          class="search-input"
          @keyup.enter.native="fetchList"
          clearable
        ></el-input>
        <!-- <el-select clearable class="search-input" v-model="search.department" placeholder="请选择科室">
          <el-option
            v-for="item in departments"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select> -->
        <el-button type="primary" icon="el-icon-search" @click="fetchList(0)">搜索</el-button>
      </div>
      <div class="tool-option">
        <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addTime">新增排班</el-button> -->
        <el-upload
        class="uploadTime"
        action="/center/doctor/time/upload"
        :show-file-list="false"
        :auto-upload="false"
        :file-list="fileList"
        :on-change="handleUpload">
          <el-button type="primary" icon="el-icon-upload">上传排班文件</el-button>
        </el-upload>
        <el-button type="primary" icon="el-icon-download" @click="downloadTemp">模板下载</el-button>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        border>
        <el-table-column align="center" type="index" label="序号" width="65">
        </el-table-column>
        <el-table-column align="center" prop="department" label="科室" min-width="240">
        </el-table-column>
        <el-table-column align="center" prop="doctor" label="医生" min-width="120">
        </el-table-column>
        <el-table-column align="center" label="星期几" min-width="160">
          <template slot-scope="scope">
            {{days[scope.row.week]}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="dayPeriod" label="时间段" min-width="160">
        </el-table-column>
        <el-table-column align="center" label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="primary" size="small" @click="toDetail(scope.row)" icon="el-icon-edit">详情</el-button>
            <el-button plain type="primary" size="small" @click="singleDelete(scope.row.id)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        @size-change="fetchList"
        @current-change="fetchList"
        :current-page.sync="page.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" width="30%">
      <el-form :model="dialog" label-width="100px" label-position="left">
        <el-form-item label="科室：">
          <!-- <el-select clearable filterable v-model="dialog.department" placeholder="请选择科室" @change="changeDoctor">
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select> -->
          <el-input v-model="dialog.department" placeholder="请输入科室"></el-input> 
        </el-form-item>
        <el-form-item label="医生：">
          <!-- <el-select clearable filterable v-model="dialog.doctor" placeholder="请选择医生">
            <el-option
              v-for="item in doctors"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select> -->
          <el-input v-model="dialog.doctor" placeholder="请输入医生"></el-input> 
        </el-form-item>
        <el-form-item label="星期几：">
          <el-select clearable v-model="dialog.week" placeholder="请选择星期几">
            <el-option
              v-for="(item, index) in days"
              :key="index"
              :label="item"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间段：">
          <el-select clearable v-model="dialog.dayPeriod" placeholder="请选择时间">
            <el-option label="上午" value="上午"></el-option>
            <el-option label="下午" value="下午"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="toSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: '',   //搜索关键字
      // search: {
      //   doctorName: '',   //医生名称
      //   department: '',   //科室
      // },
      // departments: [],   //科室选项
      doctors: [],   //医生选项   
      page: {
        current: 1,
        size: 10,
        total: 100
      },
      tableData: [],
      days:['星期天','星期一','星期二','星期三','星期四','星期五','星期六'],
      dialog: {
        id: '',
        title: '新增排班',
        visible: false,
        department: '',
        doctor: '',
        dayPeriod: null,
        week: ''
      },
      fileList: []
    }
  },
  created() {
    this.fetchList()
    // this.getDepartments()
  },
  methods: {
    //根据科室更换医生选项
    // async changeDoctor() {
    //   this.dialog.doctor = ''
    //   const res = await this.$request.formGet('/department/doctor/list/'+this.dialog.department)
    //   this.doctors = res.data
    // },
    //获取所有未删除科室
    // async getDepartments() {
    //   const res = await this.$request.formGet('/department/query/all')
    //   this.departments = res.data
    // },
    //获取用户列表
    async fetchList(type) {
      if(type === 0){
        this.page.current = 1
      }
      const res = await this.$request.formGet('/doctor/time/list',{
        // doctorId: '',
        // departmentId: this.search.department,
        // doctorName: this.search.doctorName,
        key: this.key,
        page: this.page.current,
        size: this.page.size
      })
      if(res.code === 200 && res.data && res.data.data){
        this.tableData = res.data.data
        this.page.total = res.data.totalSize
      }else{
        this.tableData = []
        this.$message.error(res.message || '系统错误')
      }
    },
    //查看详情
    toDetail(data) {
      this.dialog.title = '排班详情'
      this.dialog.id = data.id
      this.dialog.department = data.department
      // this.changeDoctor()
      this.dialog.doctor = data.doctor
      this.dialog.dayPeriod = data.dayPeriod
      this.dialog.week = data.week
      this.dialog.visible = true
    },
    //删除用户
    singleDelete(id) {
      this.$confirm('确认删除该排班吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$request.formDelete('/doctor/time/delete/id',{ id })
        if(res.code === 200){
          this.$message.success('删除成功')
          this.fetchList(0)
        }
      }).catch(() => {})
    },
    //新增用户
    addTime() {
      Object.keys(this.dialog).forEach(item => {
        this.dialog[item] = null
      })
      this.dialog.title = '新增排班'
      this.dialog.visible = true
    },
    //点击上传
    async handleUpload(file, fileList){
      if(fileList.length > 1){
        fileList.shift()
      }
      let param = new FormData()
      param.append('file', file.raw)
      const res = await this.$request.uploadPost('/doctor/time/upload',param)
      if(res.code === 200){
        this.$message.success('上传成功')
        this.fetchList()
      }
    },
    //下载模板
    async downloadTemp() {
      let a = document.createElement('a');
      let res = await this.$request.download('/doctor/time/template')  
      a.download = '排班模板.xlsx';
      a.href= URL.createObjectURL(res);
      a.click()
    }, 
    //保存
    async toSave() {
      const params = {
        dayPeriod: this.dialog.dayPeriod === '上午' ? 0 : 1,
        doctor: this.dialog.doctor,
        department: this.dialog.department,
        id: this.dialog.id,
        week: this.dialog.week,
      }
      const res = await this.$request.jsonPost('/doctor/time/update',params)
      if(res.code === 200){
        this.fetchList(0)
        this.dialog.visible = false
      }
    },
  }
}
</script>

<style scoped lang="scss">
  .userList{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .toolbar{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .tool-search{
        display: flex;
        .search-input{
          width: 180px;
          &:not(:last-child){
            margin-right: 16px;
          }
        }
      }
      .tool-option{
        display: flex;
        .uploadTime{
          margin: 0 20px;
        }
      }
    }
    .table{
      margin: 20px 0;
      flex: 1;
    }
    .pagination{
      margin-bottom: 20px;
      display: flex;
      flex-direction: row-reverse;
    }
    .el-dialog{
      .el-input{
        width: 200px;
      }
    }
  }
</style>
