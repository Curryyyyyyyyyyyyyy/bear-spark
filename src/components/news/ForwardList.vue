<script setup>
  import { onMounted, ref } from 'vue';
  import {getForwardListApi} from '@/api/news'
  import Loading from '@/components/common/Loading.vue'
  const props = defineProps(['happeningId'])
  onMounted(()=>{
    loadMore()
  })
  const forwardList = ref([])
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
      const res = await getForwardListApi({
        pageNum:pageNum.value,
        pageSize:pageSize.value,
        happeningId:props.happeningId
      })
      forwardList.value.push(...res.records)
      if(forwardList.value.length >= res.total) isArriveTotal.value = true
    }, 500);
  }
</script>

<template>
  <ul class="news-forward-list">
    <li v-for="(item,index) in forwardList" :key="index" class="forward-item">
      <div class="user-avatar">
        <img v-lazy="item.avatarUrl" alt="">
      </div>
      <div class="user-info">
        <span class="username">{{ item.username }}</span>
        <span class="text">转发了</span>
      </div>
    </li>
  </ul>
  <div class="load-more"
    v-infinite-scroll="loadMore" 
    :infinite-scroll-disabled="busy" 
    infinite-scroll-distance="50"
  >
    <Loading v-show="!isArriveTotal && loading"></Loading>
  </div>
  <div v-if="isArriveTotal" class="forward-list-full">人家是有底线的呢 ~</div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .news-forward-list {
    .forward-item {
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
    .forward-list-empty {
      padding: 20px 0;
      text-align: center;
      font-size: $fontJ;
      color: $colorD;
    }
  }
  .load-more {
    @include flex(center);
  }
  .forward-list-full {
    text-align: center;
    color: $colorD;
    padding: 30px 0 60px 0;
  }
</style>