<template>
  <div class="page-container">
    首页
    <div class="list" v-for="n in 5" :key="n">
      {{n}}
    </div>
    <router-link to="/about">关于</router-link>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="scss" scoped>
.list{
  line-height: 50px;
  font-size:13px;
  border:1px solid #ddd;
}
</style>

