<script setup>
  import { unparseSpan } from '@/hooks/parseHtmlText';
  import { useRouter } from 'vue-router';

  /* router */
  const router = useRouter()
  const props = defineProps(['content','atUserInfoList'])
  const htmlArr = unparseSpan(props.content, props.atUserInfoList)

  function toHome(id) {
    const page = router.resolve({
      name:'home',
      params:{
        userId:id
      }
    })
    window.open(page.href, '_blank')
  }
</script>

<template>
  <span v-for="(item,index) in htmlArr" :key="index">
    <a v-html="item.content" class="at-username" v-if="item.isAtSpan" @click.stop="toHome(item.atUserId)"></a>
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

