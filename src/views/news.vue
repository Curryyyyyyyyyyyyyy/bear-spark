<script setup>
  import { nextTick, onBeforeUnmount, reactive, ref } from 'vue';
  import NavHeader from '@/components/NavHeader.vue'
  import Modal from '@/components/Modal.vue';
  import BsSelect from '@/components/BsSelect.vue';
  import BsOption from '../components/BsOption.vue';
  import { ElSelect,ElOption,ElDatePicker } from 'element-plus';
  import {hourOptions,minuteOptions} from '@/hooks/timeOptions.js'
  import { publishNews } from '../api/news';
  import useNews from '@/store/news.js'
  import {useRouter} from 'vue-router'
  import { storeToRefs } from 'pinia';

  /* Store */
  const newsStore = useNews()
  /* Router */
  const router = useRouter()

  /* 页面卸载时清除定时器，清除pictureList */
  window.addEventListener('pagehide',()=>{
    pictureList.value = []
    clearInterval(timer)
  })
  /* 组件卸载时清除定时器，清除pictureList */
  onBeforeUnmount(()=>{
    pictureList.value = []
    clearInterval(timer)
  })

  /* 选择标签 */
  const showTagCol = ref(false)
  //#region 发布
  /* 监听title输入 */
  const pubTitleNum = ref(0)
  const pubTitleInput = ref()
  function changePubTitle(event) {
    pubTitleNum.value = event.target.value.length
  }
  function clearPubTitle() {
    pubTitleInput.value.value = ''
    pubTitleNum.value = 0
  }
  /* 监听content输入 */
  const pubContentNum = ref(0)
  function changePubContent(event) {
    pubContentNum.value = event.target.value.length
  }
  /* 图片上传 */
  let timer
  const showUploadBox = ref(false)
  const {pictureList} = storeToRefs(newsStore)
  if(pictureList.value.length > 0) showUploadBox.value = true
  timer = setInterval(() => {
    for (let i = 0; i < pictureList.value.length; i++) {
      pictureList.value[i].remainTime--
      if(!pictureList.value[i].remainTime) {
        pictureList.value.shift()
      }
    }
  }, 1000);
  function uploadPicture() {
    pictureList.value.push({src:'/imgs/logo.png',remainTime:20})
  }
  function deletePicture(index) {
    pictureList.value.splice(index, 1)
  }
  /* 展示设置 */
  const settingCascaderDom = ref()
  const settingCascader1 = ref(false)
  const settingCascader2 = ref(0) // 0:不展示二级层叠 1：可见范围 3:精选评论
  function showSettingCascader() {
    settingCascader1.value = true
    nextTick(()=>{
      settingCascaderDom.value.focus()
    })
  }
  function blurSettingCascader() {
    settingCascader1.value = false
    settingCascader2.value = 0
  }
  function showSettingCascader2(num) {
    settingCascader2.value = num
  }
  const newsSeePermission = ref(0) // 0:所有人可见 1:仅自己
  const newsCommentPermission = ref(0) // 0:允许评论 1：关闭评论 2：精选评论
  
  /* 发布时间框 */
  const PubTimeBox = ref(false)
  function showPubTimeBox() {
    PubTimeBox.value = true
    settingCascader1.value = false
  }
  function deletePubTime() {
    publishDate.value = ''
    publishHour.value = ''
    publishMinute.value = ''
    PubTimeBox.value = false
  }
  /* 发布 */
  const newsTitle = ref('')
  const newsContent = ref('')
  const publishDate = ref('')
  const publishHour = ref('')
  const publishMinute = ref('')
  async function publish() {
    await publishNews({
      title:newsTitle.value,
      content:newsContent.value
    })
  }
  //#endregion

  /* 页面尺寸缩放调整 */
  let smallSize = ref(false)
  window.addEventListener('resize', ()=> {
    if(window.innerWidth < 1396) {
      smallSize.value = true
    } else {
      smallSize.value = false
    }
  })
  /* 切换 tab 栏样式 */
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
  /* 时间下拉框选项 */
  
  //#region 投票功能
  /* 展示投票表单 */
  const showVoteModal = ref(false)
  /* 展示投票栏 */
  const showVoteBox = ref(false)
  /* 监测标题数 */
  const voteTitleNum = ref(0)
  function changeVoteTitle(event) {
    voteTitleNum.value = event.target.value.length
  }
  /* 展示说明输入框 */
  const showDescInput = ref(false)
  /* 监测说明字数 */
  const voteDescNum = ref(0)
  function changeDesc(event) {
    voteDescNum.value = event.target.value.length
  }
  /* 投票类型 */
  const voteType = ref(1)
  const textOptionList = reactive([{value:''},{value:''}])
  function addTextOption() {
    textOptionList.push({value:''})
  }
  function deleteTextOption(index) {
    textOptionList.splice(index, 1)
  }
  const pictureOptionList = reactive([{value:''},{value:''}])
  function addPictureOption() {
    pictureOptionList.push({value:''})
  }
  function deletePictureOption(index) {
    pictureOptionList.splice(index, 1)
  }
  /* 限选和截止时间 */
  const voteMaxSelectNum = ref('单选')
  const voteEndDate = ref('')
  const VoteEndHour = ref('')
  const VoteEndMinute = ref('')
  /* 提交投票表单 */
  function submitVote() {
    showVoteModal.value = false
    showVoteBox.value = true
  }
  //#endregion
  //#region 预约直播
  const showLivesBox = ref(false)
  const showLivesModal = ref(false)
  const livesEndDate = ref('')
  const livesEndHour = ref('')
  const livesEndMinute = ref('')
  const livesTitleNum = ref(0)
  function changeLivesTitle(event) {
    livesTitleNum.value = event.target.value.length
  }
  function submitLives() {
    showLivesBox.value = true
    showLivesModal.value = false
  }
  //#endregion
  //#region up列表
  const activeUpIndex = ref(-1)
  const upListDom = ref()
  function changeUpListScroll(n) {
    upListDom.value.scrollLeft += n
  }
  //#endregion
  //#region 动态
  const showNewsCascader = ref(false)
  //#endregion
</script>

<template>
  <div class="news">
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
    <div class="container" :class="{'container-small':smallSize}">
      <div class="user-box">
        <img src="/imgs/default-avatar.png" alt="头像">
        <span class="username">curyyyyyyyy</span>
        <div class="infos">
          <div class="info-box">
            <p class="num">11</p>
            <p class="desc">关注</p>
          </div>
          <div class="info-box">
            <p class="num">1</p>
            <p class="desc">粉丝</p>
          </div>
          <div class="info-box">
            <p class="num">1</p>
            <p class="desc">动态</p>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="publish-box">
          <div class="tag-desk">
            <div class="tag-search">
              <div class="tag-search-popover" :class="{'active':showTagCol}">
                <label class="tag-search-input">
                  <i v-if="!showTagCol" @click="showTagCol = true" class="iconfont icon-huati"></i>
                  <i v-if="showTagCol" class="iconfont icon-sousuo"></i>
                  <span v-if="!showTagCol" @click="showTagCol = true" class="tag-search-input-text">选择标签</span>
                  <input v-if="showTagCol" @blur="showTagCol = false" type="text" placeholder="搜索标签">
                </label>
                <div v-if="showTagCol" class="tag-search-result">
                  <div class="tag-search-list">
                    <div class="tag-search-item">
                      <i class="iconfont icon-huati"></i>
                      <span class="tag-search-item-title">巴黎最前线</span>
                      <p class="tag-search-item-desc">122浏览&middot;133讨论</p>
                    </div>
                    <div class="tag-search-item">
                      <i class="iconfont icon-huati"></i>
                      <span class="tag-search-item-title">巴黎最前线</span>
                      <p class="tag-search-item-desc">122浏览&middot;133讨论</p>
                    </div>
                    <div class="tag-search-item">
                      <i class="iconfont icon-huati"></i>
                      <span class="tag-search-item-title">巴黎最前线</span>
                      <p class="tag-search-item-desc">122浏览&middot;133讨论</p>
                    </div>
                    <div class="tag-search-item">
                      <i class="iconfont icon-huati"></i>
                      <span class="tag-search-item-title">巴黎最前线</span>
                      <p class="tag-search-item-desc">122浏览&middot;133讨论</p>
                    </div>
                    <div class="tag-search-item">
                      <i class="iconfont icon-huati"></i>
                      <span class="tag-search-item-title">巴黎最前线</span>
                      <p class="tag-search-item-desc">122浏览&middot;133讨论</p>
                    </div>
                    <div class="tag-search-item">
                      <i class="iconfont icon-huati"></i>
                      <span class="tag-search-item-title">巴黎最前线</span>
                      <p class="tag-search-item-desc">122浏览&middot;133讨论</p>
                    </div>
                    <div class="tag-search-item">
                      <i class="iconfont icon-huati"></i>
                      <span class="tag-search-item-title">巴黎最前线</span>
                      <p class="tag-search-item-desc">122浏览&middot;133讨论</p>
                    </div>
                  </div>
                  <div v-if="false" class="tag-search-empty">还没有相关话题~</div>
                </div>
              </div>
            </div>
          </div>
          <input name="newsTitle" ref="pubTitleInput" v-model="newsTitle" @input="changePubTitle" maxlength="20" type="text" class="title" placeholder="标题 (选填，20字内)">
          <i v-if="pubTitleNum" @click="clearPubTitle" class="iconfont icon-cuowu1"></i>
          <span v-if="pubTitleNum" class="title-num">{{ pubTitleNum }}</span>
          <textarea name="newsContent" v-model="newsContent" @input="changePubContent" maxlength="500" class="content" placeholder="有什么想和大家分享的？"></textarea>
          <div v-if="showUploadBox" class="pub-picture-list">
            <div v-for="(item,index) in pictureList" :key="index" class="picture-box">
              <img :src="item.src" alt="">
              <div class="delete-btn" @click="deletePicture(index)">
                <i class="iconfont icon-cuowu"></i>
              </div>
              <div class="progress-bar">
                <div class="progress" :style="{width:item.remainTime/20*100+'%', backgroundColor:item.remainTime/20*100 > 70 ? '#88cc24' : (item.remainTime/20*100 > 20 ? '#e6a23c' : '#f56c6c')}"></div>
              </div>
            </div>
            <label for="upload-pic">
              <div class="pictrue-upload-box">
                <i class="iconfont icon-jiahao"></i>
              </div>
              <input @change="uploadPicture" id="upload-pic" type="file">
            </label>
          </div>
          <div v-if="showVoteBox" class="vote-box">
            <div class="vote-desc-box">
              <div class="vote-box-title">哪个好看</div>
              <p class="desc">0人参与投票</p>
            </div>
            <i @click="showVoteBox = false" class="iconfont icon-cuowu"></i>
          </div>
          <div v-if="showLivesBox" class="lives-box">
            <div class="lives-desc-box">
              <div class="lives-box-title">直播预约：111</div>
              <p class="desc">明天 18:00 直播</p>
            </div>
            <i @click="showLivesBox = false" class="iconfont icon-cuowu"></i>
          </div>
          <div v-if="PubTimeBox" class="pubTime-box">
            <span>发布时间：</span>
            <el-date-picker
              v-model="publishDate"
              type="date"
              placeholder="选择发布日期"
              value-format="YYYY-MM-DD"
            />
            <el-select v-model="publishHour" placeholder="时" style="width: 100px">
              <el-option
                v-for="item in hourOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="publishMinute" placeholder="分" style="width: 100px">
              <el-option
                v-for="item in minuteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <i @click="deletePubTime" class="iconfont icon-cuowu"></i>
          </div>
          <div class="comment-permission">
            <span v-if="newsCommentPermission === 1">开启后，将禁止任何人在此内容下发布评论</span>
            <span v-if="newsCommentPermission === 2">开启后，评论都需要经过你的筛选后再向所有用户展示</span>
          </div>
          <div v-if="newsSeePermission === 1" class="only-box">
            <span class="only-title"><i class="iconfont icon-suo"></i>仅自己可见</span>
            <span class="only-desc">开启后，将不支持分享、商业推广</span>
          </div>
          <div class="publish-controls">
            <div>
              <i class="iconfont icon-biaoqing"></i>
              <i @click="showUploadBox = !showUploadBox" :class="{'active':showUploadBox}" class="iconfont icon-tupian"></i>
              <i class="iconfont icon-aite"></i>
              <i @click="showVoteModal = true" :class="{'active':showVoteBox}" class="iconfont icon-toupiao"></i>
              <i @click="showLivesModal = true" :class="{'active':showLivesBox}" class="iconfont icon-zhibo"></i>
            </div>
            <div class="publish-controls-headquarters">
              <span class="content-num">{{ pubContentNum }} / 300</span>
              <i @click="showSettingCascader" class="iconfont icon-shezhi"></i>
              <div v-if="settingCascader1" class="cascader"  tabindex="1" @blur="blurSettingCascader" ref="settingCascaderDom">
                <div v-if="settingCascader1" class="cascader-list">
                  <div class="cascader-options">
                    <div @click="showSettingCascader2(1)" class="cascader-options-item">
                      <div class="item-label">可见范围</div>
                      <i class="iconfont icon-youjiantou"></i>
                    </div>
                    <div @click="showPubTimeBox" class="cascader-options-item">
                      <div class="item-label">定时发布</div>
                    </div>
                    <div @click="showSettingCascader2(3)" class="cascader-options-item">
                      <div class="item-label">精选评论</div>
                      <i class="iconfont icon-youjiantou"></i>
                    </div>
                  </div>
                </div>
                <div v-if="settingCascader2" style="z-index: 3;" class="cascader-list">
                  <div v-if="settingCascader2 === 1" class="cascader-options">
                    <div @click="newsSeePermission = 0,blurSettingCascader()" :class="{'is-active':newsSeePermission === 0}" class="cascader-options-item">
                      <i class="iconfont icon-jiesuo1"></i>
                      <div class="item-label">所有用户可见</div>
                    </div>
                    <div @click="newsSeePermission = 1,blurSettingCascader()" :class="{'is-active':newsSeePermission === 1}" class="cascader-options-item">
                      <i class="iconfont icon-suo"></i>
                      <div class="item-label">仅自己可见</div>
                    </div>
                  </div>
                  <div v-if="settingCascader2 === 3" class="cascader-options">
                    <div class="cascader-options-item" @click="newsCommentPermission = 0,blurSettingCascader()" :class="{'is-active':newsCommentPermission === 0}">
                      <span class="item-label">允许评论</span>
                    </div>
                    <div class="cascader-options-item"  @click="newsCommentPermission = 1,blurSettingCascader()" :class="{'is-active':newsCommentPermission === 1}">
                      <span class="item-label">关闭评论</span>
                    </div>
                    <div class="cascader-options-item" @click="newsCommentPermission = 2,blurSettingCascader()" :class="{'is-active':newsCommentPermission === 2}">
                      <span class="item-label">精选评论</span>
                    </div>
                  </div>
                </div>
              </div>
              <button @click="publish" class="pub-btn">发布</button>
            </div>
          </div>
        </div>
        <div class="bs-up-list">
          <div class="shim"></div>
          <div @click="changeUpListScroll(-400)" class="left-btn"><i class="iconfont icon-zuojiantou"></i></div>
          <div ref="upListDom" @click="showArrow = true" class="up-list">
            <div class="up-box-list" @hover="showArrow = true">
              <div @click="activeUpIndex = -1" class="all-news" :class="{'active':activeUpIndex === -1}">
                <span><i class="iconfont icon-dongtai"></i></span>
                <p>全部动态</p>
              </div>
              <div @click="activeUpIndex = 0" class="up-box" :class="{'active':activeUpIndex === 0}">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>111</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>222</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>333</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>444</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>555</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>666</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>777</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>888</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>999</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>101010</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>AllSpark-工作室</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>AllSpark-工作室</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>AllSpark-工作室</p>
              </div>
              <div class="up-box">
                <img src="/imgs/default-avatar.png" alt="头像">
                <p>AllSpark-工作室</p>
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
        <div class="news-list">
          <div class="news-item">
            <div class="news-item-avatar">
              <img src="/imgs/default-avatar.png" alt="头像">
            </div>
            <div class="news-item-header">
              <span class="news-item-author">尚硅谷</span>
              <p class="news-item-time">14小时前</p>
              <div  @mouseenter="showNewsCascader = true" @mouseleave="showNewsCascader = false" class="news-item-more-btn">
                <i class="iconfont icon-gengduo1"></i>
                <div v-if="showNewsCascader" class="new-item-cascader">
                  <div class="cascader-list">
                    <div class="cascader-item">取消关注</div>
                    <div class="cascader-item">举报</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="news-item-body">
              <div class="news-tag">
                <i class="iconfont icon-huati"></i>
                <span>职业新人进化论</span>
              </div>
              <div class="news-title">与神相约，畅谈职业规划</div>
              <div class="news-text-content">禹神，我的神！！！</div>
              <div class="news-album">
                <div class="news-album-preview grid">
                  <div class="news-album-preview-picture">
                    <img src="/imgs/logo.png" alt="">
                  </div>
                  <div class="news-album-preview-picture">
                    <img src="/imgs/logo.png" alt="">
                  </div>
                </div>
              </div>
              <div class="news-video-card">
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
            </div>
            <div class="news-item-footer">
              <div class="footer-item news-like">
                <i class="iconfont icon-dianzan"></i>
                点赞
              </div>
              <div class="footer-item item-comment">
                <i class="iconfont icon-pinglun"></i>
                评论
              </div>
              <div class="footer-item item-browse">
                <i class="iconfont icon-yanjing"></i>
                0
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="slide">
        <div class="slide-banner">
          <img src="/imgs/slide-bar.jpg" alt="">
        </div>
        <div class="slide-tags">
          <h2>话题</h2>
          <ul class="tag-list">
            <li class="tag-item">
              <i class="iconfont icon-huati"></i>
              <div class="tag-item-title">曝姆巴佩存在精神问题</div>
              <span class="tag-item-stat">13浏览&middot;199讨论</span>
            </li>
            <li class="tag-item">
              <i class="iconfont icon-huati"></i>
              <div class="tag-item-title">曝姆巴佩存在精神问题</div>
              <span class="tag-item-stat">13浏览&middot;199讨论</span>
            </li>
            <li class="tag-item">
              <i class="iconfont icon-huati"></i>
              <div class="tag-item-title">曝姆巴佩存在精神问题</div>
              <span class="tag-item-stat">13浏览&middot;199讨论</span>
            </li>
            <li class="tag-item">
              <i class="iconfont icon-huati"></i>
              <div class="tag-item-title">曝姆巴佩存在精神问题</div>
              <span class="tag-item-stat">13浏览&middot;199讨论</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <Modal v-if="showVoteModal" @submit="submitVote" @closeModal="showVoteModal = false" title="发起投票">
    <template v-slot:modal>
      <div class="modal-vote-box">
        <div class="vote-title-sec">
          <p class="desc">投票标题</p>
          <div class="input-box">
            <input @input="changeVoteTitle" type="text" placeholder="请填写标题" maxlength="32"/>
            <span class="stat">{{ voteTitleNum }}/32</span>
          </div>
        </div>
        <div class="vote-desc-sec">
          <div v-if="!showDescInput" @click="showDescInput = true" class="add-desc">
            <i class="iconfont icon-jiahao"></i>
            <span>添加说明</span>
          </div>
          <p v-if="showDescInput" class="desc">投票说明<span>(选填)</span></p>
          <div v-if="showDescInput" class="input-box">
            <textarea @input="changeDesc" type="text" placeholder="请填写投票说明(选填)" maxlength="100"></textarea>
            <span class="stat">{{ voteDescNum }}/100</span>
          </div>
        </div>
        <div class="vote-type-sec">
          <p class="desc">投票类型</p>
          <div class="radio-box">
            <input :checked="voteType === 1" @click="voteType = 1" class="radio" id="radio-text" type="radio" name="text">
            <label class="radio" for="radio-text">文字投票</label>
            <input :checked="voteType === 2" @click="voteType = 2" class="radio" id="radio-picture" type="radio" name="picture">
            <label class="radio" for="radio-picture">图片投票</label>
          </div>
          <div v-if="voteType === 1" class="text-option-list">
            <div v-for="(item,index) in textOptionList" :key="index" class="option-item">
              <span class="item-name">选项{{ index+1 }}</span>
              <div class="input-box">
                <input v-model="item.value" type="text" maxlength="20" :placeholder="`请填写选项${index+1}内容，最多20字`">
                <div v-if="textOptionList.length > 2" class="delete-icon-box">
                  <i @click="deleteTextOption(index)" class="iconfont icon-shanchu"></i>
                </div>
              </div>
            </div>
            <div @click="addTextOption" class="add-option">
              <i class="iconfont icon-jiahao"></i>
              <span>添加选项</span>
            </div>
          </div>
          <div v-if="voteType === 2" class="picture-option-list">
            <div v-for="(item,index) in pictureOptionList" :key="index" class="picture-option-item">
              <div class="info">
                <span class="info-name">选项{{ index+1 }}</span>
                <i @click="deletePictureOption(index)" v-if="pictureOptionList.length > 2" class="iconfont icon-shanchu"></i>
              </div>
              <div class="picture-box">
                <label for="picture">
                  <div class="upload-box">
                    <i class="iconfont icon-jiahao"></i>
                  </div>
                  <input id="picture" type="file">
                </label>
                <textarea maxlength="20" class="desc" :placeholder="`请填写选项${index+1}内容，不超过20个字`"></textarea>
              </div>
            </div>
            <div @click="addPictureOption" class="picture-add-box">
              <div>
                <i class="iconfont icon-jiahao"></i>
                <span>添加选项</span>
              </div>
            </div>
          </div>
        </div>
        <div class="vote-more-sec">
          <div class="desc">更多设置</div>
          <div class="select-box">
            <span>单选/多选</span>
            <bs-select v-model="voteMaxSelectNum">
              <bs-option label="单选" value="1"></bs-option>
              <bs-option label="最多选两项" value="2"></bs-option>
              <bs-option label="最多选三项" value="3"></bs-option>
            </bs-select>
          </div>
        </div>
        <div class="vote-end-sec">
          <div class="desc">投票截止时间</div>
          <div class="end-box">
            <el-date-picker
              type="date"
              v-model="voteEndDate"
              placeholder="请选择截止日期"
              value-format="YYYY-MM-DD"
            />
            <el-select v-model="VoteEndHour" placeholder="时" style="width: 100px">
              <el-option
                v-for="item in hourOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="VoteEndMinute" placeholder="分" style="width: 100px">
              <el-option
                v-for="item in minuteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </template>
  </Modal>
  <Modal v-if="showLivesModal" @submit="submitLives" @closeModal="showLivesModal = false" title="发起直播预约">
    <template v-slot:modal>
      <div class="modal-lives-box">
        <p class="lives-box-title">发起新预约</p>
        <div class="title-input-box">
          <input @input="changeLivesTitle" maxlength="14" type="text" placeholder="请填写预约标题">
          <span class="stat">{{ livesTitleNum }}/14</span>
        </div>
        <div class="time-box">
          <el-date-picker
            type="date"
            v-model="livesEndDate"
            placeholder="请选择预约日期"
            value-format="YYYY-MM-DD"
          />
          <el-select v-model="livesEndHour" placeholder="时" style="width: 100px">
            <el-option
              v-for="item in hourOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="livesEndMinute" placeholder="分" style="width: 100px">
            <el-option
              v-for="item in minuteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style lang="scss">
  @use '../assets/sass/config.scss' as *;
  @use '../assets/sass/mixin.scss' as *;
  .news {
    .header {
      z-index: 100;
      position: fixed;
      top: 0px;
      left: 0;
      right: 0;
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
    .container {
      display: flex;
      padding-top: 74px;
      .user-box {
        width: 22%;
        height: 140px;
        padding: 20px;
        box-sizing: border-box;
        background-color: $colorG;
        border-radius: 5px;
        img {
          height: 50px;
          width: 50px;
          border-radius: 25px;
          margin-right: 20px;
          cursor: pointer;
          vertical-align: middle;
        }
        .username {
          font-size: $fontJ;
          font-weight: bold;
          cursor: pointer;
          &:hover {
            color: $colorM;
          }
        }
        .infos {
          @include flex();
          text-align: center;
          margin-top: 15px;
          font-size: $fontJ;
          .info-box {
            cursor: pointer;
            .num {
              color: $colorB;
              font-weight: bold;
            }
            .desc {
              color: $colorD;
            }
          }
        }
      }
      .body {
        width: 53%;
        margin: 0 10px;
        .publish-box {
          padding: 15px;
          box-sizing: border-box;
          border-radius: 5px;
          background-color: $colorG;
          margin-bottom: 10px;
          .tag-desk {
            .tag-search {
              height: 24px;
              width: 96px;
              position: relative;
              .tag-search-popover {
                z-index: 10;
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                background-color: $colorN;
                border-radius: 11px;
                transition: all .4s;
                .tag-search-input {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-sizing: border-box;
                  height: 22px;
                  padding: 0 10px 0 8px;
                  border-radius: 11px;
                  background-color: $colorN;
                  color: $colorD;
                  cursor: pointer;
                  transition: all .4s;
                  .icon-huati {
                    margin-right: 3px;
                    vertical-align: middle;
                  }
                  .icon-sousuo {
                    margin-right: 3px;
                  }
                  input {
                    height: 20px;
                    width: 100%;
                    background-color: inherit;
                    border: none;
                    outline: none;
                  }
                }
                .tag-search-result {
                  height: 228px;
                  overflow-x: hidden;
                  overflow-y: scroll;
                  .tag-search-list {
                    .tag-search-item {
                      padding: 10px 16px;
                      &:hover {
                        background-color: $colorN;
                      }
                      .icon-huati {
                        color: $colorM;
                        font-weight: 500;
                        margin-right: 3px
                      }
                      .tag-search-item-title {
                        font-size: $fontJ;
                      }
                      .tag-search-item-desc {
                        margin-left: 20px;
                        margin-top: 1px;
                        font-size: $fontK;
                        color: $colorD;
                      }
                    }
                  }
                  .tag-search-empty {
                    font-size: $fontJ;
                    color: $colorD;
                    text-align: center;
                    padding-top: 80px;
                  }
                }
                .tag-search-result::-webkit-scrollbar {
                  width: 4px;
                  height: 0;
                }
                .tag-search-result::-webkit-scrollbar-thumb {
                  background-color: $colorF;
                  border-radius: 2px;
                }
              }
              .active {
                height: 280px;
                width: 300px;
                background-color: $colorG;
                border-radius: 6px;
                box-shadow: 0 11px 12px rgba(106, 115, 133, .3);
                box-sizing: border-box;
                .tag-search-input {
                  height: 28px;
                  margin: 16px 16px 8px;
                }
              }
            }
          }
          .title {
            margin-top: 10px;
            width: 90%;
            border: none;
          }
          .icon-cuowu1 {
            margin-right: 10px;
            color: $colorF;
            font-size: $fontH;
            cursor: pointer;
          }
          .title-num {
            color: $colorF;
            font-size: $fontJ;
          }
          .content {
            margin-top: 5px;
            margin-bottom: 15px;
            width: 92%;
            border: none;
            resize: none;
            font-weight: bold;
          }
          .pub-picture-list {
            display: flex;
            .picture-box {
              position: relative;
              width: 80px;
              height: 80px;
              text-align: center;
              border-radius: 6px;
              margin-right: 10px;
              margin-bottom: 10px;
              box-shadow: 0 0 1px $colorD;
              img {
                width: 80%;
                height: 100%;
                border-radius: 6px;
              }
              .delete-btn {
                position: absolute;
                top: 2px;
                right: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 14px;
                width: 14px;
                border-radius: 7px;
                background-color: #6c6e72;
                color: $colorG;
                cursor: pointer;
                .icon-cuowu {
                  font-size: $fontK;
                }
              }
              .progress-bar {
                position: absolute;
                bottom: 5px;
                left: 50%;
                height: 6px;
                width: 80%;
                border-radius: 3px;
                border: 1.2px solid $colorN;
                transform: translateX(-50%);
                .progress {
                  height: 100%;
                  width: 100%;
                  border-radius: 3px;
                  background-color: #88cc24;
                  animation: progressBar 5s linear;
                }
                // @keyframes progressBar {
                //   0%{
                //     width: 100%;
                //     background-color: #88cc24;
                //   }50%{
                //     background-color: #e6a23c;
                //   }80%{
                //     background-color: #f56c6c;
                //   }100% {
                //     width: 0%;
                //     background-color: #f56c6c;
                //   }
                // }
              }
            }
            .pictrue-upload-box {
              width: 80px;
              height: 80px;
              line-height: 80px;
              border: 1px dashed $colorF;
              border-radius: 6px;
              margin-bottom: 10px;
              text-align: center;
              cursor: pointer;
              &:hover {
                border: 1px dashed $colorQ;
                .icon-jiahao {
                  color: $colorQ;
                }
              }
              .icon-jiahao {
                font-size: $fontC;
                color: $colorF;
              }
            }
            #upload-pic {
              display: none;
            }
          }
          .vote-box {
            @include flex(left);
            position: relative;
            width: 100%;
            height: 80px;
            padding: 0 16px;
            box-sizing: border-box;
            border-radius: 6px;
            background-color: $colorN;
            margin-top: 10px;
            .vote-desc-box {
              cursor: pointer;
              .title {
                font-size: $fontJ;
                color: $colorB;
              }
              .desc {
                font-size: $fontL;
                color: $colorD;
                margin-top: 5px;
              }
            }
            .icon-cuowu {
              position: absolute;
              right: 5px;
              top: 5px;
              font-size: $fontH;
              color: $colorD;
              cursor: pointer;
            }
          }
          .lives-box {
            @include flex(left);
            position: relative;
            width: 100%;
            height: 80px;
            padding: 0 16px;
            box-sizing: border-box;
            border-radius: 6px;
            background-color: $colorN;
            margin-top: 10px;
            .lives-desc-box {
              cursor: pointer;
              .title {
                font-size: $fontJ;
                color: $colorB;
              }
              .desc {
                font-size: $fontL;
                color: $colorD;
                margin-top: 5px;
              }
            }
            .icon-cuowu {
              position: absolute;
              right: 5px;
              top: 5px;
              font-size: $fontH;
              color: $colorD;
              cursor: pointer;
            }
          }
          .pubTime-box {
            @include flex(left);
            position: relative;
            width: 100%;
            height: 60px;
            padding: 0 16px;
            box-sizing: border-box;
            border-radius: 6px;
            background-color: $colorN;
            margin-top: 10px;
            .el-date-editor--date {
              width: 130px;
              margin-right: 10px
            }
            .el-select__wrapper {
              margin-right: 5px;
            }
            .icon-cuowu {
              position: absolute;
              right: 5px;
              top: 5px;
              font-size: $fontH;
              color: $colorD;
              cursor: pointer;
            }
          }
          .comment-permission {
            margin-top: 10px;
            color: $colorD;
            font-size: $fontL;
          }
          .only-box {
            margin-top: 10px;
            font-size: $fontL;
            .only-title {
              color: #f85d54;
              margin-right: 10px;
              .icon-suo {
                font-size: $fontK;
                margin-right: 3px;
              }
            }
            .only-desc {
              color: $colorD
            }
          }
          .publish-controls {
            @include flex();
            height: 40px;
            .iconfont {
              font-size: $fontG;
              margin-right: 15px;
              color: $colorD;
              cursor: pointer;
              &:hover {
                color: $colorQ;
              }
            }
            .active {
              color: $colorM;
            }
            .publish-controls-headquarters {
              position: relative;
              .content-num {
                height: 20px;
                margin-right: 10px;
              }
              .icon-shezhi {
                vertical-align: middle;
              }
              .cascader {
                display: flex;
                flex-direction: row-reverse;
                position: absolute;
                bottom: -134px;
                right: -36px;
                z-index: 2;
                .cascader-list {
                  .cascader-options {
                    padding: 12px 0;
                    background-color: $colorG;
                    box-shadow: 0 0 30px rgba(0, 0, 0, .1);
                    border: 1px solid $colorF;
                    border-radius: 6px;
                    margin-right: -3px;
                    min-width: 142px;
                    .cascader-options-item {
                      display: flex;
                      position: relative;
                      padding: 8px 25px;
                      cursor: pointer;
                      &:hover {
                        background-color: $colorN;
                      }
                      .item-label {
                        color: $colorD;
                      }
                      .icon-youjiantou {
                        position: absolute;
                        top: 10px;
                        right: 0;
                        color: $colorB;
                        font-size: $fontK;
                        font-weight: bold;
                      }
                      .icon-jiesuo1,.icon-suo {
                        font-size: $fontJ;
                        margin-right: 5px;
                      }
                    }
                    .is-active {
                      .item-label,.icon-jiesuo1,.icon-suo {
                        color: $colorM;
                      }
                    }
                  }
                }
              }
              .pub-btn {
                height: 30px;
                width: 70px;
                background-color: $colorM;
                border: none;
                border-radius: 5px;
                color: $colorG;
                cursor: pointer;
                &:hover {
                  background-color: $colorP;
                }
              }
            }
          }
        }
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
              opacity: .7;
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
            background-color: $colorG;
            box-shadow: 0 0 10px $colorF;
            opacity: 0;
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
        .news-list {
          width: 100%;
          margin-top: 10px;
          .news-item {
            position: relative;
            width: 100%;
            padding: 0 20px 0 88px;
            box-sizing: border-box;
            margin-bottom: 10px;
            background-color: $colorG;
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
              .news-item-time {
                color: $colorD;
                margin-top: 8px
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
            .news-item-body {
              .news-tag {
                font-size: $fontJ;
                color: $colorP;
                font-weight: 500;
                cursor: pointer;
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
              }
              .news-album {
                width: 470px;
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
            }
            .news-item-footer {
              @include flex();
              height: 50px;
              padding-right: 80px;
              box-sizing: border-box;
              color: $colorD;
              font-size: $fontJ;
              .footer-item {
                cursor: pointer;
                &:hover {
                  color: $colorM;
                }
              }
            }
          }
        }
      }
      .slide {
        width: 25%;
        .slide-banner {
          width: 100%;
          height: 200px;
          background-color: $colorG;
          border-radius: 6px;
          margin-bottom: 10px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 6px
          }
        }
        .slide-tags {
          width: 100%;
          padding: 20px 5px 5px 5px;
          box-sizing: border-box;
          border-radius: 6px;
          background-color: $colorG;
          h2 {
            padding: 10px;
          }
          .tag-list {
            .tag-item {
              position: relative;
              width: 100%;
              height: 50px;
              padding: 5px 30px;
              box-sizing: border-box;
              border-radius: 6px;
              margin-bottom: 10px;
              cursor: pointer;
              &:hover {
                background-color: $colorN;
              }
              .icon-huati {
                position: absolute;
                left: 10px;
                top: 6px;
                font-size: $fontH;
                color: $colorM;
              }
              .tag-item-title {
                font-size: $fontJ;
                color: $colorB;
                font-weight: 500;
                margin-bottom: 4px;
                &:hover {
                  color: $colorM;
                }
              }
              .tag-item-stat {
                color: $colorD;
              }
            }
          }
        }
      }
    }
    .container-small {
      width: 1100px;
    }
  }
  .modal-vote-box {
    .vote-title-sec {
      .desc {
        font-size: $fontJ;
        font-weight: bold;
      }
      .input-box {
        position: relative;
        margin-top: 8px;
        input {
          width: 100%;
          height: 36px;
          padding: 0 12px;
          border: 1px solid $colorE;
          box-sizing: border-box;
          border-radius: 6px;
          &:hover {
            border: 1px solid $colorM;
          }
        }
        .stat {
          position: absolute;
          right: 10px;
          top: 10px;
          color: $colorD
        }
      }
    }
    .vote-desc-sec {
      .add-desc {
        width: 70px;
        color: $colorM;
        cursor: pointer;
        margin-top: 10px;
        .icon-jiahao {
          font-size: $fontK;
          margin-right: 6px;
        }
      }
      .desc {
        font-size: $fontJ;
        font-weight: bold;
        margin-top: 24px;
        span {
          color: $colorD;
          font-size: $fontK;
          font-weight: 100;
          margin-left: 5px;
        }
      }
      .input-box {
        margin-top: 8px;
        position: relative;
        textarea {
          width: 100%;
          height: 100px;
          padding: 10px;
          border: 1px solid $colorE;
          border-radius: 6px;
          box-sizing: border-box;
          resize: none;
          &:hover {
            border: 1px solid $colorM;
          }
        }
        .stat {
          position: absolute;
          right: 10px;
          bottom: 10px;
        }
      }
    }
    .vote-type-sec {
      margin-top: 20px;
      .desc {
        font-size: $fontJ;
        font-weight: bold;
      }
      .radio-box {
        margin-top: 8px;
        .radio {
          cursor: pointer;
          font-size: $fontJ;
        }
        input {
          margin-right: 5px;
        }
        label {
          margin-right: 15px;
        }
      }
      .text-option-list {
        .option-item {
          display: flex;
          height: 40px;
          line-height: 40px;
          width: 100%;
          margin-top: 10px;
          .item-name {
            flex: .15;
            font-size: $fontJ;
            color: $colorB;
          }
          .input-box {
            flex: .85;
            @include flex();
            width: 100%;
            padding: 7px 0;
            border: 1px solid $colorE;
            border-radius: 6px;
            &:hover {
              border: 1px solid $colorM;
            }
            input {
              height: 100%;
              width: 90%;
              border: none;
              padding-left: 10px;
              box-sizing: border-box;
            }
            .delete-icon-box {
              width: 10%;
              text-align: center;
              .icon-shanchu {
                font-size: $fontF;
                padding: 0 8px;
                box-sizing: border-box;
                cursor: pointer;
                border-left: 2px solid $colorE;
              }
            }
          }
        }
        .add-option {
          width: 70px;
          margin-top: 10px;
          color: $colorM;
          cursor: pointer;
          .icon-jiahao {
            font-size: $fontK;
            margin-right: 6px;
          }
        }
      }
      .picture-option-list {
        display: flex;
        flex-wrap: wrap;
        .picture-option-item {
          width: 152px;
          margin-top: 10px;
          margin-right: 10px;
          .info {
            position: relative;
            margin-bottom: 4px;
            .info-name {
              font-size: $fontJ;
            }
            .icon-shanchu {
              position: absolute;
              right: 0;
              font-size: $fontF;
              cursor: pointer;
            }
          }
          .upload-box {
            width: 152;
            height: 152px;
            line-height: 152px;
            text-align: center;
            background-color: $colorN;
            border: 1px solid $colorL;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            cursor: pointer;
            .icon-jiahao {
              font-size: $fontB;
              color: $colorE;
            }
          }
          #picture {
            display: none;
          }
          .desc {
            width: 100%;
            height: 62px;
            padding: 8px;
            border: 1px solid $colorL;
            border-top: none;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            box-sizing: border-box;
            resize: none
          }
        }
        .picture-add-box {
          @include flex(center);
          width: 152px;
          height: 215px;
          border: 1px dotted $colorL;
          border-radius: 6px;
          margin-top: 32px;
          color: $colorM;
          cursor: pointer;
          .icon-jiahao {
            margin-right: 5px;
            font-size: $fontK;
          }
        }
      }
    }
    .vote-more-sec {
      margin-top: 15px;
      .desc {
        font-size: $fontJ;
        font-weight: bold;
        margin-bottom: 5px;
      }
      .select-box {
        @include flex();
        font-size: $fontJ;
        color: $colorD;
        .el-select {
          width: 85%;
        }
      }
    }
    .vote-end-sec {
      margin-top: 15px;
      .desc {
        font-size: $fontJ;
        font-weight: bold;
        color: $colorD;
        margin-bottom: 8px
      }
      .end-box {
        @include flex();
        .el-date-editor--date {
          margin-right: 20px;
        }
      }
    }
  }
  .modal-lives-box {
    .lives-box-title {
      font-size: $fontJ;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .title-input-box {
      position: relative;
      height: 36px;
      width: 100%;
      margin-bottom: 10px;
      input {
        height: 100%;
        width: 100%;
        padding: 0 10px;
        border: 1px solid $colorE;
        box-sizing: border-box;
        border-radius: 6px;
        &:hover {
          border: 1px solid $colorM;
        }
      }
      .stat {
        position: absolute;
        right: 10px;
        top: 10px;
        color: $colorE;
      }
    }
    .time-box {
      @include flex();
      .el-date-editor--date {
        margin-right: 20px;
      }
    }
  }
</style>