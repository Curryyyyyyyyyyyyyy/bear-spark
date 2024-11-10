<script setup>
import { useRoute } from 'vue-router';

  const route = useRoute()
  const userId = route.params.userId
  console.log(userId)
</script>

<template>
  <div class="main-interface">
    <div class="container">main-interface</div>
  </div>
</template>

<style lang="scss">
  @use '../assets/sass/config.scss' as *;
  // .main-interface {
    
  // }
</style>