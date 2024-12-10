<script setup>
  import NavHeader from '@/components/common/NavHeader.vue'
  import NewsModifyBox from './NewsModifyBox.vue';
  import NewsForwardBox from './NewsForwardBox.vue';
  import LikeList from '@/components/news/LikeList.vue';
  import ForwardList from '@/components/news/ForwardList.vue';
  import { useRoute, useRouter } from 'vue-router';
  import {getNewsDetailApi,deleteNewsApi,getVoteDetailApi,likeNewsApi} from '@/api/news.js'
  import {revokeBookLiveApi, modBookLiveStateApi} from '@/api/bookLive'
  import { onMounted, ref } from 'vue';
  import useUser from '@/store/user.js'
  import { ElMessage, ElMessageBox } from 'element-plus';

  /* Store */
  const {username} = useUser()
  /* router */
  const router = useRouter()
  /* route */
  const route = useRoute()
  /* onMounted */
  const newsInfo = ref({})
  newsInfo.value = {
    "happeningInfo":{
      "happeningId":1,
      "title": "现无称点进其原",
      "content": "11",
      "tag": "pariatur eiusmod aliqua labore reprehenderit",
      "viewNumInfo": 41,
      "likeNumInfo": 50,
      "commentNumInfo": 9,
      "forwardNumInfo":0,
      "commentAble": 0,
      "advanceRelease": 0,
      "voteSimpleInfo": {
          "voteId": 8,
          "title": "需观反干分取必",
          "voteNumInfo": "43"
      },
      "quotedHappening":{
        "happeningInfo":{
        "happeningId":1,
        "username": "万超",
        "avatarUrl": "http://dummyimage.com/100x100",
        "title": "现无称点进其原",
        "content": "",
        "tag": "pariatur eiusmod aliqua labore reprehenderit",
        "viewNumInfo": 41,
        "likeNumInfo": 50,
        "commentNumInfo": 9,
        "forwardNumInfo":0,
        "commentAble": 0,
        "advanceRelease": 0,
        "voteSimpleInfo": {
          "voteId": 8,
          "title": "需观反干分取必",
          "voteNumInfo": "43"
        },
        "imgUrlList": [
            "http://dummyimage.com/400x400"
        ],
        "pubTimeInfo": "1975-04-15 04:31:03"
        },
      },
      "imgUrlList": [
          "http://dummyimage.com/400x400"
      ],
      "pubTimeInfo": "1975-04-15 04:31:03"
    },
    "publisherInfo":{
      "userId":1001,
      "username": "万超",
      "avatarUrl": "/imgs/default-avatar.png",
    },
  }
  onMounted(async () => {
  // newsInfo.value = await getNewsDetailApi({
  //   happeningId:route.params.id
  // })
  })
  //#region 投票
  const showVoteModal = ref(false)
  const voteDetailInfo = ref({})
  const voteId = ref(null)
  async function handleShowVoteModal(id) {
    voteId.value = id
    voteDetailInfo.value = await getVoteDetailApi({
      voteId:id
    })
    showVoteModal.value = true
  }
  //#endregion
  //#region 预约直播
  function revokeBookLive(bookLiveId) {
    ElMessageBox.confirm(
      '撤销预约后，将提醒已预约用户',
      '提示',
      {
        confirmButtonText: '撤销预约',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(async () => {
      await revokeBookLiveApi({
        bookLiveId
      })
      newsInfo.value.happeningInfo.bookLiveInfo.canceled = 1
      ElMessage({ 
        type: 'info',
        message: '已撤销',
      })
    })
  }
  function cancelRevokeBookLive() {
    ElMessage.info('该直播预约已撤销')
  }
  async function bookLive(bookLiveId) {
    await modBookLiveStateApi({
      bookLiveId,
      booked:0
    })
    newsInfo.value.happeningInfo.bookLiveInfo.booked = 0
    ElMessage.success('预约成功')
  }
  async function cancelBookLive(bookLiveId) {
    await modBookLiveStateApi({
      bookLiveId,
      booked:1
    })
    newsInfo.value.happeningInfo.bookLiveInfo.booked = 1
    ElMessage.info('已取消预约')
  }
  //#endregion
  //#region setting
  const showCascader = ref(false)
  function deleteNews(id) {
    ElMessageBox.confirm(
      '动态删除后将无法恢复，请谨慎操作',
      '确认删除动态吗？',
      {
        confirmButtonText:'确认删除',
        confirmButtonClass:'confirmButtonClass',
        cancelButtonText:'取消',
        type:'error'
      }
    ).then(async ()=>{
      await deleteNewsApi({
        happeningId:id
      })
      ElMessage.info('删除成功')
    })
  }
  //#endregion
  //#region 点赞
  async function likeNews(id, liked) {
    await likeNewsApi({
      happeningId:id,
      liked:liked ? 0 : 1
    })
    if(liked) {
      newsInfo.value.happeningInfo.liked = 0
      newsInfo.value.happeningInfo.likeNumInfo--
      ElMessage.info('取消点赞')
    } else {
      newsInfo.value.happeningInfo.liked = 1
      newsInfo.value.happeningInfo.likeNumInfo++
      ElMessage.success('点赞成功')
    }
  }
  //#endregion
  //#region 编辑
  const showModifyBox = ref(false)
  //#endregion
  //#region 转发
  const showForwardBox = ref(false)
  //#endregion
  //#region onselectionchange
  const newsModifyRef = ref()
  const newsForwardRef = ref()
  document.onselectionchange = () => {
    let selection = document.getSelection()
    if(selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      if(showForwardBox.value && newsForwardRef.value.forwardInputRef.contentDom.contains(range.commonAncestorContainer)) {
        newsForwardRef.value.forwardInputRef.rangeOfContentBox = range
      }
      if(showModifyBox.value && newsModifyRef.value.modifyInputRef.contentDom.contains(range.commonAncestorContainer)) {
        newsModifyRef.value.modifyInputRef.rangeOfContentBox = range
      }
    }
  }
  //#endregion
  //#region tab栏
  const tab = ref('comment')
  //#endregion
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
  <div class="news-detail">
    <div class="bg"></div>
    <div class="news-detail-card">
      <div class="news-item">
        <div v-if="newsInfo.happeningInfo.content" class="item-warpper">
          <div class="news-item-avatar">
            <img :src="newsInfo.publisherInfo.avatarUrl" alt="头像">
          </div>
          <div class="news-item-header">
            <span class="news-item-author">{{ newsInfo.username }}</span>
            <span v-if="!newsInfo.advanceRelease" class="news-item-early-pub">提前发布</span>
            <div class="news-item-desc">
              <span class="news-item-time">{{ newsInfo.pubTimeInfo }}</span>
              <div class="news-item-visibility">
                <div v-if="newsInfo.visibility === 0" class="visibility-item">
                  <i class="iconfont icon-jiesuo1"></i>
                  <span>所有人都可见</span>
                </div>
                <div v-else class="visibility-item">
                  <i class="iconfont icon-suo"></i>
                  <span>仅自己可见</span>
                </div>
              </div>
            </div>
            <div @mouseenter="showCascader = true"  @mouseleave="showCascader = false,showCascaderSecond=false" class="news-item-more-btn">
              <i class="iconfont icon-gengduo1"></i>
              <div v-if="showCascader" class="new-item-cascader">
                <div v-if="username !== newsInfo.username" class="cascader-list">
                  <div class="cascader-item">取消关注</div>
                  <div class="cascader-item">举报</div>
                </div>
                <div v-else class="cascader-list">
                  <div @click="showModifyBox = true" class="cascader-item">编辑</div>
                  <div @click.stop="deleteNews(newsInfo.id)" class="cascader-item">删除</div>
                </div>
              </div>
            </div>
          </div>
          <div class="news-item-body">
            <div v-if="newsInfo.happeningInfo.tag" class="news-tag">
              <i class="iconfont icon-huati"></i>
              <span>{{ newsInfo.happeningInfo.tag }}</span>
            </div>
            <div class="news-title">{{ newsInfo.happeningInfo.title }}</div>
            <div class="news-text-content" v-html="newsInfo.happeningInfo.content"></div>
            <div v-if="newsInfo.happeningInfo.imgUrlList" class="news-album">
              <div class="news-album-preview grid">
                <div v-for="(item, index) in newsInfo.happeningInfo.imgUrlList" :key="index" class="news-album-preview-picture">
                  <img :src="item" alt="图片">
                </div>
              </div>
            </div>
            <div v-if="false" class="news-video-card">
              <a href="javascript:;" class="news-video-box">
                <div class="video-box-header">
                  <video controls src="/imgs/video.mp4"></video>
                </div>
                <div class="video-box-body">
                  <div class="video-title">vhosnvonvosnovl</div>
                  <div class="video-stat">
                    <div class="video-stat-item">
                      <i class="iconfont icon-shipin"></i>
                      22
                    </div>
                    <div class="video-stat-item">
                      <i class="iconfont icon-icon"></i>
                      11
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div v-if="newsInfo.happeningInfo.bookLiveInfo" class="news-book-lives">
              <div class="lives-detail">
                <p class="lives-title">直播预约：{{ newsInfo.happeningInfo.bookLiveInfo.title }}</p>
                <p class="lives-stat">
                  <span class="lives-time">{{ newsInfo.happeningInfo.bookLiveInfo.liveTimeInfo }} 直播</span>
                  <span class="book-num">{{ newsInfo.happeningInfo.bookLiveInfo.bookNumInfo }}人预约</span>
                </p>
              </div>
              <div class="lives-btn-box">
                <div v-if="username === newsInfo.publisherInfo.username" class="revoke-btn-box">
                  <button v-if="!newsInfo.happeningInfo.bookLiveInfo.canceled" @click.stop="revokeBookLive(newsInfo.happeningInfo.bookLiveInfo.bookLiveId)" class="book-lives-btn revoke-btn">撤销</button>
                  <button v-else @click.stop="cancelRevokeBookLive" class="book-lives-btn revoked-btn">已撤销</button>
                </div>
                <div v-else class="book-btn-box">
                  <button  v-if="newsInfo.happeningInfo.bookLiveInfo.booked" @click.stop="bookLive(newsInfo.happeningInfo.bookLiveInfo.bookLiveId)" class="book-lives-btn book-btn">
                    <span><i class="iconfont icon-icon-tixing"></i>预约</span>
                  </button>
                  <button v-else @click.stop="cancelBookLive(newsInfo.happeningInfo.bookLiveInfo.bookLiveId)" class="book-lives-btn booked-btn">已预约</button>
                </div>
              </div>
            </div>
            <div v-if="newsInfo.happeningInfo.voteSimpleInfo" class="news-vote">
              <div @click.stop="handleShowVoteModal(newsInfo.happeningInfo.voteSimpleInfo.voteId)" class="news-vote-card">
                <div class="vote-icon-box"><i class="iconfont icon-toupiao"></i></div>
                <div class="vote-detail">
                  <p class="vote-title">{{ newsInfo.happeningInfo.voteSimpleInfo.title }}</p>
                  <p class="vote-stat">{{ newsInfo.happeningInfo.voteSimpleInfo.voteNumInfo }}人参与&nbsp;&nbsp;{{ newsInfo.happeningInfo.voteSimpleInfo.deadlineInfo }}</p>
                </div>
                <div class="vote-btn-box">
                  <button class="vote-btn">详情</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="newsInfo.happeningInfo.quotedHappening" class="news-item-body" :class="{'news-reference':true}">
            <div v-if="newsInfo.happeningInfo.quotedHappening.happeningInfo.content" class="quote-wrapper">
            <div class="refer-author-box">
              <div class="author-info">
                <img :src="newsInfo.happeningInfo.quotedHappening.publisherInfo.avatarUrl" alt="头像">
                <span class="author-username">{{ newsInfo.happeningInfo.quotedHappening.publisherInfo.username }}</span>
                <span class="refer-text">投稿了文章</span>
              </div>
            </div>
            <div v-if="newsInfo.happeningInfo.quotedHappening.happeningInfo.tag" class="news-tag">
              <i class="iconfont icon-huati"></i>
              <span>{{ newsInfo.happeningInfo.quotedHappening.happeningInfo.tag }}</span>
            </div>
            <div class="news-title">{{ newsInfo.happeningInfo.quotedHappening.happeningInfo.title }}</div>
            <div class="news-text-content" v-html="newsInfo.happeningInfo.quotedHappening.happeningInfo.content"></div>
            <div v-if="newsInfo.happeningInfo.quotedHappening.happeningInfo.imgUrlList" class="news-album">
              <div class="news-album-preview grid">
                <div v-for="(item,index) in newsInfo.happeningInfo.quotedHappening.happeningInfo.imgUrlList" :key="index" class="news-album-preview-picture">
                  <img :src="item" alt="图片">
                </div>
              </div>
            </div>
            <div v-if="false" class="news-video-card">
              <a href="javascript:;" class="news-video-box">
                <div class="video-box-header">
                  <video controls src="/imgs/video.mp4"></video>
                </div>
                <div class="video-box-body">
                  <div class="video-title">vhosnvonvosnovl</div>
                  <div class="video-stat">
                    <div class="video-stat-item">
                      <i class="iconfont icon-shipin"></i>
                      22
                    </div>
                    <div class="video-stat-item">
                      <i class="iconfont icon-icon"></i>
                      11
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div v-if="newsInfo.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo" class="news-book-lives">
              <div class="lives-detail">
                <p class="lives-title">直播预约：{{newsInfo.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.title}}</p>
                <p class="lives-stat">
                  <span class="lives-time">{{ newsInfo.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.liveTimeInfo }} 直播</span>
                  <span class="book-num">{{newsInfo.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.bookNumInfo}}人预约</span>
                </p>
              </div>
              <div class="lives-btn-box">
                <div v-if="username === newsInfo.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.anchorName" class="revoke-btn-box">
                  <button v-if="true" @click.stop="revokeBookLive(newsInfo.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.bookLiveId)" class="book-lives-btn revoke-btn">撤销</button>
                  <button v-else @click.stop="cancelRevokeBookLive" class="book-lives-btn revoked-btn">已撤销</button>
                </div>
                <div v-else class="book-btn-box">
                  <button v-if="newsInfo.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.booked" @click.stop="bookLive(newsInfo.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.bookLiveId)" class="book-lives-btn book-btn">
                    <span><i class="iconfont icon-icon-tixing"></i>预约</span>
                  </button>
                  <button v-else @click.stop="cancelBookLive(newsInfo.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.bookLiveId)" class="book-lives-btn booked-btn">已预约</button>
                </div>
              </div>
            </div>
            <div v-if="newsInfo.happeningInfo.quotedHappening.happeningInfo.voteSimpleInfo" class="news-vote">
              <div @click.stop="handleShowVoteModal(newsInfo.happeningInfo.quotedHappening.happeningInfo.voteSimpleInfo.voteId)" class="news-vote-card">
                <div class="vote-icon-box"><i class="iconfont icon-toupiao"></i></div>
                <div class="vote-detail">
                  <p class="vote-title">{{newsInfo.happeningInfo.quotedHappening.happeningInfo.voteSimpleInfo.title}}</p>
                  <p class="vote-stat">{{newsInfo.happeningInfo.quotedHappening.happeningInfo.voteSimpleInfo.voteNumInfo}}人参与&nbsp;&nbsp;{{ newsInfo.happeningInfo.quotedHappening.happeningInfo.voteSimpleInfo.deadlineInfo }}</p>
                </div>
                <div class="vote-btn-box">
                  <button class="vote-btn">详情</button>
                </div>
              </div>
            </div>
            </div>
            <div v-else class="quoted-isdelete">
              <i class="iconfont icon-jinggao"></i>
              <span>源动态已被作者删除</span>
            </div>
          </div>
        </div>
      </div>
      <div class="side-toolbar">
        <div @click="likeNews(newsInfo.happeningInfo.happeningId, newsInfo.happeningInfo.liked)" class="side-toolbar-item like-info" :class="{'active':newsInfo.happeningInfo.liked}">
          <i class="iconfont icon-dianzan"></i>
          <div class="side-toolbar-item-text">
            {{ newsInfo.happeningInfo.likeNumInfo }}
          </div>
        </div>
        <div @click="showForwardBox = true" class="side-toolbar-item forward-info">
          <i class="iconfont icon-zhuanfa"></i>
          <div class="side-toolbar-item-text">
            {{ newsInfo.happeningInfo.forwardNumInfo }}
          </div>
        </div>
        <div class="side-toolbar-item comment-info">
          <i class="iconfont icon-pinglun"></i>
          <div class="side-toolbar-item-text">
            {{ newsInfo.happeningInfo.commentNumInfo }}
          </div>
        </div>
      </div>
      <div class="item-tabs">
        <div class="tabs-nav-items">
          <div @click="tab = 'comment'" class="tabs-nav-item" :class="{'active':tab === 'comment'}">评论</div>
          <div @click="tab = 'like'" class="tabs-nav-item" :class="{'active':tab === 'like'}">点赞</div>
          <div @click="tab = 'forward'" class="tabs-nav-item" :class="{'active':tab === 'forward'}">转发</div>
          <div class="tabs-active-bar" :style="{transform:tab==='comment'?'translateX(60px)':(tab==='like'?'translateX(132px)':'translate(204px)')}"></div>
        </div>
      </div>
      <div class="item-tabs-content">
        <like-list v-if="tab === 'like'" :likeInfoList="newsInfo.happeningInfo.likeInfoList"></like-list>
        <forward-list v-if="tab === 'forward'" :forwardInfoList="newsInfo.happeningInfo.forwardInfoList"></forward-list>
      </div>
    </div>
  </div>
  <bs-vote-modal
    v-if="showVoteModal"
    @closeVoteModal="showVoteModal = false"
    :voteDetail="voteDetailInfo"
    :voteId="voteId"
  >
  </bs-vote-modal>
  <news-modify-box 
    v-if="showModifyBox"
    @closeModifyBox="showModifyBox = false"
    :newsInfo="newsInfo"
    ref="newsModifyRef"
  >
  </news-modify-box>
  <news-forward-box
    v-if="showForwardBox"
    @closeForwardBox="showForwardBox = false"
    :newsInfo="newsInfo"
    ref="newsForwardRef"
  >
  </news-forward-box>
</template>

<style lang="scss"> 
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .header {
    z-index: 100;
    position: sticky;
    top: 0px;
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
  .news-detail {
    margin: 0 auto;
    margin-top: 8px;
    .bg {
      position: fixed;
      bottom: 0;
      width: $max-width;
      height: 100vh;
      background-image: url('/imgs/news-background.png');
      background-size: cover;
    }
    .news-detail-card {
      position: relative;
      width: 750px;
      margin: 0 auto;
      border-radius: 6px;
      background-color: $colorG;
      .news-item {
        padding: 0 20px 20px 88px;
        margin-bottom: 10px;
        .item-warpper {
          .news-item-avatar {
            position: absolute;
            top: 0;
            left: 0;
            width: 88px;
            height: 88px;
            @include flex(center);
            img {
              height: 48px;
              width: 48px;
              border-radius: 24px;
            }
          }
          .news-item-header {
            position: relative;
            padding-top: 20px;
            margin-bottom: 10px;
            .news-item-author {
              font-size: $fontI;
              color: $colorA;
              font-weight: bold;
            }
            .news-item-early-pub {
              display: inline-block;
              padding: 2px 4px;
              border-radius: 6px;
              margin-left: 10px;
              color: $colorG;
              background-color: #6b09ac;
            }
            .news-item-desc {
              @include flex(left);
              color: $colorD;
              margin-top: 8px;
              .news-item-visibility {
                margin-left: 10px;
                .visibility-item {
                  @include flex(left);
                  .iconfont {
                    font-size: $fontK;
                  }
                }
              }
            }
            .news-item-more-btn {
              position: absolute;
              top: 25px;
              right: 0;
              height: 24px;
              line-height: 24px;
              width: 24px;
              border-radius: 4px;
              text-align: center;
              cursor: pointer;
              &:hover {
                background-color: $colorN;
              }
              .icon-gengduo1 {
                font-size: $fontG;
                color: $colorD;
              }
              .new-item-cascader {
                position: absolute;
                right: 0px;
                top: 24px;
                padding-top: 10px;
                .cascader-list {
                  background-color: $colorG;
                  border: 1px solid $colorN;
                  border-radius: 6px;
                  text-align: left;
                  padding: 12px 0;
                  .cascader-item {
                    padding: 8px 27px;
                    min-width: 82px;
                    &:hover {
                      background-color: $colorN;
                    }
                  }
                }
              }
            }
          }
          .news-item-body {
            &.news-reference {
              margin-top: 10px;
              border-radius: 6px;
              background-color: $colorR;
              .quote-wrapper {
                padding: 20px;
                cursor: pointer;
                .refer-author-box {
                  .author-info {
                    @include flex(left);
                    img {
                      width: 36px;
                      height: 36px;
                      border-radius: 18px;
                    }
                    .author-username {
                      font-size: $fontJ;
                      margin: 0 5px;
                    }
                    .refer-text {
                      color: $colorD;
                    }
                  }
                }
                .news-vote {
                  .news-vote-card {
                    background-color: $colorG;
                    .vote-icon-box {
                      background-color: $colorR;
                    }
                  }
                }
              }
              .quoted-isdelete {
                @include flex(left);
                padding: 8px 15px;
                font-weight: bold;
                color: $colorD;
                .icon-jinggao {
                  font-size: $fontK;
                  margin-right: 5px;
                }
              }
              .news-book-lives {
                background-color: $colorG;
              }
            }
            .news-tag {
              font-size: $fontJ;
              color: $colorP;
              font-weight: 500;
              cursor: pointer;
              margin-top: 10px;
              &:hover {
                color: $colorM;
              }
              .icon-huati {
                margin-right: 5px;
              }
            }
            .news-title {
              font-size: $fontJ;
              font-weight: bold;
              margin-top: 15px;
            }
            .news-text-content {
              margin-top: 10px;
              font-size: $fontJ;
              img{
                height: 20px;
                width: 20px;
                vertical-align: middle;
              }
              .username {
                color: $colorM;
              }
            }
            .news-album {
              // width: 470px;
              width: 100%;
              margin-top: 15px;
              margin-bottom: 15px;
              .single {
                .news-album-preview-picture {
                  img {
                    max-width: 100%;
                    max-height: 280px;
                    object-fit: cover;
                    border-radius: 10px;
                    box-shadow: 0 0 1px $colorD;
                  }
                }
              }
              .grid {
                display: inline-grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 6px;
                .news-album-preview-picture {
                  img {
                    height: 132px;
                    width: 132px;
                    border-radius: 10px;
                    box-shadow: 0 0 1px $colorD;
                  }
                }
              }
            }
            .news-video-card {
              .news-video-box {
                display: flex;
                height: 150px;
                border: 1px solid $colorF;
                border-radius: 6px;
                .video-box-header {
                  width: 45%;
                  video {
                    height: 100%;
                    width: 100%;
                    border-top-left-radius: 6px; 
                    border-bottom-left-radius: 6px; 
                    object-fit: cover;
                  }
                }
                .video-box-body {
                  position: relative;
                  width: 55%;
                  padding: 15px;
                  box-sizing: border-box;
                  .video-title {
                    width: 100%;
                    height: 95px;
                    font-size: $fontJ;
                    color: $colorB;
                    overflow: hidden;
                  }
                  .video-stat {
                    position: absolute;
                    bottom: 10px;
                    display: flex;
                    align-items: center;
                    color: $colorD;
                    .video-stat-item {
                      font-size: $fontJ;
                      margin-right: 30px;
                      .icon-icon {
                        font-size: $fontH;
                      }
                    }
                  }
                }
              }
            }
            .news-book-lives {
              @include flex();
              height: 80px;
              width: 100%;
              padding: 0 15px;
              margin-top: 10px;
              box-sizing: border-box;
              border-radius: 6px;
              background-color: $colorR;
              .lives-detail {
                .lives-title {
                  font-size: $fontJ;
                }
                .lives-stat {
                  color: $colorD;
                  margin-top: 4px;
                  .lives-time {
                    margin-right: 10px
                  }
                }
              }
              .lives-btn-box {
                .book-lives-btn {
                  background-color: $colorM;
                  border: none;
                  height: 30px;
                  min-width: 72px;
                  border-radius: 6px;
                  color: $colorG;
                  cursor: pointer;
                  .icon-icon-tixing {
                    font-size: $fontJ;
                    margin-right: 4px;
                  }
                }
                .booked-btn {
                  background-color: $colorE;
                  &:hover {
                    background-color: $colorF;
                  }
                }
                .revoked-btn {
                  background-color: $colorE;
                }
                .book-btn,.revoke-btn {
                  &:hover {
                    background-color: $colorP;
                  }
                }
              }
            }
            .news-vote {
              margin-top: 10px;
              width: 100%;
              border-radius: 6px;
              .news-vote-card{
                @include flex();
                height: 80px;
                width: 100%;
                padding: 0 15px;
                box-sizing: border-box;
                border-radius: 6px;
                background-color: $colorR;
                cursor: pointer;
                .vote-icon-box {
                  @include flex(center);
                  width: 62px;
                  height: 64px;
                  border-radius: 6px;
                  background-color: $colorG;
                  .icon-toupiao {
                    font-size: $fontD;
                  }
                }
                .vote-detail {
                  flex: 1;
                  margin-left: 10px;
                  .vote-title {
                    font-size: $fontJ;
                    &:hover {
                      color: $colorM;
                    }
                  }
                  .vote-stat {
                    color: $colorD;
                    margin-top: 4px
                  }
                }
                .vote-btn-box {
                  .vote-btn {
                    background-color: $colorM;
                    border: none;
                    height: 30px;
                    min-width: 72px;
                    border-radius: 6px;
                    color: $colorG;
                    cursor: pointer;
                    &:hover {
                      background-color: $colorP;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .side-toolbar {
        position: fixed;
        top: 180px;
        padding: 12px 6px;
        margin-left: 766px;
        border-radius: 6px;
        background-color: $colorG;
        .side-toolbar-item {
          @include flex(space-between);
          flex-direction: column;
          width: 46px;
          cursor: pointer;
          &.forward-info {
            margin: 10px 0;
          }
          &.active {
            color: $colorM;
          }
          &:hover {
            color: $colorM;
          }
          .iconfont {
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            font-size: $fontG;
            &.icon-zhuanfa {
              font-size: $fontH;
            }
          }
          .side-toolbar-item-text {
            margin-top: 4px;
            font-size: $fontJ;
          }
        }
      }
      .item-tabs {
        .tabs-nav-items {
          @include flex(left);
          position: relative;
          padding: 10px 24px;
          border-bottom: 1px solid $colorH;
          .tabs-nav-item {
            font-size: $fontH;
            margin-left: 36px;
            color: $colorC;
            cursor: pointer;
            &.active {
              color: $colorM;
            }
          }
          .tabs-active-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            width: 36px;
            background-color: $colorM;
            transform: translateX(60px);
            transition: all .2s;
          }
        }
      }
      .item-tabs-content {
        padding: 14px 60px;
        min-height: 480px;
        margin-bottom: 20px;
      }
    }
  }
  .confirmButtonClass {
    background-color: #f85a54;
    border: none;
    &:hover {
      background-color: #f85a54;
    }
  }
</style>