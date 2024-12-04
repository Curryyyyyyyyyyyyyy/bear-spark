<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import NavHeader from '@/components/NavHeader.vue'
  import NewsUserBox from './NewsUserBox.vue';
  import NewsPublishBox from './NewsPublishBox.vue';
  import NewsAsideBox from './NewsAsideBox.vue';
  import BsEmoji from '@/components/BsEmoji.vue';
  import BsVoteModal from '@/components/BsVoteModal.vue';
  import BsTagSelect from '@/components/BsTagSelect.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import {insertEmoji,handleContentBoxClick,handleContentNum,changePubContent} from '@/hooks/richTextInput'
  import {useRouter} from 'vue-router'
  import { storeToRefs } from 'pinia';
  import useUser from '@/store/user';
  import {getNewsPrepareApi,getNewsListApi,getVoteDetailApi,fowardNewsApi} from '@/api/news.js'
  import {revokeBookLiveApi,modBookLiveStateApi} from '@/api/bookLive.js'

  /* Store */
  const userStore = useUser()
  const {username} = storeToRefs(userStore)
  /* Router */
  const router = useRouter()
  //#region Mounted
  const recentTagList = ref([])
  const followerList = ref([])
  const emojiUrlList = ref([])
  const newsList = ref('')
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
  // newsList.value = [
  //   {
  //       "id":1,
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
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  //   {
  //       "id":2,
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
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  //   {
  //       "id":2,
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
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  //   {
  //       "id":2,
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
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  //   {
  //       "id":2,
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
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  //   {
  //       "id":2,
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
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  //   {
  //       "id":2,
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
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  //   {
  //       "id":2,
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
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  //   {
  //       "id":2,
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
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  //   {
  //       "id":2,
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
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  //   {
  //       "id":2,
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
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  //   {
  //       "id":2,
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
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "imgUrlList": [
  //           "http://dummyimage.com/400x400"
  //       ],
  //       "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  // ]
  // emojiUrlList.value = [
  //   '/imgs/default-avatar.png',
  //   '/imgs/default-avatar.png',
  //   '/imgs/default-avatar.png',
  //   '/imgs/default-avatar.png',
  //   '/imgs/default-avatar.png',
  // ]
  // sideBarUrl.value = '/imgs/slide-bar.jpg'
  // backgroundUrl.value = '/imgs/news-background.png'
  onMounted(async () => {
    /* 获取关注的列表、表情包列表、热门标签列表 */
    const res = await getNewsPrepareApi()
    recentTagList.value = res.recentTagList
    followerList.value = res.followerList
    emojiUrlList.value = res.emojiUrlList
    backgroundUrl.value = res.backgroundUrl
    sideBarUrl.value = res.sideBarUrl
    /* 分页获取动态 */
    const newsRes = await getNewsListApi({
      pageNum:pageNum.value,
      pageSize:pageSize.value
    })
    newsList.value = newsRes.records
  })
  //#endregion
  
  // #region 标签
  /* forwardTagId */
  const forwardTagIdList = ref([])
  function changeForwardTagId(index,id) {
    forwardTagIdList.value[index] = id
  }
  //#endregion
  //#region 表情包
  // /* 表情包列表失焦 */
  function handleEmojiBoxBlur(index) {
    newsList.value[index].showEmojiBox = false
  }
  //#endregion
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
      newsList.value[index].bookLiveInfo.canceled = 1
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
    newsList.value[index].bookLiveInfo.booked = 0
    ElMessage.success('预约成功')
  }
  async function cancelBookLive(bookLiveId,index) {
    await modBookLiveStateApi({
      bookLiveId,
      booked:1
    })
    newsList.value[index].bookLiveInfo.booked = 1
    ElMessage.info('已取消预约')
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
  const voteId = ref(null)
  async function handleShowVoteModal(id) {
    voteId.value = id
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
    curRangeIndex.value = index
  }
  function showEmojiBoxForward(index,showEmojiBox){
    !showEmojiBox ? newsList.value[index].showEmojiBox = true : newsList.value[index].showEmojiBox = false
  }
  /* 滚动加载 */
  const busy = ref(false)
  const newsLoading = ref(false)
  const pageNum = ref(1)
  const pageSize = ref(10)
  function loadMoreNews() {
    newsLoading.value = true
    busy.value = true;
    setTimeout(async () => {
      const newsRes = await getNewsListApi({
        pageNum:++pageNum.value,
        pageSize:pageSize.value
      })
      newsList.value = newsList.value.concat(newsRes.records)
      busy.value = false;
      newsLoading.value = false
    }, 1000);
  }
  //#endregion
  //#region 动态转发输入框
  const mineRefList = reactive([])
  const contentNumList = reactive(new Array(4).fill(0))
  const showAtSelect = reactive(new Array(4).fill(false))
  let curRangeIndex = ref('')
  function getMineRef(el, index) {
    if(el) {
      mineRefList[index] = el
    }
  }

  let rangeOfContentBoxList = reactive([])
  let focusNode = reactive({}); // 存储光标聚焦节点
  let focusOffset = ref(0); // 存储光标聚焦偏移量
  let chatInputOffset = reactive({}); // 存储光标聚焦的元素
  const atSelectPosition = reactive({
    left:"0px",
    top:"0px",
  })

  /* 处理光标 */
  const publishBox = ref()
  document.onselectionchange = () => {
    let selection = document.getSelection()
    if(selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      mineRefList.forEach((item,index) => {
        if(item.contains(range.commonAncestorContainer)) {
          rangeOfContentBoxList[index] = range
          curRangeIndex.value = index
        }
      })
      /* 处理publish输入框光标 */
      if(publishBox.value.richTextInputPub.contentDom.contains(range.commonAncestorContainer)) {
        publishBox.value.richTextInputPub.rangeOfContentBox = range
      }
    }
  }
  /* 处理输入框失焦 */
  function handleContentBlur(index) {
    setTimeout(() => {
      showAtSelect[index] = false
    }, 200);
    if (window.getSelection) {
      let sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        focusNode = sel.focusNode;
        focusOffset.value = sel.focusOffset;
        chatInputOffset = sel.getRangeAt(0);
      }
    }
  }
  /* @ */
  function selectAtUser(username) {
    let index = curRangeIndex.value
    if(handleContentNum(mineRefList[index]) + username.length + 1 > 300) return ElMessage.error('字数已达上限')
    showAtSelect[index] = false
    chatInputOffset.setStart(focusNode,focusOffset.value-1)
    chatInputOffset.setEnd(focusNode,focusOffset.value)
    chatInputOffset.deleteContents()
    const atElement = `<span class="username" contenteditable="false">@${username}</span>`
    chatInputOffset.collapse(false)
    const atNode = chatInputOffset.createContextualFragment(atElement)
    let lastChild = atNode.lastChild
    chatInputOffset.insertNode(atNode)
    chatInputOffset.setEndAfter(lastChild)
    chatInputOffset.setStartAfter(lastChild)
    const selection = document.getSelection()
    selection.removeAllRanges()
    selection.addRange(chatInputOffset)
    contentNumList[index] = handleContentNum(mineRefList[index])
  }
  /* 输入表情包 */
  function insertEmojiForward(emojiUrl) {
    insertEmoji(emojiUrl,curRangeIndex.value,contentNumList,rangeOfContentBoxList,mineRefList)
  }

  /* 转发动态 */
  async function forwardNews(index) {
    let content = mineRefList[index].innerHTML ? mineRefList[index].innerHTML : '转发动态'
    let tagId = forwardTagIdList.value[index]
    let quotedHappeningId = newsList.value[index].quotedHappening ? newsList.value[index].quotedHappening.id : newsList.value[index].id
    await fowardNewsApi({
      quotedHappeningId,
      content,
      tagId
    })
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
    <div class="bg"></div>
    <div class="container" :class="{'container-small':smallSize}">
      <news-user-box></news-user-box>
      <div class="body">
        <news-publish-box ref="publishBox" :emojiUrlList="emojiUrlList"></news-publish-box>
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
              <div v-if="item.bookLiveInfo" class="news-book-lives">
                <div class="lives-detail">
                  <p class="lives-title">直播预约：{{ item.bookLiveInfo.title }}</p>
                  <p class="lives-stat">
                    <span class="lives-time">{{ item.bookLiveInfo.liveTimeInfo }} 直播</span>
                    <span class="book-num">{{ item.bookLiveInfo.bookNumInfo }}人预约</span>
                  </p>
                </div>
                <div class="lives-btn-box">
                  <div v-if="username === item.username" class="revoke-btn-box">
                    <button v-if="!item.bookLiveInfo.canceled" @click="revokeBookLive(item.bookLiveInfo.bookLiveId,index)" class="book-lives-btn revoke-btn">撤销</button>
                    <button v-else @click="cancelRevokeBookLive" class="book-lives-btn revoked-btn">已撤销</button>
                  </div>
                  <div v-else class="book-btn-box">
                    <button  v-if="item.bookLiveInfo.booked" @click="bookLive(item.bookLiveInfo.bookLiveId,index)" class="book-lives-btn book-btn">
                      <span><i class="iconfont icon-icon-tixing"></i>预约</span>
                    </button>
                    <button v-else @click="cancelBookLive(item.bookLiveInfo.bookLiveId,index)" class="book-lives-btn booked-btn">已预约</button>
                  </div>
                </div>
              </div>
              <div v-if="item.voteSimpleInfo" class="news-vote">
                <div @click="handleShowVoteModal(item.voteSimpleInfo.voteId)" class="news-vote-card">
                  <div class="vote-icon-box"><i class="iconfont icon-toupiao"></i></div>
                  <div class="vote-detail">
                    <p class="vote-title">{{ item.voteSimpleInfo.title }}</p>
                    <p class="vote-stat">{{ item.voteSimpleInfo.voteNumInfo }}人参与&nbsp;&nbsp;{{ item.voteSimpleInfo.deadlineInfo }}</p>
                  </div>
                  <div class="vote-btn-box">
                    <button class="vote-btn">详情</button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="item.quotedHappening" class="news-item-body" :class="{'news-reference':true}">
              <div class="refer-author-box">
                <div class="author-info">
                  <img :src="item.quotedHappening.avatarUrl" alt="头像">
                  <span class="author-username">{{ item.quotedHappening.username }}</span>
                  <span class="refer-text">投稿了文章</span>
                </div>
              </div>
              <div v-if="item.quotedHappening.tag" class="news-tag">
                <i class="iconfont icon-huati"></i>
                <span>{{ item.quotedHappening.tag }}</span>
              </div>
              <div class="news-title">{{ item.quotedHappening.title }}</div>
              <div class="news-text-content">{{ item.quotedHappening.content }}</div>
              <div v-if="item.quotedHappening.imgUrlList" class="news-album">
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
              <div v-if="item.quotedHappening.bookLiveInfo" class="news-book-lives">
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
              <div v-if="item.quotedHappening.voteSimpleInfo" class="news-vote">
                <div @click="handleShowVoteModal(item.quotedHappening.voteSimpleInfo.voteId)" class="news-vote-card">
                  <div class="vote-icon-box"><i class="iconfont icon-toupiao"></i></div>
                  <div class="vote-detail">
                    <p class="vote-title">{{item.quotedHappening.voteSimpleInfo.title}}</p>
                    <p class="vote-stat">{{item.quotedHappening.voteSimpleInfo.voteNumInfo}}人参与&nbsp;&nbsp;{{ item.quotedHappening.voteSimpleInfo.deadlineInfo }}</p>
                  </div>
                  <div class="vote-btn-box">
                    <button class="vote-btn">详情</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="news-item-footer">
              <div @click="showForwardInput(index,item.showForward)" class="footer-item news-zhuanfa" :class="{'highlight':item.showForward}">
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
            <div v-show="item.showForward" class="item-forward-box">
              <div class="forward-body">
                <div class="avatar-box">
                  <img src="/imgs/default-avatar.png" alt="头像">
                </div>
                <div class="forward-input-box">
                  <bs-tag-select @getSelectTagId="changeForwardTagId(index,$event)"></bs-tag-select>
                  <div class="forward-input">
                    <div 
                      :ref="el => getMineRef(el,index)"
                      contenteditable="true"
                      :class="{'empty-input':!contentNumList[index]}"
                      placeholder="有什么想说的呢"
                      @click="handleContentBoxClick"
                      tabindex="0"
                      @input="changePubContent($event,index,showAtSelect,mineRefList,contentNumList)"
                      @blur="handleContentBlur(index,showAtSelect,focusNode,focusOffset,chatInputOffset)"
                    >
                    </div>
                    <bs-at-ul v-if="showAtSelect[index]" contenteditable="false" :atSelectPosition="atSelectPosition">
                      <bs-at-li 
                        v-for="(item,index) in followerList"
                        :key="index"
                        :avatarUrl="item.avatarUrl"
                        :username="item.username"
                        :fansNum="item.fanNumInfo"
                        @selectAtUser="selectAtUser"
                      >
                      </bs-at-li>
                    </bs-at-ul>
                  </div>
                </div>
              </div>
              <div class="forward-footer">
                <div class="emoji-btn" tabindex="1" @blur="handleEmojiBoxBlur(index)">
                  <i @click="showEmojiBoxForward(index,item.showEmojiBox)" :class="{'active':item.showEmojiBox}" class="iconfont icon-biaoqing"></i>
                  <div v-if="item.showEmojiBox" class="emoji-box">
                    <bs-emoji @insertEmoji="insertEmojiForward" :emojiUrlList="emojiUrlList"></bs-emoji>
                  </div>
                </div>
                <div class="wrapper">
                  <span class="stat">{{ 300-contentNumList[index] }}</span>
                  <button @click="forwardNews(index)" class="forward-btn">转发</button>
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
          <img src="/imgs/loading-svg/loading-spinning-bubbles.svg" v-show="newsLoading">
        </div>
      </div>
      <news-aside-box :sideBarUrl="sideBarUrl" :recentTagList="recentTagList"></news-aside-box>
    </div>
  </div>
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
                  width: 93.5%;
                  padding: 10px;
                  border: 1px solid $colorF;
                  border-radius: 6px;
                  box-sizing: border-box;
                  margin-left: 8px;
                  &:hover {
                    border: 1px solid $colorM;
                  }
                  .forward-input {
                    position: relative;
                    margin-top: 6px;
                    .empty-input {
                      &::after {
                        content: attr(placeholder);
                        position: absolute;
                        top: 0px;
                        color: $colorD;
                      }
                    }
                    img{
                      height: 20px;
                      width: 20px;
                      vertical-align: middle
                    }
                    .username{
                      color: $colorM;
                    }
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
          text-align: center;
        }
      }
    }
    .container-small {
      width: 1100px;
    }
  }
</style>