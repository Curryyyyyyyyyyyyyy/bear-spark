<script setup>
  defineProps(['forwardInfoList'])
</script>

<template>
  <ul class="news-forward-list">
    <li v-for="(item,index) in forwardInfoList" :key="index" class="forward-item">
      <div class="user-avatar">
        <img v-lazy="item.avatarUrl" alt="">
      </div>
      <div class="user-info">
        <span class="username">{{ item.username }}</span>
        <span class="text">转发了</span>
      </div>
    </li>
    <div class="forward-list-empty">人家是有底线的呢 ~</div>
  </ul>
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
</style>