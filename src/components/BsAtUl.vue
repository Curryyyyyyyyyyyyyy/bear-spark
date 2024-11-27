<script setup>
  // import { toRefs } from 'vue';

  // const props = defineProps(['atSelectPosition'])
  // const { atSelectPosition } = toRefs(props);
</script>

<template>
  <div class="bs-at-ul">
    <div class="bs-at-header">
      <span>选择或输入你想@的人</span>
    </div>
    <ul class="bs-at-list">
      <p class="bs-at-ul-desc">我的关注</p>
      <slot></slot>
    </ul>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  .bs-at-ul {
    z-index: 10;
    position: absolute;
    bottom: -180px;
    width: 200px;
    border: 1px solid #e3e5e7;
    border-radius: 6px;
    box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.17);
    background-color: $colorG;
    .bs-at-header {
      height: 40px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      box-sizing: border-box;
      color: $colorD;
    }
    .bs-at-list {
      max-height: 225px;
      overflow-x: hidden;
      overflow-y: auto;
      .bs-at-ul-desc {
        padding: 0 10px;
        box-sizing: border-box;
        margin-bottom: 10px;
        color: $colorC;
      }
    }
    .bs-at-list::-webkit-scrollbar {
      width: 4px;
    }
    .bs-at-list::-webkit-scrollbar-thumb {
      background-color: $colorF;
      border-radius: 2px;
    }
  }
</style>