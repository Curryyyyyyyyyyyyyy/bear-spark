<script setup>
  import Loading from '@/components/common/Loading.vue'
  import { ref } from 'vue';
  import {getDraftListApi,deleteDraftApi} from '@/api/article'
  import { ElMessage, ElMessageBox } from 'element-plus';

  const draftList = ref([])
  const isEmpty = ref(false)
  const busy = ref(false)
  const loading = ref(false)
  const isArriveTotal = ref(false)
  const pageNum = ref(1)
  const pageSize = ref(10)
  function loadMore() {
    if(isArriveTotal.value) return
    busy.value = true
    loading.value = true
    setTimeout(async () => {
      const res = await getDraftListApi({
        pageNum:pageNum.value++,
        pageSize:pageSize.value,
      })
      draftList.value.push(...res.records)
      if(res.total <= draftList.value.length) isArriveTotal.value = true
      if(draftList.value.length === 0) isEmpty.value = true
      busy.value = false
      loading.value = false
    }, 500);
  }
  function deleteDraft(id, index) {
    ElMessageBox.confirm(
      '确定删除该草稿吗？',
      '',
      {
        cancelButtonText:'取消',
        confirmButtonText:'确定'
      }
    ).then(async () => {
      await deleteDraftApi({
        draftId:id
      })
      draftList.value.splice(index, 1)
      ElMessage.info('删除成功')
    })
  }
</script>

<template>
  <div class="draft-box">
    <div class="draft-box-header">
      <span class="header-text">草稿箱</span>
    </div>
    <div class="draft-box-main">
      <ul class="draft-list">
        <li v-for="(item, index) in draftList" :key="item.draftId" class="draft-item">
          <div class="header">
            <router-link :to="{
              name:'submit_article',
              query:{
                draftId:1
              }
            }">
              <span class="title">{{ item.title }}</span>
            </router-link>
            <div class="save-time">{{ item.lastSaveTimeInfo }}</div>
          </div>
          <div class="footer">
            <span class="draft-mark">草稿</span>
            <div class="tools">
              <router-link :to="{
                name:'submit_article',
                query:{
                  draftId:1
                }
              }">
                <button>编辑</button>
              </router-link>
              <button @click="deleteDraft(item.draftId, index)">删除</button>
            </div>
          </div>
        </li>
        <div class="load-more"
          v-infinite-scroll="loadMore" 
          :infinite-scroll-disabled="busy" 
          infinite-scroll-distance="50"
        >
          <Loading v-show="!isArriveTotal && loading"></Loading>
        </div>
      </ul>
      <div v-if="isEmpty" class="draft-empty">
        <i class="iconfont icon-kongxiangzi"></i>
        <span class="empty-text">还木有草稿 ~ 快去创作吧 ~</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
 @use '@/assets/sass/config.scss' as *;
 @use '@/assets/sass/mixin.scss' as *;
  .draft-box {
    @include flex(space-between, start);
    height: calc(100% - 60px);
    padding: 26px 60px 26px 36px;
    box-sizing: border-box;
    .draft-box-header {
      @include flex(left, start);
      .header-text {
        display: inline-block;
        width: 154px;
        padding: 10px 0;
        border-radius: 10px;
        background: $colorM;
        background: linear-gradient(to bottom left, rgb(43, 149, 243), rgb(3, 70, 152));
        text-align: center;
        font-size: $fontH;
        color: $colorG;
        font-family: Georgia, 'Times New Roman', Times, serif;
        font-weight: bold;
      }
    }
    .draft-box-main {
      width: calc(100% - 194px);
      height: 100%;
      padding: 0 30px;
      box-sizing: border-box;
      background-color: $colorG;
      border-radius: 6px;
      .draft-list {
        .draft-item {
          padding: 18px 0;
          border-bottom: 1px solid $colorF;
          .header {
            @include flex();
            .title {
              flex: 1;
              font-size: $fontI;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              cursor: pointer;
              &:hover {
                color: $colorM;
              }
            }
            .save-time {
              margin-left: 24px;
              font-size: $fontJ;
              color: $colorD;
            }
          }
          .footer {
            @include flex();
            margin-top: 16px;
            .draft-mark {
              display: inline-block;
              height: 18px;
              padding: 0 4px;
              border-radius: 4px;
              background-color: $colorN;
              color: $colorD;
              font-size: $fontK;
            }
            .tools {
              button {
                border: none;
                cursor: pointer;
                margin-left: 14px;
                &:hover {
                  color: $colorM;
                }
              }
            }
          }
        }
      }
      .draft-empty {
        @include flex(center);
        flex-direction: column;
        margin-top: 200px;
        .icon-kongxiangzi {
          font-size: 180px;
          color: $colorD;
        }
        .empty-text {
          margin-top: 12px;
          color: $colorD;
          font-size: $fontJ;
        }
      }
    }
  }
</style>