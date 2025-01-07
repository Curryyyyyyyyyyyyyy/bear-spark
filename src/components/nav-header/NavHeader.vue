<script setup>
  import login from '@/views/login.vue'
  import HeaderAvatar from '@/components/nav-header/HeaderAvatar.vue';
  import HeaderMessage from '@/components/nav-header/HeaderMessage.vue';
  import useUser from '@/store/user';
  import { storeToRefs } from 'pinia';
  import { onMounted, ref} from 'vue';

  /* Router */
  const userStore = useUser()
  const {token} = storeToRefs(userStore)
  /* onMounted */
  onMounted(() => {
    document.addEventListener('click', (event) => {
      if(!inputWrapperRef.value.contains(event.target)) {
        searchPanel.value = false
      }
    })
  })

  //#region 搜索
  const keyword = ref('')
  function search() {
    
  }
  const inputWrapperRef = ref()
  const searchPanel = ref(false)
  function handleInputFocus() {
    searchPanel.value = true
  }
  //#endregion
  //#region 登录
  let showLogin = ref(false)
  function openLogin() {
    showLogin.value = true
  }
  function closeLogin() {
    showLogin.value = false
  }
  //#endregion
  //#region 防止刷新显示问题
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
  //#endregion
</script>

<template>
  <div class="nav-header">
    <div class="wrapper">
      <div class="nav-left">
        <slot name="nav"></slot>
        <a class="left-item jump">番剧</a>
        <a class="left-item jump">直播</a>
        <a class="left-item jump">游戏中心</a>
        <a class="left-item jump">会员购</a>
        <a class="left-item jump">漫画</a>
        <a class="left-item jump">赛事</a>
        <a class="left-item jump">KPL</a>
        <a v-if="!pageSmall" class="left-item jump">KPL</a>
        <a v-if="!pageSmall" class="left-item jump">KPL</a>
      </div>
      <div class="input-wrapper" :class="{'inp-small':pageSmall,'focus':searchPanel}" ref="inputWrapperRef" tabindex="1" @blur="searchPanel = false">
        <div class="input-box">
          <input v-model="keyword" @focus="handleInputFocus" name="keyword" type="text" placeholder="尚硅谷">
          <span @click="search" class="icon-search">
            <i class="iconfont icon-search-1-copy"></i>
          </span>
        </div>
        <div v-if="searchPanel" class="search-panel">
          <div class="search-history">
            <div class="search-history-header">
              <div class="header-text">搜索历史</div>
              <div class="clear-btn">清空</div>
            </div>
            <ul class="search-history-list">
              <li class="search-history-item">
                <span class="history-text">哈啊dscvcsdvsdvwwwfefwef哈</span>
                <div class="delete-btn">
                  <i class="iconfont icon-cuowu"></i>
                </div>
              </li>
              <li class="search-history-item">
                <span class="history-text">哈啊dscvcsdvsdvwwwfefwef哈</span>
                <div class="delete-btn">
                  <i class="iconfont icon-cuowu"></i>
                </div>
              </li>
              <li class="search-history-item">
                <span class="history-text">哈啊dscvcsdvsdvwwwfefwef哈</span>
                <div class="delete-btn">
                  <i class="iconfont icon-cuowu"></i>
                </div>
              </li>
              <li class="search-history-item">
                <span class="history-text">哈啊dscvcsdvsdvwwwfefwef哈</span>
                <div class="delete-btn">
                  <i class="iconfont icon-cuowu"></i>
                </div>
              </li>
            </ul>
          </div>
          <div class="search-hot">
            <div class="search-hot-header">
              <span class="header-text">热搜</span>
            </div>
            <ul class="search-hot-list">
              <li class="search-hot-item">
                <span class="order-text">1</span>&nbsp;&nbsp;滴哦闹女哦少女
              </li>
            </ul>
          </div>
        </div>
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
          <header-avatar></header-avatar>
        </div>
        <a class="right-item">
          <i class="iconfont icon-huiyuan jump" :class="{'onlyIcon':pageSmall}"></i>
          <p v-if="!pageSmall">大会员</p>
        </a>
        <a class="right-item">
          <header-message :showText="!pageSmall"></header-message>
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
          <div class="submit-ways">
            <div class="submit-ways-wrapper">
              <a href="/#/submit/article" target="_blank" class="submit-item">
                <i class="iconfont icon-zhenggaotougao"></i>
                <span class="submit-item-text">专栏投稿</span>
              </a>
              <a href="/#/submit/video" target="_blank" class="submit-item">
                <i class="iconfont icon-shipinshangchuan"></i>
                <span class="submit-item-text">视频投稿</span>
              </a>
              <a href="/#/submit/draft" target="_blank" class="submit-item">
                <i class="iconfont icon-caogaoxiang"></i>
                <span class="submit-item-text">草稿箱</span>
              </a>
            </div>
          </div>
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
    z-index: 100;
    position: relative;
    min-width: $min-width;
    max-width: $max-width;
    margin: 0 auto;
    // height: 152px;
    padding: 10px 15px;
    box-sizing: border-box;
    // background-color: transparent;
    .wrapper {
      display: flex;
      justify-content: space-between;
      align-items: start;
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
        .header-index {
          @include flex();
          margin-right: 8px;
          .logo {
            vertical-align: middle;
            @include bgImg(30px,30px,'/imgs/logo.png',50px 50px);
            margin-right:10px;
          }
          .icon-down {
            font-size: $fontH;
            transition: all .3s;
          }
          &:hover {
            .icon-down {
              display: inline-block;
              transform: rotate(180deg);
            }
          }
          }
        .left-item {
          display: inline-block;
          margin-right: 10px;
          cursor: pointer;
          &:last-child {
            margin: 0;
          }
        }
        .icon-shouye {
          font-size: $fontC;
          vertical-align: middle;
        }
      }
      .input-wrapper {
        width: 420px;
        border-radius: 5px;
        border: 1px solid $colorL;
        &.focus {
          box-shadow: 0 0 30px #0000001a;
          .input-box {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            input {
              background-color: #e3e5e7;
            }
          }
        }
        .input-box {
          position: relative;
          padding: 0 5px;
          background-color: $colorJ;
          border-radius: 5px;
          input {
            border:none;
            width: 89%;
            height: 30px;
            padding: 0 5px;
            margin: 6px 0;
            border-radius: 5px;
            background-color: transparent;
            box-sizing: border-box;
            margin-right: 10px;
          }
          .icon-search {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            display: inline-block;
            width: 8%;
            height: 30px;
            line-height: 30px;
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
        .search-panel {
          padding: 12px 0;
          background-color: $colorG;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          .search-history {
            padding: 0 12px;
            .search-history-header {
              @include flex();
              .header-text {
                font-weight: 550;
                color: $colorI;
              }
              .clear-btn {
                font-size: $fontK;
                color: $colorD;
                cursor: pointer;
              }
            }
            .search-history-list {
              display: flex;
              flex-wrap: wrap;
              margin-top: 10px;
              color: $colorI;
              .search-history-item {
                position: relative;
                margin: 0 10px 10px 0;
                border-radius: 5px;
                background-color: $colorN;
                cursor: pointer;
                .history-text {
                  display: inline-block;
                  max-width: 100px;
                  padding: 5px 8px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  font-size: $fontK;
                }
                .delete-btn {
                  position: absolute;
                  top: -4px;
                  right: -4px;
                  @include flex(center);
                  height: 12px;
                  width: 12px;
                  border-radius: 6px;
                  background-color: $colorE;
                  color: $colorG;
                  .icon-cuowu {
                    font-size: 10px;
                  }
                }
              }
            }
          }
          .search-hot {
            .search-hot-header {
              padding: 0 12px;
              .header-text {
                color: $colorI;
                font-weight: 550;
              }
            }
            .search-hot-list {
              margin-top: 6px;
              .search-hot-item {
                padding: 10px 14px;
                font-size: $fontK;
                color: $colorI;
                cursor: pointer;
                &:hover {
                  background-color: $colorN;
                }
                .order-text {
                  font-weight: 550;
                }
              }
            }
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
          color: $colorG;
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
        .submit {
          position: relative;
          @include flex();
          height: 35px;
          padding: 0 10px;
          border-radius: 15px;
          background-color: $colorM;
          color: $colorG;
          span {
            margin-left: 3px;
          }
          &:hover {
            cursor: pointer;
            background-color: rgb(15, 141, 214);
            .submit-ways {
              display: block;
            }
          }
          .submit-ways {
            display: none;
            position: absolute;
            right: 0;
            top: 88%;
            padding-top: 20px;
            opacity: 1;
            transition: all .1s;
            .submit-ways-wrapper {
              @include flex();
              padding: 6px 10px;
              border-radius: 6px;
              box-shadow: 0 0 1px $colorD;
              background-color: $colorG;
              .submit-item {
                @include flex();
                flex-direction: column;
                padding: 4px 2px;
                min-width:54px;
                border-radius: 6px;
                color: $colorC;
                &:hover {
                  background-color: $colorN;
                }
                .submit-item-text {
                  font-size: $fontL;
                  margin-top: 4px;
                }
              }
            }
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
