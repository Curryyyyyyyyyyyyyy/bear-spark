<script setup>
  import { ref } from 'vue';
  import BsEmoji from '@/components/input/BsEmoji.vue'
  import BsTagSelect from '@/components/news/BsTagSelect.vue'
  import BsInput from '@/components/input/BsInput.vue'
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
  function insertEmoji(emojiUrl) {
    inputMethods.value.insertEmoji(emojiUrl, inputBoxRef.value.children[0])
  }
  /* 发布 */
  const inputBoxRef = ref()
  const inputMethods = ref()
  async function publishNews() {
    const content = inputBoxRef.value.children[0].innerHTML ? inputBoxRef.value.children[0].innerHTML : '转发动态'
    await fowardNewsApi({
      quotedHappeningId:props.newsInfo.happeningInfo.quotedHappening ? props.newsInfo.happeningInfo.quotedHappening.happeningInfo.happeningId : props.newsInfo.happeningInfo.happeningId,
      content,
      tagId:tagId.value
    })
    ElMessage.success('发布成功')
    closeForwardBox()
    router.replace('/news_index')
  }
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
        <div ref="inputBoxRef" class="bs-input-box">
          <bs-input ref="inputMethods" placeholder="有什么想说的呢？"></bs-input>
        </div>
      </div>
      <div class="news-forward-footer">
        <div class="forward-tools">
          <div class="icon-box">
            <i @click="showEmojiBox = !showEmojiBox" class="iconfont icon-biaoqing"></i>
            <div v-if="showEmojiBox" class="emoji-box">
              <bs-emoji @insertEmoji="insertEmoji"></bs-emoji>
            </div>
          </div>
        </div>
        <div class="forward-headquarter">
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
        .bs-input-box {
          position: relative;
        }
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
            .emoji-box {
              position: absolute;
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