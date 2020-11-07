<template>
  <div class="userList">
    <div class="toolbar">
      <div class="tool-search">
        <el-input
          placeholder="请输入用户姓名"
          v-model.trim="search.realname"
          class="search-input"
          @keyup.enter.native="fetchList"
          clearable
        ></el-input>
        <el-select clearable class="search-input" v-model="search.department" placeholder="请选择科室">
          <el-option
            v-for="item in departments"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="fetchList(0)">搜索</el-button>
      </div>
      <div class="tool-option">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addUser">新增用户</el-button>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        border>
        <el-table-column align="center" type="index" label="序号" width="65">
        </el-table-column>
        <el-table-column align="center" prop="username" label="用户名" min-width="160">
        </el-table-column>
        <el-table-column align="center" prop="realname" label="真是姓名" min-width="120">
        </el-table-column>
        <el-table-column align="center" prop="phoneNo" label="手机号码" min-width="240">
        </el-table-column>
        <el-table-column align="center" prop="departmentName" label="科室" min-width="160">
        </el-table-column>
        <el-table-column align="center" label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="primary" size="small" @click="toDetail(scope.row)" icon="el-icon-edit">详情</el-button>
            <el-button plain type="primary" size="small" @click="singleDelete(scope.row.id)" icon="el-icon-delete" v-if="scope.row.isDelete === 0">删除</el-button>
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
        <el-form-item label="用户名：">
          <el-input v-model="dialog.username" placeholder="请输入用户名" :disabled="dialog.title === '用户详情'"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名：">
          <el-input v-model="dialog.realname" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="密码：" v-show="dialog.title === '新增用户'">
          <el-input v-model="dialog.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="旧密码：" v-show="dialog.title === '用户详情'">
          <el-input v-model="dialog.oldPassword" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码：" v-show="dialog.title === '用户详情'">
          <el-input v-model="dialog.newPassword" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="dialog.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="科室：">
          <el-select v-model="dialog.department" placeholder="请选择科室">
            <el-option 
              v-for="type in departments" 
              :key="type.id" 
              :label="type.name" 
              :value="type.id">
            </el-option>
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
      search: {
        realname: '',   //用户名称
        department: '',   //科室
      },
      departments: [],   //科室选项
      page: {
        current: 1,
        size: 10,
        total: 100
      },
      tableData: [],
      dialog: {
        title: '新增用户',
        visible: false,
        oldPassword: '',
        newPassword: '',
        username: '',
        realname: '',
        mobile: '',
        department: '',
        password: ''
      }
    }
  },
  created() {
    this.fetchList()
    this.getDepartments()
  },
  methods: {
    //获取所有未删除科室
    async getDepartments() {
      const res = await this.$request.formGet('/department/query/all')
      this.departments = res.data
    },
    //获取用户列表
    async fetchList(type) {
      if(type === 0){
        this.page.current = 1
      }
      const res = await this.$request.formGet('/user/query/page',{
        departmentId: this.search.department,
        realname: this.search.realname,
        page: this.page.current,
        size: this.page.size
      })
      this.tableData = res.data.data
      this.page.total = res.data.totalSize
    },
    //删除用户
    singleDelete(id) {
      this.$confirm('确认删除该用户吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$request.formDelete('/user/delete',{ id })
        if(res.code === 200){
          this.$message.success('删除成功')
          this.fetchList(0)
        }
      }).catch(() => {})
    },
    //新增用户
    addUser() {
      Object.keys(this.dialog).forEach(item => {
        this.dialog[item] = null
      })
      this.dialog.title = '新增用户'
      this.dialog.visible = true
    },
    //跳转到详情
    toDetail(detail) {
      this.dialog.title = '用户详情'
      this.dialog.visible = true
      this.dialog.username = detail.username
      this.dialog.realname = detail.realname
      this.dialog.password = detail.password
      this.dialog.department = detail.departmentId
      this.dialog.mobile = detail.phoneNo
    },
    //保存
    async toSave() {
      let url
      const params = {
        username: this.dialog.username,
        realname: this.dialog.realname,
        phoneNo: this.dialog.mobile,
        departmentId: this.dialog.department,
      }
      if(this.dialog.title === '新增用户'){
        url = '/user/add'
        params.password = this.dialog.password
      }else{
        url = 'user/update'
        params.oldPassword = this.dialog.oldPassword
        params.newPassword = this.dialog.newPassword
      }
      const res = await this.$request.jsonPost(url,params)
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
