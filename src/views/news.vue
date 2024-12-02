<script setup>
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
  import NavHeader from '@/components/NavHeader.vue'
  import BsModal from '@/components/BsModal.vue';
  import BsSelect from '@/components/BsSelect.vue';
  import BsOption from '@/components/BsOption.vue';
  import BsEmoji from '@/components/BsEmoji.vue';
  import BsVoteModal from '@/components/BsVoteModal.vue';
  import BsRichTextInput from '../components/BsRichTextInput.vue';
  import BsTagSelect from '../components/BsTagSelect.vue';
  import { ElSelect,ElOption,ElDatePicker, ElMessage, ElMessageBox } from 'element-plus';
  import {hourOptions,minuteOptions} from '@/hooks/timeOptions.js'
  import {timeFormat} from '@/hooks/timeFormat.js'
  import useNews from '@/store/news.js'
  import {useRouter} from 'vue-router'
  import { storeToRefs } from 'pinia';
  import dayjs from 'dayjs';
  import useUser from '../store/user';
  import {publishNewsApi,getNewsPrepareApi,getNewsListApi,getTagListApi,getVoteDetailApi} from '@/api/news.js'
  import {uploadApi} from '@/api/file.js'
  import {getUserInfoApi} from '@/api/user.js'
  import {revokeBookLiveApi,modBookLiveStateApi} from '@/api/bookLive.js'

  /* Store */
  const newsStore = useNews()
  const {pictureList} = storeToRefs(newsStore)
  /* Router */
  const router = useRouter()
  const userStore = useUser()
  const {username} = storeToRefs(userStore)
  //#region Mounted
  const recentTagList = ref([])
  const followerList = ref([])
  const emojiUrlList = ref([])
  const tagList = ref([])
  const newsList = ref([])
  const userInfo = ref('')
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
  // followerList.value = [
  //   {avatarUrl:'/imgs/default-avatar.png',username:'周权',fansNumInfo:111},
  //   {avatarUrl:'/imgs/default-avatar.png',username:'谢家辉',fansNumInfo:222},
  //   {avatarUrl:'/imgs/default-avatar.png',username:'何昕',fansNumInfo:333},
  //   {avatarUrl:'/imgs/default-avatar.png',username:'叶凯乐',fansNumInfo:444},
  //   {avatarUrl:'/imgs/default-avatar.png',username:'王思杰',fansNumInfo:555},
  //   {avatarUrl:'/imgs/default-avatar.png',username:'卢家秦',fansNumInfo:666},
  //   {avatarUrl:'/imgs/default-avatar.png',username:'周权',fansNumInfo:777},
  //   {avatarUrl:'/imgs/default-avatar.png',username:'周权',fansNumInfo:888},
  // ]
  // userInfo.value = {
  //   username:'curryyyyyyyyy',
  //   avatarUrl:'/imgs/default-avatar.png',
  //   fanNumInfo:0,
  //   followerNumInfo:0,
  //   happeningNumInfo:0
  // }
  // newsList.value = [
  //   {
  //       "username": "万超",
  //       "avatarUrl": "http://dummyimage.com/100x100",
  //       "title": "现无称点进其原",
  //       "content": "mollit reprehenderit in",
  //       "tag": "pariatur eiusmod aliqua labore reprehenderit",
  //       "viewNumInfo": "41",
  //       "likeNumInfo": "50",
  //       "commentNumInfo": "95",
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "bookLiveInfo": {
  //           "bookLiveId": 36,
  //           "anchorName": "备料目积照之",
  //           "title": "活而场有解济",
  //           "liveTimeInfo": "2017-06-05 01:55:57",
  //           "bookNumInfo": "67",
  //           "booked": 1,
  //           "canceled": 1,
  //           "dead": 0
  //       },
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "quotedHappening": {
  //           "username": "吴芳",
  //           "avatarUrl": "http://dummyimage.com/100x100",
  //           "title": "究运平统",
  //           "content": "reprehenderit",
  //           "tag": "minim",
  //           "viewNumInfo": "93",
  //           "likeNumInfo": "94",
  //           "commentNumInfo": "35",
  //           "commentAble": 0,
  //           "advanceRelease": 1,
  //           "bookLiveInfo": {
  //               "bookLiveId": 6,
  //               "anchorName": "群电其保",
  //               "title": "书队效群",
  //               "liveTimeInfo": "1986-01-04 10:42:59",
  //               "bookNumInfo": "40",
  //               "booked": 0,
  //               "canceled": 0,
  //               "dead": 0
  //           },
  //           "voteSimpleInfo": {
  //               "voteId": 88,
  //               "title": "年常基速土",
  //               "voteNumInfo": "14"
  //           },
  //           "quotedHappening": {
  //               "username": "余娜",
  //               "avatarUrl": "http://dummyimage.com/100x100",
  //               "title": "转出参",
  //               "content": "nostrud",
  //               "tag": "et eu minim ut anim",
  //               "viewNumInfo": "16",
  //               "likeNumInfo": "5",
  //               "commentNumInfo": "57",
  //               "commentAble": 0,
  //               "advanceRelease": 1,
  //               "bookLiveInfo": {
  //                   "bookLiveId": 81,
  //                   "anchorName": "资做称百程",
  //                   "title": "军干并设",
  //                   "liveTimeInfo": "1973-09-16 16:35:07",
  //                   "bookNumInfo": "51",
  //                   "booked": 0,
  //                   "canceled": 0,
  //                   "dead": 0
  //               },
  //               "voteSimpleInfo": {
  //                   "voteId": 74,
  //                   "title": "应况据响",
  //                   "voteNumInfo": "92"
  //               },
  //               "quotedHappening": {
  //                   "username": "袁艳",
  //                   "avatarUrl": "http://dummyimage.com/100x100",
  //                   "title": "那月美具",
  //                   "content": "nostrud in occaecat amet",
  //                   "tag": "cillum Ut",
  //                   "viewNumInfo": "95",
  //                   "likeNumInfo": "99",
  //                   "commentNumInfo": "31",
  //                   "commentAble": 1,
  //                   "advanceRelease": 1,
  //                   "bookLiveInfo": {
  //                       "bookLiveId": 53,
  //                       "anchorName": "话反空经分作",
  //                       "title": "易越志也图件易",
  //                       "liveTimeInfo": "1995-10-06 04:23:05",
  //                       "bookNumInfo": "36",
  //                       "booked": 0,
  //                       "canceled": 1,
  //                       "dead": 0
  //                   },
  //                   "voteSimpleInfo": {
  //                       "voteId": 58,
  //                       "title": "当口图太",
  //                       "voteNumInfo": "31"
  //                   },
  //                   "quotedHappening": {
  //                       "description": "引用的动态"
  //                   },
  //                   "imgUrlList": [
  //                       "http://dummyimage.com/400x400",
  //                       "http://dummyimage.com/400x400"
  //                   ],
  //                   "pubTimeInfo": "2010-08-31 16:02:39"
  //               },
  //               "imgUrlList": [
  //                   "http://dummyimage.com/400x400",
  //                   "http://dummyimage.com/400x400",
  //                   "http://dummyimage.com/400x400"
  //               ],
  //               "pubTimeInfo": "2015-12-26 00:30:15"
  //           },
  //           "imgUrlList": [
  //               "http://dummyimage.com/400x400"
  //           ],
  //           "pubTimeInfo": "2006-02-08 06:15:20"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   }
  // ]
  onMounted(async () => {
    /* 获取关注的列表、表情包列表、热门标签列表 */
    const res = await getNewsPrepareApi()
    recentTagList.value = res.recentTagList
    followerList.value = res.followerList
    emojiUrlList.value = res.emojiUrlList
    backgroundUrl.value = res.backgroundUrl
    sideBarUrl.value = res.sideBarUrl
    /* 分页获取动态 */
    const newsRes = await getNewsListApi(1, 10)
    newsList.value = newsRes.records
    /* 获取用户信息 */
    userInfo.value = await getUserInfoApi()
  })
  //#endregion
  
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

  //#region 标签
  /* publishTagId */
  const publishTagId = ref('')
  function changePubTagId(id) {
    publishTagId.value = id
  }
  /* 分页获取标签 */
  async function getTagList() {
    const tagRes = await getTagListApi(1, 10)
    tagList.value = tagRes.records
    // tagList.value = [
    //   {
    //     "id": 98,
    //     "viewNumInfo": "21",
    //     "discussNumInfo": "93",
    //     "content": "laboris anim pariatur"
    //   },
    //   {
    //     "id": 59,
    //     "viewNumInfo": "97",
    //     "discussNumInfo": "65",
    //     "content": "laboris irure ut dolor nulla"
    //   }
    // ]
  }
  /* forwardTagId */
  const forwardTagId = ref('')
  function changeForwardTagId(id) {
    forwardTagId.value = id
  }
  /* 富文本 */
  const richTextInputForward = ref()
  console.log(richTextInputForward)
  //#endregion
  //#region 发布
  /* 发布 */
  const newsTitle = ref('')
  const imgUrlList = ref([])
  const bookLiveInfo = ref({})
  async function publish() {
    if(!richTextInputPub.value.contentDom.innerHTML) return ElMessage.error('内容不能为空')
    let pubTime = ''
    if(publishDate.value && publishHour.value && publishHour.value) {
      pubTime = timeFormat(publishDate.value,publishHour.value,publishHour.value)
    }
    await publishNewsApi({
      title:newsTitle.value,
      content:richTextInputPub.value.contentDom.innerHTML,
      imgUrlList:imgUrlList.value,
      tagId:publishTagId.value,
      visibility:newsSeePermission.value,
      advanceRelease:earlyPublish.value,
      commentAble:newsCommentPermission.value,
      submissionId:'',
      pubTime:pubTime,
      bookLiveInfo:bookLiveInfo.value,
      voteInfo:voteInfo.value
    })
    ElMessage.success('发布成功')
    //#region 清空表单
    newsTitle.value = ''
    pubTitleNum.value = 0
    richTextInputPub.value.contentDom.innerHTML = ''
    richTextInputPub.value.contentNum = 0
    imgUrlList.value = []
    newsSeePermission.value = 0
    newsCommentPermission.value = 0
    publishDate.value = ''
    publishHour.value = ''
    publishMinute.value = ''
    //#endregion
  }
  //#endregion
  //#region title
  /* 监听title输入 */
  const pubTitleNum = ref(0)
  function changePubTitle(event) {
    pubTitleNum.value = event.target.value.length
  }
  function clearPubTitle() {
    newsTitle.value = ''
    pubTitleNum.value = 0
  }
  //#endregion
  //#region @艾特功能
  const richTextInputPub = ref()
  function handleClickAt() {
    richTextInputPub.value.handleClickAt()
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
    if(pictureFile.size / 1024 / 1024 > 5) {
      return ElMessage.error('图片大小不能超过5MB')
    }
    const fd = new FormData()
    fd.append('file',pictureFile)
    console.log(event)
    const imgUrl = await uploadApi(fd)
    pictureList.value.push({src:imgUrl.data,remainTime:1800})
    imgUrlList.value = pictureList.value.map(item => item.src)
    event.target.value = null
  }
  function deletePicture(index) {
    pictureList.value.splice(index, 1)
  }
  //#endregion
  //#region 表情包
  const showEmojiBoxPub = ref(false)
  /* 展示表情包列表 */
  function clickEmojiBtn() {
    showEmojiBoxPub.value = !showEmojiBoxPub.value
  }
  /* 表情包列表失焦 */
  function handleEmojiBoxBlur() {
    showEmojiBoxPub.value = false
  }
  /* 输入表情包 */
  function insertEmojiPub(emojiUrl) {
    richTextInputPub.value.insertEmoji(emojiUrl)
  }
  //#endregion
  //#region 投票功能
  /* 展示投票表单 */
  const showPubVoteModal = ref(false)
  /* 展示投票栏 */
  const showVoteBox = ref(false)
  /* 监测标题数 */
  const voteTitle = ref('')
  const voteTitleNum = ref(0)
  function changeVoteTitle(event) {
    voteTitleNum.value = event.target.value.length
  }
  /* 展示说明输入框 */
  const voteDesc = ref('')
  const showDescInput = ref(false)
  /* 监测说明字数 */
  const voteDescNum = ref(0)
  function changeDesc(event) {
    voteDescNum.value = event.target.value.length
  }
  /* 投票类型 */
  const voteType = ref(1) // 1:文字 2:图片
  const textOptionList = ref([{value:''},{value:''}])
  function addOption() {
    textOptionList.value.push({value:''})
    pictureOptionList.value.push({value:'',pictureUrl:''})
  }
  function deleteOption(index) {
    textOptionList.value.splice(index, 1)
    pictureOptionList.value.splice(index, 1)
  }
  const pictureOptionList = ref([{value:'',pictureUrl:''},{value:'',pictureUrl:''}])
  /* 上传图片选项 */
  async function uploadPictureOption(event,index) {
    const pictureFile = event.target.files[0]
    if(pictureFile.size / 1024 / 1024 > 5) {
      return ElMessage.error('图片大小不能超过5MB')
    }
    const fd = new FormData()
    fd.append('file',pictureFile)
    const pictureUrl = await uploadApi(fd)
    pictureOptionList.value[index].pictureUrl = pictureUrl
    event.target.value = null
  }
  /* 限选和截止时间 */
  const voteMaxSelectNum = ref('')
  const voteEndDate = ref('')
  const voteEndHour = ref('')
  const voteEndMinute = ref('')
  const voteHourOptions = ref(hourOptions)
  const voteMinuteOptions = ref(minuteOptions)
  const disabledVoteAndLiveDate = (time) => {
    return time.getTime() < Date.now() - 8.46e7
  }
  function handleClickVote() {
    showPubVoteModal.value = true
    const defaultTime = dayjs(new Date().getTime() + 86400000)
    voteEndDate.value = defaultTime.format('YYYY-MM-DD')
  }
  function changeVoteDate() {
    const date = dayjs(voteEndDate.value)
    if(date.$D === new Date().getDate()) {
      voteHourOptions.value.splice(0, new Date().getHours())
      if(livesEndHour.value === new Date().getHours()) {
        voteMinuteOptions.value.splice(0, new Date().getMinutes() + 1)
      }
    } else {
      voteHourOptions.value = [
      {label:'0时',value:'00'},
      {label:'1时',value:'01'},
      {label:'2时',value:'02'},
      {label:'3时',value:'03'},
      {label:'4时',value:'04'},
      {label:'5时',value:'05'},
      {label:'6时',value:'06'},
      {label:'7时',value:'07'},
      {label:'8时',value:'08'},
      {label:'9时',value:'09'},
      {label:'10时',value:'10'},
      {label:'11时',value:'11'},
      {label:'12时',value:'12'},
      {label:'13时',value:'13'},
      {label:'14时',value:'14'},
      {label:'15时',value:'15'},
      {label:'16时',value:'16'},
      {label:'17时',value:'17'},
      {label:'18时',value:'18'},
      {label:'19时',value:'19'},
      {label:'20时',value:'20'},
      {label:'21时',value:'21'},
      {label:'22时',value:'22'},
      {label:'23时',value:'23'},
      ]
      voteMinuteOptions.value = [
        {"label":"0分","value":'00'},
        {"label":"1分","value":'01'},
        {"label":"2分","value":'02'},
        {"label":"3分","value":'03'},
        {"label":"4分","value":'04'},
        {"label":"5分","value":'05'},
        {"label":"6分","value":'06'},
        {"label":"7分","value":'07'},
        {"label":"8分","value":'08'},
        {"label":"9分","value":'09'},
        {"label":"10分","value":'10'},
        {"label":"11分","value":'11'},
        {"label":"12分","value":'12'},
        {"label":"13分","value":'13'},
        {"label":"14分","value":'14'},
        {"label":"15分","value":'15'},
        {"label":"16分","value":'16'},
        {"label":"17分","value":'17'},
        {"label":"18分","value":'18'},
        {"label":"19分","value":'19'},
        {"label":"20分","value":'20'},
        {"label":"21分","value":'21'},
        {"label":"22分","value":'22'},
        {"label":"23分","value":'23'},
        {"label":"24分","value":'24'},
        {"label":"25分","value":'25'},
        {"label":"26分","value":'26'},
        {"label":"27分","value":'27'},
        {"label":"28分","value":'28'},
        {"label":"29分","value":'29'},
        {"label":"30分","value":'30'},
        {"label":"31分","value":'31'},
        {"label":"32分","value":'32'},
        {"label":"33分","value":'33'},
        {"label":"34分","value":'34'},
        {"label":"35分","value":'35'},
        {"label":"36分","value":'36'},
        {"label":"37分","value":'37'},
        {"label":"38分","value":'38'},
        {"label":"39分","value":'39'},
        {"label":"40分","value":'40'},
        {"label":"41分","value":'41'},
        {"label":"42分","value":'42'},
        {"label":"43分","value":'43'},
        {"label":"44分","value":'44'},
        {"label":"45分","value":'45'},
        {"label":"46分","value":'46'},
        {"label":"47分","value":'47'},
        {"label":"48分","value":'48'},
        {"label":"49分","value":'49'},
        {"label":"50分","value":'50'},
        {"label":"51分","value":'51'},
        {"label":"52分","value":'52'},
        {"label":"53分","value":'53'},
        {"label":"54分","value":'54'},
        {"label":"55分","value":'55'},
        {"label":"56分","value":'56'},
        {"label":"57分","value":'57'},
        {"label":"58分","value":'58'},
        {"label":"59分","value":'59'}
      ]
    }
    voteEndHour.value = ''
    voteEndMinute.value = ''
  }
  function changeVoteHour() {
    const date = dayjs(voteEndDate.value)
    if(date.$D === new Date().getDate() && voteEndHour.value === new Date().getHours()) {
      voteMinuteOptions.value.splice(0, new Date().getMinutes() + 5)
    } else {
      voteMinuteOptions.value = [
        {"label":"0分","value":'00'},
        {"label":"1分","value":'01'},
        {"label":"2分","value":'02'},
        {"label":"3分","value":'03'},
        {"label":"4分","value":'04'},
        {"label":"5分","value":'05'},
        {"label":"6分","value":'06'},
        {"label":"7分","value":'07'},
        {"label":"8分","value":'08'},
        {"label":"9分","value":'09'},
        {"label":"10分","value":'10'},
        {"label":"11分","value":'11'},
        {"label":"12分","value":'12'},
        {"label":"13分","value":'13'},
        {"label":"14分","value":'14'},
        {"label":"15分","value":'15'},
        {"label":"16分","value":'16'},
        {"label":"17分","value":'17'},
        {"label":"18分","value":'18'},
        {"label":"19分","value":'19'},
        {"label":"20分","value":'20'},
        {"label":"21分","value":'21'},
        {"label":"22分","value":'22'},
        {"label":"23分","value":'23'},
        {"label":"24分","value":'24'},
        {"label":"25分","value":'25'},
        {"label":"26分","value":'26'},
        {"label":"27分","value":'27'},
        {"label":"28分","value":'28'},
        {"label":"29分","value":'29'},
        {"label":"30分","value":'30'},
        {"label":"31分","value":'31'},
        {"label":"32分","value":'32'},
        {"label":"33分","value":'33'},
        {"label":"34分","value":'34'},
        {"label":"35分","value":'35'},
        {"label":"36分","value":'36'},
        {"label":"37分","value":'37'},
        {"label":"38分","value":'38'},
        {"label":"39分","value":'39'},
        {"label":"40分","value":'40'},
        {"label":"41分","value":'41'},
        {"label":"42分","value":'42'},
        {"label":"43分","value":'43'},
        {"label":"44分","value":'44'},
        {"label":"45分","value":'45'},
        {"label":"46分","value":'46'},
        {"label":"47分","value":'47'},
        {"label":"48分","value":'48'},
        {"label":"49分","value":'49'},
        {"label":"50分","value":'50'},
        {"label":"51分","value":'51'},
        {"label":"52分","value":'52'},
        {"label":"53分","value":'53'},
        {"label":"54分","value":'54'},
        {"label":"55分","value":'55'},
        {"label":"56分","value":'56'},
        {"label":"57分","value":'57'},
        {"label":"58分","value":'58'},
        {"label":"59分","value":'59'}
      ]
    }
    voteEndMinute.value = ''
  }
  /* 提交投票表单 */
  const voteId = ref('')
  /* 清空表单 */
  function clearVoteForm() {
    voteTitle.value = ''
    voteDesc.value = ''
    voteType.value = 1
    voteMaxSelectNum.value = 0
    voteEndDate.value = ''
    voteEndHour.value = ''
    voteEndMinute.value = ''
    textOptionList.value = [{value:''},{value:''}]
    pictureOptionList.value = [{value:'',pictureUrl:''},{value:'',pictureUrl:''}]
  }
  const voteInfo = ref({})
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
        if(!textOptionList.value[index].value) return ElMessage.error('请填写完整选项')
      }
      optionList = textOptionList.value
    } else {
      for (let index = 0; index < pictureOptionList.value.length; index++) {
        if(!pictureOptionList.value[index].value || !pictureOptionList.value[index].pictureUrl) return ElMessage.error('请填写完整选项')
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
  }
  function deleteVoteBox() {
    showVoteBox.value = false
    voteId.value = ''
    clearVoteForm()
  }
  //#endregion
  //#region 预约直播
  const showLivesBox = ref(false)
  const showPubBookLivesModal = ref(false)
  const livesEndDate = ref('') // 预约日期
  const livesEndHour = ref('') // 预约小时
  const livesEndMinute = ref('') // 预约分钟
  const livesTitleNum = ref(0)
  const livesHourOptions = ref(hourOptions)
  const livesMinuteOptions = ref(minuteOptions)
  const livesTitle = ref('')
  function handleClickLive() {
    showPubBookLivesModal.value = true
    const defaultTime = dayjs(new Date().getTime() + 86400000)
    livesEndDate.value = defaultTime.format('YYYY-MM-DD')
  }
  function changeLivesTitle(event) {
    livesTitleNum.value = event.target.value.length
  }
  function changeLivesDate() {
    const date = dayjs(livesEndDate.value)
    if(date.$D === new Date().getDate()) {
      livesHourOptions.value.splice(0, new Date().getHours())
      if(livesEndHour.value === new Date().getHours()) {
        livesMinuteOptions.value.splice(0, new Date().getMinutes() + 1)
      }
    } else {
      livesHourOptions.value = [
        {label:'0时',value:'00'},
        {label:'1时',value:'01'},
        {label:'2时',value:'02'},
        {label:'3时',value:'03'},
        {label:'4时',value:'04'},
        {label:'5时',value:'05'},
        {label:'6时',value:'06'},
        {label:'7时',value:'07'},
        {label:'8时',value:'08'},
        {label:'9时',value:'09'},
        {label:'10时',value:'10'},
        {label:'11时',value:'11'},
        {label:'12时',value:'12'},
        {label:'13时',value:'13'},
        {label:'14时',value:'14'},
        {label:'15时',value:'15'},
        {label:'16时',value:'16'},
        {label:'17时',value:'17'},
        {label:'18时',value:'18'},
        {label:'19时',value:'19'},
        {label:'20时',value:'20'},
        {label:'21时',value:'21'},
        {label:'22时',value:'22'},
        {label:'23时',value:'23'},
      ]
      livesMinuteOptions.value = [
        {"label":"0分","value":'00'},
        {"label":"1分","value":'01'},
        {"label":"2分","value":'02'},
        {"label":"3分","value":'03'},
        {"label":"4分","value":'04'},
        {"label":"5分","value":'05'},
        {"label":"6分","value":'06'},
        {"label":"7分","value":'07'},
        {"label":"8分","value":'08'},
        {"label":"9分","value":'09'},
        {"label":"10分","value":'10'},
        {"label":"11分","value":'11'},
        {"label":"12分","value":'12'},
        {"label":"13分","value":'13'},
        {"label":"14分","value":'14'},
        {"label":"15分","value":'15'},
        {"label":"16分","value":'16'},
        {"label":"17分","value":'17'},
        {"label":"18分","value":'18'},
        {"label":"19分","value":'19'},
        {"label":"20分","value":'20'},
        {"label":"21分","value":'21'},
        {"label":"22分","value":'22'},
        {"label":"23分","value":'23'},
        {"label":"24分","value":'24'},
        {"label":"25分","value":'25'},
        {"label":"26分","value":'26'},
        {"label":"27分","value":'27'},
        {"label":"28分","value":'28'},
        {"label":"29分","value":'29'},
        {"label":"30分","value":'30'},
        {"label":"31分","value":'31'},
        {"label":"32分","value":'32'},
        {"label":"33分","value":'33'},
        {"label":"34分","value":'34'},
        {"label":"35分","value":'35'},
        {"label":"36分","value":'36'},
        {"label":"37分","value":'37'},
        {"label":"38分","value":'38'},
        {"label":"39分","value":'39'},
        {"label":"40分","value":'40'},
        {"label":"41分","value":'41'},
        {"label":"42分","value":'42'},
        {"label":"43分","value":'43'},
        {"label":"44分","value":'44'},
        {"label":"45分","value":'45'},
        {"label":"46分","value":'46'},
        {"label":"47分","value":'47'},
        {"label":"48分","value":'48'},
        {"label":"49分","value":'49'},
        {"label":"50分","value":'50'},
        {"label":"51分","value":'51'},
        {"label":"52分","value":'52'},
        {"label":"53分","value":'53'},
        {"label":"54分","value":'54'},
        {"label":"55分","value":'55'},
        {"label":"56分","value":'56'},
        {"label":"57分","value":'57'},
        {"label":"58分","value":'58'},
        {"label":"59分","value":'59'}
      ]
    }
    livesEndHour.value = ''
    livesEndMinute.value = ''
  }
  function changeLivesHour() {
    const date = dayjs(livesEndDate.value)
    if(date.$D === new Date().getDate() && livesEndHour.value === new Date().getHours()) {
      livesMinuteOptions.value.splice(0, new Date().getMinutes() + 5)
    } else {
      livesMinuteOptions.value = [
        {"label":"0分","value":'00'},
        {"label":"1分","value":'01'},
        {"label":"2分","value":'02'},
        {"label":"3分","value":'03'},
        {"label":"4分","value":'04'},
        {"label":"5分","value":'05'},
        {"label":"6分","value":'06'},
        {"label":"7分","value":'07'},
        {"label":"8分","value":'08'},
        {"label":"9分","value":'09'},
        {"label":"10分","value":'10'},
        {"label":"11分","value":'11'},
        {"label":"12分","value":'12'},
        {"label":"13分","value":'13'},
        {"label":"14分","value":'14'},
        {"label":"15分","value":'15'},
        {"label":"16分","value":'16'},
        {"label":"17分","value":'17'},
        {"label":"18分","value":'18'},
        {"label":"19分","value":'19'},
        {"label":"20分","value":'20'},
        {"label":"21分","value":'21'},
        {"label":"22分","value":'22'},
        {"label":"23分","value":'23'},
        {"label":"24分","value":'24'},
        {"label":"25分","value":'25'},
        {"label":"26分","value":'26'},
        {"label":"27分","value":'27'},
        {"label":"28分","value":'28'},
        {"label":"29分","value":'29'},
        {"label":"30分","value":'30'},
        {"label":"31分","value":'31'},
        {"label":"32分","value":'32'},
        {"label":"33分","value":'33'},
        {"label":"34分","value":'34'},
        {"label":"35分","value":'35'},
        {"label":"36分","value":'36'},
        {"label":"37分","value":'37'},
        {"label":"38分","value":'38'},
        {"label":"39分","value":'39'},
        {"label":"40分","value":'40'},
        {"label":"41分","value":'41'},
        {"label":"42分","value":'42'},
        {"label":"43分","value":'43'},
        {"label":"44分","value":'44'},
        {"label":"45分","value":'45'},
        {"label":"46分","value":'46'},
        {"label":"47分","value":'47'},
        {"label":"48分","value":'48'},
        {"label":"49分","value":'49'},
        {"label":"50分","value":'50'},
        {"label":"51分","value":'51'},
        {"label":"52分","value":'52'},
        {"label":"53分","value":'53'},
        {"label":"54分","value":'54'},
        {"label":"55分","value":'55'},
        {"label":"56分","value":'56'},
        {"label":"57分","value":'57'},
        {"label":"58分","value":'58'},
        {"label":"59分","value":'59'}
      ]
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
  }
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
    ElMessage.success('预约成功')
  }
  async function cancelBookLive(bookLiveId) {
    await modBookLiveStateApi({
      bookLiveId,
      state:1
    })
    ElMessage.info('已取消预约')
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
  const PubTimeBox = ref(false)
  const publishDate = ref()
  const publishHour = ref()
  const publishMinute = ref()
  const pubHourOptions = ref(hourOptions)
  const pubMinuteOptions = ref(minuteOptions)
  const earlyPublish = ref(1) // 1:不提前发布 0：提前发布
  /* 禁用某些日期 */
  const disabledPubDate = (time) => {
    if(earlyPublish.value) return time.getTime() < Date.now() - 8.64e7
    else return time.getTime() > Date.now() - 8.64e7
  }
  function handleClickPubTime() {
    PubTimeBox.value = true
    settingCascader1.value = false
    const defaultTime = dayjs(new Date().getTime() + 86400000)
    publishDate.value = defaultTime.format('YYYY-MM-DD')
  }
  function changePubDate() {
    const date = dayjs(publishDate.value)
    if(date.$D === new Date().getDate()) {
      pubHourOptions.value.splice(0, new Date().getHours())
      if(publishHour.value === new Date().getHours()) {
        pubMinuteOptions.value.splice(0, new Date().getMinutes() + 1)
      }
    } else {
      pubHourOptions.value = [
        {label:'0时',value:'00'},
        {label:'1时',value:'01'},
        {label:'2时',value:'02'},
        {label:'3时',value:'03'},
        {label:'4时',value:'04'},
        {label:'5时',value:'05'},
        {label:'6时',value:'06'},
        {label:'7时',value:'07'},
        {label:'8时',value:'08'},
        {label:'9时',value:'09'},
        {label:'10时',value:'10'},
        {label:'11时',value:'11'},
        {label:'12时',value:'12'},
        {label:'13时',value:'13'},
        {label:'14时',value:'14'},
        {label:'15时',value:'15'},
        {label:'16时',value:'16'},
        {label:'17时',value:'17'},
        {label:'18时',value:'18'},
        {label:'19时',value:'19'},
        {label:'20时',value:'20'},
        {label:'21时',value:'21'},
        {label:'22时',value:'22'},
        {label:'23时',value:'23'},
      ]
      pubMinuteOptions.value = [
        {"label":"0分","value":'00'},
        {"label":"1分","value":'01'},
        {"label":"2分","value":'02'},
        {"label":"3分","value":'03'},
        {"label":"4分","value":'04'},
        {"label":"5分","value":'05'},
        {"label":"6分","value":'06'},
        {"label":"7分","value":'07'},
        {"label":"8分","value":'08'},
        {"label":"9分","value":'09'},
        {"label":"10分","value":'10'},
        {"label":"11分","value":'11'},
        {"label":"12分","value":'12'},
        {"label":"13分","value":'13'},
        {"label":"14分","value":'14'},
        {"label":"15分","value":'15'},
        {"label":"16分","value":'16'},
        {"label":"17分","value":'17'},
        {"label":"18分","value":'18'},
        {"label":"19分","value":'19'},
        {"label":"20分","value":'20'},
        {"label":"21分","value":'21'},
        {"label":"22分","value":'22'},
        {"label":"23分","value":'23'},
        {"label":"24分","value":'24'},
        {"label":"25分","value":'25'},
        {"label":"26分","value":'26'},
        {"label":"27分","value":'27'},
        {"label":"28分","value":'28'},
        {"label":"29分","value":'29'},
        {"label":"30分","value":'30'},
        {"label":"31分","value":'31'},
        {"label":"32分","value":'32'},
        {"label":"33分","value":'33'},
        {"label":"34分","value":'34'},
        {"label":"35分","value":'35'},
        {"label":"36分","value":'36'},
        {"label":"37分","value":'37'},
        {"label":"38分","value":'38'},
        {"label":"39分","value":'39'},
        {"label":"40分","value":'40'},
        {"label":"41分","value":'41'},
        {"label":"42分","value":'42'},
        {"label":"43分","value":'43'},
        {"label":"44分","value":'44'},
        {"label":"45分","value":'45'},
        {"label":"46分","value":'46'},
        {"label":"47分","value":'47'},
        {"label":"48分","value":'48'},
        {"label":"49分","value":'49'},
        {"label":"50分","value":'50'},
        {"label":"51分","value":'51'},
        {"label":"52分","value":'52'},
        {"label":"53分","value":'53'},
        {"label":"54分","value":'54'},
        {"label":"55分","value":'55'},
        {"label":"56分","value":'56'},
        {"label":"57分","value":'57'},
        {"label":"58分","value":'58'},
        {"label":"59分","value":'59'}
      ]
    }
    publishHour.value = ''
    publishMinute.value = ''
  }
  function changePubHour() {
    const date = dayjs(publishDate.value)
    if(date.$D === new Date().getDate() && publishHour.value === new Date().getHours()) {
      pubMinuteOptions.value.splice(0, new Date().getMinutes() + 5)
    } else {
      pubMinuteOptions.value = [
        {"label":"0分","value":'00'},
        {"label":"1分","value":'01'},
        {"label":"2分","value":'02'},
        {"label":"3分","value":'03'},
        {"label":"4分","value":'04'},
        {"label":"5分","value":'05'},
        {"label":"6分","value":'06'},
        {"label":"7分","value":'07'},
        {"label":"8分","value":'08'},
        {"label":"9分","value":'09'},
        {"label":"10分","value":'10'},
        {"label":"11分","value":'11'},
        {"label":"12分","value":'12'},
        {"label":"13分","value":'13'},
        {"label":"14分","value":'14'},
        {"label":"15分","value":'15'},
        {"label":"16分","value":'16'},
        {"label":"17分","value":'17'},
        {"label":"18分","value":'18'},
        {"label":"19分","value":'19'},
        {"label":"20分","value":'20'},
        {"label":"21分","value":'21'},
        {"label":"22分","value":'22'},
        {"label":"23分","value":'23'},
        {"label":"24分","value":'24'},
        {"label":"25分","value":'25'},
        {"label":"26分","value":'26'},
        {"label":"27分","value":'27'},
        {"label":"28分","value":'28'},
        {"label":"29分","value":'29'},
        {"label":"30分","value":'30'},
        {"label":"31分","value":'31'},
        {"label":"32分","value":'32'},
        {"label":"33分","value":'33'},
        {"label":"34分","value":'34'},
        {"label":"35分","value":'35'},
        {"label":"36分","value":'36'},
        {"label":"37分","value":'37'},
        {"label":"38分","value":'38'},
        {"label":"39分","value":'39'},
        {"label":"40分","value":'40'},
        {"label":"41分","value":'41'},
        {"label":"42分","value":'42'},
        {"label":"43分","value":'43'},
        {"label":"44分","value":'44'},
        {"label":"45分","value":'45'},
        {"label":"46分","value":'46'},
        {"label":"47分","value":'47'},
        {"label":"48分","value":'48'},
        {"label":"49分","value":'49'},
        {"label":"50分","value":'50'},
        {"label":"51分","value":'51'},
        {"label":"52分","value":'52'},
        {"label":"53分","value":'53'},
        {"label":"54分","value":'54'},
        {"label":"55分","value":'55'},
        {"label":"56分","value":'56'},
        {"label":"57分","value":'57'},
        {"label":"58分","value":'58'},
        {"label":"59分","value":'59'}
      ]
    }
    publishMinute.value = ''
  }
  function deletePubTime() {
    publishDate.value = ''
    publishHour.value = ''
    publishMinute.value = ''
    PubTimeBox.value = false
  }
  function handleClickEarlyPub() {
    earlyPublish.value = Math.abs(earlyPublish.value-1)
    publishDate.value = ''
    publishHour.value = ''
    publishMinute.value = ''
  }
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
  //#region 动态
  const showVoteModal = ref(false)
  function closeVoteModal() {
    showVoteModal.value = false
  }
  const voteDetailInfo = ref({})
  async function handleShowVoteModal(id) {
    voteDetailInfo.value = await getVoteDetailApi({
      voteId:id
    })
    // voteDetailInfo.value = {
    //     "title": "非住矿八",
    //     "voteNumInfo": "37",
    //     "voteType": 1,
    //     "optionList": [
    //         {
    //             "optionId": 56,
    //             "optionContent": "Duis ea aliqua",
    //             "optionPhotoUrl": "http://dummyimage.com/400x400",
    //             "optionPercent": "officia ullamco minim dolore",
    //             "selected": 1
    //         },
    //         {
    //             "optionId": 29,
    //             "optionContent": "ullamco",
    //             "optionPhotoUrl": "http://dummyimage.com/400x400",
    //             "optionPercent": "nisi deserunt",
    //             "selected": 0
    //         },
    //         {
    //             "optionId": 38,
    //             "optionContent": "fugiat officia dolore ut irure",
    //             "optionPhotoUrl": "http://dummyimage.com/400x400",
    //             "optionPercent": "labore mollit deserunt amet",
    //             "selected": 1
    //         }
    //     ],
    //     "voteLim": 74,
    //     "voted": 1,
    //     "dead": 1,
    //     "voterInfoList": [
    //         {
    //             "username": "丁敏",
    //             "avatarUrl": "http://dummyimage.com/100x100",
    //             "optionsInfo": "tempor ut"
    //         },
    //         {
    //             "username": "武刚",
    //             "avatarUrl": "http://dummyimage.com/100x100",
    //             "optionsInfo": "sint nisi est"
    //         },
    //         {
    //             "username": "顾强",
    //             "avatarUrl": "http://dummyimage.com/100x100",
    //             "optionsInfo": "Lorem consectetur quis exercitation deserunt"
    //         }
    //     ]
    // }
    showVoteModal.value = true
  }
  function showForwardInput(index, showForward) {
    !showForward ? newsList.value[index].showForward = true : newsList.value[index].showForward = false
  }
  const showEmojiBoxForward = ref(false)
  function insertEmojiForward(emojiUrl) {
    richTextInputForward.value.insertEmoji(emojiUrl)
  }
  //#endregion
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
    <!-- <div class="bgc"></div> -->
    <div class="bg"></div>
    <div class="container" :class="{'container-small':smallSize}">
      <div class="user-box">
        <img @click="router.push('/mainInterface')" :src="userInfo.avatarUrl" alt="头像">
        <span @click="router.push('/mainInterface')" class="username">{{ userInfo.username }}</span>
        <div class="infos">
          <div @click="router.push('/mainInterface')" class="info-box">
            <p class="num">{{ userInfo.followerNumInfo }}</p>
            <p class="desc">关注</p>
          </div>
          <div @click="router.push('/mainInterface')" class="info-box">
            <p class="num">{{ userInfo.fanNumInfo }}</p>
            <p class="desc">粉丝</p>
          </div>
          <div @click="router.push('/mainInterface')" class="info-box">
            <p class="num">{{ userInfo.happeningNumInfo }}</p>
            <p class="desc">动态</p>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="publish-box">
          <bs-tag-select :tagList="tagList" @getTagList="getTagList" @getSelectTagId="changePubTagId"></bs-tag-select>
          <div class="publish-input">
            <input name="newsTitle" v-model="newsTitle" @input="changePubTitle" maxlength="20" type="text" class="title" placeholder="标题 (选填，20字内)" autocomplete="off">
            <i v-if="pubTitleNum" @click="clearPubTitle" class="iconfont icon-cuowu1"></i>
            <span v-if="pubTitleNum" class="title-num">{{ pubTitleNum }}</span>
            <bs-rich-text-input ref="richTextInputPub" placeholder="有什么想和大家分享的？"></bs-rich-text-input>
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
              <input @change="uploadPicture" accept="image/*" maxSize id="upload-pic" type="file">
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
          <div v-if="PubTimeBox" class="pubTime-box">
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
            <span class="only-title"><i class="iconfont icon-suo"></i>仅粉丝可见</span>
            <span class="only-desc">开启后，将不支持分享、商业推广</span>
          </div>
          <div v-if="newsSeePermission === 2" class="only-box">
            <span class="only-title"><i class="iconfont icon-suo"></i>仅自己可见</span>
            <span class="only-desc">开启后，将不支持分享、商业推广</span>
          </div>
          <div class="publish-controls">
            <div class="publish-controls-tool">
              <div class="emoji-btn" ref="emojiBtnDom" tabindex="1" @blur="handleEmojiBoxBlur">
                <i @click="clickEmojiBtn" :class="{'active':showEmojiBoxPub}" class="iconfont icon-biaoqing"></i>
                <div v-if="showEmojiBoxPub" class="emoji-box">
                  <bs-emoji @insertEmoji="insertEmojiPub" :emojiUrlList="emojiUrlList"></bs-emoji>
                </div>
              </div>
              <div>
                <i @click="showUploadBox = !showUploadBox" :class="{'active':showUploadBox}" class="iconfont icon-tupian"></i>
              </div>
              <div>
                <i @click="handleClickAt" class="iconfont icon-aite"></i>
              </div>
              <div>
                <i @click="handleClickVote" :class="{'active':showVoteBox}" class="iconfont icon-toupiao"></i>
              </div>
              <div>
                <i @click="handleClickLive" :class="{'active':showLivesBox}" class="iconfont icon-zhibo"></i>
              </div>
            </div>
            <div class="publish-controls-headquarters">
              <span class="content-num">{{ richTextInputPub ? richTextInputPub.contentNum : 0 }} / 300</span>
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
                    <div @click="newsSeePermission = 2,blurSettingCascader()" :class="{'is-active':newsSeePermission === 2}" class="cascader-options-item">
                      <i class="iconfont icon-suo"></i>
                      <div class="item-label">仅粉丝可见</div>
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
        <div class="news-list">
          <div v-for="(item,index) in newsList" :key="index" class="news-item">
            <div class="news-item-avatar">
              <img :src="item.avatarUrl" alt="头像">
            </div>
            <div class="news-item-header">
              <span class="news-item-author">{{ item.username }}</span>
              <span v-if="!item.advanceRelease" class="news-item-early-pub">提前发布</span>
              <p class="news-item-time">{{ item.pubTimeInfo }}</p>
              <div @mouseenter="newsList[index].isOpen = true" @mouseleave="newsList[index].isOpen = false" class="news-item-more-btn">
                <i class="iconfont icon-gengduo1"></i>
                <div v-if="newsList[index].isOpen" class="new-item-cascader">
                  <div v-if="username !== item.username" class="cascader-list">
                    <div class="cascader-item">取消关注</div>
                    <div class="cascader-item">举报</div>
                  </div>
                  <div v-else class="cascader-list">
                    <div class="cascader-item">删除</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="news-item-body">
              <div v-if="item.tag" class="news-tag">
                <i class="iconfont icon-huati"></i>
                <span>{{ item.tag }}</span>
              </div>
              <div class="news-title">{{ item.title }}</div>
              <div class="news-text-content" v-html="item.content"></div>
              <div v-if="item.imgUrlList" class="news-album">
                <div class="news-album-preview grid">
                  <div v-for="(item, index) in item.imgUrlList" :key="index" class="news-album-preview-picture">
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
              <div v-if="false" class="news-book-lives">
                <div class="lives-detail">
                  <p class="lives-title">直播预约：{{ item.bookLiveInfo.title }}</p>
                  <p class="lives-stat">
                    <span class="lives-time">{{ item.bookLiveInfo.liveTimeInfo }} 直播</span>
                    <span class="book-num">{{ item.bookLiveInfo.bookInfo }}人预约</span>
                  </p>
                </div>
                <div class="lives-btn-box">
                  <div v-if="true" class="revoke-btn-box">
                    <button v-if="true" @click="revokeBookLive(item.bookLiveInfo.bookLiveId)" class="book-lives-btn revoke-btn">撤销</button>
                    <button v-else @click="cancelRevokeBookLive" class="book-lives-btn revoked-btn">已撤销</button>
                  </div>
                  <div v-else class="book-btn-box">
                    <button  v-if="false" @click="bookLive(item.bookLiveInfo.bookLiveId)" class="book-lives-btn book-btn">
                      <span><i class="iconfont icon-icon-tixing"></i>预约</span>
                    </button>
                    <button v-else @click="cancelBookLive(item.bookLiveInfo.bookLiveId)" class="book-lives-btn booked-btn">已预约</button>
                  </div>
                </div>
              </div>
              <div class="news-vote">
                <div @click="handleShowVoteModal(item.voteSimpleInfo.voteId)" class="news-vote-card">
                  <div class="vote-icon-box"><i class="iconfont icon-toupiao"></i></div>
                  <div class="vote-detail">
                    <p class="vote-title">{{ item.voteSimpleInfo.title }}</p>
                    <p class="vote-stat">{{ item.voteSimpleInfo.voteNumInfo }}人参与</p>
                  </div>
                  <div class="vote-btn-box">
                    <button class="vote-btn">{{ username === item.username ? '查看' : '参与'}}</button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="true" class="news-item-body" :class="{'news-reference':true}">
              <div class="refer-author-box">
                <div class="author-info">
                  <img :src="item.quotedHappening.avatarUrl" alt="头像">
                  <span class="author-username">{{ item.quotedHappening.username }}</span>
                  <span class="refer-text">投稿了文章</span>
                </div>
              </div>
              <div class="news-tag">
                <i class="iconfont icon-huati"></i>
                <span>{{ item.quotedHappening.tag }}</span>
              </div>
              <div class="news-title">{{ item.quotedHappening.title }}</div>
              <div class="news-text-content">{{ item.quotedHappening.content }}</div>
              <div class="news-album">
                <div class="news-album-preview grid">
                  <div v-for="(item,index) in item.quotedHappening.imgUrlList" :key="index" class="news-album-preview-picture">
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
              <div v-if="false" class="news-book-lives">
                <div class="lives-detail">
                  <p class="lives-title">直播预约：{{item.quotedHappening.bookLiveInfo.title}}</p>
                  <p class="lives-stat">
                    <span class="lives-time">{{ item.quotedHappening.bookLiveInfo.liveTimeInfo }} 直播</span>
                    <span class="book-num">{{item.quotedHappening.bookLiveInfo.bookNumInfo}}人预约</span>
                  </p>
                </div>
                <div class="lives-btn-box">
                  <div v-if="username === item.quotedHappening.bookLiveInfo.anchorName" class="revoke-btn-box">
                    <button v-if="true" @click="revokeBookLive" class="book-lives-btn revoke-btn">撤销</button>
                    <button v-else @click="cancelRevokeBookLive" class="book-lives-btn revoked-btn">已撤销</button>
                  </div>
                  <div v-else class="book-btn-box">
                    <button v-if="item.quotedHappening.bookLiveInfo.booked" @click="bookLive" class="book-lives-btn book-btn">
                      <span><i class="iconfont icon-icon-tixing"></i>预约</span>
                    </button>
                    <button v-else @click="cancelBookLive" class="book-lives-btn booked-btn">已预约</button>
                  </div>
                </div>
              </div>
              <div class="news-vote">
                <div @click="handleShowVoteModal(item.quotedHappening.voteSimpleInfo.voteId)" class="news-vote-card">
                  <div class="vote-icon-box"><i class="iconfont icon-toupiao"></i></div>
                  <div class="vote-detail">
                    <p class="vote-title">{{item.quotedHappening.voteSimpleInfo.title}}</p>
                    <p class="vote-stat">{{item.quotedHappening.voteSimpleInfo.voteNumInfo}}人参与</p>
                  </div>
                  <div class="vote-btn-box">
                    <button class="vote-btn">查看</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="news-item-footer">
              <div @click="showForwardInput(index,item.showForward)" class="footer-item news-zhuanfa">
                <i class="iconfont icon-zhuanfa"></i>
                {{ !item.likeInfo ? '转发' : item.likeInfo}}
              </div>
              <div class="footer-item item-comment">
                <i class="iconfont icon-pinglun"></i>
                {{ !item.commentInfo ? '评论' : item.commentInfo }}
              </div>
              <div class="footer-item news-like">
                <i class="iconfont icon-dianzan"></i>
                {{ !item.likeInfo ? '点赞' : item.likeInfo}}
              </div>
            </div>
            <div v-if="item.showForward" class="item-forward-box">
              <div class="forward-body">
                <div class="avatar-box">
                  <img src="/imgs/default-avatar.png" alt="头像">
                </div>
                <div class="forward-input-box">
                  <bs-tag-select :tagList="tagList" @getSelectTagId="changeForwardTagId" @getTagList="getTagList"></bs-tag-select>
                  <bs-rich-text-input ref="richTextInputForward" placeholder="有什么想说的呢"></bs-rich-text-input>
                </div>
              </div>
              <div class="forward-footer">
                <div class="emoji-btn" tabindex="1" @blur="handleEmojiBoxBlur">
                  <i @click="showEmojiBoxForward = !showEmojiBoxForward" :class="{'active':showEmojiBoxForward}" class="iconfont icon-biaoqing"></i>
                  <div v-if="showEmojiBoxForward" class="emoji-box">
                    <bs-emoji @insertEmoji="insertEmojiForward" :emojiUrlList="emojiUrlList"></bs-emoji>
                  </div>
                </div>
                <div class="wrapper">
                  <span class="stat">{{ richTextInputForward ? 300-richTextInputForward[0].contentNum : 300}}</span>
                  <button class="forward-btn">转发</button>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="news-item">
            <div class="news-item-avatar">
              <img src="/imgs/default-avatar.png" alt="头像">
            </div>
            <div class="news-item-header">
              <span class="news-item-author">尚硅谷</span>
              <span v-if="earlyPublish === 0" class="news-item-early-pub">提前发布</span>
              <p class="news-item-time">14小时前</p>
              <div class="news-item-more-btn">
                <i class="iconfont icon-gengduo1"></i>
                <div v-if="showNewsCascader" class="new-item-cascader">
                  <div v-if="true" class="cascader-list">
                    <div class="cascader-item">取消关注</div>
                    <div class="cascader-item">举报</div>
                  </div>
                  <div v-else class="cascader-list">
                    <div class="cascader-item">删除</div>
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
                  <div class="news-album-preview-picture">
                    <img src="/imgs/logo.png" alt="">
                  </div>
                  <div class="news-album-preview-picture">
                    <img src="/imgs/logo.png" alt="">
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
              <div v-if="false" class="news-book-lives">
                <div class="lives-detail">
                  <p class="lives-title">直播预约：hahaha</p>
                  <p class="lives-stat">
                    <span class="lives-time">20:00 直播</span>
                    <span class="book-num">1人预约</span>
                  </p>
                </div>
                <div class="lives-btn-box">
                  <div v-if="true" class="revoke-btn-box">
                    <button v-if="true" @click="revokeBookLive" class="book-lives-btn revoke-btn">撤销</button>
                    <button v-else @click="cancelRevokeBookLive" class="book-lives-btn revoked-btn">已撤销</button>
                  </div>
                  <div v-else class="book-btn-box">
                    <button  v-if="false" @click="bookLive" class="book-lives-btn book-btn">
                      <span><i class="iconfont icon-icon-tixing"></i>预约</span>
                    </button>
                    <button v-else @click="cancelBookLive" class="book-lives-btn booked-btn">已预约</button>
                  </div>
                </div>
              </div>
              <div class="news-vote">
                <div @click="handleShowVoteModal(1)" class="news-vote-card">
                  <div class="vote-icon-box"><i class="iconfont icon-toupiao"></i></div>
                  <div class="vote-detail">
                    <p class="vote-title">哈哈哈</p>
                    <p class="vote-stat">1人参与</p>
                  </div>
                  <div class="vote-btn-box">
                    <button class="vote-btn">参与</button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="true" class="news-item-body" :class="{'news-reference':true}">
              <div class="refer-author-box">
                <div class="author-info">
                  <img src="/imgs/default-avatar.png" alt="头像">
                  <span class="author-username">currrryyyyyyyy</span>
                  <span class="refer-text">投稿了文章</span>
                </div>
              </div>
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
                  <div class="news-album-preview-picture">
                    <img src="/imgs/logo.png" alt="">
                  </div>
                  <div class="news-album-preview-picture">
                    <img src="/imgs/logo.png" alt="">
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
              <div v-if="false" class="news-book-lives">
                <div class="lives-detail">
                  <p class="lives-title">直播预约：hahaha</p>
                  <p class="lives-stat">
                    <span class="lives-time">20:00 直播</span>
                    <span class="book-num">1人预约</span>
                  </p>
                </div>
                <div class="lives-btn-box">
                  <div v-if="true" class="revoke-btn-box">
                    <button v-if="true" @click="revokeBookLive" class="book-lives-btn revoke-btn">撤销</button>
                    <button v-else @click="cancelRevokeBookLive" class="book-lives-btn revoked-btn">已撤销</button>
                  </div>
                  <div v-else class="book-btn-box">
                    <button  v-if="false" @click="bookLive" class="book-lives-btn book-btn">
                      <span><i class="iconfont icon-icon-tixing"></i>预约</span>
                    </button>
                    <button v-else @click="cancelBookLive" class="book-lives-btn booked-btn">已预约</button>
                  </div>
                </div>
              </div>
              <div class="news-vote">
                <div @click="handleShowVoteModal(1)" class="news-vote-card">
                  <div class="vote-icon-box"><i class="iconfont icon-toupiao"></i></div>
                  <div class="vote-detail">
                    <p class="vote-title">哈哈哈</p>
                    <p class="vote-stat">1人参与</p>
                  </div>
                  <div class="vote-btn-box">
                    <button class="vote-btn">参与</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="news-item-footer">
              <div class="footer-item news-like">
                <i class="iconfont icon-zhuanfa"></i>
                转发
              </div>
              <div class="footer-item news-like">
                <i class="iconfont icon-dianzan"></i>
                点赞
              </div>
              <div class="footer-item item-comment">
                <i class="iconfont icon-pinglun"></i>
                评论
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <div class="slide">
        <div class="slide-banner">
          <img :src="sideBarUrl" alt="">
        </div>
        <div class="slide-tags">
          <h2>标签</h2>
          <ul class="tag-list">
            <li class="tag-item" v-for="(item,index) in recentTagList" :key="index">
              <i class="iconfont icon-huati"></i>
              <div class="tag-item-title">{{ item.content }}</div>
              <span class="tag-item-stat">{{ item.viewNumInfo }}浏览&middot;{{ item.discussNumInfo }}讨论</span>
            </li>
          </ul>
        </div>
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
            <input v-model="voteTitle" @input="changeVoteTitle" type="text" placeholder="请填写标题" maxlength="32"/>
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
            <textarea v-model="voteDesc" @input="changeDesc" type="text" placeholder="请填写投票说明(选填)" maxlength="100"></textarea>
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
                  <i @click="deleteOption(index)" class="iconfont icon-shanchu"></i>
                </div>
              </div>
            </div>
            <div @click="addOption" class="add-option">
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
                    <img v-if="item.pictureUrl" :src="item.pictureUrl" alt="">
                    <i v-else class="iconfont icon-jiahao"></i>
                  </div>
                </label>
                <textarea v-model="item.value" maxlength="20" class="desc" :placeholder="`请填写选项${index+1}内容，不超过20个字`"></textarea>
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
          <input v-model="livesTitle" @input="changeLivesTitle" maxlength="14" type="text" placeholder="请填写预约标题">
          <span class="stat">{{ livesTitleNum }}/14</span>
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
  <bs-vote-modal
    v-if="showVoteModal"
    @closeVoteModal="closeVoteModal"
    :voteDetailInfo="voteDetailInfo"
  >
  </bs-vote-modal>
</template>

<style lang="scss">
  @use '../assets/sass/config.scss' as *;
  @use '../assets/sass/mixin.scss' as *;
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
  .news {
    background-size: cover;
    // .bgc {
    //   position: fixed;
    //   width: $max-width;
    //   height: 100vh;
    //   background: linear-gradient(225deg, #00bdcd, #00bacf);
    // }
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
      padding-top: 74px;
      .user-box {
        position: sticky;
        top: 74px;
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
          .publish-input {
            position: relative;
            .title {
              margin-top: 10px;
              width: 90%;
              border: none;
              font-size: $fontJ;
              font-weight: bold;
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
              .news-item-early-pub {
                display: inline-block;
                padding: 2px 4px;
                border-radius: 6px;
                margin-left: 10px;
                color: $colorG;
                background-color: #6b09ac;
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
              &.news-reference {
                padding: 20px;
                border-radius: 6px;
                margin-top: 10px;
                background-color: $colorR;
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
                  width: 93.5%;
                  padding: 10px;
                  border: 1px solid $colorF;
                  border-radius: 6px;
                  box-sizing: border-box;
                  margin-left: 8px;
                  &:hover {
                    border: 1px solid $colorM;
                  }
                  .bs-rich-text-input {
                    margin-top: 5px
                  }
                }
              }
              .forward-footer {
                @include flex();
                padding-left: 40px;
                margin-top: 12px;
                box-sizing: border-box;
                .emoji-btn {
                  cursor: pointer;
                  &:hover {
                    color: $colorM;
                  }
                  .icon-biaoqing {
                    font-weight: bold;
                    font-size: $fontH;
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
          position: sticky;
          top: 76px;
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