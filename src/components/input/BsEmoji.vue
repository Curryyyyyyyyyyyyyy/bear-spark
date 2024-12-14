<script setup>
  import { onMounted, ref } from 'vue';
  import {getEmojiListApi} from '@/api/emoji.js'
  const emit = defineEmits(['insertEmoji'])
  const emojiUrlList = ref([])
  onMounted(async () => {
    const emojiListRes = await getEmojiListApi()
    emojiUrlList.value = emojiListRes.emojiUrlList
    // emojiUrlList.value = [
    //   '/imgs/default-avatar.png',
    //   '/imgs/default-avatar.png',
    //   '/imgs/default-avatar.png',
    //   '/imgs/default-avatar.png',
    //   '/imgs/default-avatar.png',
    //   '/imgs/default-avatar.png',
    // ]
  })
  function insertEmoji(event) {
    let emojiUrl
    if(event.target.tagName === 'LI') {
      emojiUrl = event.target.childNodes[0].src
    } else {
      emojiUrl = event.target.src
    }
    emit('insertEmoji', emojiUrl)
  }
</script>

<template>
  <div class="bs-emoji">
    <ul class="bs-emoji-list">
      <li @click="insertEmoji" class="bs-emoji-item" v-for="(item,index) in emojiUrlList" :key="index">
        <img v-lazy="item" alt="表情">
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  .bs-emoji {
    display: flex;
    flex-direction: column;
    width: 384px;
    height: 252px;
    padding: 5px 4px 5px 12px;
    border: 1px solid $colorE;
    box-sizing: border-box;
    border-radius: 6px;
    background-color: $colorG;
    .bs-emoji-list {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      overflow: auto;
      .bs-emoji-item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 6px;
        &:hover {
          background-color: $colorL;
        }
        img {
          width: 26px;
          height: 26px;
          user-select: none;
        }
      }
    }
    .bs-emoji-list::-webkit-scrollbar {
      width: 4px;
    }
    .bs-emoji-list::-webkit-scrollbar-thumb {
      background-color: $colorE;
      border-radius: 2px;
    }
  }
</style>