<script setup>
  import Loading from '../../components/common/Loading.vue'
  import {getArticleListApi, getCategoryListApi, getCategoryInfoApi} from '../../api/article'
  import { onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';

  /* router */
  const router = useRouter()
  const route = useRoute()
  /* onMounted */
  const categoryList = ref([])
  const allArticleNum = ref(0)
  onMounted(async () => {
    categoryList.value = await getCategoryListApi({
      listedUserId:route.params.userId
    })
    categoryList.value.forEach(item => {
      allArticleNum.value += item.articleNum
    })
    loadMore()
  })

  //#region 加载文章
  const showCategory = ref(false)
  const categoryId = ref(null)
  const categoryInfo = ref(null)
  const articleList = ref([])
  const pageNum = ref(1)
  const pageSize = ref(20)
  const busy = ref(false)
  const loading = ref(false)
  const isArriveTotal = ref(false)
  async function getArticleList(id) {
    categoryId.value = id
    pageNum.value = 1
    isArriveTotal.value = false
    if(id) {
      categoryInfo.value = await getCategoryInfoApi({
        categoryId:id
      })
    }
    const res = await getArticleListApi({
      pageNum:pageNum.value,
      pageSize:pageSize.value,
      categoryId:id,
      listedUserId:route.params.userId
    })
    articleList.value = res.records
  }
  function loadMore() {
    busy.value = true
    loading.value = true
    setTimeout(async () => {
      const res = await getArticleListApi({
        pageNum:pageNum.value++,
        pageSize:pageSize.value,
        categoryId:categoryId.value
      })
      articleList.value.push(...res.records)
      if(articleList.value.length >= res.total) isArriveTotal.value = true
      loading.value = false
      busy.value = false
    }, 500);
  }
  //#endregion
  /* 跳转至文章详情 */
  function toDetail(id) {
    const page = router.resolve({
      name:'news_detail',
      query:{
        articleId:id
      }
    })
    window.open(page.href)
  }
</script>

<template>
  <div class="home-article">
    <div class="side-nav">
      <div @click="getArticleList(null)" class="side-nav-item all">
        <div class="side-nav-item-header" :class="{'active':categoryId === null}">
          <span class="side-nav-item-text">全部</span>
          <div class="side-nav-item-num">{{ allArticleNum }}</div>
        </div>
      </div>
      <div class="side-nav-item category">
        <div @click="showCategory = !showCategory" class="side-nav-item-header" :class="{'active':categoryId !== null}">
          <span class="side-nav-item-text">分类</span>
          <i class="iconfont icon-down" :style="{transform:showCategory ? `rotate(180deg)` : ''}"></i>
        </div>
        <div v-if="showCategory" class="side-nav-item-content">
          <ul class="side-nav-content-list">
            <li
              @click="getArticleList(item.categoryId)"
              v-for="item in categoryList"
              :key="item.categoryId"
              class="side-nav-content-item"
              :class="{'content-active':categoryId === item.categoryId}"
              >
              <div class="item-text">{{ item.categoryName }}</div>
              <div class="item-num">{{ item.articleNum }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="article-list">
      <div v-if="categoryId !== null" class="article-category-info">
        <div class="category-photo">
          <img :src="categoryInfo?.categoryPhotoUrl" alt="">
        </div>
        <div class="category-name">{{ categoryInfo?.categoryName }}</div>
      </div>
      <div class="article-list-main">
        <a v-for="item in articleList" :key="item.articleId" @click="toDetail(item.articleId)" target="_blank" class="article-item">
          <div class="article-cover">
            <img :src="item.coverUrl" alt="">
          </div>
          <div class="article-info">
            <div class="article-info-main">
              <h4 class="article-title">{{ item.title}}</h4>
              <div class="article-content">{{ item.summary }}</div>
            </div>
            <div class="article-info-footer">
              <div class="article-declaration">
                <div v-if="!item.declaration" class="original">原创</div>
                <div v-else class="reprint">转载</div>
              </div>
              <div class="pub-time">{{ item.pubTimeInfo }}</div>
              <div class="article-stats">
                <div class="stat-item">
                  <span class="stat-item-num">{{ item.viewNumInfo }}</span>
                  <span class="stat-item-text">浏览&nbsp;·&nbsp;</span>
                </div>
                <div class="stat-item">
                  <span class="stat-item-num">{{ item.likeNumInfo }}</span>
                  <span class="stat-item-text">点赞&nbsp;·&nbsp;</span>
                </div>
                <div class="stat-item">
                  <span class="stat-item-num">{{ item.commentNumInfo }}</span>
                  <span class="stat-item-text">评论&nbsp;·&nbsp;</span>
                </div>
                <div class="stat-item">
                  <span class="stat-item-num">{{ item.collectNumInfo }}</span>
                  <span class="stat-item-text">收藏</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
      <div class="load-more"
        v-infinite-scroll="loadMore" 
        :infinite-scroll-disabled="busy" 
        infinite-scroll-distance="50"
      >
        <Loading v-show="!isArriveTotal && loading"></Loading>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .home-article {
    display: flex;
    .side-nav {
      flex-shrink: 0;
      width: 160px;
      margin-right: 24px;
      .side-nav-item {
        border-bottom: 1px solid $colorN;
        cursor: pointer;
        &.all {
          .side-nav-item-header {
            @include flex();
            padding-right: 4px;
          }
        }
        &.category {
          .side-nav-item-header {
            @include flex();
            .icon-down {
              font-size: $fontG;
              transition: transform .3s;
            }
          }
        }
        .side-nav-item-header {
          padding: 18px 0;
          font-size: $fontJ;
          font-weight: bold;
          &:hover {
            color: $colorM;
          }
          &.active {
            color: $colorM;
          }
        }
        .side-nav-item-content {
          .side-nav-content-list {
            max-height: 400px;
            overflow-y: auto;
            overscroll-behavior: contain;
            &::-webkit-scrollbar {
              width: 4px;
            }
            &::-webkit-scrollbar-thumb {
              border-radius: 2px;
              background-color: $colorF
            }
            .side-nav-content-item {
              @include flex();
              padding: 14px 16px;
              border-radius: 6px;
              margin-bottom: 8px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              &:hover {
                background-color: $colorN;
              }
              &.content-active {
                background-color: $colorM;
                color: $colorG;
              }
              .item-text {
                font-weight: 550;
                font-size: 13px;
              }
              .item-num {
                font-weight: 550;
              }
            }
          }
        }
        @keyframes expand {
          from {
            height: 0;
          } to {
            height: 100%;
          }
        }
      }
    }
    .article-list {
      flex: 1;
      .article-category-info {
        position: relative;
        padding-top: 10px;
        .category-photo {
          img {
            width: 100%;
            height: 300px;
            border-radius: 6px;
            border: 1px solid rgba(0,0,0,.07);
          }
        }
        .category-name {
          position: absolute;
          right: 30px;
          bottom: 30px;
          margin-left: 12px;
          font-size: $fontF;
        }
      }
      .article-list-main {
        margin-top: 16px;
        .article-item {
          display: flex;
          padding: 14px 0;
          border-bottom: 1px solid $colorN;
          cursor: pointer;
          .article-cover {
            img {
              width: 160px;
              height: 100px;
              border-radius: 6px;
              border: 1px solid rgba(0,0,0,.07);
            }
          }
          .article-info {
            flex: 1;
            @include flex(space-between, start);
            flex-direction: column;
            height: 100px;
            padding: 6px 0;
            box-sizing: border-box;
            margin-left: 12px;
            .article-info-main {
              .article-title {
                display: -webkit-box;
                overflow: hidden;
                white-space: normal;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                line-clamp: 1;
                font-size: $fontH;
                font-weight: 500;
                &:hover {
                  color: $colorM;
                }
              }
              .article-content {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
                font-size: $fontJ;
                margin-top: 6px;
              }
            }
            .article-info-footer {
              @include flex(left);
              .article-declaration {
                width: 32px;
                height: 18px;
                line-height: 18px;
                text-align: center;
                border-radius: 2px;
                color: $colorG;
                margin-right: 10px;
                .original {
                  background-color: $colorM;
                  border-radius: 2px;
                }
                .reprint {
                  background-color: #e96725;
                  border-radius: 2px;
                }
              }
              .pub-time {
                color: $colorD;
                margin-right: 10px;
              }
              .article-stats {
                @include flex(left);
                color: $colorC;
                .stat-item {
                  .stat-item-num {
                    margin-right: 3px;
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