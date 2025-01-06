<script setup>
  import BsEmoji from '@/components/input/BsEmoji.vue';
  import BsTagSelect from '@/components/news/BsTagSelect.vue';
  import BsVoteModal from '@/components/news/BsVoteModal.vue'
  import BsInput from '@/components/input/BsInput.vue';
  import BsHtmlText from '@/components/common/BsHtmlText.vue'
  import Loading from '@/components/common/Loading.vue'
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { onMounted, ref } from 'vue';
  import handleNumInfo from '@/hooks/handleNumInfo'
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import useUser from '@/store/user';
  import {fowardNewsApi,getNewsListApi,deleteNewsApi,likeNewsApi} from '@/api/news'
  import {revokeBookLiveApi,modBookLiveStateApi} from '@/api/bookLive'

  /* Store */
  const userStore = useUser()
  const {username,avatarUrl} = storeToRefs(userStore)
  /* Router */
  const router = useRouter()
  /* Props */
  defineProps(['tab'])
  /* onMounted */
  const userId = ref(null)
  onMounted(() => {
    loadMoreNews()
  })
  //#region 预约直播
  function revokeBookLive(bookLiveId,index) {
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
      newsList.value[index].happeningInfo.bookLiveInfo.canceled = 1
      ElMessage({ 
        type: 'info',
        message: '已撤销',
      })
    })
  }
  function cancelRevokeBookLive() {
    ElMessage.info('该直播预约已撤销')
  }
  async function bookLive(bookLiveId,index) {
    await modBookLiveStateApi({
      bookLiveId,
      booked:0
    })
    newsList.value[index].happeningInfo.bookLiveInfo.booked = 0
    ElMessage.success('预约成功')
  }
  async function cancelBookLive(bookLiveId,index) {
    await modBookLiveStateApi({
      bookLiveId,
      booked:1
    })
    newsList.value[index].happeningInfo.bookLiveInfo.booked = 1
    ElMessage.info('已取消预约')
  }
  //#endregion
  //#region 投票
  const showVoteModal = ref(false)
  function closeVoteModal() {
    showVoteModal.value = false
  }
  const voteDetailInfo = ref({})
  const voteId = ref(null)
  async function handleShowVoteModal(id) {
    voteId.value = id
    showVoteModal.value = true
  }
  //#endregion
  //#region 标签
  /* forwardTagId */
  const forwardTagIdList = ref([])
  function changeForwardTagId(index,id) {
    forwardTagIdList.value[index] = id
  }
  //#endregion
  //#region 动态转发输入框
  const inputBoxRefList = ref([])
  const inputMethodsList = ref([])
  function getInputBoxRef(el, index) {
    inputBoxRefList.value[index] = el
  }
  function getInputMethods(el, index) {
    inputMethodsList.value[index] = el
  }
  /* 输入表情包 */
  function insertEmoji(emojiUrl, inputMethods, inputRef) {
    inputMethods.insertEmoji(emojiUrl, inputRef)
  }

  /* 转发动态 */
  async function forwardNews(index) {
    let content = inputBoxRefList.value[index].children[0].innerHTML ? inputBoxRefList.value[index].children[0].innerHTML : '转发动态'
    let tagId = forwardTagIdList.value[index]
    let quotedHappeningId = newsList.value[index].happeningInfo.quotedHappening ? newsList.value[index].happeningInfo.quotedHappening.happeningInfo.happeningId : newsList.value[index].happeningInfo.happeningId
    await fowardNewsApi({
      quotedHappeningId,
      content,
      tagId
    })
    ElMessage.success('转发成功')
    inputBoxRefList.value[index].children[0].innerHTML = ''
    inputMethodsList.value[index].handleContentNum(inputBoxRefList.value[index].children[0])
    forwardTagIdList.value[index] = null
    newsList.value[index].showForward = false
    newsList.value[index].forwardNumInfo++
  }
  function showForwardInput(index, showForward) {
    !showForward ? newsList.value[index].showForward = true : newsList.value[index].showForward = false
  }
  function showEmojiBoxForward(index,showEmojiBox){
    !showEmojiBox ? newsList.value[index].showEmojiBox = true : newsList.value[index].showEmojiBox = false
  }
  //#endregion
  //#region 动态
  /* 滚动加载 */
  let newsList = ref([])
  const busy = ref(false)
  const newsLoading = ref(false)
  const pageNum = ref(1)
  const pageSize = ref(20)
  const isArriveTotal = ref(false)
  function loadMoreNews() {
    if(isArriveTotal.value) return
    newsLoading.value = true
    busy.value = true;
    setTimeout(async () => {
      const newsRes = await getNewsListApi({
        pageNum:pageNum.value++,
        pageSize:pageSize.value,
        selectedUserId:userId.value
      })
      newsList.value.push(...newsRes.records)
      if(newsRes.total <= newsList.value.length) isArriveTotal.value = true
      busy.value = false;
      newsLoading.value = false
    }, 500);
  }
  /* 删除动态 */
  async function deleteNews(id,index) {
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
      newsList.value[index].content = ''
      ElMessage.info('删除成功')
      pageNum.value = 1
      isArriveTotal.value = false
      newsList.value = []
      loadMoreNews()
    })
  }
  /* 点赞/取消点赞 */
  async function likeNews(item) {
    await likeNewsApi({
      happeningId:item.happeningId,
      liked:item.liked ? 0 : 1
    })
    if(item.liked) {
      ElMessage.info('已取消点赞')
      item.likeNumInfo = handleNumInfo(item.likeNumInfo, -1)
      item.liked = 0
    } else {
      ElMessage.success('点赞成功')
      item.likeNumInfo = handleNumInfo(item.likeNumInfo, 1)
      item.liked = 1
    }
  }
  //#endregion
  //#region 查看指定用户动态
  function getUserNewsList(id) {
    userId.value = id
    pageNum.value = 1
    newsList.value.splice(0, newsList.value.length)
    isArriveTotal.value = false
    newsLoading.value = true
    setTimeout(async () => {
      const newsRes = await getNewsListApi({
        pageNum:pageNum.value++,
        pageSize:pageSize.value,
        selectedUserId:id
      })
      newsList.value.push(...newsRes.records)
      if(newsRes.total <= newsList.value.length) isArriveTotal.value = true
      newsLoading.value = false
    }, 500);
  }
  //#endregion 
  function toDetail(articleId, happeningId) {
    const page = router.resolve({
      name:'news_detail',
      query:{
        articleId,
        happeningId
      }
    })
    window.open(page.href)
  }
  defineExpose({
    getUserNewsList
  })
</script>

<template>
  <div class="news-list">
    <div v-for="(item,index) in newsList" :key="index" class="news-item">
      <div v-if="item.happeningInfo.content || item.happeningInfo.articleInfo" class="item-warpper">
        <a class="news-item-avatar" :href="`/#/home/${item.publisherInfo.userId}`">
          <img :src="item.publisherInfo.avatarUrl" alt="头像">
        </a>
        <div class="news-item-header">
          <a class="news-item-author" :href="`/#/home/${item.publisherInfo.userId}`">{{ item.publisherInfo.username }}</a>
          <span v-if="!item.happeningInfo.advanceRelease" class="news-item-early-pub">提前发布</span>
          <div class="news-item-desc">
            <span class="pubtime">{{ item.happeningInfo.pubTimeInfo }}</span>
            <span v-if="item.happeningInfo.articleInfo" class="news-type">投稿了文章</span>
              <div v-if="item.happeningInfo.tag" class="news-tag">
              <i class="iconfont icon-huati"></i>
              <span>{{ item.happeningInfo.tag }}</span>
            </div>
          </div>
          <div @mouseenter="newsList[index].isOpen = true" @mouseleave="newsList[index].isOpen = false" class="news-item-more-btn">
            <i class="iconfont icon-gengduo1"></i>
            <div v-if="newsList[index].isOpen" class="new-item-cascader">
              <div v-if="username !== item.publisherInfo.username" class="cascader-list">
                <div class="cascader-item">取消关注</div>
                <div class="cascader-item">举报</div>
              </div>
              <div v-else class="cascader-list">
                <div @click.stop="deleteNews(item.happeningInfo.happeningId,index)" class="cascader-item">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div @click="toDetail(item.happeningInfo.articleInfo.articleId)" v-if="item.happeningInfo.articleInfo" class="news-article-content">
          <div class="article-title">{{ item.happeningInfo.articleInfo.title }}</div>
          <div class="article-summary">{{ item.happeningInfo.articleInfo.summary }}</div>
        </div>
        <div v-else class="news-item-body">
          <div class="news-content">
            <div @click="toDetail(null,item.happeningInfo.happeningId)" class="news-title">{{ item.happeningInfo.title }}</div>
            <div @click="toDetail(null,item.happeningInfo.happeningId)" class="news-text-content">
              <bs-html-text :content="item.happeningInfo.content" :atUserInfoList="item.happeningInfo.atUserInfoList"></bs-html-text>
            </div>
          </div>
          <div v-if="item.happeningInfo.imgUrlList.length" class="news-album">
            <div class="news-album-preview grid">
              <div v-for="(item, index) in item.happeningInfo.imgUrlList" :key="index" class="news-album-preview-picture">
                <img v-lazy="item" alt="图片">
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
          <div v-if="item.happeningInfo.bookLiveInfo" class="news-book-lives">
            <div class="lives-detail">
              <p class="lives-title">直播预约：{{ item.happeningInfo.bookLiveInfo.title }}</p>
              <p class="lives-stat">
                <span class="lives-time">{{ item.happeningInfo.bookLiveInfo.liveTimeInfo }} 直播</span>
                <span class="book-num">{{ item.happeningInfo.bookLiveInfo.bookNumInfo }}人预约</span>
              </p>
            </div>
            <div class="lives-btn-box">
              <div v-if="username === item.publisherInfo.username" class="revoke-btn-box">
                <button v-if="!item.happeningInfo.bookLiveInfo.canceled" @click.stop="revokeBookLive(item.happeningInfo.bookLiveInfo.bookLiveId,index)" class="book-lives-btn revoke-btn">撤销</button>
                <button v-else @click.stop="cancelRevokeBookLive" class="book-lives-btn revoked-btn">已撤销</button>
              </div>
              <div v-else class="book-btn-box">
                <button  v-if="item.happeningInfo.bookLiveInfo.booked" @click.stop="bookLive(item.happeningInfo.bookLiveInfo.bookLiveId,index)" class="book-lives-btn book-btn">
                  <span><i class="iconfont icon-icon-tixing"></i>预约</span>
                </button>
                <button v-else @click.stop="cancelBookLive(item.happeningInfo.bookLiveInfo.bookLiveId,index)" class="book-lives-btn booked-btn">已预约</button>
              </div>
            </div>
          </div>
          <div v-if="item.happeningInfo.voteSimpleInfo" class="news-vote">
            <div @click.stop="handleShowVoteModal(item.happeningInfo.voteSimpleInfo.voteId)" class="news-vote-card">
              <div class="vote-icon-box"><i class="iconfont icon-toupiao"></i></div>
              <div class="vote-detail">
                <p class="vote-title">{{ item.happeningInfo.voteSimpleInfo.title }}</p>
                <p class="vote-stat">{{ item.happeningInfo.voteSimpleInfo.voteNumInfo }}人参与&nbsp;&nbsp;{{ item.happeningInfo.voteSimpleInfo.deadlineInfo }}</p>
              </div>
              <div class="vote-btn-box">
                <button class="vote-btn">详情</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="item.happeningInfo.quotedHappening" class="news-item-body news-reference">
          <div v-if="item.happeningInfo.quotedHappening.happeningInfo.content || item.happeningInfo.quotedHappening.happeningInfo.articleInfo" class="quote-wrapper">
            <div class="quote-header">
              <div class="refer-author-box">
                <div class="author-info">
                  <img :src="item.happeningInfo.quotedHappening.publisherInfo.avatarUrl" alt="头像">
                  <span class="author-username">{{ item.happeningInfo.quotedHappening.publisherInfo.username }}</span>
                  <span v-if="item.happeningInfo.quotedHappening.happeningInfo.articleInfo" class="refer-text">投稿了文章</span>
                </div>
              </div>
              <div v-if="item.happeningInfo.quotedHappening.happeningInfo.tag" class="news-tag">
                <i class="iconfont icon-huati"></i>
                <span>{{ item.happeningInfo.quotedHappening.happeningInfo.tag }}</span>
              </div>
            </div>
            <div v-if="item.happeningInfo.quotedHappening.happeningInfo.articleInfo" @click="toDetail(item.happeningInfo.quotedHappening.happeningInfo.articleInfo.articleId)" class="news-article-content">
              <div class="article-title">{{ item.happeningInfo.quotedHappening.happeningInfo.articleInfo.title }}</div>
              <div class="article-summary">{{ item.happeningInfo.quotedHappening.happeningInfo.articleInfo.summary }}</div>   
            </div>
            <div v-else class="quote-body">
              <div class="news-content">
                <div @click="toDetail(null,item.happeningInfo.quotedHappening.happeningInfo.happeningId,)" class="news-title">{{ item.happeningInfo.quotedHappening.happeningInfo.title }}</div>
                <div @click="toDetail(null,item.happeningInfo.quotedHappening.happeningInfo.happeningId,)" class="news-text-content">
                  <bs-html-text :content="item.happeningInfo.quotedHappening.happeningInfo.content" :atUserInfoList="item.happeningInfo.quotedHappening.happeningInfo.atUserInfoList"></bs-html-text>
                </div>
              </div>
              <div v-if="item.happeningInfo.quotedHappening.happeningInfo.imgUrlList.length" class="news-album">
                <div class="news-album-preview grid">
                  <div v-for="(item,index) in item.happeningInfo.quotedHappening.happeningInfo.imgUrlList" :key="index" class="news-album-preview-picture">
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
              <div v-if="item.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo" class="news-book-lives">
                <div class="lives-detail">
                  <p class="lives-title">直播预约：{{item.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.title}}</p>
                  <p class="lives-stat">
                    <span class="lives-time">{{ item.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.liveTimeInfo }} 直播</span>
                    <span class="book-num">{{item.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.bookNumInfo}}人预约</span>
                  </p>
                </div>
                <div class="lives-btn-box">
                  <div v-if="username === item.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.anchorName" class="revoke-btn-box">
                    <button v-if="true" @click.stop="revokeBookLive(newsInfo.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.bookLiveId)" class="book-lives-btn revoke-btn">撤销</button>
                    <button v-else @click.stop="cancelRevokeBookLive" class="book-lives-btn revoked-btn">已撤销</button>
                  </div>
                  <div v-else class="book-btn-box">
                    <button v-if="item.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.booked" @click.stop="bookLive(newsInfo.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.bookLiveId)" class="book-lives-btn book-btn">
                      <span><i class="iconfont icon-icon-tixing"></i>预约</span>
                    </button>
                    <button v-else @click.stop="cancelBookLive(newsInfo.happeningInfo.quotedHappening.happeningInfo.bookLiveInfo.bookLiveId)" class="book-lives-btn booked-btn">已预约</button>
                  </div>
                </div>
              </div>
              <div v-if="item.happeningInfo.quotedHappening.happeningInfo.voteSimpleInfo" class="news-vote">
                <div @click.stop="handleShowVoteModal(item.happeningInfo.quotedHappening.happeningInfo.voteSimpleInfo.voteId)" class="news-vote-card">
                  <div class="vote-icon-box"><i class="iconfont icon-toupiao"></i></div>
                  <div class="vote-detail">
                    <p class="vote-title">{{item.happeningInfo.quotedHappening.happeningInfo.voteSimpleInfo.title}}</p>
                    <p class="vote-stat">{{item.happeningInfo.quotedHappening.happeningInfo.voteSimpleInfo.voteNumInfo}}人参与&nbsp;&nbsp;{{ item.happeningInfo.quotedHappening.happeningInfo.voteSimpleInfo.deadlineInfo }}</p>
                  </div>
                  <div class="vote-btn-box">
                    <button class="vote-btn">详情</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="quoted-isdelete">
            <i class="iconfont icon-jinggao"></i>
            <span>源动态已被作者删除</span>
          </div>
        </div>
        <div class="news-item-footer">
          <div @click.stop="showForwardInput(index,item.showForward)" class="footer-item news-zhuanfa" :class="{'highlight':item.showForward}">
            <i class="iconfont icon-zhuanfa"></i>
            {{ item.happeningInfo.forwardNumInfo === '0' ? '转发' : item.happeningInfo.forwardNumInfo}}
          </div>
          <div @click.stop="toDetail(item.happeningInfo.articleInfo?.articleId,item.happeningInfo.happeningId)" class="footer-item item-comment">
            <i class="iconfont icon-pinglun"></i>
            {{ item.happeningInfo.commentNumInfo === '0' ? '评论' : item.happeningInfo.commentNumInfo }}
          </div>
          <div @click.stop="likeNews(item.happeningInfo)" class="footer-item news-like" :class="{'highlight':item.happeningInfo.liked}">
            <i class="iconfont icon-dianzan"></i>
            {{ item.happeningInfo.likeNumInfo === '0' ? '点赞' : item.happeningInfo.likeNumInfo}}
          </div>
        </div>
        <div v-show="item.showForward" class="item-forward-box">
          <div class="forward-body">
            <div class="avatar-box">
              <img :src="avatarUrl" alt="头像">
            </div>
            <div class="forward-input-box">
              <bs-tag-select @getSelectTagId="changeForwardTagId(index,$event)"></bs-tag-select>
              <div :ref="el => getInputBoxRef(el, index)" class="input-box">
                <bs-input :ref="el => getInputMethods(el, index)" placeholder="有什么想说的呢？"></bs-input>
              </div>
            </div>
          </div>
          <div class="forward-footer">
            <div class="emoji-btn">
              <i @click.stop="showEmojiBoxForward(index,item.showEmojiBox)" :class="{'active':item.showEmojiBox}" class="iconfont icon-biaoqing"></i>
              <div v-if="item.showEmojiBox" class="emoji-box">
                <bs-emoji @insertEmoji="insertEmoji($event, inputMethodsList[index], inputBoxRefList[index].children[0])"></bs-emoji>
              </div>
            </div>
            <div class="wrapper">
              <button @click.stop="forwardNews(index)" class="forward-btn">转发</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="load-more-news"
    v-infinite-scroll="loadMoreNews" 
    :infinite-scroll-disabled="busy" 
    infinite-scroll-distance="50"
  >
    <loading v-show="!isArriveTotal && newsLoading"></loading>
  </div>
  <div v-show="isArriveTotal" class="prompt">已经到最底啦~</div>
  <bs-vote-modal
    v-if="showVoteModal"
    @closeVoteModal="closeVoteModal"
    :voteDetail="voteDetailInfo"
    :voteId="voteId"
  >
  </bs-vote-modal>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .news-list {
    width: 100%;
    .news-item {
      position: relative;
      width: 100%;
      padding: 0 20px 0 88px;
      box-sizing: border-box;
      margin-bottom: 10px;
      background-color: $colorG;
      border: 1px solid rgba(0, 0, 0, .07);
      border-radius: 6px;
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
          color: $colorD;
          margin-top: 8px;
          .pubtime {
            margin-right: 8px;
          }
          .news-tag {
            @include flex(left);
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
              min-width: 132px;
              .cascader-item {
                padding: 8px 27px;
                &:hover {
                  background-color: $colorN;
                }
              }
            }
          }
        }
      }
      .news-article-content {
        margin-top: 10px;
        font-size: $fontJ;
        .article-title {
          font-weight: bold;
          cursor: pointer;
        }
        .article-summary {
          margin-top: 6px;
          cursor: pointer;
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
            .quote-header {
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
            }
            .news-article-content {
              margin-top: 12px;
            }
            .quote-body {
              .news-vote {
                .news-vote-card {
                  background-color: $colorG;
                  .vote-icon-box {
                    background-color: $colorR;
                  }
                }
              }
              .news-book-lives {
                background-color: $colorG
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
        .news-content {
          margin-top: 10px;
          .news-title {
            font-size: $fontJ;
            font-weight: bold;
            margin-top: 15px;
            cursor: pointer;
          }
          .news-text-content {
            margin-top: 6px;
            font-size: $fontJ;
            cursor: pointer;
            img{
              height: 20px;
              width: 20px;
              vertical-align: middle;
            }
            .username {
              color: $colorM;
            }
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
      .news-item-footer {
        @include flex();
        height: 50px;
        padding-right: 50px;
        box-sizing: border-box;
        color: $colorD;
        font-size: $fontJ;
        .footer-item {
          min-width: 100px;
          cursor: pointer;
          &:hover {
            color: $colorM;
          }
          &.highlight {
            color: $colorM;
          }
        }
      }
      .item-forward-box {
        padding: 15px 0;
        .forward-body {
          display: flex;
          .avatar-box {
            img {
              width: 30px;
              height: 30px;
              border-radius: 15px;
            }
          }
          .forward-input-box {
            min-height: 70px;
            flex: 1;
            padding: 10px;
            border: 1px solid $colorF;
            border-radius: 6px;
            box-sizing: border-box;
            margin-left: 8px;
            &:hover {
              border: 1px solid $colorM;
            }
            .input-box {
              position: relative;
            }
          }
        }
        .forward-footer {
          @include flex();
          padding-left: 40px;
          margin-top: 12px;
          box-sizing: border-box;
          .emoji-btn {
            position: relative;
            cursor: pointer;
            &:hover {
              color: $colorM;
            }
            .icon-biaoqing {
              font-weight: bold;
              font-size: $fontH;
            }
            .emoji-box {
              z-index: 10;
              position: absolute;
              top: 35px;
              left: -5px;
              background-color: $colorG;
              border-radius: 6px;
            }
          }
          .wrapper {
            .stat {
              color: $colorD;
            }
            .forward-btn {
              width: 56px;
              height: 26px;
              border: none;
              margin-left: 8px;
              border-radius: 6px;
              background-color: $colorM;
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
  .load-more-news {
    @include flex(center);
  }
  .prompt {
    color: $colorD;
    text-align: center;
    padding: 8px 0;
    font-size: $fontJ;
  }
  .confirmButtonClass {
    background-color: #f85a54;
    border: none;
    &:hover {
      background-color: #f85a54;
    }
  }
</style>