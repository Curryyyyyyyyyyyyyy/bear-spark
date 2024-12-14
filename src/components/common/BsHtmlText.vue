<script setup>
  import { unparseSpan } from '@/hooks/parseHtmlText';

  const props = defineProps(['content','atUserInfoList'])
  const htmlArr = unparseSpan(props.content, props.atUserInfoList)
</script>

<template>
  <span v-for="(item,index) in htmlArr" :key="index">
    <span v-html="item.content" class="at-username" v-if="item.isAtSpan" @click="router.push(`/mainInterface/${item.atUserId}`)"></span>
    <span v-html="item.content" v-else></span>
  </span>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  .at-username {
    color: $colorM;
  }
</style>

