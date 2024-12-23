<script setup>
  import { onMounted, ref } from 'vue';
  import useUser from '../../store/user';
  import { ElMessage } from 'element-plus';
  import {voteApi,getVoteDetailApi} from '@/api/news.js'

  const userStore = useUser()
  const {username} = userStore
  const emit = defineEmits(['closeVoteModal'])
  const props = defineProps(['voteId'])

  const voteDetailInfo = ref({})
  onMounted(async ()=>{
    voteDetailInfo.value = await getVoteDetailApi({
      voteId:props.voteId
    })
  })

  function closeVoteModal() {
    emit('closeVoteModal')
  }
  const showVoteDetail = ref(0) // 1:show 0:hidden
  const synchronous = ref(1) // 0：同步，1：不同步
  const anonymous = ref(1)   // 0：匿名，1：不匿名
  const selectOptionIdList = ref([])
  function handleClickOption(id, lim) {
    const index = selectOptionIdList.value.indexOf(id)
    if(index === -1) {
      if(selectOptionIdList.value.length >= lim) return ElMessage.warning(`最多选择${lim}项`)
      selectOptionIdList.value.push(id)
    } else {
      selectOptionIdList.value.splice(index,1)
    }
  }
  function isChecked(id) {
    return selectOptionIdList.value.includes(id)
  }
  async function handleVote() {
    if(!selectOptionIdList.value.length) return ElMessage.warning('请先选择选项')
    await voteApi({
      voteId:props.voteId,
      optionIdList:selectOptionIdList.value,
      synchronous:synchronous.value,
      anonymous:anonymous.value
    })
    voteDetailInfo.value = await getVoteDetailApi({
      voteId:props.voteId
    })
  }
</script>

<template>
  <div class="bs-vote-modal-wrapper">
    <div class="mask"></div>
    <div class="bs-vote-modal">
      <div class="bs-vote-header">
        <span>投票</span>
        <i @click="closeVoteModal" class="iconfont icon-cuowu"></i>
      </div>
      <div v-if="voteDetailInfo" class="bs-vote-container" :style="{transform:`translateX(${-showVoteDetail*560}px)`}">
        <div class="vote-main-wrapper">
          <div class="bs-vote-body">
            <div class="vote-title">{{voteDetailInfo.title}}</div>
            <div class="vote-info">
              <div class="author-info">
                <img :src="voteDetailInfo.publisherInfo?.avatarUrl" alt="">
                <span class="author-username">{{ voteDetailInfo.publisherInfo?.username }}</span>
              </div>
              <div class="vote-text">发起</div>
              <div class="vote-stat"><span class="involveNum">{{voteDetailInfo.voteNumInfo}}人</span>参与</div>
            </div>
            <div class="vote-desc">{{ voteDetailInfo.desc }}</div>
            <div class="vote-options">
              <div class="vote-limit">
                <div>投票选项</div>
                <div>最多选{{voteDetailInfo.voteLim}}项</div>
              </div>
              <ul class="option-list">
                <div v-for="(item,index) in voteDetailInfo.optionList" :key="index" class="option-item" :class="{'image-vote':voteDetailInfo.voteType===2}" @click="handleClickOption(item.optionId,voteDetailInfo.voteLim)">
                  <div v-if="voteDetailInfo.voteType === 2" class="option-photo">
                    <img v-lazy="item.optionPhotoUrl" alt="">
                  </div>
                  <div class="option-content-wrap">
                    <div v-if="!voteDetailInfo.voted || username === voteDetailInfo.publisherInfo?.username" class="percentage-bar" :class="{'full':item.optionPercent==='100'}" :style="{width:`${item.optionPercent}%`,backgroundColor: item.selected?'#e3e5e7':'#8dd0ff'}"></div>
                    <div class="option-content">
                      <p>{{ item.optionContent }}</p>
                    </div>
                    <p v-if="voteDetailInfo.publisherInfo?.username === username || !voteDetailInfo.voted" class="option-percentage" :style="{color:item.selected?'#999999':(item.optionPercent === '100' ? '#ffffff' : '#8dd0ff')}">{{item.optionPercent}}%</p>
                    <p v-if="voteDetailInfo.publisherInfo?.username !== username && voteDetailInfo.voted" class="select-btn" :class="{'checked':isChecked(item.optionId)}">
                      <i v-if="isChecked(item.optionId)" class="iconfont icon-gou"></i>
                    </p>
                  </div>
                </div>
                <!-- <div class="option-item" @click="handleClickOption(1)">
                  <div class="option-content-wrap">
                    <div v-if="true" class="percentage-bar" :class="{'full':false}" :style="{width:'50%',backgroundColor: false?'#e3e5e7':'#8dd0ff'}"></div>
                    <div class="option-content">
                      <p>1111</p>
                    </div>
                    <p v-if="true" class="option-percentage" :style="{color:false?'#999999':'#8dd0ff'}">50%</p>
                    <p v-if="false" class="select-btn" :class="{'checked':isChecked(2)}">
                      <i v-if="isChecked(2)" class="iconfont icon-gou"></i>
                    </p>
                  </div>
                </div> -->
                <div v-if="username !== voteDetailInfo.publisherInfo?.username && voteDetailInfo.voted" class="vote-privacy">
                  <div @click="synchronous = Math.abs(synchronous-1)" class="share-to-news">
                    <span class="select-btn" :style="{backgroundColor:synchronous ? '#ffffff' : '#03a0d6'}">
                      <i v-if="synchronous === 0" class="iconfont icon-gou"></i>
                    </span>
                    <span>同时分享到动态</span>
                  </div>
                  <div @click="anonymous = Math.abs(anonymous-1)" class="anonymous">
                    <span class="select-btn" :style="{backgroundColor:anonymous ? '#ffffff' : '#03a0d6'}">
                      <i v-if="anonymous === 0" class="iconfont icon-gou"></i>
                    </span>
                    <span>匿名</span>
                  </div>
                </div>
              </ul>
            </div>
          </div>
          <div class="bs-vote-footer">
            <div v-if="username === voteDetailInfo.publisherInfo?.username && voteDetailInfo.voterInfoList.length" class="follower-vote">
              <div @click="showVoteDetail = 1" class="desc">
                <p>你关注的人</p>
                <p>也参与了投票</p>
              </div>
              <div @click="showVoteDetail = 1" class="follower-avatar-list">
                <div v-for="(item,index) in voteDetailInfo.voterInfoList" :key="index" class="follower-avatar-item">
                  <img :src="item.avatarUrl" alt="">
                </div>
              </div>
            </div>
            <!-- <button v-if="username !== voteDetailInfo.username" class="vote-btn" :style="{backgroundColor:!voteDetailInfo.voted || voteDetailInfo.dead?'#e5e9ef':'#00aeec',color:!voteDetailInfo.voted||voteDetailInfo.dead?'#999999':'#ffffff'}">{{ !voteDetailInfo.voted ? '感谢你的投票' : (voteDetailInfo.dead ? '投票已结束' : '投票') }}</button> -->
            <button v-if="voteDetailInfo.dead" class="vote-btn" :style="{backgroundColor:'#e5e9ef',color:'#999999'}">投票已结束</button>
            <button v-else-if="username !== voteDetailInfo.publisherInfo?.username && voteDetailInfo.voted" @click="handleVote()" class="vote-btn" :style="{backgroundColor:'#00aeec',color:'#ffffff'}">投票</button>
            <button v-else-if="username !== voteDetailInfo.publisherInfo?.username && !voteDetailInfo.voted" class="vote-btn" :style="{backgroundColor:'#e5e9ef',color:'#999999'}">感谢你的投票</button>
            <div v-if="username === voteDetailInfo.publisherInfo?.username && !voteDetailInfo.voterInfoList.length" @click="showVoteDetail = 1" class="vote-detail-btn">
              <span>投票详情</span>
              <i class="iconfont icon-youjiantou"></i>
            </div>
          </div>
        </div>
        <div class="vote-detail-wrapper">
          <div class="bs-vote-body">
            <ul class="vote-detail-list">
              <li v-for="(item,index) in voteDetailInfo.voterInfoList" :key="index" class="vote-detail-item">
                <div class="avatar-box">
                  <img :src="item.avatarUrl" alt="">
                </div>
                <div class="vote-detail">
                  <span class="voter-username">{{ item.username }}</span>
                  <span class="text">投给了</span>
                  <p class="vote-content">{{ item.optionsInfo }}</p>
                </div>
              </li>
            </ul>
            <div v-if="!voteDetailInfo.voterInfoList?.length" class="vote-detail-empty">
              <span>暂时没有人参与投票哦</span>
            </div>
          </div>
          <div class="bs-vote-footer">
            <button @click="showVoteDetail = 0" class="back-to-vote">返回投票窗口</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .bs-vote-modal-wrapper {
    .mask {
      z-index: 200;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-color: $colorI;
      opacity: .5;
    }
    .bs-vote-modal {
      z-index: 201;
      position: fixed;
      top: 50%;
      left: 50%;
      width: 560px;
      transform: translate(-50%,-50%);
      background-color: $colorG;
      border-radius: 6px;
      overflow: hidden;
      .bs-vote-header {
        position: relative;
        @include flex(center);
        height: 40px;
        border-bottom: 1px solid $colorN;
        font-size: $fontJ;
        .icon-cuowu {
          position: absolute;
          right: 15px;
          font-size: $fontH;
          color: $colorD;
          cursor: pointer;
          transition: all .2s;
          &:hover {
            transform: scale(1.3);
          }
        }
      }
      .bs-vote-container {
        display: flex;
        width: 560px;
        transition: all .3s;
        .vote-main-wrapper {
          flex-shrink: 0;
          width: 560px;
          .bs-vote-body {
            width: 100%;
            padding: 20px 0;
            box-sizing: border-box;
            .vote-title {
              padding: 0 20px;
              font-size: $fontH;
              font-weight: bold;
            }
            .vote-info {
              @include flex();
              font-size: $fontJ;
              padding: 0 20px;
              margin: 14px 0;
              .author-info {
                @include flex();
                img {
                  width: 36px;
                  height: 36px;
                  border-radius: 18px;
                  margin-right: 6px;
                }
              }
              .vote-text {
                flex: 1;
                margin-left: 8px;
                color: $colorD;
              }
              .vote-stat {
                .involveNum {
                  color: $colorM;
                }
              }
            }
            .vote-desc {
              padding: 0 20px;
              font-size: $fontJ;
            }
            .vote-options {
              margin-top: 10px;
              .vote-limit {
                @include flex();
                color: $colorD;
                padding: 0 20px;
                margin-bottom: 10px;
              }
              .option-list {
                min-height: 240px;
                max-height: 240px;
                padding: 0 20px;
                overflow-x: hidden;
                overflow-y: auto;
                &::-webkit-scrollbar {
                  width: 4px;
                }
                &::-webkit-scrollbar-thumb {
                  border-radius: 2px;
                  background-color: $colorE;
                }
                .option-item {
                  @include flex();
                  width: 100%;
                  height: 50px;
                  margin-top: 10px;
                  border-radius: 6px;
                  border: 1px solid $colorR;
                  box-sizing: border-box;
                  background-color: $colorR;
                  cursor: pointer;
                  &.image-vote {
                    height: 70px;
                    .option-photo {
                      img {
                        height: 68px;
                        width: 68px;
                        vertical-align: middle;
                        border-top-left-radius: 6px;
                        border-bottom-left-radius: 6px;
                      }
                    }
                    .option-content-wrap {
                      .percentage-bar {
                        border-radius: 0;
                      }   
                    }
                  }
                  .option-content-wrap {
                    position: relative;
                    flex: 1;
                    @include flex();
                    height: 100%;
                    box-sizing: border-box;
                    border-radius: 6px;
                    .percentage-bar {
                      height: 100%;
                      border-top-left-radius: 6px;
                      border-bottom-left-radius: 6px;
                      &.full {
                        border-top-right-radius: 6px;
                        border-bottom-right-radius: 6px;
                      }
                    }
                    .option-content {
                      position: absolute;
                      left: 15px;
                    }
                    .option-percentage {
                      position: absolute;
                      right: 15px;
                      color: $colorD;
                    }
                    .select-btn {
                      position: absolute;
                      right: 15px;
                      @include flex(center);
                      width: 20px;
                      height: 20px;
                      border: 1px solid $colorE;
                      border-radius: 10px;
                      &.checked {
                        background-color: #03a0d6;
                      }
                      .icon-gou {
                        color: $colorG;
                        font-size: $fontH;
                      }
                    }
                  }
                }
                .vote-privacy {
                  @include flex(left);
                  margin-top: 10px;
                  color: $colorD;
                  .select-btn {
                    @include flex(center);
                    display: inline-block;
                    height: 12px;
                    width: 12px;
                    border: 1px solid $colorF;
                    margin-right: 4px;
                    border-radius: 2px;
                    .icon-gou {
                      font-size: $fontK;
                      color: $colorG;
                    }
                  }
                  .share-to-news {
                    @include flex();
                    margin-right: 20px;
                    cursor: pointer;
                  }
                  .anonymous {
                    @include flex();
                    cursor: pointer;
                  }
                }
              }
            }
          }
          .bs-vote-footer {
            position: relative;
            @include flex(center);
            padding: 10px 20px;
            .follower-vote {
              flex: 1;
              @include flex();
              .desc {
                color: $colorD;
                cursor: pointer;
              }
              .follower-avatar-list {
                @include flex(right);
                cursor: pointer;
                .follower-avatar-item {
                  margin-right: 4px;
                  img {
                    height: 34px;
                    width: 34px;
                    border-radius: 17px;
                  }
                }
              }
            }
            .vote-btn {
              width: 140px;
              height: 40px;
              border: none;
              background-color: $colorM;
              border-radius: 6px;
              color: $colorG;
              cursor: pointer;
            }
            .vote-detail-btn {
              position: absolute;
              @include flex();
              right: 20px;
              color: $colorD;
              cursor: pointer;
              &:hover {
                color: $colorM;
              }
              .icon-youjiantou {
                font-size: $fontJ;
              }
            }
          }
        }
        .vote-detail-wrapper {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 560px;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
          background-color: $colorG;
          .bs-vote-body {
            width: 100%;
            min-height: 390px;
            max-height: 390px;
            overflow-x: hidden;
            overflow-y: auto;
            overscroll-behavior-y: contain;
            padding: 20px;
            box-sizing: border-box;
            &::-webkit-scrollbar {
              width: 4px;
            }
            &::-webkit-scrollbar-thumb {
              border-radius: 2px;
              background-color: $colorF;
            }
            .vote-detail-list {
              .vote-detail-item {
                @include flex(left);
                padding: 3px 0;
                .avatar-box {
                  margin-right: 10px;
                  img {
                    height: 38px;
                    width: 38px;
                    border-radius: 19px;
                  }
                }
                .vote-detail {
                  flex: 1;
                  padding: 10px 0;
                  border-bottom: 1px solid $colorN;
                  box-sizing: border-box;
                  .voter-username {
                    font-size: $fontJ;
                    font-weight: 450;
                    margin-right: 6px;
                  }
                  .text {
                    font-size: $fontK;
                    color: $colorD;
                  }
                  .vote-content {
                    margin-top: 4px;
                  }
                }
              }
            }
            .vote-detail-empty {
              margin-top: 200px;
              text-align: center;
              font-size: $fontJ;
            }
          }
          .bs-vote-footer {
            @include flex(center);
            height: 60px;
            .back-to-vote {
              width: 140px;
              height: 40px;
              border: none;
              background-color: $colorM;
              border-radius: 6px;
              color: $colorG;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>