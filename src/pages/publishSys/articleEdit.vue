<template>
  <div class="articleEdit">
    <div class="nav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/publishSys/articleList' }">文章列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form">
      <el-form :model="formData" label-width="100px" label-position="left" :hide-required-asterisk="true">
        <el-form-item label="文章标题：">
          <el-input v-model="formData.title" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="文章简介：">
          <el-input v-model="formData.brief" type="textarea" :autosize="{ minRows: 6, maxRows: 12}" placeholder="请输入文章简介" maxlength="300" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="文章栏目：">
          <el-select v-model="formData.column" placeholder="请选择文章栏目" @change="getTags">
            <el-option 
              v-for="type in columns" 
              :key="type.label" 
              :label="type.value" 
              :value="type.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="栏目标签：">
          <el-select v-model="formData.tag" placeholder="请选择栏目标签">
            <el-option 
              v-for="type in tags" 
              :key="type.label" 
              :label="type.value" 
              :value="type.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章顺序：">
          <el-input v-model="formData.order" style="width: 80px"></el-input>
        </el-form-item>
        <!-- <el-divider></el-divider> -->
        <el-form-item label="上传图片：">
          <el-upload
            :show-file-list="false"
            :auto-upload="false"
            action="/center/img/upload"
            :on-change="handleUpload"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip" style="line-height:24px">
              <span style="color:red">*</span>图文信息推荐尺寸：600*340<br> 热点新闻推荐尺寸：210*210
            </div>
          </el-upload>
          <ul>
            <li v-for="file in fileList" :key="file.id">
              
              <a class="fileName" :href="file.url" target="_blank"><i class="el-icon-picture"></i>{{file.name}}</a>
              <span>图片顺序：</span>
              <el-input size="mini" v-model="file.order" placeholder="请输入图片插入顺序"></el-input>
              <el-button type="primary" size="mini" @click="deletePic(file.id)">删除</el-button>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="文章内容：">
          <editor
            v-model="formData.content"
            class="editor"
          ></editor>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="formData.keyWordsString" type="textarea" :autosize="{ minRows: 6, maxRows: 10}" placeholder="请输入关键字，用英文逗号分隔" maxlength="256" show-word-limit></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" @click="saveArticle">保存草稿</el-button>
      <el-button plain @click="$router.push('/publishSys/articleList')">取消</el-button>
    </div>
  </div>
</template>

<script>
import editor from "@/components/editor";
export default {
  components: {
    editor
  },
  data() {
    return {
      id: null,
      title: '新增文章',
      status: 0,   //0草稿
      formData: {
        title: '',
        brief: '',
        column: '',
        tag: '',
        content: '',
        order: '',
        createTime: null,
        keyWordsString: ''
      },
      columns: [],   //栏目选项
      tags: [],   //标签选项
      fileList: [],   //上传的文件列表
      editor: null,
    }
  },
  created() {
    this.getColumns()
    this.id = this.$route.query.id
    if(this.id){
      this.title = '文章详情'
      this.getDetail(this.id)
    }
  },
  methods: {
    //根据id获取文章详情
    async getDetail(id) {
      const res = await this.$request.formGet('/article/query/id',{id})
      this.formData.title = res.data.title
      this.formData.brief = res.data.brief
      this.formData.column = res.data.columnCode
      await this.getTags()
      this.formData.tag = res.data.tag
      this.formData.order = res.data.order
      this.formData.content = res.data.content
      this.formData.createTime = res.data.createTime
      this.formData.keyWordsString = res.data.keyWordsString
      this.fileList = res.data.imageList
    },
    //获取栏目列表
    async getColumns() {
      const res = await this.$request.formGet('/article/column/all')
      this.columns = res.data.columns
    },
    //获取标签
    async getTags() {
      const res = await this.$request.formGet('/article/column/tags',{
        column: this.formData.column
      })
      this.formData.tag = ''
      this.tags = res.data.tags
    },
    //图片上传成功回调
    async handleUpload(file){
      let param = new FormData()
      param.append('file', file.raw)
      const res = await this.$request.uploadPost('/img/upload',param)
      if(res.code === 200){
        this.fileList.push(res.data)
        this.$message.success('上传成功')
      }
    },
    //删除图片
    deletePic(id) {
      this.$confirm('确认删除图片吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$request.formDelete('/img/delete/id',{id})
        if(res.code === 200){
          this.fileList = this.fileList.filter(item => {
            return item.id !==id
          })
          this.$message.success('删除成功')
        }
      })
    },
    //保存草稿
    async saveArticle() {
      const res = await this.$request.jsonPost('/article/save',{
        userId: localStorage.getItem('userid'),
        author: localStorage.getItem('realname'),
        title: this.formData.title,
        createTime: this.formData.createTime,
        tag: this.formData.tag,
        status: this.status,
        columnCode: this.formData.column,
        content: this.formData.content,
        order: this.formData.order,
        id: this.id,
        brief: this.formData.brief,
        imageReqs: this.fileList,
        keyWordsString: this.formData.keyWordsString
      })
      if(res.code === 200){
        this.$router.push('/publishSys/articleList')
      }
    },
  }
}
</script>

<style scoped lang="scss">
  .articleEdit{
    display: flex;
    flex-direction: column;
    height: 100%;
    .nav{
      /deep/.el-breadcrumb__item:not(:last-child){
        .el-breadcrumb__inner{
          color: #999999;
          font-weight: 400;
        }
      }
    }
    .form{
      margin-top: 40px;
      margin-bottom: 20px;
      /deep/.el-form-item__label{
        font-weight: 700;
        color: #333;
      }
      .el-input{
        width: 360px;
      }
      .el-textarea{
        width: 720px;
      }
      ul{
        li{
          
          .fileName{
            color: #409EFF;
            margin-right: 60px;
            .el-icon-picture{
              font-size: 18px;
              margin-right: 2px
            }
          }
          .el-input{
            width: 80px;
          }
        }
      }
      .editor {
        max-width: 1200px;
      }
    }
    .footer{
      margin-bottom: 20px;
    }
  }
</style>
