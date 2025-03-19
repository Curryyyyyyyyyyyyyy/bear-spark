<script setup>
  import NavHeader from '@/components/nav-header/NavHeader.vue'
  import Player from './Player.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getVideoInfoApi } from '@/api/video.js'
  import { onMounted, ref } from 'vue';

  const route = useRoute()
  const router = useRouter()
  const videoInfo = ref({})
  onMounted(async () => {
    videoInfo.value = await getVideoInfoApi({
      videoId: route.params.id
    })
  })
</script>

<template>
  <div class="video-detail">
    <div class="video-detail__header">
      <NavHeader :showLogo="true"></NavHeader>
    </div>
    <div class="video-detail__body container">
      <div class="left-container">
        <div class="video-info">
          <h1 class="video-title">{{ videoInfo.videoTitle }}</h1>
          <div class="video-pubtime">{{ videoInfo.publishTimeInfo }}</div>
          <div class="video-box">
            <Player :videoUrl="videoInfo.videoUrl" :videoId="route.params.id"></Player>
          </div>
          <div class="video-toolbar">
            <div class="video-like video-toolbar-item">
              <i class="iconfont icon-dianzan"></i>
              <span class="stat">1</span>
            </div>
            <div class="video-merit video-toolbar-item">
              <i class="iconfont icon-muyu"></i>
              <span class="stat">2</span>
            </div>
            <div class="video-collect video-toolbar-item">
              <i class="iconfont icon-shoucang"></i>
              <span class="stat">1</span>
            </div>
          </div>
          <div class="video-desc">{{ videoInfo.description }}</div>
        </div>
      </div>
      <div class="right-container">
        <div class="author-info">
          <div class="author-info__left">
            <img @click="router.push(`/home/${videoInfo.authorInfo?.userId}`)" class="author-avatar" :src="videoInfo.authorInfo?.avatarUrl" alt="">
          </div>
          <div class="author-info__right">
            <span @click="router.push(`/home/${videoInfo.authorInfo?.userId}`)" class="author-name">{{ videoInfo.authorInfo?.username }}</span>
            <div class="button-set">
              <button @click="router.push(`/home/${videoInfo.authorInfo?.userId}`)" class="btn tohome-btn">访问主页</button>
              <button v-if="true" class="btn follow-btn">关注</button>
              <button v-else class="btn cancelfollow-btn">已关注</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .video-detail {
    background-color: $colorG;
    height: 100%;
    .video-detail__header {
      background-color: $colorG;
      box-shadow: 0 2px 4px #00000014;
      position: fixed;
      width: 100%;
      z-index: 2000;
    }
    .video-detail__body {
      @include flex(space-between, flex-start);
      padding-top: 90px;
      .left-container {
        flex: 1;
        .video-info {
          padding-bottom: 20px;
          border-bottom: 1px solid $colorE;
          .video-title {
            font-weight: 400;
          }
          .video-pubtime {
            margin-top: 12px;
            color: $colorD;
            font-size: $fontJ;
          }
          .video-box {
            margin-top: 20px;
          }
          .video-toolbar {
            display: flex;
            padding: 20px 0;
            border-bottom: 1px solid $colorE;
            font-size: $fontJ;
            .video-toolbar-item {
              @include flex();
              margin-right: 40px;
              cursor: pointer;
              &:hover, &.active {
                color: $colorM;
              }
              .iconfont {
                margin-right: 10px;
                font-size: $fontH;
                &.icon-dianzan {
                  font-size: $fontC;
                }
                &.icon-muyu {
                  font-size: $fontF;
                }
                &.icon-shoucang {
                  font-size: $fontD;
                }
              }
            }
          }
          .video-desc {
            margin-top: 26px;
            font-size: $fontJ;
          }
        }
      }
      .right-container {
        width: 410px;
        margin-left: 30px;
        .author-info {
          @include flex(left);
          cursor: pointer;
          .author-info__left {
            margin-right: 12px;
            .author-avatar {
              height: 50px;
              width: 50px;
              border-radius: 25px;
            }
          }
          .author-info__right {
            @include flex(space-between, flex-start);
            flex-direction: column;
            .author-name {
              font-size: $fontI;
              margin-bottom: 10px;
            }
            .button-set {
              .btn {
                width: 228px;
                height: 30px;
                border-radius: 6px;
                cursor: pointer;
                border: none;
                &.tohome-btn {
                  width: 110px;
                  border: 1px solid $colorA;
                  color: $colorA;
                  margin-right: 10px;
                  &:hover {
                    background-color: rgb(251, 232, 235);
                  }
                }
                &.follow-btn {
                  background-color: $colorM;
                  border: none;
                  color: $colorG;
                  &:hover {
                    background-color: $colorP;
                  }
                }
                &.cancelfollow-btn {
                  background-color: $colorF;
                  color: $colorC;
                  &:hover {
                    background-color: $colorE;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>