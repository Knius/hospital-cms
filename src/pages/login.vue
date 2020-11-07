<template>
  <div class="login">
    <h1>恺德医院管理后台</h1>
    <el-input prefix-icon="el-icon-user" v-model="username"></el-input>
    <el-input prefix-icon="el-icon-lock" v-model="password" show-password @keyup.enter.native="login"></el-input>
    <el-button type="primary" @click="login">登陆</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: null,
      password: null
    }
  },
  methods: {
    //登陆
    async login() {
      const res = await this.$request.jsonPost('/login',{
        username: this.username,
        password: this.password
      })
      if(res.data.token){
        localStorage.setItem('token',res.data.token)
        localStorage.setItem('username',res.data.username)
        localStorage.setItem('userid',res.data.userId)
        localStorage.setItem('realname',res.data.realname)
        this.$router.push('/main')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .login{
    height: 100%;
    background: $themeColor;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    h1{
      width: 450px;
      font-size: 26px;
      color: #eee;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: 700;
      margin-bottom: 40px;
      margin-top: 160px;
    }
    /deep/.el-input{
      width: 450px;
      margin-bottom: 22px;
      .el-input__inner{
        height: 48px;
        color: #eee;
        background: rgba(0,0,0,.1);
        border: 1px solid hsla(0,0%,100%,.1);
      }
    }
    .el-button{
      width: 450px;
    }
  }
</style>
