<script setup>
  import { storeToRefs } from 'pinia';
  import useUser from '@/store/user.js'
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { useRouter } from 'vue-router';
  import { deleteUserInfo } from '@/hooks/handleUserInfo';
  
  const router = useRouter()
  const userStore = useUser()
  const {token,userId,username,avatarUrl,fanNumInfo,followerNumInfo,happeningNumInfo,currencyInfo} = storeToRefs(userStore)
  function logout() {
    ElMessageBox.confirm('您确定退出登录吗？','温馨提示',{
      confirmButtonText:'确定',
      cancelButtonText:'取消',
      type:'warning'      
    }).then(()=>{
      ElMessage({
        type:'success',
        message:'退出成功',
        duration:1000
      })
      token.value = ''
      deleteUserInfo()
      router.replace('/index')
    })
  }
</script>

<template>
  <div class="header-avatar">
    <a class="avatar" :href="`/#/mainInterface/${userId}`" target="_blank">
      <img :src="avatarUrl" alt="">
    </a>
    <div class="avatar-children">
      <div class="nickname-box">
        <a class="nickname" :href="`/#/mainInterface/${userId}`" target="_blank">{{ username }}</a>
      </div>
      <a class="coins" :href="`/#/mainInterface/${userId}`" target="_blank">
        <span class="coin-item">功德：<span class="coin-num">{{ currencyInfo.meritNumInfo }}</span></span>
        <span class="merit-item">硬币：<span class="merit-num">{{ currencyInfo.coinNumInfo }}</span></span>
      </a>
      <div class="infos">
        <a class="info-item" :href="`/#/mainInterface/${userId}`" target="_blank">
          <span class="count">{{ followerNumInfo }}</span>
          <p class="desc">关注</p>
        </a>
        <a class="info-item fans-item" :href="`/#/mainInterface/${userId}`" target="_blank">
          <span class="count">{{ fanNumInfo }}</span>
          <p class="desc">粉丝</p>
        </a>
        <a class="info-item" :href="`/#/mainInterface/${userId}`" target="_blank">
          <span class="count">{{ happeningNumInfo }}</span>
          <p class="desc">动态</p>
        </a>
      </div>
      <div class="vip-info">
        <span class="vip-desc">最后3天 大会员4.6折</span>
        <span class="vip-btn">会员中心</span>
      </div>
      <a class="user-item user-center" :href="`/#/mainInterface/${userId}`" target="_blank">
        <div class="user-item-wrap">
          <i class="iconfont icon-geren"></i>
          <span>个人中心</span>
        </div>
        <i class="iconfont icon-xiangyoujiantou"></i>
      </a>
      <div class="user-item sub-manage">
        <div class="user-item-wrap">
          <i class="iconfont icon-tougaogaojian"></i>
          <span>投稿管理</span>
        </div>
        <i class="iconfont icon-xiangyoujiantou"></i>
      </div>
      <div class="user-item recommend-service">
        <div class="user-item-wrap">
          <i class="iconfont icon-tuijian"></i>
          <span>推荐服务</span>
        </div>
        <i class="iconfont icon-xiangyoujiantou"></i>
      </div>
      <div class="split-line"></div>
      <div class="user-item logout" @click="logout">
        <div class="user-item-wrap">
          <i class="iconfont icon-tuichu"></i>
          <span>退出登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .header-avatar {
    position: relative;
    &:hover {
      .avatar {
        transform: translate(-50%,100%) scale(1.5);
      }
      .avatar-children {
        display: block;
      }
    }
    .avatar {
      display: inline-block;
      position: relative;
      z-index: 1;
      cursor: pointer;
      transition: all .3s;
      img {
        width: 36px;
        height: 36px;
        border-radius: 18px;
      }
    }
    .avatar-children {
      display: none;
      width: 216px;
      position: absolute;
      top: 58px;
      padding: 0 20px;
      padding-top: 30px;
      box-sizing: border-box;
      border-radius: 5px;
      background-color: $colorG;
      box-shadow: 0 0 1px $colorE;
      color:$colorI;
      transform: translateX(-50%);
      .nickname-box {
        @include flex(center);
        .nickname {
          cursor: pointer;
          font-weight: bold;
          margin-bottom: 10px;
          color: $colorI;
        }
      }
      .coins {
        @include flex(center);
        font-size: $fontL;
        color: $colorD;
        margin-bottom: 10px;
        cursor: pointer;
        .coin-num,.merit-num {
          color: $colorI;
        }
        .coin-item {
          margin-right: 5px
        }
        .merit-item {
          margin-left: 5px;
        }
      }
      .infos {
        @include flex(center);
        margin-bottom: 10px;
        .info-item {
          cursor: pointer;
          text-align: center;
          color: $colorI;
          &.fans-item {
            margin: 0 32px;
          }
          &:hover {
            color: $colorM;
          }
          .desc {
            color: $colorD;
            font-size: $fontL;
          }
        }
      }
      .vip-info {
        width: 176px;
        height: 50px;
        line-height: 50px;
        background-color: $colorO;
        color: $colorA;
        font-size: $fontL;
        text-align: left;
        padding: 0 8px;
        border-radius: 5px;
        box-sizing: border-box;
        margin-bottom: 10px;
        .vip-desc {
          font-weight: bold;
        }
        .vip-btn {
          display: inline-block;
          height: 24px;
          line-height: 24px;
          width: 50px;
          text-align: center;
          border-radius: 6px;
          margin-left: 15px;
          background-color: $colorG;
          cursor: pointer;
        }
      }
      .user-item {
        @include flex();
        height: 25px;
        padding: 0 5px;
        box-sizing: border-box;
        margin-bottom: 10px;
        font-size: $fontK;
        color: $colorB;
        border-radius: 5px;
        cursor: pointer;
        &.user-center {
          display: block;
          @include flex();
        }
        &:hover {
          background-color: $colorN;
        }
        span {
          margin-left: 10px;
        }
        .icon-xiangyoujiantou {
          font-size: $fontH;
        }
      }
      .split-line {
        height: 1px;
        background-color: $colorF;
        margin-bottom: 10px;
      }
    }
  }
</style>