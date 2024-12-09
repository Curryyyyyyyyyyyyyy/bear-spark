<script setup>
  import useUser from '@/store/user';
  import { ElMessage } from 'element-plus';
  const userStore = useUser()
  if(Date.now() - userStore.expires > 1.296e9) {
    userStore.token = ''
    ElMessage.info('登录失效，请重新登录')
    location.href('/#/index')
  } else {
    userStore.expires = Date.now()
  }
</script>

<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  @use './assets/sass/reset.scss' as *;
  @use './assets/sass/base.scss' as *;
  @use './assets/sass/config.scss' as *;
  .app {
    margin: 0 auto;
    min-width: $min-width;
    max-width: $max-width;
  }
</style>
