<script setup>
  import { ref } from 'vue';

  defineProps(['showText'])
  const showMessageList = ref(false)
</script>

<template>
  <div @mouseenter="showMessageList = true" @mouseleave="showMessageList = false" class="header-message">
    <div class="message-icon-box">
      <i class="iconfont icon-xiaoxi jump" :class="{'onlyIcon':!showText}"></i>
      <p v-if="showText">消息</p>
    </div>
    <div v-if="showMessageList" class="message-list-box">
      <ul class="message-list">
        <li class="message-item">回复我的</li>
        <li class="message-item">@我的</li>
        <li class="message-item">收到的赞</li>
        <li class="message-item">系统消息</li>
        <li class="message-item">我的消息</li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .header-message {
    position: relative;
    min-width: 25px;
    margin: 0 7px;
    cursor: pointer;
    .message-icon-box {
      @include flex(center);
      flex-direction: column;
      .onlyIcon {
        line-height: 36px;
        font-size: 24px;
      }
    }
    .message-list-box {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding-top: 10px;
      animation: appear .1s;
      .message-list {
        padding: 8px 0;
        background-color: $colorG;
        box-shadow: 0 0 1px $colorE;
        border-radius: 6px;
        .message-item {
          min-width: 88px;
          padding: 10px 30px 10px 20px;
          text-align: left;
          color: $colorI;
          &:hover {
            background-color: $colorN;
          }
        }
      }
    }
  }
  @keyframes appear {
    from{
      opacity: 0;
      top: 90%;
    } to {
      opacity: 1;
      top: 100%;
    }
  }
</style>