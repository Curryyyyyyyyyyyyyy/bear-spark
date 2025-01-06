<script setup>
  import useUser from '@/store/user';
  import { ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';
  
  /* router */
  const router = useRouter()
  const userStore = useUser()
  if(Date.now() > userStore.timestamp + userStore.expire) {
    userStore.token = ''
    ElMessage.info('登录失效，请重新登录')
    router.replace('')
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
    height: 100%;
    min-width: $min-width;
    max-width: $max-width;
  }
</style>
