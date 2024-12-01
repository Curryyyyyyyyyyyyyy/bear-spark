<script setup>
  import { ElMessage } from 'element-plus';
  import BsAtUl from './BsAtUl.vue';
  import BsAtLi from './BsAtLi.vue'
  import { ref,reactive } from 'vue';

  defineProps(['placeholder'])

  /* 处理光标 */
  document.onselectionchange= () => {
    let selection = document.getSelection()
    if(selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      if(contentDom.value.contains(range.commonAncestorContainer)) {
        rangeOfContentBox = range
      }
    }
  }
  //#region 表情包
  let rangeOfContentBox
  /* 插入表情包 */
  function insertEmoji(emojiUrl) {
    if(pubContentNum.value + 3 > 300) return ElMessage.error('字数已达上限')
    const emojiImg = document.createElement('img')
    emojiImg.src = emojiUrl
    if(!rangeOfContentBox) {
      rangeOfContentBox = new Range()
      rangeOfContentBox.selectNodeContents(contentDom.value)
    }
    if(rangeOfContentBox.collapsed) {
      rangeOfContentBox.insertNode(emojiImg)
    } else {
      rangeOfContentBox.deleteContents()
      rangeOfContentBox.insertNode(emojiImg)
    }
    rangeOfContentBox.collapse(false)
    pubContentNum.value += 3
  }
  /* 处理点击表情包光标移到表情包前 */
  function handleContentBoxClick(event) {
    setCaretForEmoji(event.target)
  }
  function setCaretForEmoji(target) {
    if(target.tagName === 'IMG') {
      let range = new Range()
      range.setStartBefore(target)
      range.collapse(true)
      document.getSelection().removeAllRanges()
      document.getSelection().addRange(range)
    }
  }
  //#endregion
  //#region 监听content
  const contentDom = ref()
  const pubContentNum = ref(0)
  function handleContentNum() {
    // 判断innerHtml的<数量
    let htmlStr = contentDom.value.innerHTML.replace(/<div>|<br>|<\/div>|<\/span>/g,'')
    htmlStr = htmlStr.replace(/<span.*?>/g,'')
    let htmlArr = htmlStr.split('')
    /* 表情包数量 */
    const htmlLtCount = htmlArr.reduce((prev,cur)=>{
      return cur === '<' ? prev + 1 : prev
    },0)
    let textArr = contentDom.value.innerText.split('')
    /* < 和 > 数量 */
    const textLtCount = textArr.reduce((prev, cur)=>{
      return cur === '<' || cur === '>' ? prev + 1 : prev
    }, 0)
    return textArr.length + textLtCount*3 + htmlLtCount * 3
  }
  function changePubContent(event) {
    if(event.target.innerHTML === '<br>') {
      event.target.innerText = ''
    }
    /* 监听@输入 */
    if(event.data === '@') {
      setTimeout(() => {
        showAtSelect.value = true
        // const {left, top} = getCursorPosition()
        // atSelectPosition.left = left + 'px'
        // atSelectPosition.top = top + 'px'
        // console.log(left,top)
      }, 200);
    } else {
      showAtSelect.value = false
    }
    if(handleContentNum() > 300) {
      const overTextNum = handleContentNum() - 300
      event.target.innerHTML = event.target.innerHTML.slice(0, event.target.innerHTML.length - overTextNum)
      ElMessage.error('字数已达上限！')
      event.target.blur()
    }
    pubContentNum.value = handleContentNum()
  }
  function handleContentBlur() {
    setTimeout(() => {
      showAtSelect.value = false
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
  //#region @艾特功能
  let focusNode = reactive({}); // 存储光标聚焦节点
  let focusOffset = ref(0); // 存储光标聚焦偏移量
  let chatInputOffset = reactive({}); // 存储光标聚焦的元素
  const showAtSelect = ref(false)
  const atSelectPosition = reactive({
    left:"0px",
    top:"0px",
  })
  // function getCursorPosition() {
  //   let selection = document.getSelection()
  //   let range = new Range()
  //   range.selectNode(selection.focusNode)
  //   range.setStart(selection.focusNode, selection.focusOffset)
  //   const {left, top} = range.getBoundingClientRect()
  //   return {left, top}
  // }
  function handleClickAt() {
    if(pubContentNum.value + 1 > 300) return ElMessage.error('字数已达上限')
    pubContentNum.value++
    const atElement = '@'
    if(!rangeOfContentBox) {
      rangeOfContentBox = new Range()
      rangeOfContentBox.selectNodeContents(contentDom.value)
    }
    const atNode = rangeOfContentBox.createContextualFragment(atElement)
    if(rangeOfContentBox.collapsed) {
      rangeOfContentBox.insertNode(atNode)
    } else {
      rangeOfContentBox.deleteContents()
      rangeOfContentBox.insertNode(atNode)
    }
    rangeOfContentBox.collapse(false)
    document.getSelection().removeAllRanges()
    document.getSelection().addRange(rangeOfContentBox)
    setTimeout(() => {
      // const {left, top} = rangeOfContentBox.getBoundingClientRect()
      // console.log(left,top)
      // atSelectPosition.left = left + 'px'
      // atSelectPosition.top = top + 'px'
      showAtSelect.value = true
    }, 200);
  }
  function selectAtUser(username) {
    if(handleContentNum() + username.length + 1 > 300) return ElMessage.error('字数已达上限')
    showAtSelect.value = false
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
    pubContentNum.value = handleContentNum()
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
  /* 暴露方法 */
  defineExpose({
    insertEmoji,
    handleClickAt,
    selectAtUser,
    pubContentNum,
    contentDom
  })
</script>

<template>
  <div 
    ref="contentDom"
    contenteditable="true"
    @blur="handleContentBlur"
    @click="handleContentBoxClick"
    @input="changePubContent"
    :class="{'input-empty':!pubContentNum}"
    class="bs-rich-text-input"
    :placeholder="placeholder"
    tabindex="0"
  >
  </div>
  <bs-at-ul v-if="showAtSelect" :atSelectPosition="atSelectPosition">
    <bs-at-li 
      v-for="(item,index) in followerList" :key="index"
      :avatarUrl="item.avatarUrl"
      :username="item.username"
      :fansNum="item.fanNumInfo"
      @selectAtUser="selectAtUser"
    >
    </bs-at-li>
  </bs-at-ul>
</template>

<style lang="scss">
  @use '../assets/sass/config.scss' as *;
  .bs-rich-text-input {
    position: relative;
    width: 100%;
    font-size: $fontJ;
    img {
      width: 20px;
      height: 20px;
      vertical-align: middle;
    }
    .username {
      color: $colorM;
    }
  }
  .input-empty {
    &::after {
      content: attr(placeholder);
      position: absolute;
      top: 0px;
      color: $colorD;
    }
  }
</style>