<template>
  <div class="page-container">
    首页
    <div class="list" v-for="n in 5" :key="n">
      <div class="list__text">{{n}}</div>
    </div>
    <router-link to="/about">关于</router-link>
  </div>
</template>
<script>
export default {
  mounted() {
    console.log('console.log test');
    console.info('console.info test');
    console.error('console.error test');
    console.warn('console.warn test');
    debugger;
  },
};
</script>
<style lang="scss" scoped>
.list{
  line-height: 50px;
  padding: 10px;
  font-size:13px;
  border:1px solid #ddd;
  display: flex;
  .list__text{
    color:#666;
  }
}
</style>
