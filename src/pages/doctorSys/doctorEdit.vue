<template>
  <div class="doctorEdit">
    <div class="nav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/doctorSys/doctorList' }">文章列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form">
      <el-form :model="formData" label-width="100px" label-position="left" :hide-required-asterisk="true">
        <el-form-item label="医生姓名：">
          <el-input v-model="formData.name" placeholder="请输入医生姓名" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="医生性别：">
          <el-select v-model="formData.sex" placeholder="请选择医生性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属科室：">
          <el-select clearable v-model="formData.departmentId" placeholder="请选择科室">
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职称：">
          <el-input v-model="formData.title" placeholder="请输入医生头衔"></el-input>
        </el-form-item>
        <el-form-item label="职务：">
          <el-input v-model="formData.level" placeholder="请输入医生级别"></el-input>
        </el-form-item>
        <el-form-item label="社会职务：">
          <el-input v-model="formData.remark" type="textarea" :autosize="{ minRows: 6, maxRows: 12}" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="医生简介：">
          <el-input v-model="formData.note" type="textarea" :autosize="{ minRows: 6, maxRows: 12}" placeholder="请输入医生简介"></el-input>
        </el-form-item>
        <el-form-item label="是否展示：">
          <el-radio v-model="formData.show" :label="true">显示</el-radio>
          <el-radio v-model="formData.show" :label="false">不显示</el-radio>
        </el-form-item>
        <el-form-item label="医生照片：">
          <el-upload
            action="/center/img/upload"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="handleUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"><span style="color:red">*</span>推荐尺寸255*355</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="医生顺序：">
          <el-input v-model="formData.order" style="width: 100px"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" @click="savedoctor">保存</el-button>
      <el-button plain @click="$router.push('/doctorSys/doctorList')">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      title: '新增医生',
      formData: {
        name: '',
        sex: '',
        departmentId: '',
        level: '',
        title: '',
        remark: '',
        note: '',
        show: '',
        pictureId: '',
        order: ''
      },
      departments: [],   //科室选项
      fileList: []
    }
  },
  created() {
    this.getDepartments()
    this.id = this.$route.query.id
    if(this.id){
      this.title = '医生详情'
      this.getDetail(this.id)
    }
  },
  methods: {
    //获取所有未删除科室
    async getDepartments() {
      const res = await this.$request.formGet('/department/query/all')
      this.departments = res.data
    },
    //根据id获取医生详情
    async getDetail(id) {
      const res = await this.$request.formGet('/doctor/id',{id})
      Object.keys(this.formData).forEach(item => {
        this.formData[item] = res.data[item]
      })
      if(res.data.pictureId){
        this.fileList.push({
          name: res.data.name,
          pictureId: res.data.pictureId
        })
      }
    },
    //图片上传成功回调
    async handleUpload(file, fileList){
      if(fileList.length > 1){
        fileList.shift()
      }
      let param = new FormData()
      param.append('file', file.raw)
      const res = await this.$request.uploadPost('/img/upload',param)
      if(res.code === 200){
        this.formData.pictureId = res.data.id
        this.$message.success('上传成功')
      }
    },
    //保存草稿
    async savedoctor() {
      const params = {}
      Object.keys(this.formData).forEach(item => {
        params[item] = this.formData[item]
      })
      if(this.id){
        params.id = this.id
      }
      const res = await this.$request.jsonPost('/doctor/save',params)
      if(res.code === 200){
        this.$router.push('/doctorSys/doctorList')
      }
    },
  }
}
</script>

<style scoped lang="scss">
  .doctorEdit{
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
        width: 660px;
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
