<script setup>
  import NavHeader from '@/components/nav-header/NavHeader.vue';
</script>

<template>
  <div class="index-header">
    <nav-header>
      <template v-slot:nav>
        <a class="header-index">
          <i class="iconfont icon-shouye"></i>
          <span>首页</span>
        </a>
      </template>
    </nav-header>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  .index-header {
    height: 152px;
    background-color: pink;
    color: $colorG;
    a {
      color: $colorG;
    }
  }
</style>