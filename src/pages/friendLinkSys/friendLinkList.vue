<template>
  <div class="userList">
    <div class="toolbar">
      <div class="tool-search">
      </div>
      <div class="tool-option">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addTime">新增链接</el-button>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        border>
        <el-table-column align="center" type="index" label="序号" width="65">
        </el-table-column>
        <el-table-column align="center" prop="name" label="链接名称" min-width="120">
        </el-table-column>
        <el-table-column align="center" prop="value" label="链接地址" min-width="180">
        </el-table-column>
        <el-table-column align="center" prop="sortOrder" label="链接顺序" min-width="100">
        </el-table-column>
        <el-table-column align="center" prop="status" label="是否展示" min-width="100">
          <template slot-scope="scope">
            {{scope.row.status === true ? '展示' : '不展示'}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="primary" size="small" v-if="!scope.row.status" @click="changeStatus(scope.row.id, 1)" icon="el-icon-circle-check">启用</el-button>
            <el-button plain type="primary" size="small" v-if="scope.row.status" @click="changeStatus(scope.row.id, 0)" icon="el-icon-circle-close">禁用</el-button>
            <el-button plain type="primary" size="small" @click="toDetail(scope.row)" icon="el-icon-edit">修改</el-button>
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
        <el-form-item label="链接名称：">
          <el-input v-model="dialog.name" placeholder="请输入链接名"></el-input>
        </el-form-item>
        <el-form-item label="链接地址：">
          <el-input v-model="dialog.value" placeholder="请输入链接地址"></el-input>
        </el-form-item>
        <el-form-item label="链接顺序：">
          <el-input v-model="dialog.sortOrder" placeholder="请输入顺序"></el-input>
        </el-form-item>
        <el-form-item label="是否展示：">
          <el-radio v-model="dialog.status" :label="true">显示</el-radio>
          <el-radio v-model="dialog.status" :label="false">不显示</el-radio>
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
      page: {
        current: 1,
        size: 10,
        total: 100
      },
      tableData: [],
      dialog: {
        id: null,
        title: '新增链接',
        visible: false,
        name: '',
        sortOrder: null,
        value: '',
        status: true,
        createTime: null,
        updateTime: null
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    //获取友情链接列表
    async fetchList() {
      const res = await this.$request.formGet('/friendshipLink/all')
      this.tableData = res.data
      this.page.total = res.data.length
    },
    //查看详情
    toDetail(data) {
      this.dialog.title = '修改链接'
      this.dialog.id = data.id
      this.dialog.name = data.name
      this.dialog.value = data.value
      this.dialog.sortOrder = data.sortOrder
      this.dialog.visible = true
    },
    //更改状态
    async changeStatus(id, targetStatus) {
      const res = await this.$request.formPost('/friendshipLink/status/update',{
        id,
        status: targetStatus
      })
      if(res.code === 200){
        this.$message.success('更改状态成功')
        this.fetchList(0)
      }
    },
    //删除链接
    singleDelete(id) {
      this.$confirm('确认删除该链接吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$request.formDelete('/friendshipLink/delete/id',{ id })
        if(res.code === 200){
          this.$message.success('删除成功')
          this.fetchList()
        }
      }).catch(() => {})
    },
    //新增用户
    addTime() {
      Object.keys(this.dialog).forEach(item => {
        this.dialog[item] = null
      })
      this.dialog.title = '新增链接'
      this.dialog.visible = true
    },
    //保存
    async toSave() {
      const params = {
        id: this.dialog.id,
        createTime: this.dialog.createTime,
        updateTime: this.dialog.updateTime,
        name: this.dialog.name,
        sortOrder: this.dialog.sortOrder,
        status: this.dialog.status,
        value: this.dialog.value
      }
      const res = await this.$request.jsonPost('/friendshipLink/save',params)
      if(res.code === 200){
        this.fetchList()
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
