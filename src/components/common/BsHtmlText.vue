<script setup>
  import { unparseSpan } from '@/hooks/parseHtmlText';

  const props = defineProps(['content','atUserInfoList'])
  const htmlArr = unparseSpan(props.content, props.atUserInfoList)
</script>

<template>
  <span v-for="(item,index) in htmlArr" :key="index">
    <a v-html="item.content" class="at-username" v-if="item.isAtSpan" :href="`/#/home/${item.atUserId}`" target="_blank"></a>
    <span class="content" v-html="item.content" v-else></span>
  </span>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  .at-username {
    color: $colorM !important;
    cursor: pointer;
    &:hover {
      color: $colorP !important;
    }
  }
  .content {
    img {
      height: 20px;
      width: 20px;
      vertical-align: middle;
    }
  }
</style>

