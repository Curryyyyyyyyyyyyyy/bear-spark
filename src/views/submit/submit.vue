<script setup>
  import HeaderAvatar from '@/components/nav-header/HeaderAvatar.vue'
  import HeaderMessage from '@/components/nav-header/HeaderMessage.vue'
</script>

<template>
  <div class="bs-submit">
    <div class="bs-submit-header">
      <a href="/#/index" class="logo-box">
        <img src="/imgs/logo.png" alt="logo">
        <span class="text">创作中心</span>
      </a>
      <div class="right-wrapper">
        <a class="avatar-box">
          <header-avatar></header-avatar>
        </a>
        <div class="message-box">
          <header-message></header-message>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .bs-submit {
    height: 100%;
    .bs-submit-header {
      z-index: 100;
      position: sticky;
      top: 0;
      @include flex();
      padding: 0 60px 0 24px;
      background-color: $colorG;
      box-shadow: 0 1px 10px $colorF;
      .logo-box {
        @include flex();
        img {
          height: 60px;
          width: 60px;
        }
        .text {
          font-weight: bold;
          font-size: $fontG;
          font-family:Georgia, 'Times New Roman', Times, serif;
          color: #00a1d6;
        }
      }
      .right-wrapper {
        @include flex();
        .avatar-box {
          margin-right: 40px;
          img {
            height: 36px;
            width: 36px;
            border-radius: 18px;
          }
        }
        .message-box {
          margin-right: 15px;
        }
      }
    }
  }
</style>