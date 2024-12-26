<script setup>

</script>

<template>
  <div class="home-aside">
    <section class="home-aside-section">
      <div class="submit-center">
        <div class="header">
          <i class="iconfont icon-chuangzuozhongxin"></i>
          <span>创作中心</span>
        </div>
        <div class="body">
          <div class="submit-box">
            <div class="submit-item submit-video">
              <i class="iconfont icon-shipinshangchuan"></i>
              <span class="submit-item-text">视频投稿</span>
            </div>
            <div class="submit-item submit-article">
              <i class="iconfont icon-zhenggaotougao"></i>
              <span class="submit-item-text">专栏投稿</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="home-aside-section">
      <div class="live-room">
        <div class="header">
          <div class="header-text">直播间</div>
        </div>
        <div class="body">
          <div class="live-room-tips">欢迎回来！期待你的分享时刻，快来直播吧～</div>
          <a href="javascript:;" class="live-room-link">
            <span class="text">前往我的直播间</span>
            <i class="iconfont icon-youjiantou"></i>
          </a>
        </div>
      </div>
    </section>
    <section class="home-aside-section">
      <div class="user-info">
        <div class="header">
          <div class="user-info-text">个人资料</div>
          <div class="modify">
            <span>编辑</span>
            <i class="iconfont icon-youjiantou"></i>
          </div>
        </div>
        <div class="body">
          <div class="user-info-item">
            <i class="iconfont icon-user-id"></i>
            <div class="item-value">1008611</div>
          </div>
          <div class="user-info-item">
            <i class="iconfont icon-geren"></i>
            <div class="item-value">curryyyyy</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .home-aside {
    width: 240px;
    .home-aside-section {
      width: 100%;
      margin-bottom: 10px;
      .submit-center {
        padding: 30px 20px;
        background-color: $colorR;
        border-radius: 6px;
        .header {
          @include flex(center);
          font-size: $fontI;
          color: $colorM;
          .iconfont {
            &.icon-chuangzuozhongxin {
              font-size: $fontF;
            }
          }
        }
        .body {
          .submit-box {
            @include flex();
            padding: 8px 0;
            border: 1px solid $colorF;
            border-radius: 6px;
            margin-top: 22px;
            .submit-item {
              @include flex();
              padding: 0 16px;
              color: $colorI;
              cursor: pointer;
              &.submit-video {
                border-right: 1px solid $colorF;
              }
              .submit-item-text {
                margin-left: 2px;
              }
            }
          }
        }
      }
      .live-room {
        padding: 20px;
        background-color: $colorR;
        border-radius: 6px;
        .header {
          .header-text {
            font-size: $fontI;
            font-weight: bold;
          }
        }
        .body {
          margin-top: 12px;
          .live-room-tips {
            width: 100%;
            padding-right: 10px;
            box-sizing: border-box;
            font-size: 13px;
            color: $colorC;
          }
          .live-room-link {
            display: inline-block;
            @include flex(left);
            margin-top: 8px;
            font-size: 13px;
            color: $colorM;
            .icon-youjiantou {
              font-size: 13px;
              margin-left: 4px;
            }
          }
        }
      }
      .user-info {
        padding: 20px 16px 24px;
        background-color: $colorR;
        border-radius: 6px;
        .header {
          @include flex();
          .user-info-text {
            font-size: $fontI;
            font-weight: bold
          }
          .modify {
            @include flex(center);
            cursor: pointer;
            color: $colorD;
            .icon-youjiantou {
              font-size: $fontK;
              margin-left: 2px;
            }
          }
        }
        .body {
          margin-top: 18px;
          .user-info-item {
            @include flex(left);
            margin-top: 6px;
            font-size: 13px;
            .iconfont {
              width: 20px;
            }
            .item-value {
              margin-left: 4px;
            }
          }
        }
      }
    }
  }
</style>