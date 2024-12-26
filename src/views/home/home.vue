<script setup>
  import NavHeader from '@/components/nav-header/NavHeader.vue';
  import { onBeforeUpdate, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  /* route */
  const route = useRoute()
  /* onMounted */
  const userId = ref('')
  onMounted(() => {
    userId.value = route.params.userId
  })
  /* onBeforeRouteUpdate */
  const tabLeft = ref('0px')
  onBeforeUpdate(()=>{
    switch(route.name) {
      case 'home_index':
        tabLeft.value = '0px'
        break
      case 'home_news':
        tabLeft.value = '70px'
        break
      case 'home_article':
        tabLeft.value = '140px'
        break
      case 'home_video':
        tabLeft.value = '210px'
        break
      case 'home_collect':
        tabLeft.value = '280px'
        break
      case 'home_mine':
        tabLeft.value = '350px'
        break
    }
  })

  //#region 视角
  const showPerspectives = ref(false)
  //#endregion
</script>

<template>
  <div class="home-page">
    <div class="home-page-header">
      <div class="background"></div>
      <div class="bg-shadow">
        <div class="top"></div>
        <div class="bottom"></div>
      </div>
      <nav-header>
        <template v-slot:nav>
          <a class="header-index" href="/#/index">
            <span class="logo"></span>
            <span>首页</span>
            <i class="iconfont icon-down"></i>
          </a>
        </template>
      </nav-header>
      <div class="header-user-info">
        <div class="user-box">
          <div class="avatar-box">
            <img src="/imgs/default-avatar.png" alt="">
            <div v-if="true" class="replace-box">更换头像</div>
          </div>
          <div class="username-box">
            <span>curryyyyy</span>
          </div>
        </div>
        <div class="tool-box">
          <div v-if="true" @click="showPerspectives = !showPerspectives" tabindex="0" @blur="showPerspectives = false" class="tool-item perspective">
            <span>视角：我自己</span>
            <i class="iconfont icon-down"></i>
            <div v-if="showPerspectives" class="perspective-box">
              <div class="perspectives">
                <div class="perspective-item">我的粉丝</div>
                <div class="perspective-item">新访客</div>
              </div>
            </div>
          </div>
          <div v-if="false" class="tool-item follow-status active">
            <div v-if="false" class="follow-status-item followed">
              <i class="iconfont icon-yiguanzhu"></i>
              <span class="follow-status-text">已关注</span>
            </div>
            <div v-else class="follow-status-item unfollowed">
              <i class="iconfont icon-jiahao"></i>
              <span class="follow-status-text">关注</span>
            </div>
          </div>
          <div v-if="false" class="tool-item send-message">
            <span>发消息</span>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-bar">
      <div class="nav-bar-wrapper">
        <div class="nav-bar-left">
          <div class="nav-tab">
            <a :href="`/#/home/${userId}`" class="nav-tab-item">
              <i class="iconfont icon-zhuye"></i>
              <span class="nav-tab-item-text">主页</span>
            </a>
            <a :href="`/#/home/${userId}/news`" class="nav-tab-item">
              <i class="iconfont icon-dongtai2"></i>
              <span class="nav-tab-item-text">动态</span>
            </a>
            <a :href="`/#/home/${userId}/article`" class="nav-tab-item">
              <i class="iconfont icon-tougao"></i>
              <span class="nav-tab-item-text">专栏</span>
            </a>
            <a :href="`/#/home/${userId}/video`" class="nav-tab-item">
              <i class="iconfont icon-shipin1"></i>
              <span class="nav-tab-item-text">视频</span>
            </a>
            <a :href="`/#/home/${userId}/collect`" class="nav-tab-item">
              <i class="iconfont icon-shoucang1"></i>
              <span class="nav-tab-item-text">收藏</span>
            </a>
            <a :href="`/#/home/${userId}/mine`" class="nav-tab-item">
              <i class="iconfont icon-geren"></i>
              <span class="nav-tab-item-text">我的</span>
            </a>
            <div class="nav-tab-cursor" :style="{left:tabLeft}"></div>
          </div>
        </div>
        <div class="nav-bar-right">
          <div class="stats">
            <div class="stat-item">
              <div class="stat-item-text">关注数</div>
              <div class="stat-item-num">14</div>
            </div>
            <div class="stat-item">
              <div class="stat-item-text">粉丝数</div>
              <div class="stat-item-num">14</div>
            </div>
            <div class="stat-item">
              <div class="stat-item-text">动态数</div>
              <div class="stat-item-num">14</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- todo -->
    <main class="home-page-main">
      <div class="space-home">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .home-page {
    .home-page-header {
      position: relative;
      height: 200px;
      padding-bottom: 10px;
      box-sizing: border-box;
      box-shadow: 0 5px 5px $colorF;
      .background {
        z-index: 1;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: url('/imgs/homepage-background.jpeg') no-repeat;
        background-size: cover;
        background-position: center top;
      }
      .bg-shadow {
        z-index: 1;
        position: absolute;
        height: 100%;
        width: 100%;
        .top {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 106px;
          background: linear-gradient(180deg, rgba(0, 0, 0, .7) 0%, rgba(0, 0, 0, 0) 100%);
        }
        .bottom {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 117px;
          background: linear-gradient(180deg, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);
        }
      }
      .nav-header{
        width: 100%;
        background-color: transparent;
        .submit,.login,.header-index,.left-item,.right-item {
          color: $colorG;
        }
      }
      .header-user-info {
        z-index: 1;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        @include flex();
        padding: 0 60px 24px;
        .user-box {
          @include flex(left);
          .avatar-box {
            position: relative;
            margin-right: 10px;
            cursor: pointer;
            img {
              width: 64px;
              height: 64px;
              border-radius: 32px;
              border: 2px solid rgba(255,255,255,.5);
            }
            .replace-box {
              position: absolute;
              top: 0;
              height: 64px;
              line-height: 64px;
              width: 64px;
              border: 2px solid rgba(255,255,255,.5);
              text-align: center;
              border-radius: 32px;
              font-size: $fontJ;
              color: $colorG;
              background-color: rgba(0, 0, 0, .5);
              opacity: 0;
              transition: opacity .3s;
              &:hover {
                opacity: 1;
              }
            }
          }
          .username-box {
            cursor: pointer;
          }
          .username-box {
            font-size: $fontH;
            color: $colorG;
          }
        }
        .tool-box {
          @include flex();
          .tool-item {
            @include flex(center);
            position: relative;
            height: 34px;
            width: 150px;
            border: 1px solid rgba(255, 255, 255, .2);
            margin-left: 10px;
            border-radius: 6px;
            background-color: rgba(255, 255, 255, .14);
            color: $colorG;
            cursor: pointer;
            transition: background-color .3s;
            &:hover {
              background-color: rgba(255, 255, 255, .2);
            }
            &.active {
              background-color: rgb(38, 141, 237);
              color: $colorG;
              &:hover {
                background-color: rgb(60, 170, 243);
              }
            }
            &.perspective {
              .perspective-box {
                position: absolute;
                top: calc(100% + 10px);
                .perspectives {
                  padding: 10px 0;
                  background-color: $colorG;
                  border: 1px solid $colorF;
                  border-radius: 6px;
                  .perspective-item {
                    padding: 8px 30px;
                    color: $colorC;
                    &:hover {
                      background-color: $colorN;
                    }
                  }
                }
              }
            }
            &.send-message {
              font-size: $fontJ;
            }
            .follow-status-item {
              &.unfollowed {
                .icon-jiahao {
                  font-size: $fontK;
                }
              }
              .follow-status-text {
                margin-left: 8px;
                font-size: $fontJ;
              }
            }
          }
        }
      }
    }
    .nav-bar {
      border-bottom: 1px solid rgba(0, 0, 0, .05);
      background-color: $colorG;
      .nav-bar-wrapper {
        @include flex();
        height: 64px;
        padding: 0 60px;
        .nav-bar-left {
          .nav-tab {
            @include flex(center);
            position: relative;
            .nav-tab-item {
              @include flex();
              min-width: 50px;
              height: 64px;
              margin-left: 20px;
              font-size: $fontJ;
              font-weight: bold;
              &:first-child {
                margin-left: 0;
              }
              .iconfont {
                padding-right: 4px;
                height: 18px;
                font-size: $fontH;
                &.icon-zhuye {
                  color: #1fb85c;
                }
                &.icon-dongtai2 {
                  color: #ff6699;
                }
                &.icon-tougao {
                  color: #00aeec;
                }
                &.icon-shipin1 {
                  color: #1fb85c;
                }
                &.icon-shoucang1 {
                  color: #ffba44;
                }
                &.icon-geren {
                  color: gray;
                  font-size: $fontI;
                }
              }
            }
            .nav-tab-cursor {
              position: absolute;
              bottom: 0;
              left: 0;
              height: 3px;
              width: 52px;
              border-radius: 2px;
              background-color: $colorM;
              transition: left .2s;
            }
          }
        }
        .nav-bar-right {
          .stats {
            @include flex(center);
            .stat-item {
              @include flex();
              flex-direction: column;
              margin-left: 20px;
              cursor: pointer;
              &:first-child {
                margin: 0;
              }
              &:hover {
                color: $colorM;
              }
              .stat-item-text {
                color: $colorC;
                margin-bottom: 4px;
                &:hover {
                  color: $colorM;
                }
              }
            }
          }
        }
      }
    }
    .home-page-main {
      min-height: calc(100vh - 264px);
      background-color: $colorG;
      .space-home {
        padding: 0 60px;
      }
    }
  }
  @media (min-width:1560px) {
    .home-page {
      .home-page-header {
        .header-user-info {
          padding: 0 140px 24px;
        }
      }
      .nav-bar {
        .nav-bar-wrapper {
          padding: 0 140px;
        }
      }
      .home-page-main {
        .space-home {
          padding: 0 140px;
        }
      }
    }
  }
  @media (min-width:2060px) {
    .home-page {
      .home-page-header {
        .header-user-info {
          padding: 0 140px 24px;
          margin: 0 150px;
        }
      }
      .nav-bar {
        .nav-bar-wrapper {
          padding: 0 140px;
          margin: 0 150px;
        }
      }
      .home-page-main {
        .space-home {
          padding: 0 140px;
          margin: 0 150px;
        }
      }
    }
  }
</style>