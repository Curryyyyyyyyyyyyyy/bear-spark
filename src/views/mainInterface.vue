<script setup>
import NavHeader from '@/components/nav-header/NavHeader.vue';
</script>

<template>
  <div class="main-interface">
    <div class="header">
      <div class="background"></div>
      <div class="bg-shadow">
        <div class="top"></div>
        <div class="bottom"></div>
      </div>
      <nav-header>
        <template v-slot:nav>
          <a href="/#/index">
            <span class="logo"></span>
            <span>首页</span>
            <i class="iconfont icon-down"></i>
          </a>
        </template>
      </nav-header>
      <div class="header-user-info">
        <div class="user-box">
          <div class="avatar-box">
            <img src="/imgs/default-avatar.png" alt="">
          </div>
          <div class="username-box">
            <span>curryyyyy</span>
          </div>
        </div>
        <div class="perspective-box">
          <span>视角：我自己</span>
          <i class="iconfont icon-down"></i>
        </div>
      </div>
    </div>
    
  </div>
</template>

<style lang="scss">
  @use '../assets/sass/config.scss' as *;
  @use '../assets/sass/mixin.scss' as *;
  .main-interface {
    .header {
      position: relative;
      height: 200px;
      padding-bottom: 10px;
      box-sizing: border-box;
      box-shadow: 0 5px 5px $colorF;
      .background {
        z-index: 1;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: url('/imgs/homepage-background.jpeg') no-repeat;
        background-size: cover;
        background-position: center top;
      }
      .bg-shadow {
        z-index: 1;
        position: absolute;
        height: 100%;
        width: 100%;
        .top {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 106px;
          background: linear-gradient(180deg, rgba(0, 0, 0, .7) 0%, rgba(0, 0, 0, 0) 100%);
        }
        .bottom {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 117px;
          background: linear-gradient(180deg, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);
        }
      }
      .nav-header{
        width: 100%;
        background-color: transparent;
        .submit,.login,a {
          color: $colorG;
        }
      }
      .header-user-info {
        z-index: 1;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        @include flex();
        padding: 0 60px 24px;
        .user-box {
          @include flex(left);
          .avatar-box {
            margin-right: 10px;
            img {
              width: 64px;
              height: 64px;
              border-radius: 32px;
            }
          }
          .username-box {
            font-size: $fontH;
            color: $colorG;
          }
        }
        .perspective-box {
          @include flex(center);
          height: 34px;
          width: 150px;
          border: 1px solid rgba(255, 255, 255, .2);
          border-radius: 6px;
          background-color: rgba(255, 255, 255, .14);
          color: $colorG;
          cursor: pointer;
          &:hover {
            background-color: rgba(255, 255, 255, .2);
          }
        }
      }
    }
  }
  @media (min-width:1560px) {
    .main-interface {
      .header {
        .header-user-info {
          padding: 0 140px 24px;
        }
      }
    }
  }
  @media (min-width:2060px) {
    .main-interface {
      .header {
        .header-user-info {
          padding: 0 140px 24px;
          margin: 0 150px;
        }
      }
    }
  }
</style>