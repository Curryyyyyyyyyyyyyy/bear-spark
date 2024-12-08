<script setup>
  import { ref } from 'vue';
  import BsEmoji from '@/components/BsEmoji.vue'
  import BsTagSelect from '@/components/BsTagSelect.vue'
  import BsRichTextInput from '@/components/BsRichTextInput.vue'
  import {fowardNewsApi} from '@/api/news.js'
  import { ElMessage } from 'element-plus';
  import router from '@/router';

  const emit = defineEmits(['closeForwardBox'])
  const props = defineProps(['newsInfo'])
  function closeForwardBox() {
    emit('closeForwardBox')
  }
  /* 标签 */
  const tagId = ref(null)
  function getSelectTagId(id) {
    tagId.value = id
  }
  /* emoji */
  const showEmojiBox = ref(false)
  const forwardInputRef = ref()
  function insertEmoji(emojiUrl) {
    forwardInputRef.value.insertEmoji(emojiUrl)
  }
  // document.onselectionchange = () => {
  //   let selection = document.getSelection()
  //   if(selection.rangeCount > 0) {
  //     const range = selection.getRangeAt(0)
  //     if(forwardInputRef.value&&forwardInputRef.value.contentDom.contains(range.commonAncestorContainer)) {
  //       forwardInputRef.value.rangeOfContentBox = range
  //     }
  //   }
  // }
  /* 发布 */
  async function publishNews() {
    const content = forwardInputRef.value.contentDom.innerHTML ? forwardInputRef.value.contentDom.innerHTML : '转发动态'
    await fowardNewsApi({
      quotedHappeningId:props.newsInfo.quotedHappening ? props.newsInfo.quotedHappening.id : props.newsInfo.id,
      content: content,
      tagId:tagId.value
    })
    ElMessage.success('发布成功')
    closeForwardBox()
    router.replace('/news_index')
  }

  defineExpose({
    forwardInputRef
  })
</script>

<template>
  <div class="news-forward-box">
    <div class="mask"></div>
    <div class="news-forward">
      <div class="news-forward-header">
        <span>分享动态</span>
        <i @click="closeForwardBox" class="iconfont icon-cuowu"></i>
      </div>
      <div class="news-forward-body">
        <bs-tag-select @getSelectTagId="getSelectTagId"></bs-tag-select>
        <bs-rich-text-input ref="forwardInputRef" placeholder="有什么想说的呢？"></bs-rich-text-input>
      </div>
      <div class="news-forward-footer">
        <div class="forward-tools">
          <div class="icon-box" tabindex="0" @blur="showEmojiBox = false">
            <i @click="showEmojiBox = true" class="iconfont icon-biaoqing"></i>
            <bs-emoji v-if="showEmojiBox" @insertEmoji="insertEmoji"></bs-emoji>
          </div>
        </div>
        <div class="forward-headquarter">
          <div class="text-num">{{ 300 - forwardInputRef?.contentNum }}</div>
          <button @click="publishNews" class="publish-btn">发布</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .news-forward-box {
    z-index: 100;
    @include flex(center);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    .mask {
      z-index: 100;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: $colorI;
      opacity: .5;
    }
    .news-forward {
      z-index: 101;
      width: 630px;
      border-radius: 6px;
      background-color: $colorG;
      .news-forward-header {
        @include flex(center);
        position: relative;
        height: 50px;
        font-size: $fontI;
        border-bottom: 1px solid $colorN;
        .icon-cuowu {
          position: absolute;
          right: 15px;
          font-size: $fontF;
          color: $colorD;
          transition: all .2s;
          cursor: pointer;
          &:hover {
            transform: scale(1.3);
          }
        }
      }
      .news-forward-body {
        padding: 10px 16px;
      }
      .news-forward-footer {
        @include flex();
        padding: 0 16px 10px;
        .forward-tools {
          @include flex();
          .icon-box {
            margin-left: 16px;
            cursor: pointer;
            &:first-child {
              margin-left: 0;
            }
            .iconfont {
              font-size: $fontG;
              color: $colorD;
              &:hover {
                color: $colorM;
              }
            }
          }
        }
        .forward-headquarter {
          @include flex();
          .text-num {
            padding: 0 10px;
            color: $colorD;
          }
          .publish-btn {
            padding: 6px 18px;
            border: none;
            background-color: $colorM;
            color: $colorG;
            border-radius: 6px;
            cursor: pointer;
            &:hover {
              background-color: $colorP;
            }
          }
        }
      }
    }
  }
</style>