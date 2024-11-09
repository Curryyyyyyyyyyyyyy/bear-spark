<script setup>
  import { ref,defineEmits } from 'vue';
  import useUser from '../store/user';
  import { storeToRefs } from 'pinia';
  const userStore = useUser()
  const {userId} = storeToRefs(userStore)
  const emit = defineEmits(['openLogin'])

  function openLogin() {
    emit('openLogin')
  }
</script>

<template>
  <div class="nav-header">
    <div class="wrapper">
      <div class="nav-left">
        <i class="iconfont icon-shouye"></i>
        <span>首页</span>
        <span>番剧</span>
        <span>直播</span>
        <span>游戏中心</span>
        <span>会员购</span>
        <span>漫画</span>
        <span>赛事</span>
        <span>KPL</span>
        <i class="iconfont icon-xiazai"></i>
        <span>下载客户端</span>
      </div>
      <div class="inp">
        <input type="text" placeholder="尚硅谷">
        <span class="icon-search">
          <i class="iconfont icon-search-1-copy"></i>
        </span>
      </div>
      <div class="nav-right">
        <div v-if="!userId" class="login right-item">
          <span class="nav-login" @click="openLogin">登录</span>
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
        <div v-else class="avatar right-item"></div>
        <div class="right-item">
          <i class="iconfont icon-huiyuan"></i>
          <p>大会员</p>
        </div>
        <div class="right-item">
          <i class="iconfont icon-xiaoxi"></i>
          <p>消息</p>
        </div>
        <div class="right-item">
          <i class="iconfont icon-dongtai"></i>
          <p>动态</p>
        </div>
        <div class="right-item">
          <i class="iconfont icon-shoucang"></i>
          <p>收藏</p>
        </div>
        <div class="right-item">
          <i class="iconfont icon-lishi"></i>
          <p>历史</p>
        </div>
        <div class="right-item">
          <i class="iconfont icon-chuangzuozhongxin"></i>
          <p>创作中心</p>
        </div>
        <div class="submit right-item">
          <i class="iconfont icon-shangchuan"></i>
          <span>投稿</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '../assets/sass/mixin.scss' as *;
  @use '../assets/sass/config.scss' as *;
  .nav-header {
    min-width: $min-width;
    max-width: $max-width;
    margin: 0 auto;
    height: 152px;
    padding: 10px 20px 0;
    box-sizing: border-box;
    // background: url('../../public/imgs/indexBg.png') no-repeat;
    background-color: rgb(151, 140, 125);
    color: $colorG;
    .wrapper {
      display: flex;
      justify-content: space-between;
      height: 40px;
      .iconfont {
        font-size: 14px;
      }
      .nav-left {
        span {
          margin-right: 10px;
        }
      }
      .inp {
        width: 350px;
        height:26px;
        padding: 3px 5px;
        box-sizing: border-box;
        background-color: $colorL;
        border-radius: 5px;
        &:hover {
          background-color: $colorG;
        }
        input {
          border:none;
          width: 310px;
          height: 20px;
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
          display: inline-block;
          width: 20px;
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
      .nav-right {
        display: flex;
        .right-item {
          margin-left: 10px;
          text-align: center;
        }
        .login {
          position: relative;
          margin-right: 15px;
          .nav-login {
            display: inline-block;
            height: 30px;
            line-height: 30px;
            width: 30px;
            text-align: center;
            border-radius: 15px;
            background-color: $colorM;
            cursor: pointer;
          }
          &:hover {
            .children {
              display: block;
            }
          }
          .children {
            display: none;
            width: 280px;
            position: absolute;
            left: -125px;
            top: 40px;
            padding: 10px;
            box-sizing: border-box;
            border-radius: 5px;
            background-color: $colorG;
            box-shadow: 1px 1px 5px $colorF;
            color: $colorI;
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
                background-color: #34c2f5;
              }
            }
            .register {
              color: $colorM;
              cursor: pointer;
            }
          }
        }
        .avatar {
          height: 30px;
          width: 30px;
          border-radius: 15px;
          margin-right: 15px;
          cursor: pointer;
          background: url('/imgs/default-avatat.png') no-repeat;
          background-size: 30px 30px;
        }
        .submit {
          width: 70px;
          height: 30px;
          line-height: 30px;
          border-radius: 10px;
          background-color: $colorA;
          span {
            margin-left: 5px;
          }
          &:hover {
            cursor: pointer;
            background-color: #f987a7;
          }
        }
      }
    }
  }
</style>
