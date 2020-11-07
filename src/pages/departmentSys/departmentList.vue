<template>
  <div class="departmentList">
    <div class="toolbar">
      <div class="tool-search">
        <el-input
          placeholder="请输入科室名称"
          v-model.trim="search.name"
          class="search-input"
          @keyup.enter.native="fetchList"
          clearable
        ></el-input>
        <el-select clearable class="search-input" v-model="search.tag" placeholder="请选择科室标签">
          <el-option
            v-for="item in tags"
            :key="item.label"
            :label="item.value"
            :value="item.label">
          </el-option>
        </el-select>
        <el-select clearable class="search-input" v-model="search.isDelete" placeholder="请选择删除状态">
          <el-option label="已删除" :value="1"></el-option>
          <el-option label="未删除" :value="0"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="fetchList(0)">搜索</el-button>
      </div>
      <div class="tool-option">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="$router.push('/departmentSys/departmentEdit')">新增科室</el-button>
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
        <el-table-column align="center" type="index" label="序号" width="65">
        </el-table-column>
        <el-table-column align="center" prop="name" label="科室名称" min-width="160">
        </el-table-column>
        <el-table-column align="center" prop="tagCn" label="标签" min-width="120">
        </el-table-column>
        <el-table-column align="center" prop="isDelete" label="是否删除" min-width="100">
          <template slot-scope="scope">
            {{scope.row.isDelete === 0 ? '未删除' : '已删除'}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="publishDate" label="是否展示" min-width="140">
          <template slot-scope="scope">
            {{scope.row.isShow === 0 ? '不展示' : '展示'}}
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="brief" label="简介" min-width="300">
        </el-table-column>
        <el-table-column align="center" prop="order" label="排序" width="65">
        </el-table-column>
        <el-table-column align="center" label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="primary" size="small" @click="toDetail(scope.row.id)" icon="el-icon-edit">详情</el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: {
        name: '',   //科室名称
        tag: '',   //标签
        isDelete: 0,   //删除状态
      },
      tags: [],   //标签选项
      page: {
        current: 1,
        size: 10,
        total: 100
      },
      tableData: [],
      selection: []   //选中的选项
    }
  },
  created() {
    this.fetchList()
    this.getTags()
  },
  methods: {
    //获取标签
    async getTags() {
      const res = await this.$request.formGet('/department/column/tags')
      this.tags = res.data.tags
    },
    //获取科室列表
    async fetchList(type) {
      if(type === 0){
        this.page.current = 1
      }
      const res = await this.$request.formGet('/department/query/page',{
        isDelete: this.search.isDelete,
        tag: this.search.tag,
        name: this.search.name,
        page: this.page.current,
        size: this.page.size
      })
      this.tableData = res.data.data
      this.page.total = res.data.totalSize
    },
    //删除单个科室
    singleDelete(id) {
      this.$confirm('确认删除科室吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$request.formDelete('/department/delete/id',{ id })
        if(res.code === 200){
          this.$message.success('删除成功')
          this.fetchList(0)
        }
      }).catch(() => {})
    },
    //批量删除
    batchDelete() {
      this.$confirm('确认删除科室吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let ids = this.selection.map(item => {
          return item.id
        })
        const res = await this.$request.jsonPost('/department/delete/batch', ids)
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
      this.$router.push({ path: '/departmentSys/departmentEdit', query: { id }})
    }
  }
}
</script>

<style scoped lang="scss">
  .departmentList{
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
