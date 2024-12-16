<script setup>
  import Loading from '@/components/common/Loading.vue'
  import { onMounted, ref } from 'vue';
  import {getTagListApi} from '@/api/news'
  import { debounce } from '../../hooks/performance';

  const emit = defineEmits(['getSelectTagId'])
  const props = defineProps(['defaultTag','defaultTagId'])
  
  onMounted(()=>{
    if(props.defaultTag) {
      handleSelectTag(props.defaultTag,props.defaultTagId)
    }
  })

  const tagList = ref([])
  const pageNum = ref(1)
  const pageSize = ref(10)
  const showTagCol = ref(false)
  const tagLoading = ref(true)
  const selectTagName = ref('')
  const tagSelected = ref(false)
  async function handleTagCol() {
    showTagCol.value = true
    tagLoading.value = false
  }
  function handleTagBlur() {
    setTimeout(()=>{
      showTagCol.value = false
    },100)
  }
  function handleSelectTag(tagName,id) {
    selectTagName.value = tagName
    tagSelected.value = true
    emit('getSelectTagId', id)
  }
  function deleteTag() {
    selectTagName.value = ''
    tagSelected.value = false
    emit('getSelectTagId', null)
  }
  /* 滚动加载 */
  const busy = ref(false)
  const loadingTag = ref(false)
  const isArriveTotal = ref(false)
  function loadMoreTag() {
    if(isArriveTotal.value) return
    busy.value = true
    loadingTag.value = true
    setTimeout(async () => {
      const tagRes = await getTagListApi({
        pageNum:pageNum.value++,
        pageSize:pageSize.value,
        keyword:tagKeyWord.value
      })
      tagList.value.push(...tagRes.records)
      if(tagRes.total === tagList.value.length) isArriveTotal.value = true
      busy.value = false
      loadingTag.value = false
    }, 500);
  }
  const tagKeyWord = ref('')
  const searchTag = debounce(async () => {
    pageNum.value = 1
    const tagRes = await getTagListApi({
      pageNum:pageNum.value,
      pageSize:pageSize.value,
      keyword:tagKeyWord.value
    })
    tagList.value = tagRes.records
  })
</script>

<template>
  <div class="tag-desk">
    <div class="tag-search">
      <div class="tag-search-popover" :class="{'active':showTagCol}">
        <label :class="{'tag-active':tagSelected}" class="tag-search-input">
          <i v-if="!showTagCol" @click="handleTagCol" class="iconfont icon-huati"></i>
          <span v-if="!showTagCol" @click="handleTagCol">{{ selectTagName ? selectTagName : '选择标签' }}</span>
          <span v-if="tagSelected && !showTagCol" @click="deleteTag" class="delete-tag-btn"><i class="iconfont icon-cuowu"></i></span>
          <i v-if="showTagCol" class="iconfont icon-sousuo"></i>
          <input v-if="showTagCol" v-model="tagKeyWord" @input="searchTag" @blur="handleTagBlur" type="text" placeholder="搜索标签">
        </label>
        <div v-if="showTagCol" v-loading="tagLoading" class="tag-search-result">
          <div v-if="!tagLoading" class="tag-search-list">
            <div v-for="(item,index) in tagList" :key="index" @click="handleSelectTag(item.content, item.tagId)" class="tag-search-item">
              <i class="iconfont icon-huati"></i>
              <span class="tag-search-item-title" v-html="item.content"></span>
              <p class="tag-search-item-desc">{{item.viewNumInfo}}浏览&middot;{{item.discussNumInfo}}讨论</p>
            </div>
            <div class="load-more-tag"
              v-infinite-scroll="loadMoreTag" 
              :infinite-scroll-disabled="busy" 
              infinite-scroll-distance="50"
            >
              <loading v-show="!isArriveTotal && loadingTag"></loading>
            </div>
            <div v-if="isArriveTotal" class="prompt">已经到最底啦~</div>
          </div>
          <div v-if="false" class="tag-search-empty">还没有相关话题~</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  .tag-desk {
    .tag-search {
      height: 24px;
      position: relative;
      .tag-search-popover {
        z-index: 10;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: $colorN;
        border-radius: 11px;
        transition: all .4s;
        .tag-search-input {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          height: 22px;
          padding: 0 10px 0 8px;
          border-radius: 11px;
          color: $colorD;
          cursor: pointer;
          transition: all .4s;
          .icon-huati {
            margin-right: 3px;
            vertical-align: middle;
          }
          .icon-sousuo {
            margin-right: 3px;
          }
          input {
            height: 20px;
            width: 100%;
            border: none;
            outline: none;
          }
          .delete-tag-btn {
            position: absolute;
            display: inline-block;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 14px;
            height: 14px;
            border-radius: 7px;
            background-color: #dff6fd;
            right: -20px;
            .icon-cuowu {
              font-size: $fontK;
            }
          }
        }
        .tag-active {
          color: $colorM;
          background-color: #dff6fd;
        }
        .tag-search-result {
          height: 228px;
          overflow-x: hidden;
          overflow-y: scroll;
          .tag-search-list {
            .tag-search-item {
              padding: 10px 16px;
              &:hover {
                background-color: $colorN;
              }
              .icon-huati {
                color: $colorM;
                font-weight: 500;
                margin-right: 3px
              }
              .tag-search-item-title {
                font-size: $fontJ;
                em {
                  color: $colorM;
                  font-style: normal
                }
              }
              .tag-search-item-desc {
                margin-left: 20px;
                margin-top: 1px;
                font-size: $fontK;
                color: $colorD;
              }
            }
            .load-more-tag {
              text-align: center;
              img {
                width: 30px;
                height: 30px;
              }
            }
            .prompt {
              color: $colorD;
              text-align: center;
              padding: 8px 0;
              font-size: $fontJ;
            }
          }
          .tag-search-empty {
            font-size: $fontJ;
            color: $colorD;
            text-align: center;
            padding-top: 80px;
          }
        }
        .tag-search-result::-webkit-scrollbar {
          width: 4px;
          height: 0;
        }
        .tag-search-result::-webkit-scrollbar-thumb {
          background-color: $colorF;
          border-radius: 2px;
        }
      }
      .active {
        height: 280px;
        width: 300px;
        background-color: $colorG;
        border-radius: 6px;
        box-shadow: 0 11px 12px rgba(106, 115, 133, .3);
        box-sizing: border-box;
        .tag-search-input {
          height: 28px;
          margin: 16px 16px 8px;
          background-color: $colorN;
        }
      }
    }
  }
</style>