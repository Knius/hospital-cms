<template>
  <div class="articleList">
    <div class="toolbar">
      <div class="tool-search">
        <el-input
          placeholder="请输入文章标题"
          v-model.trim="search.title"
          class="search-input"
          @keyup.enter.native="fetchList"
          clearable
        ></el-input>
        <el-select clearable class="search-input" v-model="search.column" placeholder="请选择栏目" @change="getTags">
          <el-option
            v-for="item in columns"
            :key="item.label"
            :label="item.value"
            :value="item.label">
          </el-option>
        </el-select>
        <el-select clearable class="search-input" v-model="search.tag" placeholder="请选择栏目标签">
          <el-option
            v-for="item in tags"
            :key="item.label"
            :label="item.value"
            :value="item.label">
          </el-option>
        </el-select>
        <el-select clearable class="search-input" v-model="search.status" placeholder="请选择状态">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="fetchList(0)">搜索</el-button>
      </div>
      <div class="tool-option">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="$router.push('/publishSys/articleEdit')">新增文章</el-button>
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
        <el-table-column align="center" show-overflow-tooltip prop="title" label="标题" min-width="200">
        </el-table-column>
        <el-table-column align="center" prop="columnCn" label="栏目" min-width="100">
        </el-table-column>
        <el-table-column align="center" prop="tagCn" label="标签" min-width="100">
        </el-table-column>
        <el-table-column align="center" prop="author" label="作者" min-width="100">
        </el-table-column>
        <el-table-column align="center" prop="publishDate" label="发布日期" min-width="130">
        </el-table-column>
        <el-table-column align="center" prop="createDate" label="创建日期" min-width="130">
        </el-table-column>
        <el-table-column align="center" prop="statusCn" label="状态" min-width="100">
        </el-table-column>
        <!-- <el-table-column align="center" show-overflow-tooltip prop="brief" label="简介" min-width="300">
        </el-table-column> -->
        <el-table-column align="center" prop="order" label="排序" width="65">
        </el-table-column>
        <el-table-column align="center" label="操作" width="420" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="primary" size="small" @click="changeStatus(scope.row.id, 1)" icon="el-icon-view" v-if="scope.row.status == 0">提交审查</el-button>
            <el-button plain type="primary" size="small" @click="changeStatus(scope.row.id, 2)" icon="el-icon-circle-check" v-if="scope.row.status == 1">审查通过</el-button>
            <el-button plain type="primary" size="small" @click="changeStatus(scope.row.id, 3)" icon="el-icon-circle-close" v-if="scope.row.status == 1">审查不通过</el-button>
            <el-button plain type="primary" size="small" @click="changeStatus(scope.row.id, 4)" icon="el-icon-document" v-if="scope.row.status == 2">发布文章</el-button>
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
        title: '',   //文章标题
        column: '',   //栏目
        tag: '',   //标签
        status: '',   //状态
      },
      columns: [],   //栏目选项
      tags: [],   //标签选项
      statusList: [],   //状态选项
      page: {
        current: 1,
        size: 10,
        total: 100
      },
      tableData: [],
      selection: []   //选中的文章
    }
  },
  created() {
    this.fetchList()
    this.getColumns()
    this.getStatus()
  },
  methods: {
    //获取栏目列表
    async getColumns() {
      const res = await this.$request.formGet('/article/column/all')
      this.columns = res.data.columns
    },
    //获取标签标签
    async getTags() {
      const res = await this.$request.formGet('/article/column/tags',{
        column: this.search.column
      })
      this.tags = res.data.tags
      this.search.tag = ''
    },
    //获取文章所有状态
    async getStatus() {
      const res = await this.$request.formGet('/article/status/all')
      Object.keys(res.data).forEach(key => {
        this.statusList.push({
          value: key,
          label: res.data[key]
        })
      })
    },
    //获取文章列表
    async fetchList(type) {
      if(type === 0){
        this.page.current = 1
      }
      const res = await this.$request.formGet('/article/query/all',{
        column: this.search.column,
        status: this.search.status,
        tag: this.search.tag,
        title: this.search.title,
        page: this.page.current,
        size: this.page.size
      })
      this.tableData = res.data.data
      this.page.total = res.data.totalSize
    },
    //删除单个文章
    singleDelete(id) {
      this.$confirm('确认删除文章吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$request.formDelete('/article/delete',{ id })
        if(res.code === 200){
          this.$message.success('删除成功')
          this.fetchList(0)
        }
      }).catch(() => {})
    },
    //批量删除
    batchDelete() {
      this.$confirm('确认删除文章吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let ids = this.selection.map(item => {
          return item.id
        })
        const res = await this.$request.jsonPost('/article/delete/batch', ids)
        if(res.code === 200){
          this.$message.success('删除成功')
          this.fetchList(0)
        }
      }).catch(() => {})
    },
    //状态切换
    async changeStatus(id, targetStatus) {
      if(targetStatus === 4){
        this.$confirm('确认发布文章吗', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$request.formPost(`/article/status/update?articleId=${id}&status=${targetStatus}`)
          if(res.code === 200){
            this.fetchList(0)
          }
        }).catch(() => {})
      }else{
        const res = await this.$request.formPost(`/article/status/update?articleId=${id}&status=${targetStatus}`)
        if(res.code === 200){
          this.fetchList(0)
        }
      }
    },
    //选项更改
    handleSelectionChange(selection) {
      this.selection = selection
    },
    //跳转到详情
    toDetail(id) {
      this.$router.push({ path: '/publishSys/articleEdit', query: { id }})
    }
  }
}
</script>

<style scoped lang="scss">
  .articleList{
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
