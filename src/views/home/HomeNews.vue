<script setup>
  import HomeAside from '@/views/home/HomeAside.vue';
  import NewsList from '@/components/news/NewsList.vue'
</script>

<template>
  <div class="home-news">
    <div class="content">
      <news-list></news-list>
    </div>
    <div class="aside">
      <home-aside></home-aside>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .home-news {
    @include flex(space-between, start);
    padding: 20px 0;
    .content {
      width: 100%;
      margin-right: 10px;
    }
  }
</style>