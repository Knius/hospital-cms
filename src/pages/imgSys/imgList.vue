<template>
  <div class="imgList">
    <div class="toolbar">
      <div class="tool-search">
        <el-input
          placeholder="请输入图片名称"
          v-model.trim="search.name"
          class="search-input"
          @keyup.enter.native="fetchList"
          clearable
        ></el-input>
        <el-select clearable class="search-input" v-model="search.column" placeholder="请选择栏目" @change="getTags1">
          <el-option
            v-for="item in columns"
            :key="item.label"
            :label="item.value"
            :value="item.label">
          </el-option>
        </el-select>
        <el-select clearable class="search-input" v-model="search.tag" placeholder="请选择栏目标签">
          <el-option
            v-for="item in tags1"
            :key="item.label"
            :label="item.value"
            :value="item.label">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="fetchList(0)">搜索</el-button>
      </div>
      <div class="tool-option">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addNewImg">新增图片</el-button>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        border>
        <el-table-column align="center" type="index" label="序号" width="65">
        </el-table-column>
        <el-table-column align="center" prop="name" show-overflow-tooltip="" label="图片名称" min-width="140">
        </el-table-column>
        <el-table-column align="center" prop="columnCn" label="栏目" min-width="95">
        </el-table-column>
        <el-table-column align="center" prop="tagCn" label="标签" min-width="100">
        </el-table-column>
        <el-table-column align="center" prop="url" label="链接" min-width="100">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">显示图片</a>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" min-width="80">
          <template slot-scope="scope">
            {{scope.row.status === 1 ? '已启用' : '已禁用'}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="order" label="排序" width="65">
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="140" fixed="right">
          <template slot-scope="scope">
            <el-button plain type="primary" size="small" v-if="scope.row.status === 0" @click="changeStatus(scope.row.id, 1)" icon="el-icon-circle-check">启用</el-button>
            <el-button plain type="primary" size="small" v-if="scope.row.status === 1" @click="changeStatus(scope.row.id, 0)" icon="el-icon-circle-close">禁用</el-button>
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
    <el-dialog title="新增图片" :visible.sync="dialog.visible" width="30%">
      <el-form :model="dialog" label-width="100px" label-position="left">
        <el-form-item label="图片名：">
          <el-input v-model="dialog.name" placeholder="请输入图片名"></el-input>
        </el-form-item>
        <el-form-item label="图片栏目：">
          <el-select clearable v-model="dialog.column" placeholder="请选择栏目" @change="getTags2">
            <el-option
              v-for="item in columns"
              :key="item.label"
              :label="item.value"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片标签：">
          <el-select clearable v-model="dialog.tag" placeholder="请选择栏目标签">
            <el-option
              v-for="item in tags2"
              :key="item.label"
              :label="item.value"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片：">
          <el-upload
            action="/center/img/upload"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="handleUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">{{tip}}</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片顺序：">
          <el-input v-model="dialog.order" style="width: 100px"></el-input>
        </el-form-item>
        <el-form-item label="图片链接：">
          <el-input v-model="dialog.linkUrl"></el-input>
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
        name: '',
        column: '',   //栏目
        tag: '',   //标签
      },
      columns: [],   //栏目选项
      tags1: [],   //搜索里的标签选项
      tags2: [],   //新增里的标签选项
      page: {
        current: 1,
        size: 10,
        total: 100
      },
      fileList: [],
      tableData: [],
      dialog: {
        visible: false,
        name: '',
        column: '',
        tag: '',
        order: '',
        id: '',
        linkUrl: ''
      },
      tip: ''   //图片推荐提示
    }
  },
  watch: {
    'dialog.tag': function(val) {
      if(!val){
        this.tip = ''
      }else{
        const target = this.tags2.find(item => {
          return val === item.label
        })
        this.tip = target.tip
      }
    }
  },
  created() {
    this.fetchList()
    this.getColumns()
  },
  methods: {
    // 打开新增图片
    addNewImg() {
      this.fileList = []
      this.dialog.visible = true
    },
    //获取栏目
    async getColumns() {
      const res = await this.$request.formGet('/img/column/all')
      this.columns = res.data
    },
    //获取标签1
    async getTags1() {
      const res = await this.$request.formGet('/img/tag',{
        column: this.search.column
      })
      this.tags1 = res.data
      this.search.tag = ''
    },
    //获取标签2
    async getTags2() {
      const res = await this.$request.formGet('/img/tag',{
        column: this.dialog.column
      })
      this.tags2 = res.data
      this.dialog.tag = ''
    },
    //获取图片列表
    async fetchList(type) {
      if(type === 0){
        this.page.current = 1
      }
      const res = await this.$request.formGet('/img/query/page',{
        name: this.search.name,
        column: this.search.column,
        tag: this.search.tag,
        page: this.page.current,
        size: this.page.size
      })
      this.tableData = res.data.data
      this.page.total = res.data.totalSize
    },
    //删除图片
    singleDelete(id) {
      this.$confirm('确认删除该图片吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$request.formDelete('/img/delete/id',{ id })
        if(res.code === 200){
          this.$message.success('删除成功')
          this.fetchList(0)
        }
      }).catch(() => {})
    },
    //图片上传
    async handleUpload(file, fileList){
      if(fileList.length > 1){
        fileList.shift()
      }
      let param = new FormData()
      param.append('file', file.raw)
      const res = await this.$request.uploadPost('/img/upload',param)
      if(res.code === 200){
        this.dialog.id = res.data.id
        this.$message.success('上传成功')
      }
    },  
    //更改状态
    async changeStatus(id, targetStatus) {
      const res = await this.$request.formPost('/img/status/update',{
        id,
        status: targetStatus
      })
      if(res.code === 200){
        this.$message.success('更改状态成功')
        this.fetchList(0)
      }
    },
    //保存
    async toSave() {
      const res = await this.$request.jsonPost('/img/save',{
        name: this.dialog.name,
        column: this.dialog.column,
        tag: this.dialog.tag,
        order: this.dialog.order,
        id: this.dialog.id,
        linkUrl: this.dialog.linkUrl,
        width: 0,
        height: 0
      })
      if(res.code === 200){
        this.fetchList(0)
        this.dialog.visible = false
        Object.keys(this.dialog).forEach(item => {
          this.dialog[item] = null
        })
      }
    },
  }
}
</script>

<style scoped lang="scss">
  .imgList{
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
        width: 192px;
      }
    }
  }
</style>
