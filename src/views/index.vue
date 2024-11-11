<script setup>
  import NavHeader from '../components/NavHeader.vue';
  import login from './login.vue';
  import { ref } from 'vue';

  let showLogin =  ref(false)
  let fixedHeader = ref(false)
  function closeLogin(){
    showLogin.value = false
  }
  function openLogin(){
    showLogin.value = true
  }
</script>

<template>
  <div class="index-header">
    <nav-header @openLogin="openLogin">
      <template v-slot:nav>
        <a>
          <i v-if="fixedHeader" class="iconfont icon-shouye"></i>
          <span>首页</span>
          <i v-if="!fixedHeader" class="iconfont icon-down"></i>
        </a>
      </template>
    </nav-header>
  </div>
  <login v-if="showLogin" @closeLogin="closeLogin"></login>
</template>

<style lang="scss">
  @use '../assets/sass/config.scss' as *;
  .index-header {
    height: 152px;
    background-color: pink;
    color: $colorG;
  }
  .container {
    height: 50px;
  }
</style>