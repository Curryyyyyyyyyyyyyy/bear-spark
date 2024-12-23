<script setup>
  import BsTagSelect from '@/components/news/BsTagSelect.vue'
  import SetTimeSubmit from '@/views/submit/SetTimeSubmit.vue';
  import AddCategory from '@/views/submit/AddCategory.vue';
  import {uploadApi} from '@/api/file'
  import {getCategoryListApi, publishArticleApi, modifyArticleApi} from '@/api/article'
  import {timeFormat} from '@/hooks/timeFormat.js'
  import { dayjs, ElMessage } from 'element-plus';
  import { nextTick, onMounted, ref } from 'vue';

  const emit = defineEmits(['close'])
  const props = defineProps(['title','contentHtml','contentText','contentImgList','articleId','articleInfo'])

  /* onMounted */
  onMounted(async () => {
    if(props.articleId) {
      summary.value = props.articleInfo.summary
      coverUrl.value = props.articleInfo.coverUrl
      tagId.value = props.articleInfo.tagId
      tag.value = props.articleInfo.tag
      selectedCategoryList.value = props.articleInfo.categoryInfoList
      visibility.value = props.articleInfo.visibility
      commentAble.value = props.articleInfo.commentAble
      declaration.value = props.articleInfo.declaration
      reprintArticleUrl.value = props.articleInfo.reprintArticleUrl
    }
  })
  //#region 获取标签Id
  const tagId = ref(null)
  const tag = ref('')
  function getSelectTagId(id) {
    tagId.value = id
  }
  //#endregion
  //#region 文章封面
  const coverUrl = ref(null)
  const coverIndex = ref('')
  const coverList = ref([...props.contentImgList])
  function uploadCover(event) {
    if(event.target.files[0].size / 1024 / 1024 > 1) return ElMessage.error('图片大小不能超过1MB')
    const fd = new FormData()
    fd.append('file', event.target.files[0])
    coverUrl.value = uploadApi(fd, 1)
    coverIndex.value = ''
  }
  function selectCover(imgUrl,index) {
    coverUrl.value = imgUrl
    coverIndex.value = index
  }
  //#endregion
  //#region 文章摘要
  const summary = ref('')
  function extractSummary() {
    summary.value = props.contentText.slice(0, 256)
  }
  //#endregion
  //#region 专栏分类
  const showCategoryBox = ref(false)
  const showAddCategoryBox = ref(false)
  const mouseState = ref(false)  // 让鼠标在元素上悬浮一秒才显示分类框
  const categoryRef = ref()
  const categoryList = ref([])
  const selectedCategoryList = ref([])
  function handleShowCategorys() {
    mouseState.value = true
    setTimeout(async () => {
      if(mouseState.value) {
        categoryList.value = await getCategoryListApi()
        showCategoryBox.value = true
        nextTick(()=>{
          categoryRef.value.focus()
        })
      }
    }, 500);
  }
  function judgeSelect(categoryId) {
    let resIndex = -1
    selectedCategoryList.value.forEach((item, index) => {
      if(item.categoryId === categoryId) resIndex = index
    })
    return resIndex
  }
  function handleSelectCategory(categoryId,categoryName) {
    const index = judgeSelect(categoryId)
    if(index === -1) {
      if(selectedCategoryList.value.length >= 3) return ElMessage.error('最多选择3个分类专栏')
      selectedCategoryList.value.push({categoryId,categoryName})
      return
    } else {
      selectedCategoryList.value.splice(index, 1)
    }
  }
  //#endregion
  //#region 创作声明/可见范围/评论许可
  const declaration = ref(0)
  const visibility = ref(0)
  const commentAble = ref(0)
  const reprintArticleUrl = ref(null)
  //#endregion
  //#region 发布文章
  async function publishArticle(pubTime) {
    if(declaration.value === 1 && !reprintArticleUrl.value) return ElMessage.error('请填写原文链接')
    if(declaration.value === 0) reprintArticleUrl.value = null
    const nowTime = dayjs()
    pubTime = pubTime ? pubTime : timeFormat(nowTime.format('YYYY-MM-DD'),nowTime.$H,nowTime.$m)
    if(props.articleId) {
      await modifyArticleApi({
        articleId:props.articleId,
        title:props.title,
        summary:summary.value,
        content:props.contentHtml,
        coverUrl:coverUrl.value,
        tagId:tagId.value,
        categoryIdList:selectedCategoryList.value.map(item => item.categoryId),
        imgUrlList:props.contentImgList,
        visibility:visibility.value,
        commentAble:commentAble.value,
        declaration:declaration.value,
        reprintArticleUrl:reprintArticleUrl.value,
        pubTime:pubTime
      })
    } else {
      await publishArticleApi({
        title:props.title,
        summary:summary.value,
        content:props.contentHtml,
        coverUrl:coverUrl.value,
        tagId:tagId.value,
        categoryIdList:selectedCategoryList.value.map(item => item.categoryId),
        imgUrlList:props.contentImgList,
        visibility:visibility.value,
        commentAble:commentAble.value,
        declaration:declaration.value,
        reprintArticleUrl:reprintArticleUrl.value,
        pubTime:pubTime
      })
    }
    ElMessage.success('发布成功')
  }
  //#endregion
  //#region 定时发布框
  function close() {
    emit('close')
  }
  const showSetTimeBox = ref(false)
  function handleShowSetTime() {
    if(declaration.value === 1 && !reprintArticleUrl.value) return ElMessage.error('请填写原文链接')
    if(declaration.value === 0) reprintArticleUrl.value = null
    showSetTimeBox.value = true
  }
  //#endregion
</script>

<template>
  <div class="mask"></div>
  <div class="submit-article-modal">
    <div class="modal-header">
      <div class="title-text">发布文章</div>
      <i @click="close" class="iconfont icon-cuowu"></i>
    </div>
    <div class="modal-main">
      <div class="article-tag">
        <span class="item-text">文章标签：</span>
        <bs-tag-select :defaultTagId="tagId" :defaultTag="tag" @getSelectTagId="getSelectTagId"></bs-tag-select>
      </div>
      <div class="article-cover">
        <span class="item-text">添加封面：</span>
        <div class="cover-select-box">
          <div class="cover-box">
            <img v-if="coverUrl" src="/imgs/logo.png" alt="">
            <label v-else for="upload-cover" class="upload-box">
              <i class="iconfont icon-jiahao"></i>
              <span class="upload-text">添加文章封面</span>
            </label>
            <div v-if="coverUrl" @click="coverUrl = ''" class="icon-delete-btn">
              <i class="iconfont icon-cuowu"></i>
            </div>
          </div>
          <div class="cover-list-box">
            <div class="cover-category-list">
              <div class="cover-category-item active">正文图</div>
              <div class="cover-category-item">标签图</div>
              <div class="cover-category-item">热门</div>
              <div class="cover-category-item">VIP</div>
              <label for="upload-cover" class="cover-category-item">本地上传</label>
            </div>
            <div class="cover-list">
              <div @click="selectCover(item,index)" v-for="(item,index) in coverList" :key="index" class="cover-box">
                <img :src="item" alt="">
                <div v-if="index === coverIndex" class="icon-gou-box">
                  <i class="iconfont icon-gou"></i>
                </div>
              </div>
              <div v-if="!coverList.length" class="cover-list-empty">暂无</div>
            </div>
          </div>
        </div>
        <input @change="uploadCover" id="upload-cover" v-show="false" type="file" accept="image/*">
      </div>
      <div class="article-summary">
        <span class="item-text">文章摘要：</span>
        <div class="summary-box">
          <textarea v-model="summary" placeholder="摘要：会在推荐、列表等场景外露，帮助读者快速了解内容，支持一键将正文前256字符键入摘要文本框" maxlength="256"></textarea>
          <div class="desc-box">
            <span class="desc-text">{{ summary.length }}/256</span>
            <button @click="extractSummary" class="extract-btn">一键提取</button>
          </div>
        </div>
      </div>
      <div class="article-category">
        <span class="item-text">分类专栏：</span>
        <div ref="categoryRef" tabindex="1" @blur="showCategoryBox = false" class="category-select-btn">
          <div v-for="(item,index) in selectedCategoryList" :key="item.categoryId" class="selected-category-item">
            <span class="selected-category-name">{{item.categoryName}}</span>
            <span @click="selectedCategoryList.splice(index,1)" class="icon-delete-box">
              <i class="iconfont icon-cuowu"></i>
            </span>
          </div>
          <div class="add-btn" @mouseenter="handleShowCategorys" @mouseleave="mouseState = false"><i class="iconfont icon-jiahao"></i>添加分类</div>
          <div v-if="showCategoryBox" class="categorys-box">
            <div class="categorys-box-header">
              <span class="limit">最多选择3个分类专栏</span>
              <span class="desc">#为二级分类</span>
              <i @click="showCategoryBox = false" class="iconfont icon-cuowu"></i>
            </div>
            <div class="categorys-main">
              <div class="category-list">
                <div
                  @click="handleSelectCategory(item.categoryId,item.categoryName)" 
                  v-for="(item) in categoryList" :key="item.categoryId" 
                  class="category-item"  
                  :class="{'checked':judgeSelect(item.categoryId) !== -1}"
                >
                  <div class="radio">
                    <i class="iconfont icon-gou"></i>
                  </div>
                  <span class="category-name">{{ item.categoryName }}</span>
                </div>
                <div @click="showAddCategoryBox = true" class="category-item create-category">
                  <i class="iconfont icon-jiahao"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="article-declaration">
        <span class="item-text">创作声明：</span>
        <div class="declaration-list">
          <div @click="declaration = 0" class="declaration-item" :class="{'checked':declaration === 0}">
            <div class="radio">
              <div class="inner-white"></div>
            </div>
            <div class="declaration">原创</div>
          </div>
          <div @click="declaration = 1" class="declaration-item" :class="{'checked':declaration === 1}">
            <div class="radio">
              <div class="inner-white"></div>
            </div>
            <div class="declaration">转载</div>
          </div>
        </div>
      </div>
      <div v-if="declaration === 1" class="article-reprint">
        <input v-model="reprintArticleUrl" type="text" placeholder="请填写原文链接">
        <div class="reprint-desc">注意：转载请确认原文允许转载，或者您已经获得原文作者授权。</div>
      </div>
      <div class="article-visibility">
        <span class="item-text">可见范围：</span>
        <div class="visibility-box">
          <div @click="visibility = 0" class="visibility-item" :class="{'checked':visibility === 0}">
            <div class="radio">
              <div class="inner-white"></div>
            </div>
            <span class="visibility-text">全部可见</span>
          </div>
          <div @click="visibility = 1" class="visibility-item" :class="{'checked':visibility === 1}">
            <div class="radio">
              <div class="inner-white"></div>
            </div>
            <span class="visibility-text">仅我可见</span>
          </div>
        </div>
      </div>
      <div class="article-commentable">
        <div class="item-text">评论许可：</div>
        <div class="commentable-box">
          <div @click="commentAble = 0" class="commentable-item" :class="{'checked':commentAble === 0}">
            <div class="radio">
              <div class="inner-white"></div>
            </div>
            <span class="commentable-text">允许评论</span>
          </div>
          <div @click="commentAble = 1" class="commentable-item" :class="{'checked':commentAble === 1}">
            <div class="radio">
              <div class="inner-white"></div>
            </div>
            <span class="commentable-text">禁止评论</span>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button v-if="props.articleId" @click="close" class="modal-footer-btn cancel-btn">取消</button>
      <button v-else @click="handleShowSetTime" class="modal-footer-btn set-time-btn">定时发布</button>
      <button @click="publishArticle" class="modal-footer-btn publish-btn">发布文章</button>
    </div>
  </div>
  <set-time-submit v-if="showSetTimeBox" @publishArticle="publishArticle" @close="showSetTimeBox = false"></set-time-submit>
  <add-category v-if="showAddCategoryBox" @close="showAddCategoryBox = false"></add-category>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .mask {
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: $colorI;
    opacity: .5;
  }
  .submit-article-modal {
    z-index: 1001;
    position: fixed;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
    min-width: 600px;
    padding: 20px;
    border-radius: 6px;
    background-color: $colorG;
    .modal-header {
      @include flex();
      .title-text {
        font-size: $fontI;
        font-weight: bold;
      }
      .icon-cuowu {
        color: $colorD;
        font-size: $fontH;
        cursor: pointer;
        transition: all .2s;
        &:hover {
          transform: scale(1.2);
        }
      }
    }
    .modal-main {
      .item-text {
        color: $colorC;
        flex-shrink: 0;
      }
      .article-tag {
        @include flex(left);
        margin-top: 16px;
      }
      .article-cover {
        @include flex();
        align-items: start;
        margin-top: 16px;
        .cover-select-box {
          flex: 1;
          @include flex();
          .cover-box {
            position: relative;
            border: 1px dotted $colorF;
            border-radius: 6px;
            img {
              width: 160px;
              height: 90px;
            }
            .upload-box {
              @include flex(center);
              flex-direction: column;
              width: 160px;
              height: 90px;
              cursor: pointer;
              .icon-jiahao {
                font-size: $fontJ;
                margin-bottom: 4px;
              }
            }
            .icon-delete-btn {
              position: absolute;
              right: 4px;
              top: 4px;
              @include flex(center);
              width: 16px;
              height: 16px;
              border-radius: 8px;
              background-color: #252e31;
              color: $colorG;
              cursor: pointer;
            }
          }
          .cover-list-box {
            @include flex();
            flex-direction: column;
            height: 90px;
            width: 356px;
            .cover-category-list {
              @include flex();
              .cover-category-item {
                height: 22px;
                line-height: 22px;
                text-align: center;
                min-width: 60px;
                margin: 0 6px;
                border: 1px solid $colorF;
                border-radius: 4px;
                cursor: pointer;
                &:hover {
                  border: 1px solid $colorM;
                }
                &.active {
                  border: 1px solid $colorM;
                }
                &:first-child {
                  margin-left: 0;
                }
                &:last-child {
                  margin-right: 0;
                }
              }
            }
            .cover-list {
              @include flex(left);
              width: 100%;
              height: 60px;
              padding: 6px 10px;
              box-sizing: border-box;
              background-color: $colorN;
              border-radius: 6px;
              overflow-x: auto;
              overflow-y: hidden;
              &::-webkit-scrollbar {
                height: 3px;
              }
              &::-webkit-scrollbar-thumb {
                background-color: $colorF;
                border-radius: 2px;
              }
              .cover-box {
                position: relative;
                border-radius: 6px;
                background-color: $colorG;
                margin-right: 4px;
                cursor: pointer;
                img {
                  width: 80px;
                  height: 45px;
                }
                .icon-gou-box {
                  @include flex(center);
                  position: absolute;
                  top: 2px;
                  right: 2px;
                  height: 14px;
                  width: 14px;
                  border-radius: 7px;
                  background-color: #252e31;
                  color: $colorG;
                }
              }
              .cover-list-empty {
                width: 100%;
                text-align: center;
              }
            }
          }
        }
      }
      .article-summary {
        margin-top: 16px;
        @include flex(left);
        align-items: start;
        .summary-box {
          position: relative;
          flex: 1;
          textarea {
            width: 100%;
            min-height: 64px;
            padding: 6px;
            box-sizing: border-box;
            resize: none;
            border-radius: 6px;
            &::-webkit-scrollbar {
              width: 4px;
            }
            &::-webkit-scrollbar-thumb {
              background-color: $colorF;
              border-radius: 2px;
            }
          }
          .desc-box {
            position: absolute;
            right: 2px;
            bottom: 6px;
            .desc-text {
              padding: 2px;
              background-color: $colorG;
              border-radius: 10px;
            }
            .extract-btn {
              border: 1px solid $colorF;
              font-size: $fontK;
              padding: 2px 8px;
              margin-left: 8px;
              border-radius: 10px;
              background-color: $colorG;
              color: $colorB;
              cursor: pointer;
            }
          }
        }
      }
      .article-category {
        margin-top: 16px;
        @include flex(left);
        .category-select-btn {
          position: relative;
          @include flex(left);
          .selected-category-item {
            @include flex();
            padding: 2px 6px 2px 10px;
            background-color: #f4f8fc;
            border: 1px solid $colorM;
            margin-right: 8px;
            border-radius: 4px;
            color: $colorM;
            font-size: $fontK;
            .icon-delete-box {
              @include flex(center);
              width: 14px;
              height: 14px;
              border-radius: 7px;
              margin-left: 4px;
              cursor: pointer;
              &:hover {
                background-color: #267dcc;
                color: $colorG;
              }
            }
          }
          .add-btn {
            padding: 2px 10px;
            border: 1px solid $colorF;
            color: $colorD;
            border-radius: 4px;
            font-size: $fontK;
            cursor: pointer;
            &:hover {
              color: $colorM;
              background-color: #f4f8fc;
            }
            .icon-jiahao {
              font-size: $fontK;
              margin-right: 4px;
            }
          }
          .categorys-box {
            position: absolute;
            top: 120%;
            width: 540px;
            height: 170px;
            padding: 0 20px;
            box-sizing: border-box;
            background-color: $colorG;
            border: 1px solid $colorN;
            border-radius: 6px;
            box-shadow: 0 1px 1px $colorF;
            .categorys-box-header {
              position: relative;
              padding: 10px 0;
              border-bottom: 1px solid $colorF;
              .limit {
                font-size: $fontI;
                margin-right: 10px;
              }
              .desc {
                font-size: $fontJ;
                color: $colorE;
              }
              .icon-cuowu {
                position: absolute;
                right: 0;
                cursor: pointer;
                color: $colorD;
                &:hover {
                  color: $colorI;
                }
              }
            }
            .categorys-main {
              padding: 10px 0;
              .category-list {
                @include flex(left);
                flex-wrap: wrap;
                overflow-y: auto;
                &::-webkit-scrollbar {
                  width: 4px;
                }
                &::-webkit-scrollbar-thumb {
                  background-color: $colorF;
                  border-radius: 2px
                }
                .category-item {
                  @include flex();
                  margin-right: 18px;
                  margin-bottom: 10px;
                  cursor: pointer;
                  &.checked {
                    .radio {
                      background-color: #409eff;
                    }
                  }
                  .radio {
                    @include flex(center);
                    width: 14px;
                    height: 14px;
                    border: 1px solid $colorF;
                    border-radius: 4px;
                    margin-right: 4px;
                    .icon-gou {
                      color: $colorG;
                    }
                  }
                  .category-name {
                    font-size: $fontJ;
                  }
                }
                .create-category {
                  @include flex(center);
                  height: 20px;
                  width: 50px;
                  border-radius: 8px;
                  box-sizing: border-box;
                  background-color: $colorM;
                  color: $colorG;
                  &:hover {
                    background-color: $colorP;
                  }
                  .icon-jiahao {
                    font-size: $fontK;
                  }
                }
              }
            }
          }
        }
      }
      .article-declaration {
        @include flex(left);
        margin-top: 16px;
        .declaration-list {
          @include flex(left);
          .declaration-item {
            @include flex();
            margin-right: 14px;
            cursor: pointer;
            &.checked {
              color: $colorM;
              .radio {
                background-color: #409eff;
              }
            }
            .radio {
              @include flex(center);
              width: 12px;
              height: 12px;
              border-radius: 6px;
              border: 1px solid $colorF;
              margin-right: 4px;
              .inner-white {
                height: 6px;
                width: 6px;
                border-radius: 3px;
                background-color: $colorG;
              }
            }
          }
        }
      }
      .article-reprint {
        margin-top: 16px;
        padding-left: 60px;
        input {
          width: 540px;
          height: 24px;
          padding: 4px 10px;
          border: 1px solid $colorF;
          border-radius: 6px;
          box-sizing: border-box;
        }
        .reprint-desc {
          margin-top: 2px;
          color: rgb(239, 6, 6);
        }
      }
      .article-visibility {
        @include flex(left);
        margin-top: 16px;
        .visibility-box {
          @include flex(left);
          .visibility-item {
            @include flex(left);
            margin-right: 14px;
            cursor: pointer;
            &.checked {
              color: $colorM;
              .radio {
                background-color: #409eff;
              }
            }
            .radio {
              @include flex(center);
              width: 12px;
              height: 12px;
              border-radius: 6px;
              border: 1px solid $colorF;
              margin-right: 4px;
              .inner-white {
                height: 6px;
                width: 6px;
                border-radius: 3px;
                background-color: $colorG;
              }
            }
          }
        }
      }
      .article-commentable {
        @include flex(left);
        margin-top: 16px;
        .commentable-box {
          @include flex(left);
          .commentable-item {
            @include flex(left);
            margin-right: 14px;
            cursor: pointer;
            &.checked {
              color: $colorM;
              .radio {
                background-color: #409eff;
              }
            }
            .radio {
              @include flex(center);
              width: 12px;
              height: 12px;
              border-radius: 6px;
              border: 1px solid $colorF;
              margin-right: 4px;
              .inner-white {
                height: 6px;
                width: 6px;
                border-radius: 3px;
                background-color: $colorG;
              }
            }
          }
        }
      }
    }
    .modal-footer {
      @include flex(right);
      margin-top: 20px;
      .modal-footer-btn {
        width: 100px;
        height: 40px;
        border-radius: 20px;
        cursor: pointer;
      }
      .cancel-btn {
        border: 1px solid $colorF;
        color: $colorB;
        &:hover {
          background-color: $colorR;
        }
      }
      .set-time-btn {
        border: 1px solid $colorF;
        color: $colorB;
        &:hover {
          border: 1px solid $colorI;
        }
      }
      .publish-btn {
        background-color: $colorM;
        color: $colorG;
        border: none;
        margin-left: 14px;
        &:hover {
          background-color: $colorP;
        }
      }
    }
  }
</style>