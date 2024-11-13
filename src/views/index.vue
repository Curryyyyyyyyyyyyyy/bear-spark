<script setup>
  import NavHeader from '../components/NavHeader.vue';
  import { ref } from 'vue';

  let fixedHeader = ref(false)
</script>

<template>
  <div class="index-header">
    <nav-header>
      <template v-slot:nav>
        <a>
          <i v-if="fixedHeader" class="iconfont icon-shouye"></i>
          <span>首页</span>
          <i v-if="!fixedHeader" class="iconfont icon-down"></i>
        </a>
      </template>
    </nav-header>
  </div>
</template>

<style lang="scss">
  @use '../assets/sass/config.scss' as *;
  .index-header {
    height: 152px;
    background-color: pink;
    color: $colorG;
  }
</style>