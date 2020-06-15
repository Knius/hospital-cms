<template>
  <div class="footer">
    <span>备案序号：湘ICP备14016977号</span>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  
}
</script>

<style scoped lang="scss">
  .footer{
    width: 100%;
    height: 36px;
    background: $footerColor;
    display: flex;
    justify-content: center;
    align-items: center;
    span{
      color: #333;
      font-size: 12px;
    }
  }
</style>
