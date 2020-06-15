<template>
  <div class="container">
    <el-tabs v-model="currentTab" type="card" closable @tab-remove="removeTab">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.router"
        :name="item.router"
        :label="item.title"
      >
      </el-tab-pane>
    </el-tabs>
    <div class="viewContainer">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Container',
  data() {
    return {
      tabs: [{
        title: '文章列表',
        router: '/publishSys/articleList',
      }],
    }
  },
  methods: {
    // 标签移除触发
    removeTab(targetName) {
      let tabs = this.tabs;
      let activeName = this.currentTab;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.currentTab = activeName;
      this.tabs = tabs.filter(tab => tab.name !== targetName);
    }
  }
}
</script>

<style scoped lang="scss">
  .container{
    flex: 1;
    display: flex;
    flex-direction: column;
    .viewContainer{
      flex: 1;
      height: 0px;
      overflow: auto;
      padding: 6px 24px;
    }
  }
</style>
