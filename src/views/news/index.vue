<script setup>
  import { onMounted, ref } from 'vue';
  import NavHeader from '@/components/NavHeader.vue'
  import NewsUserBox from './NewsUserBox.vue';
  import NewsPublishBox from './NewsPublishBox.vue';
  import NewsAsideBox from './NewsAsideBox.vue';
  import NewsList from '@/components/NewsList.vue'
  import {useRouter} from 'vue-router'
  import {getNewsPrepareApi,getNewsBgApi} from '@/api/news.js'
  import {getFollowerListApi} from '@/api/user.js'
  import { debounce } from '@/hooks/performance';

  /* Router */
  const router = useRouter()
  //#region Mounted
  const recentTagList = ref([])
  const followerList = ref([])
  const backgroundUrl = ref('')
  const sideBarUrl = ref('')
  // recentTagList.value = [
  //     {
  //       content:'111',
  //       viewNum:1,
  //       discussNum:1,
  //     },
  //     {
  //       content:'222',
  //       viewNum:2,
  //       discussNum:2,
  //     },
  //     {
  //       content:'333',
  //       viewNum:3,
  //       discussNum:3,
  //     },
  //     {
  //       content:'444',
  //       viewNum:4,
  //       discussNum:4,
  //     },
  //     {
  //       content:'555',
  //       viewNum:5,
  //       discussNum:5,
  //     },
  //     {
  //       content:'666',
  //       viewNum:6,
  //       discussNum:6,
  //     },
  //     {
  //       content:'777',
  //       viewNum:7,
  //       discussNum:7,
  //     },
  //     {
  //       content:'888',
  //       viewNum:8,
  //       discussNum:8,
  //     },
  // ]
  followerList.value = [
    {avatarUrl:'/imgs/default-avatar.png',username:'周权',fansNumInfo:111},
    {avatarUrl:'/imgs/default-avatar.png',username:'谢家辉',fansNumInfo:222},
    {avatarUrl:'/imgs/default-avatar.png',username:'何昕',fansNumInfo:333},
    {avatarUrl:'/imgs/default-avatar.png',username:'叶凯乐',fansNumInfo:444},
    {avatarUrl:'/imgs/default-avatar.png',username:'王思杰',fansNumInfo:555},
    {avatarUrl:'/imgs/default-avatar.png',username:'卢家秦',fansNumInfo:666},
    {avatarUrl:'/imgs/default-avatar.png',username:'周权',fansNumInfo:777},
    {avatarUrl:'/imgs/default-avatar.png',username:'周权',fansNumInfo:888},
  ]
  // sideBarUrl.value = '/imgs/slide-bar.jpg'
  // backgroundUrl.value = '/imgs/news-background.png'
  onMounted(async () => {
    /* 获取关注的列表、表情包列表、热门标签列表 */
    const res = await getNewsPrepareApi()
    recentTagList.value = res.recentTagList
    sideBarUrl.value = res.sideBarUrl
    const followerListRes = await getFollowerListApi() 
    followerList.value = followerListRes.followerList
    const backgroundUrlRes = await getNewsBgApi()
    backgroundUrl.value = backgroundUrlRes.bgUrl
  })
  //#endregion
  //#region up列表
  const activeUpIndex = ref(-1)
  const upListDom = ref()
  function changeUpListScroll(n) {
    upListDom.value.scrollLeft += n
  }
  //#endregion
  //#region tab栏
  const activeNum = ref(0)
  const highlight = ref()
  function addActive(num) {
    activeNum.value = num
    if(num === 0) {
      highlight.value.style.transform = 'translateX(37px)'
    } else if(num === 1) {
      highlight.value.style.transform = 'translateX(111px)'
    } else if(num === 2) {
      highlight.value.style.transform = 'translateX(199px)'
    } else if(num === 3) {
      highlight.value.style.transform = 'translateX(273px)'
    }
  }
  //#endregion
  /* 处理光标 */
  const publishBox = ref()
  const newsListRef = ref()
  document.onselectionchange = () => {
    let selection = document.getSelection()
    if(selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      newsListRef.value.mineRefList.forEach((item,index) => {
        if(item.contains(range.commonAncestorContainer)) {
          newsListRef.value.rangeOfContentBoxList[index] = range
          newsListRef.value.curRangeIndex.value = index
        }
      })
      /* 处理publish输入框光标 */
      if(publishBox.value.richTextInputPub.contentDom.contains(range.commonAncestorContainer)) {
        publishBox.value.richTextInputPub.rangeOfContentBox = range
      }
    }
  }
  //#region 页面尺寸缩放调整
  let smallSize = ref(false)
  window.addEventListener('resize', ()=> {
    if(window.innerWidth < 1396) {
      smallSize.value = true
    } else {
      smallSize.value = false
    }
  })
  //#endregion
  const showBackToTop = ref(false)
  window.addEventListener('scroll', debounce(() => {
    if(document.documentElement.scrollTop > 700) showBackToTop.value = true
    else showBackToTop.value = false
  }))
  function backToTop() {
    document.documentElement.scrollTop = 0
  }
</script>

<template>
  <div class="header">
    <nav-header>
      <template v-slot:nav>
        <a>
          <span @click="router.push('/index')" class="logo"></span>
          <span>首页</span>
          <i class="iconfont icon-down"></i>
        </a>
      </template>
    </nav-header>
  </div>
  <div class="news">
    <div class="bg"></div>
    <div class="container" :class="{'container-small':smallSize}">
      <news-user-box></news-user-box>
      <div class="body">
        <news-publish-box ref="publishBox"></news-publish-box>
        <div class="bs-up-list">
          <div class="shim"></div>
          <div @click="changeUpListScroll(-400)" class="left-btn"><i class="iconfont icon-zuojiantou"></i></div>
          <div ref="upListDom" @click="showArrow = true" class="up-list">
            <div class="up-box-list" @hover="showArrow = true">
              <div @click="activeUpIndex = -1" class="all-news" :class="{'active':activeUpIndex === -1}">
                <span><i class="iconfont icon-dongtai"></i></span>
                <p>全部动态</p>
              </div>
              <div v-for="(item,index) in followerList" :key="index" @click="activeUpIndex = index" class="up-box" :class="{'active':activeUpIndex === index}">
                <img :src="item.avatarUrl" alt="头像">
                <p>{{ item.username }}</p>
              </div>
            </div>
          </div>
          <div @click="changeUpListScroll(400)" class="right-btn"><i class="iconfont icon-youjiantou"></i></div>
          <div class="shim"></div>
        </div>
        <div v-if="activeUpIndex === -1" class="news-tabs">
          <div class="news-tabs-list">
            <div @click="addActive(0)" :class="{'active':activeNum === 0}" class="news-tabs-item">全部</div>
            <div @click="addActive(1)" :class="{'active':activeNum === 1}" class="news-tabs-item">视频投稿</div>
            <div @click="addActive(2)" :class="{'active':activeNum === 2}" class="news-tabs-item">追番追剧</div>
            <div @click="addActive(3)" :class="{'active':activeNum === 3}" class="news-tabs-item">专栏</div>
          </div>
          <div ref="highlight" class="news-tabs-highlight"></div>
        </div>
        <NewsList ref="newsListRef" :followerList="followerList"></NewsList>
      </div>
      <news-aside-box :sideBarUrl="sideBarUrl" :recentTagList="recentTagList"></news-aside-box>
    </div>
    <button v-if="showBackToTop" @click="backToTop" class="back-to-top">
      <i class="iconfont icon-huidingbu"></i>
      <div>顶部</div>
    </button>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .header {
    z-index: 100;
    position: sticky;
    top: 0;
    height: 64px;
    padding-bottom: 10px;
    box-sizing: border-box;
    background-color: $colorG;
    box-shadow: 0 3px 5px $colorF;
    .nav-header{
      color: $colorI;
      background-color: $colorG;
      .submit,.login {
        color: $colorG;
      }
    }
  }
  .news {
    background-size: cover;
    .bg {
      position: fixed;
      bottom: 0;
      height: 100vh;
      width: $max-width;
      background-image: url('/imgs/news-background.png');
      background-size: cover;
      // background-position: bottom;
    }
    .container {
      display: flex;
      margin-top: 10px;
      .body {
        width: 53%;
        margin: 0 10px;
        .bs-up-list {
          width: 100%;
          position: relative;
          display: flex;
          background-color: $colorG;
          border-radius: 6px;
          .up-list {
            display: flex;
            padding: 15px 25px;
            overflow-x: scroll;
            scroll-behavior: smooth;
            .up-box-list {
              display: flex;
              .all-news {
                width: 50px;
                margin-right: 20px;
                cursor: pointer;
                span {
                  display: inline-block;
                  height: 50px;
                  line-height: 50px;
                  width: 50px;
                  text-align: center;
                  border-radius: 25px;
                  box-sizing: border-box;
                  background-color: #dff6fd;
                  margin-bottom: 3px;
                  .icon-dongtai {
                    font-size: $fontC;
                    color: $colorM;
                  }
                }
                p{
                  color: $colorD;
                }
                &:hover {
                  span {
                    border: 1.2px solid $colorM;
                  }
                  p{
                    color: $colorM;
                  }
                }
              }
              .up-box {
                width: 60px;
                text-align: center;
                cursor: pointer;
                margin-right: 17px;
                &:hover {
                  img {
                    border: 1.2px solid $colorM;
                  }
                  p{
                    color: $colorM;
                  }
                }
                img {
                  height: 50px;
                  width: 50px;
                  border-radius: 25px;
                  box-sizing: border-box;
                }
                p {
                  color: $colorD;
                  word-break: break-all;
                  overflow: hidden;
                }
              }
              .active {
                span,img {
                  border: 1.2px solid $colorM;
                }
                p {
                  color: $colorM;
                }
              }
            }
          }
          .up-list::-webkit-scrollbar {
            height: 0;
          }
          &:hover {
            .left-btn,.right-btn {
              opacity: 1;
            }
          }
          .left-btn,.right-btn {
            position: absolute;
            top: 46px;
            cursor: pointer;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 10px;
            box-shadow: 0 0 10px $colorF;
            opacity: 0;
            background-color: $colorN;
            transition: opacity .3s;
            .iconfont {
              font-size: $fontF;
            }
          }
          .left-btn {
            left: 5px;
          }
          .right-btn {
            right: 5px;
          }
          .shim {
            width: 8px;
            height: 112px;
            // background-color: $colorF;
            opacity: 0;
          }
        }
        .news-tabs {
          position: relative;
          height: 48px;
          width: 100%;
          margin: 10px 0;
          padding: 0 30px;
          box-sizing: border-box;
          background-color: $colorG;
          border-radius: 6px;
          font-size: $fontJ;
          color: $colorD;
          .news-tabs-list {
            height: 100%;
            display: flex;
            align-items: center;
            .news-tabs-item {
              margin-right: 32px;
              cursor: pointer;
              &:hover {
                color: $colorM;
              }
            }
            .active {
              color: $colorM;
              font-weight: bold;
            }
          }
          .news-tabs-highlight {
            position: absolute;
            left: 0;
            bottom: 10px;
            height: 2px;
            width: 14px;
            background-color: $colorM;
            transform: translateX(37px);
            transition: transform .2s;
          }
        }
      }
    }
    .container-small {
      width: 1100px;
    }
    .back-to-top {
      position: fixed;
      right: 1%;
      bottom: 15%;
      width: 40px;
      height: 40px;
      padding: 5px;
      border: none;
      border-radius: 6px;
      background-color: $colorG;
      font-size: $fontK;
      font-weight: normal;
      cursor: pointer;
      &:hover {
        background-color: $colorN;
      }
      .iconfont {
        font-size: 10px;
      }
    }
  }
</style>