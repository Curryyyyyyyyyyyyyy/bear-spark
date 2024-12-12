<script setup>
  import BsInput from '@/components/input/BsInput.vue';
  import BsEmoji from '@/components/input/BsEmoji.vue';
  import { ref } from 'vue';
  defineProps(['placeholder','hideFooter','bgcOnlyWhite','positionTop'])

  const headerInputBoxRef = ref()
  const headerInputMethods = ref()
  const showEmojiBox = ref(false)
  /* 输入表情包 */
  function insertEmoji(emojiUrl, inputMethods, inputRef) {
    inputMethods.insertEmoji(emojiUrl, inputRef)
  }
  /* @ */
  function handleAt(inputMethods, inputRef) {
    showEmojiBox.value = false
    inputMethods.handleClickAt(inputRef)
  }
  /* 发布评论 */
  function publishComment(inputRef) {
    console.log(inputRef.innerHTML)
  }
  const pubInputBoxRef = ref()
  const showInputFooter = ref(false)
  document.addEventListener('click', (event) => {
    if(pubInputBoxRef.value?.contains(event.target)) {
      showInputFooter.value = true
    } else {
      showInputFooter.value = false
    }
  })
</script>

<template>
  <div class="bs-input-box">
    <div class="avatar-box">
      <img src="/imgs/default-avatar.png">
    </div>
    <div ref="pubInputBoxRef" tabindex="0" class="pub-input-box">
      <div ref="headerInputBoxRef" class="input-box" :class="{'bgcWhite':bgcOnlyWhite || showInputFooter}">
        <bs-input :atPositionTop="positionTop" ref="headerInputMethods" :placeholder="placeholder"></bs-input>
      </div>
      <div v-if="!hideFooter || showInputFooter" class="pub-input-footer">
        <div class="input-tools">
          <div class="tool-btn emoji-btn">
            <i @click="showEmojiBox = !showEmojiBox" class="iconfont icon-biaoqing"></i>
            <div v-if="showEmojiBox" class="emoji-box" :class="{'PositionInTop':positionTop}">
              <bs-emoji @insertEmoji="insertEmoji($event, headerInputMethods, headerInputBoxRef.children[0])"></bs-emoji>
            </div>
          </div>
          <div @click="handleAt(headerInputMethods, headerInputBoxRef.children[0])" class="tool-btn at-btn">
            <i class="iconfont icon-aite"></i>
          </div>
        </div>
        <div @click="publishComment(headerInputBoxRef.children[0])" class="pub-btn">
          <button>发布</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .bs-input-box {
    @include flex(space-between,start);
    .avatar-box {
      @include flex(center);
      width: 80px;
      img {
        height: 48px;
        width: 48px;
        border-radius: 24px;
      }
    }
    .pub-input-box {
      position: relative;
      width: calc(100% - 80px);
      .input-box {
        position: relative;
        @include flex(left);
        padding:8px;
        min-height: 32px;
        border: 1px solid $colorF;
        border-radius: 6px;
        background-color: $colorR;
        &.bgcWhite {
          background-color: $colorG;
        }
        &:hover {
          background-color: $colorG;
        }
      }
      .pub-input-footer {
        @include flex();
        margin-top: 8px;
        .input-tools {
          @include flex(left);
          .tool-btn {
            @include flex(center);
            width: 32px;
            height: 26px;
            border: 1px solid $colorN;
            border-radius: 6px;
            margin-right: 6px;
            cursor: pointer;
          }
          .emoji-btn {
            .emoji-box {
              z-index: 20;
              position: absolute;
              top: 90px;
              left: 0;
              &.PositionInTop {
                top: 0;
                transform: translateY(-100%);
              }
            }
          }
        }
        .pub-btn {
          button {
            border: none;
            width: 70px;
            height: 32px;
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