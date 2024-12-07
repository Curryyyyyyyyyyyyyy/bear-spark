<script setup>
  import BsTagSelect from '@/components/BsTagSelect.vue'
  import BsRichTextInput from '@/components/BsRichTextInput.vue'
  import { ref } from 'vue';

  /* 标签 */
  const tagId = ref(null)
  function getSelectTagId(id) {
    tagId.value = id
  }
  /* title */
  const title = ref('')
</script>

<template>
  <div class="news-modify-box">
    <div class="mask"></div>
    <div class="news-modify">
      <div class="news-modify-header">
        <span>编辑动态</span>
        <i class="iconfont icon-cuowu"></i>
      </div>
      <div class="news-modify-body">
        <bs-tag-select :getSelectTagId="getSelectTagId"></bs-tag-select>
        <div class="title-input-box">
          <input type="text" v-model="title" maxlength="20" placeholder="标题（选填，建议20字内）">
          <div v-if="title" class="title-stat">
            <div @click="title = ''" class="icon-box">
              <i class="iconfont icon-cuowu"></i>
            </div>
            <span>{{ title.length }}</span>
          </div>
          <bs-rich-text-input placeholder="有什么想说的呢？"></bs-rich-text-input>
          
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .news-modify-box {
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
    .news-modify {
      z-index: 101;
      position: fixed;
      top: 50%;
      left: 50%;
      width: 630px;
      border-radius: 6px;
      background-color: $colorG;
      transform: translate(-50%,-50%);
      .news-modify-header {
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
      .news-modify-body {
        padding: 16px;
        .title-input-box {
          position: relative;
          margin-top: 10px;
          input {
            width: 100%;
            border: none;
          }
          .title-stat {
            position: absolute;
            top: 0;
            right: 0px;
            @include flex();
            color: $colorD;
            font-size: $fontJ;
            .icon-box {
              @include flex(center);
              margin-right: 10px;
              width: 16px;
              height: 16px;
              background-color: $colorF;
              border-radius: 8px;
              color: $colorG;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>