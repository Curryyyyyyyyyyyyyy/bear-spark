<script setup>
  import login from '@/views/login.vue'
  import { ElMessage, ElMessageBox } from 'element-plus';
  import useUser from '@/store/user';
  import { storeToRefs } from 'pinia';
  import { ref} from 'vue';
  import { useRouter } from 'vue-router';
  import { deleteUserInfo } from '@/hooks/handleUserInfo';

  /* Router */
  const router = useRouter()
  const userStore = useUser()
  const {token,userId,username,avatarUrl,fanNumInfo,followerNumInfo,happeningNumInfo,currencyInfo} = storeToRefs(userStore)
  /* Mounted */
  let showLogin = ref(false)
  function openLogin() {
    showLogin.value = true
  }
  function closeLogin() {
    showLogin.value = false
  }
  function toMainInterface() {
    const {href} = router.resolve({
      path:`/mainInterface/${userId.value}`,
    })
    window.open(href, '_blank')
  }
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
  // 防止刷新显示问题
  let pageSmall = ref(false)
  if(window.innerWidth < 1396) {
    pageSmall.value = true
  } else {
    pageSmall.value = false
  }
  window.addEventListener('resize', ()=> {
    if(window.innerWidth < 1396) {
      pageSmall.value = true
    } else {
      pageSmall.value = false
    }
  })
</script>

<template>
  <div class="nav-header">
    <div class="wrapper">
      <div class="nav-left">
        <slot name="nav"></slot>
        <a class="jump">番剧</a>
        <a class="jump">直播</a>
        <a class="jump">游戏中心</a>
        <a class="jump">会员购</a>
        <a class="jump">漫画</a>
        <a class="jump">赛事</a>
        <a class="jump">KPL</a>
        <a v-if="!pageSmall" class="jump">KPL</a>
        <a v-if="!pageSmall" class="jump">KPL</a>
      </div>
      <div class="inp" :class="{'inp-small':pageSmall}">
        <input name="keyword" type="text" placeholder="尚硅谷">
        <span class="icon-search">
          <i class="iconfont icon-search-1-copy"></i>
        </span>
      </div>
      <div class="nav-right">
        <div v-if="!token" class="login right-item">
          <span class="nav-login" @click="openLogin">登录</span>
          <div class="children">
            <div class="login-info">
              <p>登录后你可以：</p>
              <div class="benefits clearfix">
                <div class="item fl">
                  <i class="iconfont icon-HD"></i>
                  <span>免费看高清视频</span>
                </div>
                <div class="item fr">
                  <i class="iconfont icon-lishi"></i>
                  <span>多端同步播放记录</span>
                </div>
              </div>
              <div class="benefits clearfix">
                <div class="item fl">
                  <i class="iconfont icon-fuwenben"></i>
                  <span>发起弹幕/评论</span>
                </div>
                <div class="item fr">
                  <i class="iconfont icon-shipin"></i>
                  <span>热门番剧影视看不停</span>
                </div>
              </div>
              <button class="login-btn" @click="openLogin">立即登录</button>
              <p>首次使用？<span class="register" @click="openLogin">点我注册</span></p>
            </div>
          </div>
        </div>
        <div v-else class="avatar-box right-item">
          <div class="avatar" @click="toMainInterface">
            <img :src="avatarUrl" alt="">
          </div>
          <div class="avatar-children">
            <div class="nickname"  @click="toMainInterface">{{ username }}</div>
            <div class="coins"  @click="toMainInterface">
              功德：<span class="coin-num">{{ currencyInfo.meritNumInfo }}</span>
              硬币：<span class="coin-num">{{ currencyInfo.coinNumInfo }}</span>
            </div>
            <div class="infos">
              <div class="info-item">
                <span class="count">{{ followerNumInfo }}</span>
                <p class="desc">关注</p>
              </div>
              <div class="info-item">
                <span class="count">{{ fanNumInfo }}</span>
                <p class="desc">粉丝</p>
              </div>
              <div class="info-item">
                <span class="count">{{ happeningNumInfo }}</span>
                <p class="desc">动态</p>
              </div>
            </div>
            <div class="vip-info">
              <span class="vip-desc">最后3天 大会员4.6折</span>
              <span class="vip-btn">会员中心</span>
            </div>
            <div class="user-item user-center" @click="toMainInterface">
              <i class="iconfont icon-geren"></i>
              <span>个人中心</span>
              <i class="iconfont icon-xiangyoujiantou"></i>
            </div>
            <div class="user-item sub-manage">
              <i class="iconfont icon-tougaogaojian"></i>
              <span>投稿管理</span>
              <i class="iconfont icon-xiangyoujiantou"></i>
            </div>
            <div class="user-item recommend-service">
              <i class="iconfont icon-tuijian"></i>
              <span>推荐服务</span>
              <i class="iconfont icon-xiangyoujiantou"></i>
            </div>
            <div class="split-line"></div>
            <div class="user-item logout" @click="logout">
              <i class="iconfont icon-tuichu"></i>
              <span>退出登录</span>
            </div>
          </div>
        </div>
        <a class="right-item">
          <i class="iconfont icon-huiyuan jump" :class="{'onlyIcon':pageSmall}"></i>
          <p v-if="!pageSmall">大会员</p>
        </a>
        <a class="right-item">
          <i class="iconfont icon-xiaoxi jump" :class="{'onlyIcon':pageSmall}"></i>
          <p v-if="!pageSmall">消息</p>
        </a>
        <a class="right-item" href="/#/news_index" target="_blank">
          <i class="iconfont icon-dongtai jump" :class="{'onlyIcon':pageSmall}"></i>
          <p v-if="!pageSmall">动态</p>
        </a>
        <a class="right-item">
          <i class="iconfont icon-shoucang jump" :class="{'onlyIcon':pageSmall}"></i>
          <p v-if="!pageSmall">收藏</p>
        </a>
        <a class="right-item">
          <i class="iconfont icon-lishi jump" :class="{'onlyIcon':pageSmall}"></i>
          <p v-if="!pageSmall">历史</p>
        </a>
        <a class="right-item">
          <i class="iconfont icon-chuangzuozhongxin jump" :class="{'onlyIcon':pageSmall}"></i>
          <p v-if="!pageSmall">创作中心</p>
        </a>
        <div class="submit right-item">
          <i class="iconfont icon-shangchuan" :class="{'onlyIcon':pageSmall}"></i>
          <span v-if="!pageSmall">投稿</span>
        </div>
      </div>
    </div>
  </div>
  <login v-if="showLogin" @closeLogin="closeLogin"></login>
</template>

<style lang="scss">
  @use '@/assets/sass/mixin.scss' as *;
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/animation.scss' as *;
  .nav-header {
    min-width: $min-width;
    max-width: $max-width;
    margin: 0 auto;
    // height: 152px;
    padding: 0 15px;
    padding-top: 10px;
    box-sizing: border-box;
    // background-color: transparent;
    .wrapper {
      display: flex;
      justify-content: space-between;
      height: 40px;
      // color: $colorG;
      font-size: $fontJ;
      .iconfont {
        font-size: 14px;
        vertical-align: middle;
      }
      .nav-left {
        @include flex();
        height: 40px;
        line-height: 40px;
        .logo {
          vertical-align: middle;
          @include bgImg(30px,30px,'/imgs/logo.png',50px 50px);
          margin-right:10px;
        }
        a {
          display: inline-block;
          margin-right: 10px;
          cursor: pointer;
          &:first-child:hover {
            .icon-down {
              display: inline-block;
              transform: rotate(180deg);
            }
          }
          &:last-child {
            margin: 0;
          }
        }
        .icon-shouye {
          font-size: $fontC;
          vertical-align: middle;
        }
        .icon-down {
          font-size: $fontH;
          transition: all .3s;
        }
      }
      .inp {
        position: relative;
        width: 420px;
        // height:34px;
        padding: 0 5px;
        box-sizing: border-box;
        background-color: $colorJ;
        border: 1px solid $colorL;
        border-radius: 5px;
        &:hover {
          background-color: $colorG;
        }
        input {
          border:none;
          width: 85%;
          height: 40px;
          padding: 3px 5px;
          border-radius: 5px;
          background-color: transparent;
          box-sizing: border-box;
          margin-right: 10px;
          // &:focus {
          //   background-color: $colorG;
          // }
        }
        .icon-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-block;
          width: 30px;
          height: 20px;
          line-height: 20px;
          border-radius: 5px;
          text-align: center;
          vertical-align: middle;
          color: $colorI;
          &:hover {
            background-color: $colorL;
            cursor: pointer;
          }
        }
      }
      .inp-small {
        width: 300px;
      }
      .nav-right {
        display: flex;
        justify-content: right;
        .right-item {
          min-width: 25px;
          margin: 0 7px;
          text-align: center;
          cursor: pointer;
          .iconfont {
            display: inline-block;
            font-size: $fontH;
          }
          &:visited{
            color: inherit;
          }
          .onlyIcon {
            line-height: 36px;
            font-size: 24px;
            margin-left: 10px;
            &.icon-shangchuan {
              margin: 0;
            }
          }
        }
        .login {
          position: relative;
          .nav-login {
            display: inline-block;
            height: 40px;
            line-height: 40px;
            width: 40px;
            text-align: center;
            border-radius: 20px;
            background-color: $colorM;
            cursor: pointer;
          }
          &:hover {
            .children {
              display: block;
            }
          }
          .children {
            z-index: 2;
            display: none;
            width: 280px;
            position: absolute;
            left: -125px;
            top: 40px;
            padding-top: 12px;
            .login-info {
              padding: 10px;
              box-sizing: border-box;
              border-radius: 5px;
              background-color: $colorG;
              box-shadow: 0 0 5px $colorF;
              color: $colorI;
              font-size: $fontK;
              p:first-child {
                text-align: left;
                margin-bottom: 10px;
              }
              .benefits {
                margin-bottom: 10px;
                .item {
                  width: 130px;
                  text-align: left;
                  .iconfont {
                    color: $colorM;
                    font-size: 12px;
                    vertical-align: middle;
                    margin-right: 3px;
                  }
                  .icon-HD {
                    font-size: 20px;
                  }
                  .icon-lishi {
                    font-size: 16px;
                  }
                  .icon-fuwenben {
                    font-size: 16px;
                    margin-left: 2px;
                  }
                }
              }
              .login-btn {
                width: 250px;
                height: 30px;
                background-color: $colorM;
                color: $colorG;
                border: none;
                border-radius: 5px;
                margin-bottom: 10px;
                cursor: pointer;
                &:hover {
                  background-color: $colorP;
                }
              }
              .register {
                color: $colorM;
                cursor: pointer;
              }
            }
          }
        }
        .avatar-box {
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
            position: relative;
            z-index: 1;
            height: 36px;
            line-height: 36px;
            width: 36px;
            border-radius: 18px;
            cursor: pointer;
            background-size: 36px 36px;
            transition: all .3s;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .avatar-children {
            display: none;
            height: 336px;
            width: 216px;
            position: absolute;
            top: 58px;
            left: -112px;
            padding: 0 20px;
            padding-top: 40px;
            box-sizing: border-box;
            border-radius: 5px;
            background-color: $colorG;
            box-shadow: 0 0 5px $colorF;
            color:$colorI;
            .nickname {
              cursor: pointer;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .coins {
              font-size: $fontL;
              color: $colorD;
              margin-bottom: 10px;
              cursor: pointer;
              .coin-num {
                color: $colorI;
                margin-right: 5px
              }
            }
            .infos {
              @include flex();
              margin-bottom: 10px;
              .info-item {
                flex: 1;
                cursor: pointer;
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
              position: relative;
              height: 25px;
              line-height: 25px;
              padding: 0 5px;
              box-sizing: border-box;
              margin-bottom: 10px;
              text-align: left;
              font-size: $fontK;
              color: $colorB;
              border-radius: 5px;
              cursor: pointer;
              &:hover {
                background-color: $colorN;
              }
              span {
                margin-left: 10px;
              }
              .icon-xiangyoujiantou {
                position: absolute;
                right: 0;
                font-size: $fontH;
                vertical-align: middle;
              }
              .icon-tougaogaojian {
                font-size: $fontI;
              }
            }
            .split-line {
              height: 1px;
              background-color: $colorF;
              margin-bottom: 10px;
            }
          }
        }
        .submit {
          // width: 80px;
          height: 35px;
          line-height: 35px;
          padding: 0 10px;
          border-radius: 15px;
          background-color: $colorA;
          span {
            margin-left: 6px;
          }
          &:hover {
            cursor: pointer;
            background-color: #f987a7;
          }
        }
      }
    }
  }
  .jump:hover {
    animation: jump .4s;
  }
  @keyframes jump {
    0% {
      transform: translateY(0);
    } 50% {
      transform: translateY(-6px);
    } 100% {
      transform: translateY(0);
    }
  }
</style>
