<template>
  <div id="mainApp">
    <div class="main">
      <Sidebar :isCollapse="isCollapse"></Sidebar>
      <div class="content">
        <Header @changeCollapse="changeCollapse"></Header>
        <Container></Container>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import Container from '@/components/Container'

export default {
  name: 'App',
  components: {
    Header,
    Sidebar,
    Footer,
    Container
  },
  data() {
    return {
      isCollapse: false   //控制导航展开收起
    }
  },
  methods: {
    changeCollapse(isCollapse) {
      this.isCollapse = !isCollapse
    }
  }
}
</script>

<style lang="scss" scoped>
#mainApp {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .main{
    flex: 1;
    display: flex;
    .content{
      flex: 1;
      width: 0px;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
