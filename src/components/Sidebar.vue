<template>
  <div class="sidebar">
    <el-menu
      router
      :collapse-transition="false"
      :collapse="isCollapse"
      :default-active="$route.path"
      background-color="#304156"
      text-color="#fff"
      active-text-color="#409eff">
      <el-submenu :index="nav.index" v-for="nav in sideNavs" :key="nav.index">
        <template slot="title">
          <i :class="nav.icon"></i>
          <span slot="title">{{nav.title}}</span>
        </template>
          <el-menu-item :index="childNav.index" v-for="childNav in nav.children" :key="childNav.index">{{childNav.name}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import sideNavs from '@/sideNavs'
export default {
  name: 'Sidebar',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sideNavs, // 侧边栏导航
    }
  }
}
</script>

<style scoped lang="scss">
  .sidebar{
    background: #304156;
    .el-menu{
      border: none
    }
  }
</style>
