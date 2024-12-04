<script setup>
  defineProps(['sideBarUrl','recentTagList'])
</script>

<template>
  <div class="news-aside-box">
    <div class="aside-banner">
      <img :src="sideBarUrl" alt="">
    </div>
    <div class="aside-tags">
      <h2>标签</h2>
      <ul class="tag-list">
        <li class="tag-item" v-for="(item,index) in recentTagList" :key="index">
          <i class="iconfont icon-huati"></i>
          <div class="tag-item-title">{{ item.content }}</div>
          <span class="tag-item-stat">{{ item.viewNumInfo }}浏览&middot;{{ item.discussNumInfo }}讨论</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .news-aside-box {
    width: 25%;
    .aside-banner {
      width: 100%;
      height: 200px;
      background-color: $colorG;
      border-radius: 6px;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 6px
      }
    }
    .aside-tags {
      position: sticky;
      top: 76px;
      width: 100%;
      padding: 20px 5px 5px 5px;
      box-sizing: border-box;
      border-radius: 6px;
      background-color: $colorG;
      h2 {
        padding: 10px;
      }
      .tag-list {
        .tag-item {
          position: relative;
          width: 100%;
          height: 50px;
          padding: 5px 30px;
          box-sizing: border-box;
          border-radius: 6px;
          margin-bottom: 10px;
          cursor: pointer;
          &:hover {
            background-color: $colorN;
          }
          .icon-huati {
            position: absolute;
            left: 10px;
            top: 6px;
            font-size: $fontH;
            color: $colorM;
          }
          .tag-item-title {
            font-size: $fontJ;
            color: $colorB;
            font-weight: 500;
            margin-bottom: 4px;
            &:hover {
              color: $colorM;
            }
          }
          .tag-item-stat {
            color: $colorD;
          }
        }
      }
    }
  }
</style>