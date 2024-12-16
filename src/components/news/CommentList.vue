<script setup>
  import { onMounted, ref } from 'vue';
  import BsInputBox from '@/components/input/BsInputBox.vue'
  import BsHtmlText from '@/components/common/BsHtmlText.vue';
  import Loading from '@/components/common/Loading.vue'
  import { ElMessage, ElPagination } from 'element-plus';
  import {throttle} from '@/hooks/performance'
  import handleNumInfo from '@/hooks/handleNumInfo';
  import useUser from '@/store/user'
  import router from '@/router/index'
  import {getBldgCommentApi,getLayerCommentApi,deleteCommentApi,replyCommentApi,commentHappeningApi,likeCommentApi} from '../../api/comment'

  const props = defineProps(['happeningId','advanceRelease'])
  const userStore = useUser()
  onMounted(() => {
    loadMore()
  })
  //#region 排序方式
  const order = ref(0)
  async function changeOrder(newOrder) {
    if(newOrder === order.value) return
    order.value = newOrder
    pageNum.value = 1
    isArriveTotal.value = false
    bldgCommentList.value = []
    loadMore()
  }
  //#endregion
  //#region 控制底部评论输入框展示
  const headerRef = ref()
  const showCommentFooter = ref(false)
  document.addEventListener('scroll', throttle(() => {
    if(document.documentElement.scrollTop >= headerRef.value.offsetTop + headerRef.value.offsetHeight) {
      showCommentFooter.value = true
    } else {
      showCommentFooter.value = false
    }
  }))
  //#endregion
  //#region 加载
  const bldgCommentList = ref([])
  const busy = ref(false)
  const loading = ref(false)
  const isArriveTotal = ref(false)
  const pageNum = ref(1)
  const pageSize = ref(3)
  function loadMore() {
    if(isArriveTotal.value) return
    busy.value = true
    loading.value = true
    setTimeout(async () => {
      const res = await getBldgCommentApi({
        pageNum:pageNum.value++,
        pageSize:pageSize.value,
        happeningId:props.happeningId,
        order:order.value
      })
      bldgCommentList.value.push(...res.bldgCommentList)
      if(bldgCommentList.value.length >= res.bldgTotal) isArriveTotal.value = true
      busy.value = false
      loading.value = false
    }, 500);
  }
  //#endregion
  //#region 输入框和层评论
  const activeReplyInputIndex = ref('')
  const replyCommentId = ref('')
  const replyUserId = ref('')
  const replyPlaceholder = ref('')
  const inputRefList = ref([])
  function getInputRef(el, index) {
    inputRefList.value[index] = el
  }
  function handleShowReplyInput(index, commentId, username, userId) {
    if(commentId === replyCommentId.value) {
      activeReplyInputIndex.value = ''
      replyCommentId.value = ''
      return
    }
    replyCommentId.value = commentId
    replyUserId.value = userId
    activeReplyInputIndex.value = index
    replyPlaceholder.value = `回复 @${username} :`
    window.scrollTo({
      top:inputRefList.value[index].getBoundingClientRect().top+document.documentElement.scrollTop-500,
      behavior:'smooth'
    })
  }
  async function showLayerComment(pageNum, index, commentId) {
    const res = await getLayerCommentApi({
      pageNum:pageNum,
      pageSize:10,
      commentId:commentId
    })
    activeReplyInputIndex.value = index
    bldgCommentList.value[index].layerCommentList = res.layerCommentList
    bldgCommentList.value[index].layerPageNum = pageNum
  }
  //#endregion
  //#region 评论
  /* 发布评论 */
  async function publishComment(content, happeningId) {
    await commentHappeningApi({
      happeningId,
      content,
    })
    ElMessage.success('评论成功')
    pageNum.value = 1
    bldgCommentList.value = []
    isArriveTotal.value = false
    loadMore()
  }
  /* 回复评论 */
  async function replyComment(content, commentId, index) {
    await replyCommentApi({
      content,
      repliedCommentId:replyCommentId.value,
      repliedUserId:replyUserId.value
    })
    ElMessage.success('评论成功')
    bldgCommentList.value[index].layerPageNum = Math.ceil((++bldgCommentList.value[index].replyNum)/10)
    showLayerComment(bldgCommentList.value[index].layerPageNum, index, commentId)
  }
  /* 删除评论 */
  async function deleteComment(commentId, bldgCommentId, index) {
    await deleteCommentApi({
      commentId
    })
    ElMessage.info('删除成功')
    if(bldgCommentId) {
      bldgCommentList.value[index].replyNum--
      if((bldgCommentList.value[index].layerPageNum - 1)*10 >= bldgCommentList.value[index].replyNum) {
        bldgCommentList.value[index].layerPageNum--
      }
      showLayerComment(bldgCommentList.value[activeReplyInputIndex.value].layerPageNum, index, bldgCommentId)
    }
  }
  /* 点赞/取消点赞评论 */
  async function likeComment(item) {
    await likeCommentApi({
      commentId:item.commentId,
      liked:item.liked ? 0 : 1
    })
    if(item.liked) {
      item.liked = 0
      item.likeNumInfo = handleNumInfo(item.likeNumInfo, -1)
    } else {
      item.liked = 1
      item.likeNumInfo = handleNumInfo(item.likeNumInfo, 1)
    }
  }
  //#endregion
</script>

<template>
  <div v-if="advanceRelease" class="advanceRelease">
    <div class="avatar-box">
      <img :src="userStore.avatarUrl" alt="">
    </div>
    <div class="text-box">
      <span>评论区已关闭</span>
    </div>
  </div>
  <div v-else class="news-comment-list">
    <div class="news-comment-wrap">
      <div ref="headerRef" class="news-comment-header">
        <div class="comment-order">
          <button @click="changeOrder(0)" class="order-action hot" :class="{'active':order === 0}">最热</button>
          <div class="order-div"></div>
          <button @click="changeOrder(1)" class="order-action time" :class="{'active':order === 1}">最新</button>
        </div>
        <div ref="headerInputBoxRef" class="comment-header-input">
          <bs-input-box @publish="publishComment($event, happeningId)" :hideFooter="true" placeholder="你猜我在评论区等着谁？"></bs-input-box>
        </div>
      </div>
      <div class="news-comment-body">
        <ul class="bldg-comment-ul">
          <li v-for="(item,index) in bldgCommentList" :key="index" class="bldg-comment-li">
            <a class="bldg-avatar-box" :href="`/#/mainInterface/${item.userInfo.userId}`" target="_blank">
              <img :src="item.userInfo.avatarUrl">
            </a>
            <div @mouseenter="item.showSettingBtn = true" @mouseleave = "item.showSettingBtn = false" class="bldg-comment-main">
              <div class="main-header">
                <a :href="`/#/mainInterface/${item.userInfo.userId}`" target="_blank">{{ item.userInfo.username }}</a>
              </div>
              <div class="main-content">
                <bs-html-text :content="item.content" :atUserInfoList="item.atUserInfoList"></bs-html-text>
              </div>
              <div class="main-footer">
                <div class="pub-time">{{ item.pubTimeInfo }}</div>
                <div @click="likeComment(item)" class="like" :class="{'avtive':item.liked}">
                  <i class="iconfont icon-dianzan"></i>
                  <span v-if="item.likeNumInfo" class="like-num">{{ item.likeNumInfo }}</span>
                </div>
                <div @click="handleShowReplyInput(index, item.commentId, item.userInfo.username, item.userInfo.userId)" class="reply">
                  <button class="reply-btn">回复</button>
                </div>
                <button v-if="item.showSettingBtn" @mouseenter="item.showSettingContent = true" @mouseleave="item.showSettingContent = false" class="more">
                  <i class="iconfont icon-gengduo1"></i>
                  <div v-if="item.showSettingContent" class="more-box">
                    <div @click="deleteComment(item.commentId)" v-if="userStore.userId === item.userInfo.userId" class="setting-ul self">
                      <div class="setting-li">删除</div>
                    </div>
                    <div v-else class="setting-ul not-self">
                      <div class="setting-li">加入黑名单</div>
                      <div class="setting-li">举报</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div class="expander">
              <div v-if="item.replyNum && !item.layerCommentList" class="expand-more">
                <span>查看 {{ item.replyNumInfo }} 条回复，</span>
                <button @click="showLayerComment(1,index,item.commentId)" class="view-more-btn">点击查看</button>
              </div>
              <ul class="layer-comment-ul">
                <li v-for="(item2) in item.layerCommentList" :key="item2.commentId" class="layer-comment-li">
                  <a class="layer-avatar-box" :href="`/#/mainInterface/${item2.userInfo.userId}`" target="_blank">
                    <img :src="item2.userInfo.avatarUrl">
                  </a>
                  <div @mouseenter="item2.showSettingBtn = true" @mouseleave = "item2.showSettingBtn = false" class="layer-comment-main">
                    <span class="main-header">
                      <a :href="`/#/mainInterface/${item2.userInfo.userId}`" target="_blank">{{ item2.userInfo.username }}</a>
                      <span v-if="item2.repliedUserName"> 回复 <span class="username" @click="router.push(`/mainInterface/${item2.repliedUserId}`)">{{'@' + item2.repliedUserName }}</span> ：</span>
                      <span v-else> ：</span>
                    </span>
                    <span class="main-content">
                      <bs-html-text :content="item2.content" :atUserInfoList="item2.atUserInfoList"></bs-html-text>
                    </span>
                    <div class="main-footer">
                      <div class="pub-time">{{ item2.pubTimeInfo }}</div>
                      <div @click="likeComment(item2)" class="like" :class="{'active':item2.liked}">
                        <i class="iconfont icon-dianzan"></i>
                        <span v-if="item2.likeNumInfo" class="like-num">{{ item2.likeNumInfo }}</span>
                      </div>
                      <div class="reply">
                        <button @click="handleShowReplyInput(index, item2.commentId, item2.userInfo.username, item2.userInfo.userId)" class="reply-btn">回复</button>
                      </div>
                      <button v-if="item2.showSettingBtn" @mouseenter="item2.showSettingContent = true" @mouseleave="item2.showSettingContent = false" class="more">
                        <i class="iconfont icon-gengduo1"></i>
                        <div v-if="item2.showSettingContent" class="more-box">
                          <div @click="deleteComment(item2.commentId, item.commentId, index)" v-if="userStore.userId === item2.userInfo.userId" class="setting-ul self">
                            <div class="setting-li">删除</div>
                          </div>
                          <div v-else class="setting-ul not-self">
                            <div class="setting-li">加入黑名单</div>
                            <div class="setting-li">举报</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-if="item.layerCommentList?.length > 0 && item.replyNum > 10" class="example-pagination-block">
                <el-pagination v-model:current-page="item.layerPageNum" @current-change="showLayerComment($event, index, item.commentId)" layout="prev, pager, next" :page-count="Math.ceil(item.replyNum/10)" />
              </div>
            </div>
            <div :ref="el => getInputRef(el, index)" class="comment-input-box">
              <bs-input-box v-if="index === activeReplyInputIndex" @publish="replyComment($event, item2.commentId, index)" :bgcOnlyWhite="true" :placeholder="replyPlaceholder"></bs-input-box>
            </div>
            <div class="border"></div>
          </li>
        </ul>
        <div class="load-more"
          v-infinite-scroll="loadMore" 
          :infinite-scroll-disabled="busy" 
          infinite-scroll-distance="50"
        >
          <Loading v-show="!isArriveTotal && loading"></Loading>
        </div>
      </div>
      <div v-if="isArriveTotal" class="end-text">没有更多评论了</div>
      <div v-if="showCommentFooter" class="news-comment-footer">
        <div class="comment-header-input">
          <bs-input-box @publish="publishComment($event, happeningId)" :positionTop="true" :hideFooter="true" placeholder="你猜我在评论区等着谁？"></bs-input-box>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .advanceRelease {
    @include flex(space-evenly);
    padding-top: 30px;
    .avatar-box {
      img {
        width: 50px;
        height: 50px;
        border-radius: 25px;
      }
    }
    .text-box {
      @include flex(center);
      width: 520px;
      height: 50px;
      border-radius: 6px;
      background-color: $colorN;
      color: $colorD;
    }
  }
  .news-comment-list {
    .news-comment-wrap {
      .news-comment-header {
        margin-bottom: 20px;
        .comment-order {
          @include flex(left);
          margin-bottom: 24px;
          .order-action {
            padding: 0 6px;
            border: none;
            color: $colorD;
            cursor: pointer;
            &.active {
              color: $colorI;
            }
          }
          .order-div {
            height: 10px;
            width: 1px;
            background-color: $colorD;
          }
        }
      }
      .news-comment-body {
        .bldg-comment-ul {
          .bldg-comment-li {
            position: relative;
            padding: 22px 0 0 80px;
            .bldg-avatar-box {
              position: absolute;
              left: 16px;
              top: 16px;
              cursor: pointer;
              img {
                width: 48px;
                height: 48px;
                border-radius: 24px;
              }
            }
            .bldg-comment-main {
              width: 100%;
              .main-header {
                font-size: 13px;
                color: $colorB;
              }
              .main-content {
                display: inline-block;
                font-size: 15px;
                margin-top: 8px;
                word-break: break-word;
                white-space: pre-line;
              }
              .main-footer {
                @include flex(left);
                position: relative;
                margin-top: 8px;
                color: $colorD;
                .pub-time,.like,.reply {
                  margin-right: 18px;
                }
                .like {
                  @include flex();
                  cursor: pointer;
                  &:hover {
                    color: $colorM;
                  }
                  &.avtive {
                    color: $colorM;
                  }
                  .icon-dianzan {
                    margin-right: 4px;
                  }
                }
                .reply {
                  .reply-btn {
                    border: none;
                    color: $colorD;
                    cursor: pointer;
                    &:hover {
                      color: $colorM;
                    }
                  }
                }
                .more {
                  position: absolute;
                  right: 0;
                  border: none;
                  cursor: pointer;
                  color: $colorD;
                  .icon-gengduo1 {
                    &:hover {
                      color: $colorM;
                    }
                  }
                  .more-box {
                    z-index: 20;
                    position: absolute;
                    right: 0;
                    padding-top: 6px;
                    .setting-ul {
                      padding: 8px 0;
                      border: 1px solid $colorF;
                      border-radius: 6px;
                      background-color: $colorG;
                      .setting-li {
                        min-width: 100px;
                        padding: 10px 16px;
                        text-align: left;
                        color: $colorI;
                        font-size: $fontK;
                        &:hover {
                          background-color: $colorN;
                        }
                      }
                    }
                  }
                }
              }
            }
            .expander {
              margin-top: 8px;
              .expand-more {
                color: $colorD;
                font-size: 13px;
                .view-more-btn {
                  border: none;
                  color: $colorD;
                  font-size: 13px;
                  cursor: pointer;
                  &:hover {
                    color: $colorM;
                  }
                }
              }
              .layer-comment-ul {
                .layer-comment-li {
                  position: relative;
                  padding: 8px 0 8px 40px;
                  .layer-avatar-box {
                    position: absolute;
                    left: 0;
                    cursor: pointer;
                    img {
                      width: 30px;
                      height: 30px;
                      border-radius: 15px;
                    }
                  }
                  .layer-comment-main {
                    width: 100%;
                    .main-header {
                      font-size: 13px;
                      color: $colorB;
                      margin-right: 6px;
                      .username {
                        color: $colorM;
                        cursor: pointer;
                      }
                    }
                    .main-content {
                      display: inline-block;
                      margin-top: 8px;
                      font-size: 15px;
                      margin-top: 8px;
                      word-break: break-word;
                      white-space: pre-line;
                    }
                    .main-footer {
                      @include flex(left);
                      position: relative;
                      margin-top: 8px;
                      color: $colorD;
                      .pub-time,.like,.reply {
                        margin-right: 18px;
                      }
                      .like {
                        @include flex();
                        cursor: pointer;
                        &:hover {
                          color: $colorM;
                        }
                        &.active {
                          color: $colorM;
                        }
                        .icon-dianzan {
                          margin-right: 4px;
                        }
                      }
                      .reply {
                        .reply-btn {
                          border: none;
                          color: $colorD;
                          cursor: pointer;
                          &:hover {
                            color: $colorM;
                          }
                        }
                      }
                      .more {
                        position: absolute;
                        right: 0;
                        border: none;
                        cursor: pointer;
                        color: $colorD;
                        .icon-gengduo1 {
                          &:hover {
                            color: $colorM;
                          }
                        }
                        .more-box {
                          z-index: 20;
                          position: absolute;
                          right: 0;
                          padding-top: 6px;
                          .setting-ul {
                            padding: 8px 0;
                            border: 1px solid $colorF;
                            border-radius: 6px;
                            background-color: $colorG;
                            .setting-li {
                              min-width: 100px;
                              padding: 10px 16px;
                              text-align: left;
                              color: $colorI;
                              font-size: $fontK;
                              &:hover {
                                background-color: $colorN;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            .comment-input-box {
              margin-top: 20px;
            }
            .border {
              padding-bottom: 12px;
              border-bottom: 1px solid $colorF;
            }
          }
        }
      }
      .news-comment-footer {
        z-index: 20;
        position: fixed;
        width: 630px;
        bottom: 0;
        padding: 15px 0;
        border-top: 1px solid $colorE;
        background-color: $colorG;
      }
      .end-text {
        width: 100%;
        padding-top: 30px;
        padding-bottom: 200px;
        text-align: center;
        color: $colorD;
      }
    }
  }
</style>