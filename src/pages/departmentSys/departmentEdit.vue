<template>
  <div class="departmentEdit">
    <div class="nav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/departmentSys/departmentList' }">科室列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form">
      <el-form :model="formData" label-width="100px" label-position="left" :hide-required-asterisk="true">
        <el-form-item label="科室名称：">
          <el-input v-model="formData.name" placeholder="请输入科室名称"></el-input>
        </el-form-item>
        <el-form-item label="科室简介：">
          <el-input v-model="formData.brief" type="textarea" :autosize="{ minRows: 6, maxRows: 12}" placeholder="请输入科室简介"></el-input>
        </el-form-item>
        <el-form-item label="科室标签：">
          <el-select v-model="formData.tag" placeholder="请选择科室标签">
            <el-option 
              v-for="type in tags" 
              :key="type.label" 
              :label="type.value" 
              :value="type.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否展示：">
          <el-select v-model="formData.isShow">
            <el-option label="不展示" :value="0"></el-option>
            <el-option label="展示" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室排序：">
          <el-input v-model="formData.order" style="width: 80px"></el-input>
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
      <el-button type="primary" @click="toSave">保存草稿</el-button>
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
      title: '新增科室',
      formData: {
        name: '',
        brief: '',
        tag: '',
        isShow: null,
        content: '',
        order: ''
      },
      tags: [],   //标签选项
      editor: null,
    }
  },
  created() {
    this.getTags()
    this.id = this.$route.query.id
    if(this.id){
      this.name = '科室详情'
      this.getDetail(this.id)
    }
  },
  methods: {
    //根据id获取文章详情
    async getDetail(id) {
      const res = await this.$request.formGet('/department/query/id',{id})
      this.formData.name = res.data.name
      this.formData.brief = res.data.brief
      this.formData.isShow = res.data.isShow
      this.formData.tag = res.data.tag
      this.formData.order = res.data.order
      this.formData.content = res.data.content
    },
    //获取标签
    async getTags() {
      const res = await this.$request.formGet('/department/column/tags')
      this.tags = res.data.tags
    },
    //保存草稿
    async toSave() {
      const res = await this.$request.jsonPost('/department/save',{
        name: this.formData.name,
        tag: this.formData.tag,
        content: this.formData.content,
        order: this.formData.order,
        isShow: this.formData.isShow,
        id: this.id,
        brief: this.formData.brief,
      })
      if(res.code === 200){
        this.$router.push('/departmentSys/departmentList')
      }
    },
  }
}
</script>

<style scoped lang="scss">
  .departmentEdit{
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
