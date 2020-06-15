<template>
  <div class="articleEdit">
    <div class="nav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/publishSys/articleList' }">文章列表</el-breadcrumb-item>
        <el-breadcrumb-item>新增文章</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form">
      <el-form :model="formData" label-width="100px" label-position="left" :hide-required-asterisk="true">
        <el-form-item label="文章标题：">
          <el-input v-model="formData.title" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="文章简介：">
          <el-input v-model="formData.brief" type="textarea" :rows="3" placeholder="请输入文章简介"></el-input>
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
            action="/center/img/upload"
            :on-success="handleUploadSuccess"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <ul>
            <li v-for="file in fileList" :key="file.id">
              
              <span class="fileName"><i class="el-icon-picture"></i>{{file.name}}</span>
              <span>图片顺序：</span>
              <el-input size="mini" v-model="file.order" placeholder="请输入图片插入顺序"></el-input>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="文章内容：">
          <editor
            v-model="formData.content"
            class="editor"
          ></editor>
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
      status: 0,   //0草稿
      formData: {
        title: '',
        brief: '',
        column: '',
        tag: '',
        content: '',
        order: ''
      },
      columns: [],   //栏目选项
      tags: [],   //标签选项
      fileList: [],   //上传的文件列表
      editor: null,
    }
  },
  created() {
    this.id = this.$route.query.id
    if(this.id){
      this.getDetail(this.id)
    }
    this.getColumns()
  },
  methods: {
    //根据id获取文章详情
    async getDetail(id) {
      const res = await this.$request.formGet('/article/query/id',{id})
      this.formData.title = res.title
      this.formData.brief = res.brief
      this.formData.column = res.columnCode
      this.formData.tag = res.tagCn
      this.formData.order = res.order
      this.formData.content = res.content
    },
    //获取栏目列表
    async getColumns() {
      const res = await this.$request.formGet('/article/column/all')
      this.columns = res.columns
    },
    //获取标签
    async getTags() {
      const res = await this.$request.formGet('/article/column/tags',{
        column: this.formData.column
      })
      this.tags = res.tags
    },
    //图片上传成功回调
    handleUploadSuccess(response){
      this.fileList.push(response)
    },
    //保存草稿
    async saveArticle() {
      const res = await this.$request.jsonPost('/article/save',{
        userId: 1,
        title: this.formData.title,
        tag: this.formData.tag,
        status: this.status,
        columnCode: this.formData.column,
        content: this.formData.content,
        order: this.formData.order,
        id: this.id,
        brief: this.formData.brief,
        imageReqs: this.fileList
      })
      if(res === '保存成功'){
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
        width: 360px;
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
        max-width: 600px;
      }
    }
    .footer{
      margin-bottom: 20px;
    }
  }
</style>
