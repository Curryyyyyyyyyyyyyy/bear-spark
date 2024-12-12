<script setup>
  import { ref } from 'vue';
  import BsInputBox from '@/components/input/BsInputBox.vue';
  import {throttle} from '@/hooks/performance'

  //#region 排序方式
  const order = ref(0)
  async function changeOrder(newOrder) {
    if(newOrder === order.value) return
    order.value = newOrder
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
</script>

<template>
  <div class="news-comment-list">
    <div class="news-comment-wrap">
      <div ref="headerRef" class="news-comment-header">
        <div class="comment-order">
          <button @click="changeOrder(0)" class="order-action hot" :class="{'active':order === 0}">最热</button>
          <div class="order-div"></div>
          <button @click="changeOrder(1)" class="order-action time" :class="{'active':order === 1}">最新</button>
        </div>
        <div ref="headerInputBoxRef" class="comment-header-input">
          <bs-input-box :hideFooter="true" placeholder="你猜我在评论区等着谁？"></bs-input-box>
        </div>
      </div>
      <div class="news-comment-body">
        <ul class="bldg-comment-ul">
          <li class="bldg-comment-li">
            <a class="bldg-avatar-box">
              <img src="/imgs/default-avatar.png">
            </a>
            <div class="bldg-comment-main">
              <div class="main-header">
                <a href="">curryyyyyyyyy</a>
              </div>
              <div class="main-content">啦啦啦啦啦啦</div>
              <div class="main-footer">
                <div class="pub-time">2023-11-11 20:34</div>
                <div class="like">
                  <i class="iconfont icon-dianzan"></i>
                  <span class="like-num">5</span>
                </div>
                <div class="reply">
                  <button class="reply-btn">回复</button>
                </div>
                <button v-if="true" class="more">
                  <i class="iconfont icon-gengduo1"></i>
                  <div class="more-box">
                    <div v-if="false" class="setting-ul self">
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
              <div v-if="false" class="expand-more">
                <span>查看 6 条回复，</span>
                <button class="view-more-btn">点击查看</button>
              </div>
              <ul class="layer-comment-ul">
                <li class="layer-comment-li">
                  <a class="layer-avatar-box">
                    <img src="/imgs/default-avatar.png">
                  </a>
                  <div class="layer-comment-main">
                    <span class="main-header">
                      <a href="">curryyyyyyyyy</a>
                    </span>
                    <span class="main-content">啦啦啦啦啦啦</span>
                    <div class="main-footer">
                      <div class="pub-time">2023-11-11 20:34</div>
                      <div class="like">
                        <i class="iconfont icon-dianzan"></i>
                        <span class="like-num">5</span>
                      </div>
                      <div class="reply">
                        <button class="reply-btn">回复</button>
                      </div>
                      <button v-if="true" class="more">
                        <i class="iconfont icon-gengduo1"></i>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="comment-input-box">
              <bs-input-box :bgcOnlyWhite="true" placeholder="回复 @curryyyyy："></bs-input-box>
            </div>
            <div class="border"></div>
          </li>
        </ul>
      </div>
      <div v-if="showCommentFooter" class="news-comment-footer">
        <div class="comment-header-input">
          <bs-input-box :positionTop="true" :hideFooter="true" placeholder="你猜我在评论区等着谁？"></bs-input-box>
        </div>
      </div>
      <div class="end-text">没有更多评论了</div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
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
                font-size: 15px;
                margin-top: 8px;
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
                    right: 4px;
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
                    }
                    .main-content {
                      font-size: 15px;
                      margin-top: 8px;
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
                        &:hover {
                          color: $colorM;
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