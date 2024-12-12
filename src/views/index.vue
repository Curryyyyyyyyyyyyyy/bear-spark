<script setup>
  import NavHeader from '@/components/common/NavHeader.vue';
  import { ref } from 'vue';
  import BsInput from '../components/input/BsInput.vue';
  let fixedHeader = ref(false)

  let rangeOfContentBox = ref(null)
  const inputBoxRefList = ref([]) /* 输入盒子 */
  const inputMethodsList = ref([]) /* 输入框 */
  function getInputBoxRef(el, index) {
    inputBoxRefList.value[index] = el
  }
  function getInputRef(el, index) {
    inputMethodsList.value[index] = el
  }
  /* 监听输入框光标 */
  const commentList = ref()
  document.onselectionchange = () => {
    let selection = document.getSelection()
    if(selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      if(commentList.value.contains(range.commonAncestorContainer)) {
        rangeOfContentBox.value = range
      }
    }
  }
  /* 插入表情包 */
  function insertEmoji(inputMethods,inputRef) {
    inputMethods.insertEmoji('/imgs/default-avatar.png',rangeOfContentBox.value,inputRef)
  }
  function clickAt(inputMethods,inputRef) {
    inputMethods.handleClickAt(rangeOfContentBox.value, inputRef)
  }
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
  <div ref="commentList" class="commentList">
    <div v-for="(item,index) in [1,2,3]" :key="index">
      <div class="input-box" :ref="el => getInputBoxRef(el, index)">
        <bs-input placeholder="请输入" :ref="el => getInputRef(el, index)"></bs-input>
      </div>
      <button @click="clickAt(inputMethodsList[index],inputBoxRefList[index].children[0])">艾特</button>
      <button @click="insertEmoji(inputMethodsList[index],inputBoxRefList[index].children[0])">输入表情</button>
    </div>
  </div>
</template>

<style lang="scss">
  @use '../assets/sass/config.scss' as *;
  .index-header {
    height: 152px;
    background-color: pink;
    color: $colorG;
  }
  .input-box {
    padding: 20px;
    position: relative;
  }
</style>