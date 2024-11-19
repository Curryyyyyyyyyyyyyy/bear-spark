<script setup>
  import login from '@/views/login.vue'
  import { ElMessage, ElMessageBox } from 'element-plus';
  import useUser from '../store/user';
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  const router = useRouter()
  const userStore = useUser()
  const {token} = storeToRefs(userStore)

  let showLogin = ref(false)
  function openLogin() {
    showLogin.value = true
  }
  function closeLogin() {
    showLogin.value = false
  }
  function toMainInterface() {
    const {href} = router.resolve({
      path:`/mainInterface`,
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
    })
  }
  function toNews() {
    router.push('/news')
  }
  // 防止刷新显示问题
  let showWord = ref(true)
  if(window.innerWidth < 1396) {
    showWord.value = false
  } else {
    showWord.value = true
  }
  window.addEventListener('resize', ()=> {
    if(window.innerWidth < 1396) {
      showWord.value = false
    } else {
      showWord.value = true
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
        <a><i class="iconfont icon-xiazai"></i>下载客户端</a>
      </div>
      <div class="inp" :class="{'inp-small':!showWord}">
        <input name="keyword" type="text" placeholder="尚硅谷">
        <span class="icon-search">
          <i class="iconfont icon-search-1-copy"></i>
        </span>
      </div>
      <div class="nav-right">
        <div v-if="!token" class="login right-item">
          <span class="nav-login" @click="openLogin">登录</span>
          <div class="mask"></div>
          <div class="children">
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
        <div v-else class="avatar-box right-item">
          <div class="avatar"  @click="toMainInterface"></div>
          <div class="avatar-children">
            <div class="nickname"  @click="toMainInterface">curyyyyyyyyyy</div>
            <div class="coins"  @click="toMainInterface">
              功德：<span class="coin-num">1</span>
              硬币：<span class="coin-num">164</span>
            </div>
            <div class="infos">
              <div class="info-item">
                <span class="count">222</span>
                <p class="desc">关注</p>
              </div>
              <div class="info-item">
                <span class="count">1</span>
                <p class="desc">粉丝</p>
              </div>
              <div class="info-item">
                <span class="count">1</span>
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
        <div class="right-item">
          <i class="iconfont icon-huiyuan" :class="{'onlyIcon':!showWord}"></i>
          <p v-if="showWord">大会员</p>
        </div>
        <div class="right-item">
          <i class="iconfont icon-xiaoxi" :class="{'onlyIcon':!showWord}"></i>
          <p v-if="showWord">消息</p>
        </div>
        <div class="right-item"  @click="toNews">
          <i class="iconfont icon-dongtai" :class="{'onlyIcon':!showWord}"></i>
          <p v-if="showWord">动态</p>
        </div>
        <div class="right-item">
          <i class="iconfont icon-shoucang" :class="{'onlyIcon':!showWord}"></i>
          <p v-if="showWord">收藏</p>
        </div>
        <div class="right-item">
          <i class="iconfont icon-lishi" :class="{'onlyIcon':!showWord}"></i>
          <p v-if="showWord">历史</p>
        </div>
        <div class="right-item">
          <i class="iconfont icon-chuangzuozhongxin" :class="{'onlyIcon':!showWord}"></i>
          <p v-if="showWord">创作中心</p>
        </div>
        <div class="submit right-item">
          <i class="iconfont icon-shangchuan" :class="{'onlyIcon':!showWord}"></i>
          <span v-if="showWord">投稿</span>
        </div>
      </div>
    </div>
  </div>
  <login v-if="showLogin" @closeLogin="closeLogin"></login>
</template>

<style lang="scss">
  @use '../assets/sass/mixin.scss' as *;
  @use '../assets/sass/config.scss' as *;
  @use '../assets/sass/animation.scss' as *;
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
        flex: 1.3;
        height: 40px;
        line-height: 40px;
        .logo {
          height: 40px;
          width: 40px;
          vertical-align: middle;
          @include bgImg(40px,40px,'/imgs/logo.png',80px 80px);
          margin-right:10px;
        }
        a {
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
          font-size: $fontH;
        }
        .icon-down {
          font-size: $fontH;
          transition: all .3s;
        }
      }
      .inp {
        position: relative;
        flex: 1;
        width: 350px;
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
        flex: 0.7 !important;
      }
      .nav-right {
        flex: 1;
        display: flex;
        justify-content: right;
        .right-item {
          margin-left: 2.5%;
          text-align: center;
          cursor: pointer;
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
          .mask {
            height: 20px;
            width: 36px;
          }
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
            top: 50px;
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
            background: url('/imgs/default-avatar.png') no-repeat;
            background-size: 36px 36px;
            transition: all .3s;
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
            margin-left: 10px;
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
    animation: jump .5s;
  }
</style>
