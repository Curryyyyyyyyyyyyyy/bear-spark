<script setup>
  import BsTagSelect from '@/components/news/BsTagSelect.vue';
  import BsInput from '@/components/input/BsInput.vue';
  import BsModal from '@/components/common/BsModal.vue'
  import { nextTick, onBeforeUnmount, ref } from 'vue';
  import dayjs from 'dayjs';
  import {timeFormat} from '@/hooks/timeFormat.js'
  import {hourOptions,minuteOptions} from '@/hooks/timeOptions.js'
  import { ElSelect,ElOption,ElDatePicker, ElMessage } from 'element-plus';
  import {publishNewsApi} from '@/api/news.js'
  import {uploadApi} from '@/api/file'
  import useNews from '@/store/news.js'
  import { storeToRefs } from 'pinia';
  import { throttle } from '@/hooks/performance';
  import { regTime } from '@/util/reg';

  /* Store */
  const newsStore = useNews()
  const {pictureList} = storeToRefs(newsStore)
  //#region 标签
  /* publishTagId */
  const publishTagId = ref(null)
  function changePubTagId(id) {
    publishTagId.value = id
  }
  //#endregion
  //#region 发布
  /* 发布 */
  const newsTitle = ref('')
  const imgUrlList = ref([])
  const bookLiveInfo = ref(null)
  const publish = throttle(async () => {
    if(!pubInputBoxRef.value.children[0].innerHTML) return ElMessage.error('内容不能为空')
    let pubTime = ''
    if(!earlyPublish.value && regTime(publishDate.value,publishHour.value,publishMinute.value)) return ElMessage.error('发布时间不能早于当前')
    if(showVoteBox.value && regTime(voteEndDate.value,voteEndHour.value,voteEndMinute.value)) return ElMessage.error('投票截止时间不能早于当前')
    if(showLivesBox.value && regTime(livesEndDate.value,livesEndHour.value,livesEndMinute.value)) return ElMessage.error('预约直播时间不能早于当前')
    if(publishDate.value && publishHour.value && publishMinute.value) {
      pubTime = timeFormat(publishDate.value,publishHour.value,publishMinute.value)
    } else {
      pubTime = timeFormat(dayjs().format('YYYY-MM-DD'), dayjs().$H, dayjs().$m)
    }
    let content = pubInputBoxRef.value.children[0].innerHTML
    await publishNewsApi({
      title:newsTitle.value,
      content,
      imgUrlList:imgUrlList.value,
      tagId:publishTagId.value,
      visibility:newsSeePermission.value,
      advanceRelease:earlyPublish.value,
      commentAble:newsCommentPermission.value,
      pubTime:pubTime,
      bookLiveInfo:bookLiveInfo.value,
      voteInfo:voteInfo.value
    })
    ElMessage.success('发布成功')
    //#region 清空表单
      newsTitle.value = ''
      publishTagId.value = null
      pubInputBoxRef.value.children[0].innerHTML = ''
      pubInputMethods.value.handleContentNum(pubInputBoxRef.value.children[0])
      imgUrlList.value = []
      newsSeePermission.value = 0
      newsCommentPermission.value = 0
      showLivesBox.value = false
      bookLiveInfo.value = ''
      showVoteBox.value = false
      voteInfo.value = ''
      pictureList.value = []
      pubTime = ''
      pubTimeBox.value = false
      //#endregion
  }, 1000) 
  //#endregion
  //#region @艾特功能
  function handleClickAt(inputRef) {
    pubInputMethods.value.handleClickAt(inputRef)
  }
  //#endregion
  //#region 表情包
  const pubInputMethods = ref()
  const pubInputBoxRef = ref()
  const showEmojiBox = ref(false)
  function insertEmoji(emojiUrl, inputRef) {
    pubInputMethods.value.insertEmoji(emojiUrl, inputRef)
  }
  //#endregion
  //#region 图片
  let timer
  const showUploadBox = ref(false)
  if(pictureList.value.length > 0) showUploadBox.value = true
  timer = setInterval(() => {
    for (let i = 0; i < pictureList.value.length; i++) {
      pictureList.value[i].remainTime--
      if(!pictureList.value[i].remainTime) {
        pictureList.value.shift()
      }
    }
  }, 1000);
  async function uploadPicture(event) {
    const pictureFile = event.target.files[0]
    if(pictureFile.size / 1024 / 1024 > 1) {
      return ElMessage.error('图片大小不能超过1MB')
    }
    const fd = new FormData()
    fd.append('file',pictureFile)
    const imgUrl = await uploadApi(fd, 0)
    pictureList.value.push({src:imgUrl,remainTime:1800})
    imgUrlList.value = pictureList.value.map(item => item.src)
    event.target.value = null
  }
  function deletePicture(index) {
    pictureList.value.splice(index, 1)
  }
  //#endregion
  //#region 投票功能
  /* 展示投票表单 */
  const showPubVoteModal = ref(false)
  /* 展示投票栏 */
  const showVoteBox = ref(false)
  /* 标题 */
  const voteTitle = ref('')
  /* 说明输入框 */
  const voteDesc = ref('')
  const showDescInput = ref(false)
  /* 投票类型 */
  const voteType = ref(1) // 1:文字 2:图片
  const textOptionList = ref([{optionContent:''},{optionContent:''}])
  function addOption() {
    if(textOptionList.value.length === 20) return
    textOptionList.value.push({optionContent:''})
    pictureOptionList.value.push({optionContent:'',optionPhotoUrl:''})
  }
  function deleteOption(index) {
    textOptionList.value.splice(index, 1)
    pictureOptionList.value.splice(index, 1)
  }
  const pictureOptionList = ref([{optionContent:'',optionPhotoUrl:''},{optionContent:'',optionPhotoUrl:''}])
  /* 上传图片选项 */
  async function uploadPictureOption(event,index) {
    const pictureFile = event.target.files[0]
    if(pictureFile.size / 1024 / 1024 > 1) {
      return ElMessage.error('图片大小不能超过1MB')
    }
    const fd = new FormData()
    fd.append('file',pictureFile)
    const optionPhotoUrl = await uploadApi(fd, 0)
    pictureOptionList.value[index].optionPhotoUrl = optionPhotoUrl
    event.target.value = null
  }
  /* 限选和截止时间 */
  const voteMaxSelectNum = ref('')
  const voteEndDate = ref('')
  const voteEndHour = ref('')
  const voteEndMinute = ref('')
  const voteHourOptions = ref([...hourOptions])
  const voteMinuteOptions = ref([...minuteOptions])
  const disabledVoteAndLiveDate = (time) => {
    return time.getTime() < Date.now() - 8.46e7 || time.getTime() > Date.now() + 90 * 8.64e7
  }
  function handleClickVote() {
    showPubVoteModal.value = true
    const defaultTime = dayjs(new Date().getTime() + 86400000)
    voteEndDate.value = defaultTime.format('YYYY-MM-DD')
    voteHourOptions.value = [...hourOptions]
    voteMinuteOptions.value = [...minuteOptions]
  }
  function changeVoteDate() {
    const date = dayjs(voteEndDate.value)
    if(date.$D === new Date().getDate()) {
      if(new Date().getMinutes() >= 55) {
        voteHourOptions.value.splice(0, new Date().getHours() + 1)
      } else {
        voteHourOptions.value.splice(0, new Date().getHours())
      }
    } else {
      voteHourOptions.value = [...hourOptions]
      voteMinuteOptions.value = [...minuteOptions]
    }
    voteEndHour.value = ''
    voteEndMinute.value = ''
  }
  function changeVoteHour() {
    const date = dayjs(voteEndDate.value)
    if(date.$D === new Date().getDate() && +voteEndHour.value === new Date().getHours()) {
      voteMinuteOptions.value.splice(0, new Date().getMinutes() + 5)
    } else {
      voteMinuteOptions.value = [...minuteOptions]
    }
    voteEndMinute.value = ''
  }
  /* 提交投票表单 */
  /* 清空表单 */
  function clearVoteForm() {
    voteTitle.value = ''
    voteDesc.value = ''
    voteType.value = 1
    voteMaxSelectNum.value = 0
    voteEndDate.value = ''
    voteEndHour.value = ''
    voteEndMinute.value = ''
    textOptionList.value = [{optionContent:''},{optionContent:''}]
    pictureOptionList.value = [{optionContent:'',optionPhotoUrl:''},{optionContent:'',optionPhotoUrl:''}]
  }
  const voteInfo = ref(null)
  async function submitVote() {
    /* 校验数据 */
    if(
      !voteTitle.value || 
      !voteMaxSelectNum.value || 
      !voteEndDate.value || 
      !voteEndHour.value || 
      !voteEndMinute.value
    ) {
      return ElMessage.error('请填写完整选项')
    }
    let optionList = []
    if(voteType.value === 1) {
      for (let index = 0; index < textOptionList.value.length; index++) {
        if(!textOptionList.value[index].optionContent) return ElMessage.error('请填写完整选项')
      }
      optionList = textOptionList.value
    } else {
      for (let index = 0; index < pictureOptionList.value.length; index++) {
        if(!pictureOptionList.value[index].optionContent || !pictureOptionList.value[index].optionPhotoUrl) return ElMessage.error('请填写完整选项')
      }
      optionList = pictureOptionList.value
    }
    /* 处理optionList */
    optionList.map((item,index) => {
      item.optionId = index
    })
    voteInfo.value = {
      title:voteTitle.value,
      desc:voteDesc.value,
      voteType:voteType.value,
      voteLim:voteMaxSelectNum.value,
      deadline:timeFormat(
        voteEndDate.value,
        voteEndHour.value,
        voteEndMinute.value
      ),
      optionList:optionList
    }
    showPubVoteModal.value = false
    showVoteBox.value = true
    /* 禁止预约直播和发布时间 */
    bookLiveInfo.value = null
    showLivesBox.value = false
    publishDate.value = null
    publishHour.value = null
    publishMinute.value = null
    pubTimeBox.value = false
  }
  function deleteVoteBox() {
    showVoteBox.value = false
    clearVoteForm()
  }
  //#endregion
  //#region 预约直播
  const showLivesBox = ref(false)
  const showPubBookLivesModal = ref(false)
  const livesEndDate = ref('') // 预约日期
  const livesEndHour = ref('') // 预约小时
  const livesEndMinute = ref('') // 预约分钟
  const livesHourOptions = ref([...hourOptions])
  const livesMinuteOptions = ref([...minuteOptions])
  const livesTitle = ref('')
  function handleClickLive() {
    showPubBookLivesModal.value = true
    const defaultTime = dayjs(new Date().getTime() + 86400000)
    livesEndDate.value = defaultTime.format('YYYY-MM-DD')
    livesHourOptions.value = [...hourOptions]
    livesMinuteOptions.value = [...minuteOptions]
  }
  function changeLivesDate() {
    const date = dayjs(livesEndDate.value)
    if(date.$D === new Date().getDate()) {
      if(new Date().getMinutes() >= 55) {
        livesHourOptions.value.splice(0, new Date().getHours() + 1)
      } else {
        livesHourOptions.value.splice(0, new Date().getHours())
      }
    } else {
      livesHourOptions.value = [...hourOptions]
      livesMinuteOptions.value = [...minuteOptions]
    }
    livesEndHour.value = ''
    livesEndMinute.value = ''
  }
  function changeLivesHour() {
    const date = dayjs(livesEndDate.value)
    if(date.$D === new Date().getDate() && +livesEndHour.value === new Date().getHours()) {
      livesMinuteOptions.value.splice(0, new Date().getMinutes() + 5)
    } else {
      livesMinuteOptions.value = [...minuteOptions]
    }
    livesEndMinute.value = ''
  }
  /* 发起直播预约 */
  async function submitLives() {
    if(
      !livesTitle.value || 
      !livesEndDate.value || 
      !livesEndHour.value || 
      !livesEndMinute.value
    ) {
      return ElMessage.error('请填写完整选项')
    }
    bookLiveInfo.value = {
      title:livesTitle.value,
      liveTime:timeFormat(
        livesEndDate.value,
        livesEndHour.value,
        livesEndMinute.value
      )
    }
    showLivesBox.value = true
    showPubBookLivesModal.value = false
    /* 禁止发布投票和设定发布时间 */
    showVoteBox.value = false
    voteInfo.value = null
    publishDate.value = null
    publishHour.value = null
    publishMinute.value = null
    pubTimeBox.value = false
  }
  //#endregion
  //#region 设置
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
  const newsSeePermission = ref(0) // 0:所有人可见 1:仅粉丝可见 2:隐私
  const newsCommentPermission = ref(0) // 0:允许评论 1：关闭评论 2：精选评论
  //#endregion
  //#region 发布时间
  const pubTimeBox = ref(false)
  const publishDate = ref()
  const publishHour = ref()
  const publishMinute = ref()
  const pubHourOptions = ref([...hourOptions])
  const pubMinuteOptions = ref([...minuteOptions])
  const earlyPublish = ref(1) // 1:不提前发布 0：提前发布
  /* 禁用某些日期 */
  const disabledPubDate = (time) => {
    if(!earlyPublish.value) return time.getTime() > Date.now() - 8.64e7
    else return time.getTime() < Date.now() - 8.64e7 || time.getTime() > Date.now() + 90 * 8.64e7
  }
  function handleClickPubTime() {
    pubTimeBox.value = true
    settingCascader1.value = false
    const defaultTime = dayjs(new Date().getTime() + 86400000)
    publishDate.value = defaultTime.format('YYYY-MM-DD')
    pubHourOptions.value = [...hourOptions]
    pubMinuteOptions.value = [...minuteOptions]
    /* 禁止发布投票和预约直播 */
    bookLiveInfo.value = null
    showLivesBox.value = false
    voteInfo.value = null
    showVoteBox.value = false
  }
  function changePubDate() {
    const date = dayjs(publishDate.value)
    if(date.$D === new Date().getDate()) {
      if(new Date().getMinutes() >= 55) {
        pubHourOptions.value.splice(0, new Date().getHours() + 1)
      } else {
        pubHourOptions.value.splice(0, new Date().getHours())
      }
    } else {
      pubHourOptions.value = [...hourOptions]
      pubMinuteOptions.value = [...minuteOptions]
    }
    publishHour.value = ''
    publishMinute.value = ''
  }
  function changePubHour() {
    const date = dayjs(publishDate.value)
    if(date.$D === new Date().getDate() && +publishHour.value === new Date().getHours()) {
      pubMinuteOptions.value.splice(0, new Date().getMinutes() + 5)
    } else {
      pubMinuteOptions.value = [...minuteOptions]
    }
    publishMinute.value = ''
  }
  function deletePubTime() {
    publishDate.value = ''
    publishHour.value = ''
    publishMinute.value = ''
    pubTimeBox.value = false
  }
  function handleClickEarlyPub() {
    earlyPublish.value = Math.abs(earlyPublish.value-1)
    publishDate.value = ''
    publishHour.value = ''
    publishMinute.value = ''
  }
  //#endregion
  //#region onBeforeUnMounted
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
  //#endregion
</script>

<template>
  <div class="news-publish-box">
    <bs-tag-select @getSelectTagId="changePubTagId"></bs-tag-select>
    <div class="publish-input">
      <input name="newsTitle" v-model="newsTitle" maxlength="20" type="text" class="title" placeholder="标题 (选填，20字内)" autocomplete="off">
      <i v-if="newsTitle" @click="newsTitle = ''" class="iconfont icon-cuowu1"></i>
      <span v-if="newsTitle" class="title-num">{{ newsTitle.length }}</span>
      <div ref="pubInputBoxRef" class="pub-content-input-box">
        <bs-input ref="pubInputMethods" placeholder="有什么想和大家分享的？"></bs-input>
      </div>
    </div>
    <div v-if="showUploadBox" class="pub-picture-list">
      <div v-for="(item,index) in pictureList" :key="index" class="picture-box">
        <img :src="item.src" alt="">
        <div class="delete-btn" @click="deletePicture(index)">
          <i class="iconfont icon-cuowu"></i>
        </div>
        <div class="progress-bar">
          <div class="progress" :style="{width:item.remainTime/1800*100+'%', backgroundColor:item.remainTime/1800*100 > 70 ? '#88cc24' : (item.remainTime/1800*100 > 20 ? '#e6a23c' : '#f56c6c')}"></div>
        </div>
      </div>
      <label for="upload-pic">
        <div class="pictrue-upload-box">
          <i class="iconfont icon-jiahao"></i>
        </div>
        <input @change="uploadPicture" accept="image/*" id="upload-pic" type="file">
      </label>
    </div>
    <div v-if="showVoteBox" class="vote-box">
      <div class="vote-desc-box">
        <div class="vote-box-title">{{ voteTitle }}</div>
        <p class="desc">0人参与投票</p>
      </div>
      <i @click="deleteVoteBox" class="iconfont icon-cuowu"></i>
    </div>
    <div v-if="showLivesBox" class="lives-box">
      <div class="lives-desc-box">
        <div class="lives-box-title">直播预约：{{ livesTitle }}</div>
        <p class="desc">{{ livesEndDate }}&nbsp;{{ livesEndHour }}:{{ livesEndMinute }} 直播</p>
      </div>
      <i @click="showLivesBox = false" class="iconfont icon-cuowu"></i>
    </div>
    <div v-if="pubTimeBox" class="pubTime-box">
      <span>发布时间：</span>
      <el-date-picker
        v-model="publishDate"
        type="date"
        placeholder="日期"
        value-format="YYYY-MM-DD"
        :disabled-date="disabledPubDate"
        @change="changePubDate"
      />
      <el-select v-model="publishHour" @change="changePubHour" placeholder="时" style="width: 100px">
        <el-option
          v-for="item in pubHourOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="publishMinute" placeholder="分" style="width: 100px">
        <el-option
          v-for="item in pubMinuteOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <button @click="handleClickEarlyPub" :style="{backgroundColor:earlyPublish ? '#4844446c' : 'rgb(220, 31, 31)'}" class="early-publish-btn">提前发布</button>
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
      <div class="publish-controls-tool">
        <div class="emoji-btn" ref="emojiBtnDom">
          <i @click="showEmojiBox = !showEmojiBox" :class="{'active':showEmojiBox}" class="iconfont icon-biaoqing"></i>
          <div v-if="showEmojiBox" class="emoji-box">
            <bs-emoji @insertEmoji="insertEmoji($event, pubInputBoxRef.children[0])"></bs-emoji>
          </div>
        </div>
        <div>
          <i @click="showUploadBox = !showUploadBox" :class="{'active':showUploadBox}" class="iconfont icon-tupian"></i>
        </div>
        <div>
          <i @click="handleClickAt(pubInputBoxRef.children[0])" class="iconfont icon-aite"></i>
        </div>
        <div>
          <i @click="handleClickVote" :class="{'active':showVoteBox}" class="iconfont icon-toupiao"></i>
        </div>
        <div>
          <i @click="handleClickLive" :class="{'active':showLivesBox}" class="iconfont icon-zhibo"></i>
        </div>
      </div>
      <div class="publish-controls-headquarters">
        <i @click="showSettingCascader" class="iconfont icon-shezhi"></i>
        <div v-if="settingCascader1" class="cascader"  tabindex="1" @blur="blurSettingCascader" ref="settingCascaderDom">
          <div v-if="settingCascader1" class="cascader-list">
            <div class="cascader-options">
              <div @click="showSettingCascader2(1)" class="cascader-options-item">
                <div class="item-label">可见范围</div>
                <i class="iconfont icon-youjiantou"></i>
              </div>
              <div @click="handleClickPubTime" class="cascader-options-item">
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
              <!-- <div class="cascader-options-item" @click="newsCommentPermission = 2,blurSettingCascader()" :class="{'is-active':newsCommentPermission === 2}">
                <span class="item-label">精选评论</span>
              </div> -->
            </div>
          </div>
        </div>
        <button @click="publish" class="pub-btn">发布</button>
      </div>
    </div>
  </div>
  <bs-modal 
    v-if="showPubVoteModal" 
    @submit="submitVote" 
    @closeModal="showPubVoteModal = false" 
    title="发起投票"
  >
    <template v-slot:modal>
      <div class="modal-vote-box">
        <div class="vote-title-sec">
          <p class="desc">投票标题</p>
          <div class="input-box">
            <input v-model="voteTitle" type="text" placeholder="请填写标题" maxlength="32"/>
            <span class="stat">{{ voteTitle.length }}/32</span>
          </div>
        </div>
        <div class="vote-desc-sec">
          <div v-if="!showDescInput" @click="showDescInput = true" class="add-desc">
            <i class="iconfont icon-jiahao"></i>
            <span>添加说明</span>
          </div>
          <p v-if="showDescInput" class="desc">投票说明<span>(选填)</span></p>
          <div v-if="showDescInput" class="input-box">
            <textarea v-model="voteDesc" type="text" placeholder="请填写投票说明(选填)" maxlength="100"></textarea>
            <span class="stat">{{ voteDesc.length }}/100</span>
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
                <input v-model="item.optionContent" type="text" maxlength="20" :placeholder="`请填写选项${index+1}内容，最多20字`">
                <div v-if="textOptionList.length > 2" class="delete-icon-box">
                  <i @click="deleteOption(index)" class="iconfont icon-shanchu"></i>
                </div>
              </div>
            </div>
            <div v-if="textOptionList.length < 20" @click="addOption" class="add-option">
              <i class="iconfont icon-jiahao"></i>
              <span>添加选项</span>
            </div>
          </div>
          <div v-if="voteType === 2" class="picture-option-list">
            <div v-for="(item,index) in pictureOptionList" :key="index" class="picture-option-item">
              <div class="info">
                <span class="info-name">选项{{ index+1 }}</span>
                <i @click="deleteOption(index)" v-if="pictureOptionList.length > 2" class="iconfont icon-shanchu"></i>
              </div>
              <div class="picture-box">
                <label :for="'picture'+index">
                  <div class="upload-box">
                    <img v-if="item.optionPhotoUrl" v-lazy="item.optionPhotoUrl" alt="">
                    <i v-else class="iconfont icon-jiahao"></i>
                  </div>
                </label>
                <textarea v-model="item.optionContent" maxlength="20" class="desc" :placeholder="`请填写选项${index+1}内容，不超过20个字`"></textarea>
              </div>
              <input v-show="false" @change="uploadPictureOption($event,index)" accept="image/*" :id="'picture'+index" type="file">
            </div>
            <div @click="addOption" class="picture-add-box">
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
            <bs-select placeholder="请选择" v-model="voteMaxSelectNum">
              <bs-option
                v-for="(item,index) in textOptionList"
                :key="index"
                :label=" index+1 > 1 ? `最多选${index+1}项` : '单选'"
                :value="index+1">
              </bs-option>
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
              :disabled-date="disabledVoteAndLiveDate"
              @change="changeVoteDate"
            />
            <el-select v-model="voteEndHour" @change="changeVoteHour" placeholder="时" style="width: 100px">
              <el-option
                v-for="item in voteHourOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="voteEndMinute" placeholder="分" style="width: 100px">
              <el-option
                v-for="item in voteMinuteOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </template>
  </bs-modal>
  <bs-modal
    v-if="showPubBookLivesModal"
    @submit="submitLives"
    @closeModal="showPubBookLivesModal = false"
    title="发起直播预约"
  >
    <template v-slot:modal>
      <div class="modal-lives-box">
        <p class="lives-box-title">发起新预约</p>
        <div class="title-input-box">
          <input v-model="livesTitle" maxlength="14" type="text" placeholder="请填写预约标题">
          <span class="stat">{{ livesTitle.length }}/14</span>
        </div>
        <div class="time-box">
          <el-date-picker
            type="date"
            v-model="livesEndDate"
            placeholder="请选择预约日期"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledVoteAndLiveDate"
            :default-value="new Date(new Date().getTime() + 86400000)"
            @change="changeLivesDate"
          />
          <el-select v-model="livesEndHour" @change="changeLivesHour" placeholder="时" style="width: 100px">
            <el-option
              v-for="item in livesHourOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="livesEndMinute" placeholder="分" style="width: 100px">
            <el-option
              v-for="item in livesMinuteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </template>
  </bs-modal>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .news-publish-box {
    padding: 15px;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: $colorG;
    margin-bottom: 10px;
    .publish-input {
      position: relative;
      .title {
        margin-top: 10px;
        width: 90%;
        border: none;
        font-size: $fontJ;
        font-weight: bold;
      }
      .pub-content-input-box {
        position: relative;
      }
      .icon-cuowu1 {
        margin-right: 4px;
        color: $colorF;
        font-size: $fontJ;
        cursor: pointer;
      }
      .title-num {
        color: $colorF;
        font-size: $fontJ;
      }
      .content {
        position: relative;
        margin-top: 5px;
        margin-bottom: 15px;
        width: 92%;
        border: none;
        resize: none;
        font-size: $fontJ;
        img {
          height: 20px;
          width: 20px;
          vertical-align: middle;
        }
        .username {
          color: $colorM;
        }
      }
      .content-empty {
        &::after {
          content: attr(placeholder);
          position: absolute;
          top: 0px;
          color: $colorD;
        }
      }
    }
    .pub-picture-list {
      display: flex;
      margin-top: 10px;
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
          width: 100%;
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
      background-color: $colorR;
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
      background-color: $colorR;
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
      background-color: $colorR;
      margin-top: 10px;
      .el-date-editor--date {
        width: 130px;
        margin-right: 10px
      }
      .el-select__wrapper {
        margin-right: 5px;
      }
      .early-publish-btn {
        position: absolute;
        right: 40px;
        padding: 4px 10px;
        border: none;
        border-radius: 6px;
        color: $colorG;
        cursor: pointer;
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
      .publish-controls-tool {
        @include flex();
        .iconfont {
          font-size: $fontG;
          margin-right: 15px;
          color: $colorD;
          cursor: pointer;
          &:hover {
            color: $colorQ;
          }
        }
        .emoji-btn {
          position: relative;
          .emoji-box {
            z-index: 10;
            position: absolute;
            top: 35px;
            left: -5px;
            background-color: $colorG;
          }
        }
      }
      .publish-controls-headquarters {
        position: relative;
        .content-num {
          height: 20px;
        }
        .icon-shezhi {
          vertical-align: middle;
          font-size: $fontH;
          cursor: pointer;
          margin: 0 10px;
          &:hover {
            color: $colorM;
          }
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
                  right: 25px;
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
      .active {
        color: $colorM !important;
      }
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
            img {
              width: 100%;
              height: 100%;
            }
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