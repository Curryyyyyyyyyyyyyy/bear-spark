<script setup>
  import { ElMessage } from 'element-plus';
  import NavHeader from '../components/NavHeader.vue';
  import { ref,reactive } from 'vue';
  import {insertEmoji,handleContentBoxClick,changePubContent,handleContentNum} from '../hooks/richTextInput'
  let fixedHeader = ref(false)

  const mineRefList = reactive([])
  const contentNum = reactive(new Array(4).fill(0))
  const showAtSelect = reactive(new Array(4).fill(false))
  let curRangeIndex = ref('')
  const dataList = ref([1,2,3,4])
  function getMineRef(el, index) {
    if(el) {
      mineRefList[index] = el
    }
  }

  let rangeOfContentBox = reactive([])
  let focusNode = reactive({}); // 存储光标聚焦节点
  let focusOffset = ref(0); // 存储光标聚焦偏移量
  let chatInputOffset = reactive({}); // 存储光标聚焦的元素
  const atSelectPosition = reactive({
    left:"0px",
    top:"0px",
  })
  //#region 表情包
  /* 处理光标 */
  document.onselectionchange = () => {
    let selection = document.getSelection()
    console.log(11111111)
    if(selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      mineRefList.forEach((item,index) => {
        if(item.contains(range.commonAncestorContainer)) {
          rangeOfContentBox[index] = range
          curRangeIndex.value = index
        }
      })
    }
  }
  /* 插入表情包 */
  // function insertEmoji(emojiUrl,index) {
  //   if(contentNum[index] + 3 > 300) return ElMessage.error('字数已达上限')
  //   const emojiImg = document.createElement('img')
  //   emojiImg.src = emojiUrl
  //   if(!rangeOfContentBox[index]) {
  //     rangeOfContentBox[index] = new Range()
  //     rangeOfContentBox[index].selectNodeContents(mineRefList[index])
  //   }
  //   if(rangeOfContentBox[index].collapsed) {
  //     rangeOfContentBox[index].insertNode(emojiImg)
  //   } else {
  //     rangeOfContentBox[index].deleteContents()
  //     rangeOfContentBox[index].insertNode(emojiImg)
  //   }
  //   rangeOfContentBox[index].collapse(false)
  //   contentNum[index] += 3
  // }
  /* 处理点击表情包光标移到表情包前 */
  // function handleContentBoxClick(event) {
  //   setCaretForEmoji(event.target)
  // }
  // function setCaretForEmoji(target) {
  //   if(target.tagName === 'IMG') {
  //     let range = new Range()
  //     range.setStartBefore(target)
  //     range.collapse(true)
  //     document.getSelection().removeAllRanges()
  //     document.getSelection().addRange(range)
  //   }
  // }
  //#endregion
  //#region 监听content
  // function handleContentNum(mineRef) {
  //   // 判断innerHtml的<数量
  //   let htmlStr = mineRef.innerHTML.replace(/<div>|<br>|<\/div>|<\/span>/g,'')
  //   htmlStr = htmlStr.replace(/<span.*?>/g,'')
  //   let htmlArr = htmlStr.split('')
  //   /* 表情包数量 */
  //   const htmlLtCount = htmlArr.reduce((prev,cur)=>{
  //     return cur === '<' ? prev + 1 : prev
  //   },0)
  //   let textArr = mineRef.innerText.split('')
  //   /* < 和 > 数量 */
  //   const textLtCount = textArr.reduce((prev, cur)=>{
  //     return cur === '<' || cur === '>' ? prev + 1 : prev
  //   }, 0)
  //   return textArr.length + textLtCount*3 + htmlLtCount * 3
  // }
  // function changePubContent(event,index) {
  //   if(event.target.innerHTML === '<br>') {
  //     event.target.innerText = ''
  //   }
  //   /* 监听@输入 */
  //   if(event.data === '@') {
  //     setTimeout(() => {
  //       showAtSelect[index] = true
  //       // const {left, top} = getCursorPosition()
  //       // atSelectPosition.left = left + 'px'
  //       // atSelectPosition.top = top + 'px'
  //       // console.log(left,top)
  //     }, 200);
  //   } else {
  //     showAtSelect[index] = false
  //   }
  //   if(handleContentNum(mineRefList[index]) > 300) {
  //     const overTextNum = handleContentNum(mineRefList[index]) - 300
  //     event.target.innerHTML = event.target.innerHTML.slice(0, event.target.innerHTML.length - overTextNum)
  //     ElMessage.error('字数已达上限！')
  //     event.target.blur()
  //   }
  //   contentNum[index] = handleContentNum(mineRefList[index])
  // }
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
  //#endregion
  // #region @艾特功能
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
    contentNum[index] = handleContentNum(mineRefList[index])
  }
  const followerList = [
    {
      avatarUrl:'/imgs/default-avatar.png',
      username:'周权',
      fanNumInfo:111
    },
    {
      avatarUrl:'/imgs/default-avatar.png',
      username:'周权',
      fanNumInfo:111
    },
    {
      avatarUrl:'/imgs/default-avatar.png',
      username:'周权',
      fanNumInfo:111
    },
    {
      avatarUrl:'/imgs/default-avatar.png',
      username:'周权',
      fanNumInfo:111
    },
  ]
  //#endregion
</script>

<template>
  <div class="index-header">
    <nav-header>
      <template v-slot:nav>
        <a>
          <i v-if="fixedHeader" class="iconfont icon-shouye"></i>
          <span>首页</span>
          <i v-if="!fixedHeader" class="iconfont icon-down"></i>
        </a>
      </template>
    </nav-header>
  </div>
  <div v-for="(item,index) in dataList" :key="index">
    <div 
      :ref="el => getMineRef(el,index)"
      contenteditable="true"
      class="test empty"
      :placeholder="!contentNum[index] ? '请输入' : ''"
      @click="handleContentBoxClick"
      tabindex="0"
      @input="changePubContent($event,index,showAtSelect,mineRefList,contentNum)"
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
    <span>{{ contentNum[index] }}</span>
    <button @click="insertEmoji('/imgs/default-avatar.png',index,contentNum,rangeOfContentBox,mineRefList)">输入表情包</button>
  </div>
</template>

<style lang="scss">
  @use '../assets/sass/config.scss' as *;
  .index-header {
    height: 152px;
    background-color: pink;
    color: $colorG;
  }
  .test {
    position: relative;
    margin: 50px;
    background-color: white;
  }
  .empty {
    &::after {
      content: attr(placeholder);
      position: absolute;
      top: 0px;
      color: $colorD;
    }
  }
</style>