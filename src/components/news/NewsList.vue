<script setup>
  import BsEmoji from '@/components/input/BsEmoji.vue';
  import BsTagSelect from '@/components/news/BsTagSelect.vue';
  import BsVoteModal from '@/components/news/BsVoteModal.vue'
  import {handleContentBoxClick,changePubContent} from '@/hooks/richTextInput'
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import useUser from '@/store/user';
  import {insertEmoji,handleContentNum} from '@/hooks/richTextInput'
  import {getVoteDetailApi,fowardNewsApi,getNewsListApi,deleteNewsApi,likeNewsApi} from '@/api/news'
  import {revokeBookLiveApi,modBookLiveStateApi} from '@/api/bookLive'

  /* Store */
  const userStore = useUser()
  const {username,avatarUrl} = storeToRefs(userStore)
  /* Router */
  const router = useRouter()
  /* Props */
  const props = defineProps(['tab','activeUp'])
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
  //#region 投票
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
    //     "voteType": 2,
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
    //     "dead": 0,
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
  //#endregion
  //#region 表情包
  // /* 表情包列表失焦 */
  function handleEmojiBoxBlur(index) {
    newsList.value[index].showEmojiBox = false
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
  const mineRefList = reactive([])
  const contentNumList = reactive([])
  const showAtSelect = reactive([])
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
    ElMessage.success('转发成功')
    mineRefList[index].innerHTML = ''
    forwardTagIdList.value[index] = null
    newsList.value[index].showForward = false
    newsList.value[index].forwardNumInfo++
  }
  function showForwardInput(index, showForward) {
    !showForward ? newsList.value[index].showForward = true : newsList.value[index].showForward = false
    curRangeIndex.value = index
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
        username:props.activeUp
      })
      newsList.value.push(...newsRes.records)
      if(newsRes.total <= newsList.value.length) isArriveTotal.value = true
      contentNumList.push(...new Array(newsRes.records.length).fill(0))
      showAtSelect.push(...new Array(newsRes.records.length).fill(false))
      busy.value = false;
      newsLoading.value = false
    }, 500);
  }
  // newsList.value = [
  //   {
  //       "id":1,
  //       "username": "万超",
  //       "avatarUrl": "http://dummyimage.com/100x100",
  //       "title": "现无称点进其原",
  //       "content": "11",
  //       "tag": "pariatur eiusmod aliqua labore reprehenderit",
  //       "viewNumInfo": 41,
  //       "likeNumInfo": 50,
  //       "commentNumInfo": 9,
  //       "forwardNumInfo":0,
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //       },
  //       "quotedHappening":{
  //         "id":1,
  //         "username": "万超",
  //         "avatarUrl": "http://dummyimage.com/100x100",
  //         "title": "现无称点进其原",
  //         "content": "",
  //         "tag": "pariatur eiusmod aliqua labore reprehenderit",
  //         "viewNumInfo": 41,
  //         "likeNumInfo": 50,
  //         "commentNumInfo": 9,
  //         "forwardNumInfo":0,
  //         "commentAble": 0,
  //         "advanceRelease": 0,
  //         "voteSimpleInfo": {
  //           "voteId": 8,
  //           "title": "需观反干分取必",
  //           "voteNumInfo": "43"
  //         },
  //         "imgUrlList": [
  //             "http://dummyimage.com/400x400"
  //         ],
  //         "pubTimeInfo": "1975-04-15 04:31:03"
  //         },
  //         "imgUrlList": [
  //             "http://dummyimage.com/400x400"
  //         ],
  //         "pubTimeInfo": "1975-04-15 04:31:03"
  //   },
  //   {
  //       "id":2,
  //       "username": "万超",
  //       "avatarUrl": "http://dummyimage.com/100x100",
  //       "title": "现无称点进其原",
  //       "content": "mollit reprehenderit in",
  //       "tag": "pariatur eiusmod aliqua labore reprehenderit",
  //       "viewNumInfo": 41,
  //       "likeNumInfo": 0,
  //       "commentNumInfo":95,
  //       "forwardNumInfo":0,
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "liked":0,
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
  //       "viewNumInfo": 41,
  //       "likeNumInfo": 50,
  //       "commentNumInfo": 95,
  //       "forwardNumInfo":2,
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "liked":1,
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
  //       "viewNumInfo": 41,
  //       "likeNumInfo": 5,
  //       "commentNumInfo": 95,
  //       "forwardNumInfo":2,
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "liked":1,
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
  //       "viewNumInfo": 41,
  //       "likeNumInfo": 50,
  //       "commentNumInfo": 95,
  //       "forwardNumInfo":2,
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "liked":1,
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
  //       "viewNumInfo": 41,
  //       "likeNumInfo": 50,
  //       "commentNumInfo": 95,
  //       "forwardNumInfo":2,
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "liked":0,
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
  //       "viewNumInfo": 41,
  //       "likeNumInfo": 50,
  //       "commentNumInfo": 5,
  //       "forwardNumInfo":2,
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "liked":0,
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
  //       "viewNumInfo": 41,
  //       "likeNumInfo": 50,
  //       "commentNumInfo": 95,
  //       "forwardNumInfo":2,
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "liked":0,
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
  //       "viewNumInfo": 41,
  //       "likeNumInfo": 50,
  //       "commentNumInfo": 95,
  //       "forwardNumInfo":2,
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "liked":0,
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
  //       "viewNumInfo": 41,
  //       "likeNumInfo": 50,
  //       "commentNumInfo": 95,
  //       "forwardNumInfo":2,
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "liked":0,
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
  //       "viewNumInfo": 41,
  //       "likeNumInfo": 50,
  //       "commentNumInfo": 9,
  //       "forwardNumInfo":2,
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "liked":0,
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
  //       "viewNumInfo": 41,
  //       "likeNumInfo": 50,
  //       "commentNumInfo": 9,
  //       "forwardNumInfo":2,
  //       "commentAble": 0,
  //       "advanceRelease": 0,
  //       "liked":0,
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
    })
  }
  /* 点赞/取消点赞 */
  async function likeNews(id, liked, index) {
    await likeNewsApi({
      happeningId:id,
      liked:liked ? 0 : 1
    })
    if(liked) {
      ElMessage.info('已取消点赞')
      newsList.value[index].liked = 0
      newsList.value[index].likeNumInfo--
    } else {
      ElMessage.success('点赞成功')
      newsList.value[index].liked = 1
      newsList.value[index].likeNumInfo++
    }
  }
  //#endregion
  //#region 查看指定用户动态
  function getUserNewsList(username) {
    pageNum.value = 1
    newsList.value.splice(0, newsList.value.length)
    contentNumList.splice(0, contentNumList.length)
    showAtSelect.splice(0, showAtSelect.length)
    isArriveTotal.value = false
    newsLoading.value = true
    setTimeout(async () => {
      const newsRes = await getNewsListApi({
        pageNum:pageNum.value++,
        pageSize:pageSize.value,
        username:username
      })
      newsList.value.push(...newsRes.records)
      if(newsRes.total <= newsList.value.length) isArriveTotal.value = true
      contentNumList.push(...new Array(newsRes.records.length).fill(0))
      showAtSelect.push(...new Array(newsRes.records.length).fill(false))
      newsLoading.value = false
    }, 500);
  }
  //#endregion 
  defineExpose({
    mineRefList,
    rangeOfContentBoxList,
    curRangeIndex,
    getUserNewsList
  })
</script>

<template>
  <div class="news-list">
    <div v-for="(item,index) in newsList" :key="index" class="news-item">
      <div v-if="item.content" class="item-warpper">
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
                <div @click.stop="deleteNews(item.id,index)" class="cascader-item">删除</div>
              </div>
            </div>
          </div>
        </div>
        <div class="news-item-body">
          <div v-if="item.tag" class="news-tag">
            <i class="iconfont icon-huati"></i>
            <span>{{ item.tag }}</span>
          </div>
          <div @click="router.push(`/news_detail/${item.id}`)" class="news-title">{{ item.title }}</div>
          <div @click="router.push(`/news_detail/${item.id}`)" class="news-text-content" v-html="item.content"></div>
          <div v-if="item.imgUrlList" class="news-album">
            <div class="news-album-preview grid">
              <div v-for="(item, index) in item.imgUrlList" :key="index" class="news-album-preview-picture">
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
                <button v-if="!item.bookLiveInfo.canceled" @click.stop="revokeBookLive(item.bookLiveInfo.bookLiveId,index)" class="book-lives-btn revoke-btn">撤销</button>
                <button v-else @click.stop="cancelRevokeBookLive" class="book-lives-btn revoked-btn">已撤销</button>
              </div>
              <div v-else class="book-btn-box">
                <button  v-if="item.bookLiveInfo.booked" @click.stop="bookLive(item.bookLiveInfo.bookLiveId,index)" class="book-lives-btn book-btn">
                  <span><i class="iconfont icon-icon-tixing"></i>预约</span>
                </button>
                <button v-else @click.stop="cancelBookLive(item.bookLiveInfo.bookLiveId,index)" class="book-lives-btn booked-btn">已预约</button>
              </div>
            </div>
          </div>
          <div v-if="item.voteSimpleInfo" class="news-vote">
            <div @click.stop="handleShowVoteModal(item.voteSimpleInfo.voteId)" class="news-vote-card">
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
          <div v-if="item.quotedHappening.content" class="quote-wrapper">
            <div class="refer-author-box">
              <div class="author-info">
                <img :src="item.quotedHappening.avatarUrl" alt="头像">
                <span class="author-username">{{ item.quotedHappening.username }}</span>
                <span v-if="false" class="refer-text">投稿了文章</span>
              </div>
            </div>
            <div v-if="item.quotedHappening.tag" class="news-tag">
              <i class="iconfont icon-huati"></i>
              <span>{{ item.quotedHappening.tag }}</span>
            </div>
            <div @click="router.push(`/news_detail/${item.quotedHappening.id}`)" class="news-title">{{ item.quotedHappening.title }}</div>
            <div @click="router.push(`/news_detail/${item.quotedHappening.id}`)" class="news-text-content" v-html="item.quotedHappening.content"></div>
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
                  <button v-if="true" @click.stop="revokeBookLive(newsInfo.quotedHappening.bookLiveInfo.id)" class="book-lives-btn revoke-btn">撤销</button>
                  <button v-else @click.stop="cancelRevokeBookLive" class="book-lives-btn revoked-btn">已撤销</button>
                </div>
                <div v-else class="book-btn-box">
                  <button v-if="item.quotedHappening.bookLiveInfo.booked" @click.stop="bookLive(newsInfo.quotedHappening.bookLiveInfo.id)" class="book-lives-btn book-btn">
                    <span><i class="iconfont icon-icon-tixing"></i>预约</span>
                  </button>
                  <button v-else @click.stop="cancelBookLive(newsInfo.quotedHappening.bookLiveInfo.id)" class="book-lives-btn booked-btn">已预约</button>
                </div>
              </div>
            </div>
            <div v-if="item.quotedHappening.voteSimpleInfo" class="news-vote">
              <div @click.stop="handleShowVoteModal(item.quotedHappening.voteSimpleInfo.voteId)" class="news-vote-card">
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
          <div v-else class="quoted-isdelete">
            <i class="iconfont icon-jinggao"></i>
            <span>源动态已被作者删除</span>
          </div>
        </div>
        <div class="news-item-footer">
          <div @click.stop="showForwardInput(index,item.showForward)" class="footer-item news-zhuanfa" :class="{'highlight':item.showForward}">
            <i class="iconfont icon-zhuanfa"></i>
            {{ item.forwardNumInfo === '0' ? '转发' : item.forwardNumInfo}}
          </div>
          <div @click.stop="router.push(`/news_detail/${item.id}`)" class="footer-item item-comment">
            <i class="iconfont icon-pinglun"></i>
            {{ item.commentNumInfo === '0' ? '评论' : item.commentNumInfo }}
          </div>
          <div @click.stop="likeNews(item.id, item.liked, index)" class="footer-item news-like" :class="{'highlight':item.liked}">
            <i class="iconfont icon-dianzan"></i>
            {{ item.likeNumInfo === '0' ? '点赞' : item.likeNumInfo}}
          </div>
        </div>
        <div v-show="item.showForward" class="item-forward-box">
          <div class="forward-body">
            <div class="avatar-box">
              <img :src="avatarUrl" alt="头像">
            </div>
            <div class="forward-input-box">
              <bs-tag-select @getSelectTagId="changeForwardTagId(index,$event)"></bs-tag-select>
              <div class="forward-input">
                <div 
                  :ref="el => getMineRef(el,index)"
                  contenteditable="true"
                  :class="{'empty-input':!contentNumList[index]}"
                  placeholder="有什么想说的呢"
                  @click.stop="handleContentBoxClick"
                  tabindex="0"
                  @input="changePubContent($event,index,showAtSelect,mineRefList,contentNumList,atSelectPosition)"
                  @blur="handleContentBlur(index,showAtSelect,focusNode,focusOffset,chatInputOffset)"
                >
                </div>
                <bs-at-ul 
                  v-if="showAtSelect[index]"
                  @selectAtUser="selectAtUser"
                  contenteditable="false"
                  :atSelectPosition="atSelectPosition"
                >
                </bs-at-ul>
              </div>
            </div>
          </div>
          <div class="forward-footer">
            <div class="emoji-btn" tabindex="1" @blur="handleEmojiBoxBlur(index)">
              <i @click.stop="showEmojiBoxForward(index,item.showEmojiBox)" :class="{'active':item.showEmojiBox}" class="iconfont icon-biaoqing"></i>
              <div v-if="item.showEmojiBox" class="emoji-box">
                <bs-emoji @insertEmoji="insertEmojiForward"></bs-emoji>
              </div>
            </div>
            <div class="wrapper">
              <span class="stat">{{ 300-contentNumList[index] }}</span>
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
    <img src="/imgs/loading-svg/loading-spinning-bubbles.svg" v-show="!isArriveTotal && newsLoading">
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
            .news-book-lives {
              background-color: $colorG
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
        .news-title {
          font-size: $fontJ;
          font-weight: bold;
          margin-top: 15px;
          cursor: pointer;
        }
        .news-text-content {
          margin-top: 10px;
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