<script setup>
  const props = defineProps(['avatarUrl','username','fansNum'])
  const emits = defineEmits(['selectAtUser'])
  function selectAtUser() {
    emits('selectAtUser', props.username)
  }
</script>

<template>
  <li class="bs-at-li" @click="selectAtUser">
    <div class="bs-at-item-avatar">
      <img :src="props.avatarUrl" alt="">
    </div>
    <div class="bs-at-item-info">
      <p class="info-username">{{ props.username }}</p>
      <p class="info-stat">{{ props.fansNum }}粉丝</p>
    </div>
  </li>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  .bs-at-li {
    display: flex;
    padding: 5px 10px;
    cursor: pointer;
    &:hover {
      background-color: $colorR;
    }
    .bs-at-item-avatar {
      margin-right: 5px;
      img {
        height: 40px;
        width: 40px;
        border-radius: 20px;
        vertical-align: middle;
      }
    }
    .bs-at-item-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 2px 0;
      box-sizing: border-box;
      .info-username {
        color: $colorB;
        font-weight: 500;
      }
      .info-stat {
        color: $colorD;
      }
    }
  }
</style>