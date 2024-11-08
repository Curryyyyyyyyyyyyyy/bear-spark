<script setup>

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
    background-color: $colorN;
  }
</style>
