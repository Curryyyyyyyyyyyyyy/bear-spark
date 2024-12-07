import { ElMessage } from "element-plus"

/* 表情包 */
export function insertEmoji(emojiUrl,index,contentNum,rangeOfContentBox,mineRefList) {
  if(contentNum[index] + 3 > 300) return ElMessage.error('字数已达上限')
  const emojiImg = document.createElement('img')
  emojiImg.src = emojiUrl
  if(!rangeOfContentBox[index]) {
    rangeOfContentBox[index] = new Range()
    rangeOfContentBox[index].selectNodeContents(mineRefList[index])
  }
  if(rangeOfContentBox[index].collapsed) {
    rangeOfContentBox[index].insertNode(emojiImg)
  } else {
    rangeOfContentBox[index].deleteContents()
    rangeOfContentBox[index].insertNode(emojiImg)
  }
  rangeOfContentBox[index].collapse(false)
  contentNum[index] += 3
}
export function handleContentBoxClick(event) {
  setCaretForEmoji(event.target)
}
export function setCaretForEmoji(target) {
  if(target.tagName === 'IMG') {
    let range = new Range()
    range.setStartBefore(target)
    range.collapse(true)
    document.getSelection().removeAllRanges()
    document.getSelection().addRange(range)
  }
}
/* 监听content */
export function handleContentNum(mineRef) {
  // 判断innerHtml的<数量
  let htmlStr = mineRef.innerHTML.replace(/<div>|<br>|<\/div>|<\/span>/g,'')
  htmlStr = htmlStr.replace(/<span.*?>/g,'')
  let htmlArr = htmlStr.split('')
  /* 表情包数量 */
  const htmlLtCount = htmlArr.reduce((prev,cur)=>{
    return cur === '<' ? prev + 1 : prev
  },0)
  let textArr = mineRef.innerText.split('')
  /* < 和 > 数量 */
  const textLtCount = textArr.reduce((prev, cur)=>{
    return cur === '<' || cur === '>' ? prev + 1 : prev
  }, 0)
  return textArr.length + textLtCount*3 + htmlLtCount * 3
}
export function changePubContent(event,index,showAtSelect,mineRefList,contentNum,atSelectPosition) {
  if(event.target.innerHTML === '<br>') {
    event.target.innerText = ''
  }
  /* 监听@输入 */
  if(event.data === '@') {
    setTimeout(() => {
      showAtSelect[index] = true
      const {left, top} = getCursorPosition()
      atSelectPosition.left = left + 'px'
      atSelectPosition.top = top + 20 + 'px'
    }, 200);
  } else {
    showAtSelect[index] = false
  }
  if(handleContentNum(mineRefList[index]) > 300) {
    const overTextNum = handleContentNum(mineRefList[index]) - 300
    event.target.innerHTML = event.target.innerHTML.slice(0, event.target.innerHTML.length - overTextNum)
    ElMessage.error('字数已达上限！')
    event.target.blur()
  }
  contentNum[index] = handleContentNum(mineRefList[index])
}
/* 获取输入时光标位置 */
export function getCursorPosition() {
  let selection = document.getSelection()
  let range = new Range()
  range.selectNode(selection.focusNode)
  range.setStart(selection.focusNode, selection.focusOffset)
  const {left, top} = range.getBoundingClientRect()
  return {left, top}
}