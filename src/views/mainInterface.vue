<script setup>
import NavHeader from '../components/NavHeader.vue';
</script>

<template>
  <div class="main-interface">
    <div class="header">
      <nav-header>
        <template v-slot:nav>
          <a>
            <span class="logo"></span>
            <span>首页</span>
            <i class="iconfont icon-down"></i>
          </a>
        </template>
      </nav-header>
    </div>
    <div class="container">
      111
    </div>
  </div>
</template>

<style lang="scss">
  @use '../assets/sass/config.scss' as *;
  .main-interface {
    .header {
      height: 64px;
      margin-top: 10px;
      padding-bottom: 10px;
      box-sizing: border-box;
      background-color: $colorG;
      box-shadow: 0 5px 5px $colorF;
      .nav-header{
        color: $colorI;
        background-color: $colorG;
        .submit,.login {
          color: $colorG;
        }
      }
    }
    .container {
      background-color: pink;
    }
  }
</style>