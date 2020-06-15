<template>
  <div class="header">
    <div class="collapse">
      <i class="el-icon-s-fold" v-show="fold" @click="changeFold"></i>
      <i class="el-icon-s-unfold" v-show="!fold" @click="changeFold"></i>
    </div>
    <div class="userInfo">
      <span>你好，{{username}}</span>
      <span>修改密码</span>
      <span @click="$router.push('/login')">退出</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      username: '',
      fold: true
    }
  },
  created() {
    this.username = localStorage.getItem('username')
  },
  methods: {
    changeFold() {
      this.fold = !this.fold
      this.$emit('changeCollapse', this.fold)
    }
  }
}
</script>

<style scoped lang="scss">
  .header{
    height: 60px;
    width: 100%;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid hsl(0, 0%, 88%);
    .collapse{
      font-size: 24px;
    }
    .userInfo{
      display: flex;
      span{
        color: #333;
        padding: 2px 20px;
        cursor: pointer;
        &:not(:last-child){
          border-right: 1px solid #333;
        }
      }
    }
  }
</style>
