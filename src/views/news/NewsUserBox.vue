<script setup>
  import router from '@/router';
  import {getUserInfoApi} from '@/api/user.js'
  import { onMounted, ref } from 'vue';

  const userInfo = ref({})
  onMounted(async () => {
    /* 获取用户信息 */
    userInfo.value = await getUserInfoApi()
    // userInfo.value = {
    //   username:'curryyyyyyyyy',
    //   avatarUrl:'/imgs/default-avatar.png',
    //   fanNumInfo:0,
    //   followerNumInfo:0,
    //   happeningNumInfo:0
    // }
  })
</script>

<template>
  <div class="news-user-box">
    <img @click="router.push('/mainInterface')" :src="userInfo.avatarUrl" alt="头像">
    <span @click="router.push('/mainInterface')" class="username">{{ userInfo.username }}</span>
    <div class="infos">
      <div @click="router.push('/mainInterface')" class="info-box">
        <p class="num">{{ userInfo.followerNumInfo }}</p>
        <p class="desc">关注</p>
      </div>
      <div @click="router.push('/mainInterface')" class="info-box">
        <p class="num">{{ userInfo.fanNumInfo }}</p>
        <p class="desc">粉丝</p>
      </div>
      <div @click="router.push('/mainInterface')" class="info-box">
        <p class="num">{{ userInfo.happeningNumInfo }}</p>
        <p class="desc">动态</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .news-user-box {
    position: sticky;
    top: 74px;
    width: 22%;
    height: 140px;
    padding: 20px;
    box-sizing: border-box;
    background-color: $colorG;
    border-radius: 5px;
    img {
      height: 50px;
      width: 50px;
      border-radius: 25px;
      margin-right: 20px;
      cursor: pointer;
      vertical-align: middle;
    }
    .username {
      font-size: $fontJ;
      font-weight: bold;
      cursor: pointer;
      &:hover {
        color: $colorM;
      }
    }
    .infos {
      @include flex();
      text-align: center;
      margin-top: 15px;
      font-size: $fontJ;
      .info-box {
        cursor: pointer;
        .num {
          color: $colorB;
          font-weight: bold;
        }
        .desc {
          color: $colorD;
        }
      }
    }
  }
</style>