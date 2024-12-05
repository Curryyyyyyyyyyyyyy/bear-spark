<script setup>
  import router from '@/router';
  import {updateUserInfo} from '@/hooks/handleUserInfo';
  import useUser from '@/store/user';
  import { storeToRefs } from 'pinia';
  const userStore = useUser()
  updateUserInfo()
  const {avatarUrl,username,followerNumInfo,fanNumInfo,happeningNumInfo} = storeToRefs(userStore)
</script>

<template>
  <div class="news-user-box">
    <img @click="router.push('/mainInterface')" :src="avatarUrl" alt="头像">
    <span @click="router.push('/mainInterface')" class="username">{{ username }}</span>
    <div class="infos">
      <div @click="router.push('/mainInterface')" class="info-box">
        <p class="num">{{ followerNumInfo }}</p>
        <p class="desc">关注</p>
      </div>
      <div @click="router.push('/mainInterface')" class="info-box">
        <p class="num">{{ fanNumInfo }}</p>
        <p class="desc">粉丝</p>
      </div>
      <div @click="router.push('/mainInterface')" class="info-box">
        <p class="num">{{ happeningNumInfo }}</p>
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