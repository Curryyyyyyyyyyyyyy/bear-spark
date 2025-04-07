<script setup>
  import BsAtUl from '@/components/input/BsAtUl.vue';
  import { ref,reactive } from 'vue';
  defineProps(['placeholder','atPositionTop'])
  //#region 表情包
  /* 插入表情包 */
  function insertEmoji(emojiUrl,inputRef) {
    // if(contentNum.value + 3 > 300) return ElMessage.error('字数已达上限')
    if(!focusRange || !inputRef.contains(focusRange.commonAncestorContainer)) {
      focusRange = new Range()
      focusRange.selectNodeContents(inputRef)
      focusRange.collapse(false)
    }
    const emojiImgElement = `<img src="${emojiUrl}">`
    const emojiImgNode = focusRange.createContextualFragment(emojiImgElement)
    const lastChild = emojiImgNode.lastChild
    if(focusRange.collapsed) {
      focusRange.insertNode(emojiImgNode)
    } else {
      focusRange.deleteContents()
      focusRange.insertNode(emojiImgNode)
    }
    focusRange.setStartAfter(lastChild)
    focusRange.setEndAfter(lastChild)
    const selection = document.getSelection()
    selection.removeAllRanges()
    selection.addRange(focusRange)
    contentNum.value += 3
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
  const contentNum = ref(0)
  function handleContentNum(inputRef) {
    // 判断innerHtml的<数量
    let htmlStr = inputRef.innerHTML.replace(/<div>|<br>|<\/div>|<\/span>/g,'')
    htmlStr = htmlStr.replace(/<span.*?>/g,'')
    let htmlArr = htmlStr.split('')
    /* 表情包数量 */
    const htmlLtCount = htmlArr.reduce((prev,cur)=>{
      return cur === '<' ? prev + 1 : prev
    },0)
    let textArr = inputRef.innerText.split('')
    /* < 和 > 数量 */
    const textLtCount = textArr.reduce((prev, cur)=>{
      return cur === '<' || cur === '>' ? prev + 1 : prev
    }, 0)
    contentNum.value = textArr.length + textLtCount*3 + htmlLtCount * 3
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
        const {left, top} = getCursorPosition(event.target)
        atSelectPosition.left = left + 'px'
        atSelectPosition.top = top + 'px'
      }, 200);
    } else {
      showAtSelect.value = false
    }
    handleContentNum(event.target)
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
        focusRange = sel.getRangeAt(0);
      }
    }
  }
  //#endregion
  //#region @艾特功能
  let focusNode = reactive({}); // 存储光标聚焦节点
  let focusOffset = ref(0); // 存储光标聚焦偏移量
  let focusRange = reactive({}); // 存储光标聚焦的元素
  const showAtSelect = ref(false)
  const atSelectPosition = reactive({
    left:"0px",
    top:"0px",
  })
  function getCursorPosition(inputRef) {
    let selection = document.getSelection()
    let range = new Range()
    range.selectNode(selection.focusNode)
    range.setStart(selection.focusNode, selection.focusOffset)
    let {left, top} = range.getBoundingClientRect()
    left -= inputRef.getBoundingClientRect().left
    top -= inputRef.getBoundingClientRect().top-26
    return {left, top}
  }
  function handleClickAt(inputRef) {
    contentNum.value++
    const atElement = '@'
    if(!focusRange || !inputRef.contains(focusRange.commonAncestorContainer)) {
      focusRange = new Range()
      focusRange.selectNodeContents(inputRef)
      focusRange.collapse(false)
    }
    const atNode = focusRange.createContextualFragment(atElement)
    if(focusRange.collapsed) {
      focusRange.insertNode(atNode)
    } else {
      focusRange.deleteContents()
      focusRange.insertNode(atNode)
    }
    let {left, top} = focusRange.getBoundingClientRect()
    left -= inputRef.getBoundingClientRect().left-13
    top -= inputRef.getBoundingClientRect().top-26
    atSelectPosition.left = left + 'px'
    atSelectPosition.top = top + 'px'
    focusRange.collapse(false)
    document.getSelection().removeAllRanges()
    document.getSelection().addRange(focusRange)
    setTimeout(() => {
      showAtSelect.value = true
    }, 200);
  }
  function selectAtUser(username) {
    // if(handleContentNum() + username.length + 1 > 300) return ElMessage.error('字数已达上限')
    showAtSelect.value = false
    focusRange.setStart(focusNode,focusOffset.value-1)
    focusRange.setEnd(focusNode,focusOffset.value)
    focusRange.deleteContents()
    const atElement = `<span class="username" contenteditable="false">@${username}</span>`
    const atNode = focusRange.createContextualFragment(atElement)
    let lastChild = atNode.lastChild
    focusRange.insertNode(atNode)
    focusRange.setEndAfter(lastChild)
    focusRange.setStartAfter(lastChild)
    const selection = document.getSelection()
    selection.removeAllRanges()
    selection.addRange(focusRange)
    contentNum.value += username.length
  }
  //#endregion
  /* 暴露方法 */
  defineExpose({
    insertEmoji,
    handleClickAt,
    contentNum,
    handleContentNum
  })
</script>

<template>
  <div 
    contenteditable="true"
    @blur="handleContentBlur"
    @click="handleContentBoxClick"
    @input="changePubContent"
    :class="{'input-empty':!contentNum}"
    class="bs-input"
    :placeholder="placeholder"
    tabindex="0"
  >
  </div>
  <div class="at-list" :class="{'positionTop':atPositionTop}" :style="{left:!atPositionTop && atSelectPosition.left,top:!atPositionTop && atSelectPosition.top}">
    <bs-at-ul 
      v-if="showAtSelect" 
      @selectAtUser="selectAtUser" 
    >
    </bs-at-ul>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  .bs-input {
    position: relative;
    width: 100%;
    padding: 8px 0;
    box-sizing: border-box;
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
      color: $colorD;
      cursor: text;
    }
  }
  .at-list {
    z-index: 20;
    position: absolute;
    &.positionTop {
      top: 0;
      transform: translateY(-100%);
    }
  }
</style>