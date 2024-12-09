<script setup>
  import BsTagSelect from '@/components/news/BsTagSelect.vue'
  import BsRichTextInput from '@/components/input/BsRichTextInput.vue'
  import BsEmoji from '@/components/input/BsEmoji.vue'
  import { onMounted, ref } from 'vue';
  import {modifyNewsApi} from '@/api/news.js'
  import { ElMessage, ElMessageBox } from 'element-plus';
  import router from '@/router';

  const emit = defineEmits(['closeModifyBox'])
  const props = defineProps(['newsInfo'])
  /* 标签 */
  const tagId = ref(null)
  function getSelectTagId(id) {
    tagId.value = id
  }
  /* title */
  const title = ref(props.newsInfo.title)
  /* close */
  function closeModifyBox() {
    ElMessageBox.confirm(
      '取消后此次修改不会保存哦',
      '确定取消修改？',
      {
        type:'warning',
        confirmButtonText:'继续修改',
        cancelButtonText:'直接离开'
      }
    ).catch(()=>{
      emit('closeModifyBox')
    })
  }
  /* input */
  const modifyInputRef = ref()
  const visibility = ref(props.newsInfo.visibility)
  onMounted(()=>{
    modifyInputRef.value.contentDom.innerHTML = props.newsInfo.content
    modifyInputRef.value.contentNum = modifyInputRef.value.handleContentNum()
  })
  /* emoji */
  const showEmojiBox = ref(false)
  function insertEmoji(emojiUrl) {
    modifyInputRef.value.insertEmoji(emojiUrl)
  }
  // document.onselectionchange = () => {
  //   let selection = document.getSelection()
  //   if(selection.rangeCount > 0) {
  //     const range = selection.getRangeAt(0)
  //     if(modifyInputRef.value.contentDom.contains(range.commonAncestorContainer)) {
  //       modifyInputRef.value.rangeOfContentBox = range
  //     }
  //   }
  // }
  /* setting */
  const showCascader = ref(false)
  const showCascader2 = ref(false)
  function changeVisibility(visi) {
    visibility.value = visi
    showCascader.value = false
    showCascader2.value = false
  }
  function handleClickAt() {
    modifyInputRef.value.handleClickAt()
  }
  /* 发布 */
  async function publishNews() {
    const content = modifyInputRef.value.contentDom.innerHTML
    if(!content) return ElMessage.error('内容不能为空')
    await modifyNewsApi({
      happeningId:props.newsInfo.id,
      tagId:tagId.value,
      title:title.value,
      content:content,
      visibility:visibility.value
    })
    ElMessage.success('发布成功')
    emit('closeModifyBox')
    router.replace('/news_index')
  }

  defineExpose({
    modifyInputRef
  })
</script>

<template>
  <div class="news-modify-box">
    <div class="mask"></div>
    <div class="news-modify">
      <div class="news-modify-header">
        <span>编辑动态</span>
        <i @click="closeModifyBox" class="iconfont icon-cuowu"></i>
      </div>
      <div class="news-modify-body">
        <bs-tag-select :defaultTag="newsInfo.tag" :defaultTagId="newsInfo.tagId" @getSelectTagId="getSelectTagId"></bs-tag-select>
        <div class="title-input-box">
          <input type="text" v-model="title" maxlength="20" placeholder="标题（选填，建议20字内）">
          <div v-if="title" class="title-stat">
            <div @click="title = ''" class="icon-box">
              <i class="iconfont icon-cuowu"></i>
            </div>
            <span>{{ title.length }}</span>
          </div>
        </div>
        <bs-rich-text-input ref="modifyInputRef" placeholder="有什么想说的呢？"></bs-rich-text-input>
        <div v-if="visibility === 1" class="only-box">
          <span class="only-title"><i class="iconfont icon-suo"></i>仅自己可见</span>
          <span class="only-desc">开启后，将不支持分享、商业推广</span>
        </div>
        <div class="quote-news">
          <i class="iconfont icon-jinggao"></i>
          <span>源动态不支持修改</span>
        </div>
      </div>
      <div class="news-modify-footer">
        <div class="modify-tools">
          <div class="icon-box" tabindex="0" @blur="showEmojiBox = false">
            <i @click="showEmojiBox = true" class="iconfont icon-biaoqing"></i>
            <bs-emoji v-if="showEmojiBox" @insertEmoji="insertEmoji"></bs-emoji>
          </div>
          <div @click="handleClickAt" class="icon-box">
            <i class="iconfont icon-aite"></i>
          </div>
        </div>
        <div class="modify-headquarter">
          <div class="text-num">{{ 300 - modifyInputRef?.contentNum }}</div>
          <div class="setting" tabindex="0" @blur="showCascader = false,showCascader2 = false">
            <i @click="showCascader = true" class="iconfont icon-shezhi"></i>
            <div v-if="showCascader" class="cascader">
              <div class="cascader-first">
                <div @click="showCascader2 = true" class="cascader-item">
                  <span>可见范围</span>
                  <i class="iconfont icon-youjiantou"></i>
                </div>
                <div v-if="showCascader2" class="cascader-second">
                  <div @click="changeVisibility(0)" class="cascader-item" :class="{'highlight':visibility === 0}">
                    <i class="iconfont icon-jiesuo1"></i>
                    <span>所有人可见</span>
                  </div>
                  <div @click="changeVisibility(1)" class="cascader-item" :class="{'highlight':visibility === 1}">
                    <i class="iconfont icon-suo"></i>
                    <span>仅自己可见</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button @click="publishNews" class="publish-btn">发布</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .news-modify-box {
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
    .news-modify {
      z-index: 101;
      width: 630px;
      border-radius: 6px;
      background-color: $colorG;
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
        padding: 10px 16px;
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
        .only-box {
          margin-top: 10px;
          font-size: $fontL;
          .only-title {
            color: #f85d54;
            margin-right: 10px;
            .icon-suo {
              font-size: $fontK;
              margin-right: 3px;
            }
          }
          .only-desc {
            color: $colorD
          }
        }
        .quote-news {
          @include flex(left);
          padding: 10px 15px;
          border-radius: 6px;
          background-color: $colorN;
          color: $colorD;
          margin-top: 10px;
          .icon-jinggao {
            font-size: $fontK;
            margin-right: 5px;
          }
        }
      }
      .news-modify-footer {
        @include flex();
        padding: 0 16px 10px;
        .modify-tools {
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
        .modify-headquarter {
          @include flex();
          .text-num {
            padding: 0 10px;
            border-right: 1.4px solid $colorD;
            color: $colorD;
          }
          .setting {
            position: relative;
            margin: 0 10px;
            cursor: pointer;
            .icon-shezhi {
              font-size: $fontH;
              &:hover {
                color: $colorM;
              }
            }
            .cascader {
              position: absolute;
              top: 30px;
              .cascader-first,.cascader-second {
                position: absolute;
                min-width: 142px;
                padding: 12px 0;
                border-radius: 6px;
                background-color: $colorG;
                color: $colorD;
                box-shadow: 0 0 30px rgba(0, 0, 0, .1);
                .cascader-item {
                  @include flex();
                  &:hover {
                    background-color: $colorN;
                  }
                  padding: 8px 27px;
                  .icon-youjiantou {
                    font-size: $fontK;
                  }
                }
              }
              .cascader-second {
                left: -100%;
                top: 0;
                .highlight {
                  color: $colorM;
                }
              }
            }
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