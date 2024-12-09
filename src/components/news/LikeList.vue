<script setup>
  defineProps(['likeInfoList'])
</script>

<template>
  <ul class="news-like-list">
    <li v-for="(item,index) in likeInfoList" :key="index" class="like-item">
      <div class="user-avatar">
        <img v-lazy="item.avatarUrl" alt="">
      </div>
      <div class="user-info">
        <span class="username">{{ item.username }}</span>
        <span class="text">点赞了</span>
      </div>
    </li>
    <div class="like-list-empty">人家是有底线的呢 ~</div>
  </ul>
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
</style>