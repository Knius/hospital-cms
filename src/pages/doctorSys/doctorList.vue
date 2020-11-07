<template>
  <div class="doctorList">
    <div class="toolbar">
      <div class="tool-search">
        <el-input
          placeholder="请输入医生姓名"
          v-model.trim="search.name"
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
        <el-select clearable class="search-input" v-model="search.isDelete" placeholder="请选择删除状态">
          <el-option :value="false" label="未删除"></el-option>
          <el-option :value="true" label="删除"></el-option>
        </el-select>
        <el-select clearable class="search-input" v-model="search.isShow" placeholder="请选择展示状态">
          <el-option :value="false" label="不显示"></el-option>
          <el-option :value="true" label="显示"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="fetchList(0)">搜索</el-button>
      </div>
      <div class="tool-option">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="$router.push('/doctorSys/doctorEdit')">新增医生</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        border>
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column align="center" type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column align="center" prop="name" label="医生姓名" width="100">
        </el-table-column>
        <el-table-column align="center" label="性别" width="65">
          <template slot-scope="scope">
            <span v-if="scope.row.sex === 1">男</span>
            <span v-if="scope.row.sex === 2">女</span>
            <span v-if="scope.row.sex === 0">未知</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="department" label="所属科室" width="140">
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="level" label="职务" min-width="200">
        </el-table-column>
        <el-table-column align="center" prop="title" label="职称" min-width="140">
        </el-table-column>
        <el-table-column align="center" prop="order" label="排序" width="100">
        </el-table-column>
        <el-table-column align="center" label="删除状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.isDelete">已删除</span>
            <span v-if="!scope.row.isDelete">未删除</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="显示状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.show">已显示</span>
            <span v-if="!scope.row.show">未显示</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="primary" size="small" @click="toDetail(scope.row.id)" icon="el-icon-edit">详情</el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: {
        name: '',   //医生姓名
        department: '',   //科室
        isDelete: false,   //删除状态
        isShow: true   //显示状态
      },
      departments: [],   //科室选项
      page: {
        current: 1,
        size: 10,
        total: 100
      },
      tableData: [],
      selection: []   //选中的医生
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
    //获取医生列表
    async fetchList(type) {
      if(type === 0){
        this.page.current = 1
      }
      const res = await this.$request.formGet('/doctor/query/all',{
        departmentId: this.search.department,
        isDelete: this.search.isDelete,
        isShow: this.search.isShow,
        name: this.search.name,
        page: this.page.current,
        size: this.page.size
      })
      this.tableData = res.data.data
      this.page.total = res.data.totalSize
    },
    //删除单个医生
    singleDelete(id) {
      this.$confirm('确认删除医生吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$request.formDelete('/doctor/id',{ id })
        if(res.code === 200){
          this.$message.success('删除成功')
          this.fetchList(0)
        }
      }).catch(() => {})
    },
    //批量删除
    batchDelete() {
      this.$confirm('确认删除医生吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let ids = this.selection.map(item => {
          return item.id
        })
        const res = await this.$request.jsonPost('/doctor/ids', ids)
        if(res.code === 200){
          this.$message.success('删除成功')
          this.fetchList(0)
        }
      }).catch(() => {})
    },
    //选项更改
    handleSelectionChange(selection) {
      this.selection = selection
    },
    //跳转到详情
    toDetail(id) {
      this.$router.push({ path: '/doctorSys/doctorEdit', query: { id }})
    }
  }
}
</script>

<style scoped lang="scss">
  .doctorList{
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
  }
</style>
