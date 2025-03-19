<script setup>
  import NavHeader from '@/components/nav-header/NavHeader.vue';
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { throttle } from '@/hooks/performance.js'
  import Loading from '@/components/common/Loading.vue'
  import { getVideoListApi } from '@/api/video.js'
  import { useRouter } from 'vue-router';

  const router = useRouter()

  const headerStyle = ref({
    height: '152px',
    background: `url('../../../public/imgs/indexBackground.png')`
  })
  const headerTextColor = ref('white')
  const handleScroll = throttle(() => {
    const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop
    if(scrollHeight >= 60) {
      headerStyle.value = {
        height: '60px',
        background: 'white',
        position: 'fixed',
        top: '0'
      }
      headerTextColor.value = 'black'
    } else {
      headerStyle.value = {
        height: '152px',
        background: `url('../../../public/imgs/indexBackground.png')`
      }
      headerTextColor.value = 'white'
    }
  })
  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })
  onBeforeMount(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  const categoryList = ['全部','编程','人工智能','运动','美食','汽车','音乐','动画','电影','知识','游戏','搞笑','户外','资讯','生活','纪录片','科技','舞蹈','VLOG']
  const activeCategoryIndex = ref(0)

  const videoList = ref([])
  const busy = ref(false)
  const loading = ref(false)
  const pageNum = 1
  const pageSize = 30
  const isArriveTotal = ref(false)
  const loadMoreVideo = () => {
    if(isArriveTotal.value) return
    busy.value = true
    loading.value = true
    setTimeout(async () => {
      const res = await getVideoListApi({
        pageNum,
        pageSize
      })
      videoList.value.push(...res.records)
      if(res.total <= videoList.value.length) isArriveTotal.value = true
      busy.value = false
      loading.value = false
    }, 500);
  }
</script>

<template>
  <div class="bs-index">
    <div class="index-header" :style="headerStyle">
      <nav-header :color="headerTextColor"></nav-header>
    </div>
    <div class="index-body container">
      <div class="index-body__category">
        <div class="category-logoshow">
          <div class="category-logoshow__logo">
            <img src="../../../public/imgs/logo.png" alt="logo">
          </div>
          <div class="category-logoshow__name">bear-spark</div>
        </div>
        <ul class="category-list">
          <li 
            @click="activeCategoryIndex = index" 
            v-for="(item, index) in categoryList" 
            :key="index" 
            class="category-item" 
            :class="{'active': index === activeCategoryIndex}"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="index-body__video">
        <ul class="video-list">
          <li v-for="(item) in videoList" :key="item.videoId" class="video-item">
            <div @click="router.push(`/video/${item.videoId}`)" class="video-cover">
              <img v-lazy="item.coverUrl" alt="cover">
              <div class="video-item__stat">
                <div class="video-item__stat-duration">
                  {{ item.videoDurationInfo }}
                </div>
              </div>
            </div>
            <div class="video-info">
              <div @click="router.push(`/video/${item.videoId}`)" class="video-info__title">{{ item.videoTitle }}</div>
              <div @click="router.push(`/home/${item.authorId}`)" class="video-info__author-pubtime">{{item.authorName}} · {{ item.publishTimeInfo }}</div>
            </div>
          </li>
        </ul>
        <div class="load-more-video"
          v-infinite-scroll="loadMoreVideo" 
          :infinite-scroll-disabled="busy" 
          infinite-scroll-distance="50"
        >
          <Loading v-show="!isArriveTotal && loading"></Loading>
        </div>
        <div v-show="isArriveTotal" class="prompt">已经到最底啦~</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .bs-index {
    height: 100%;
    background-color: $colorG;
    .index-header {
      width: 100%;
      z-index: 2000;
      box-shadow: 0 2px 4px #00000014;
    }
    .index-body {
      margin-top: 14px;
      .index-body__category {
        @include flex();
        .category-logoshow {
          width: 70px;
          margin-right: 40px;
          .category-logoshow__logo {
            text-align: center;
            img {
              height: 60px;
              width: 60px;
            }
          }
          .category-logoshow__name {
            width: 70px;
            text-align: center;
            font-size: $fontJ;
          }
        }
        .category-list {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          row-gap: 8px;
          column-gap: 8px;
          .category-item {
            height: 30px;
            line-height: 30px;
            padding: 0 5px;
            border: 1px solid #f1f2f3;
            box-sizing: border-box;
            background-color: #f6f7f8;
            border-radius: 6px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            letter-spacing: 2px;
            font-weight: 400;
            color: $colorC;
            font-size: $fontJ;
            cursor: pointer;
            &:hover {
              background-color: $colorF;
            }
            &.active {
              color: $colorM;
            }
          }
        }
      }
      .index-body__video {
        margin-top: 30px;
        .video-list {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          column-gap: 20px;
          row-gap: 20px;
          .video-item {
            .video-cover {
              position: relative;
              width: 100%;
              cursor: pointer;
              img {
                height: 150px;
                width: 100%;
                border-radius: 6px;
              }
              .video-item__stat {
                width: 100%;
                position: absolute;
                bottom: 8px;
                .video-item__stat-duration {
                  position: absolute;
                  bottom: 0;
                  right: 8px;
                  color: $colorG;
                }
              }
            }
            .video-info {
              width: 100%;
              padding-right: 8px;
              margin-top: 6px;
              box-sizing: border-box;
              .video-info__title {
                font-size: $fontJ;
                color: #18191C;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: pointer;
                &:hover {
                  color: $colorM;
                }
              }
              .video-info__author-pubtime {
                margin-top: 6px;
                color: $colorD;
                cursor: pointer;
                &:hover {
                  color: $colorM;
                }
              }
            }
          }
        }
      }
    }
  }
</style>