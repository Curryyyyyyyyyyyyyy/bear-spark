<script setup>
  import {getLikeListApi} from '@/api/news'
  import { onMounted, ref } from 'vue';

  const props = defineProps(['happeningId'])
  onMounted(()=>{
    loadMore()
  })
  const likeList = ref([])
  const busy = ref(false)
  const loading = ref(false)
  const isArriveTotal = ref(false)
  const pageNum = ref(1)
  const pageSize = ref(20)
  function loadMore() {
    if(isArriveTotal.value) return
    busy.value = true
    loading.value = true
    setTimeout(async () => {
      const res = await getLikeListApi({
        pageNum:pageNum.value,
        pageSize:pageSize.value,
        happeningId:props.happeningId
      })
      likeList.value.push(...res.records)
      if(likeList.value.length >= res.total) isArriveTotal.value = true
    }, 500);
  }
</script>

<template>
  <ul class="news-like-list">
    <li v-for="(item,index) in likeList" :key="index" class="like-item">
      <div class="user-avatar">
        <img v-lazy="item.avatarUrl" alt="">
      </div>
      <div class="user-info">
        <span class="username">{{ item.username }}</span>
        <span class="text">点赞了</span>
      </div>
    </li>
  </ul>
  <div class="load-more"
    v-infinite-scroll="loadMore" 
    :infinite-scroll-disabled="busy" 
    infinite-scroll-distance="50"
  >
    <img src="/imgs/loading-svg/loading-spinning-bubbles.svg" v-show="!isArriveTotal && loading">
  </div>
  <div v-if="isArriveTotal" class="like-list-full">人家是有底线的呢 ~</div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .news-like-list {
    .like-item {
      @include flex(left);
      padding: 16px 0;
      border-bottom: 1px solid $colorN;
      cursor: pointer;
      .user-avatar {
        margin-right: 14px;
        img {
          height: 40px;
          width: 40px;
          border-radius: 20px;
        }
      }
      .user-info {
        font-size: $fontJ;
        font-weight: 500;
        .username {
          margin-right: 6px;
        }
      }
    }
    .like-list-empty {
      padding: 20px 0;
      text-align: center;
      font-size: $fontJ;
      color: $colorD;
    }
  }
  .load-more {
    text-align: center;
  }
  .like-list-full {
    text-align: center;
    color: $colorD;
    padding: 30px 0 60px 0;
  }
</style>