<script setup>
  import NavHeader from '../components/NavHeader.vue';
  import login from './login.vue';
  import { ref } from 'vue';

  let showLogin =  ref(false)
  function closeLogin(){
    showLogin.value = false
  }
  function openLogin(){
    showLogin.value = true
  }
</script>

<template>
  <nav-header @openLogin="openLogin"></nav-header>
  <login v-if="showLogin" @closeLogin="closeLogin"></login>
</template>

<style>

</style>