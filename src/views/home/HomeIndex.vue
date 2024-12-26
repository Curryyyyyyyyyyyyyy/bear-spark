<script setup>
  import HomeAside from '@/views/home/HomeAside.vue';
</script>

<template>
  <div class="home_index">
    <div class="content"></div>
    <div class="aside">
      <home-aside></home-aside>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .home_index {
    @include flex();
  }
</style>