<script setup>
  import SubmitArticleModal from '@/views/submit/SubmitArticleModal.vue'
  import '@wangeditor/editor/dist/css/style.css' // 引入 css
  import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import {uploadApi} from '@/api/file.js'
  import {saveDraftApi,getDraftInfoApi,getArticleInfoApi} from '@/api/article'
  import { ElMessage } from 'element-plus';
  import { useRoute } from 'vue-router'

  /* route */
  const route = useRoute()
  /* onMounted */
  const draftId = ref(null)
  const articleId = ref('')
  const articleInfo = ref('')
  onMounted(async () => {
    await nextTick()
    draftId.value = route.query.draftId
    articleId.value = route.query.articleId
    if(draftId.value) {
      const draftInfo = await getDraftInfoApi({
        draftId:draftId.value
      })
      title.value = draftInfo.title
      editorRef.value.setHtml(draftInfo.content)
    }
    if(articleId.value) {
      articleInfo.value = await getArticleInfoApi({
        articleId:articleId.value
      })
      title.value = articleInfo.value.title
      editorRef.value.setHtml(articleInfo.value.content)
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
  })
  function handleBeforeUnload(e) {
    e.preventDefault()
  }
  //#region 编辑器
  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef()
  const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
  }
  const mode = ref('default')
  // 内容 HTML
  const contentHtml = ref('')
  /* 工具栏配置 */
  const toolbarConfig = {
    excludeKeys:[
      "fullScreen",
      "insertVideo",
      "uploadVideo",
    ]
  }
  /* 编辑器配置 */
  const editorConfig = {placeholder:'请输入内容...',MENU_CONF:{}}
  /* 插入图片 */
  editorConfig.MENU_CONF['uploadImage'] = {
    // form-data fieldName ，默认值 'wangeditor-uploaded-image'
    fieldName: 'file',
    // 单个文件的最大体积限制，默认为 2M
    maxFileSize: 1 * 1024 * 1024, // 1M
    // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
    allowedFileTypes: ['image/*'],
    // 自定义增加 http  header
    headers: {
      'Content-Type':'multipart/form-data'
    },
    // 超时时间，默认为 10 秒
    timeout: 5 * 1000, // 5 秒
    // 自定义上传
    async customUpload(file, insertFn) {
      // file 即选中的文件
      const fd = new FormData()
      fd.append('file',file)
      // 自己实现上传，并得到图片 url alt href
      const url = await uploadApi(file, 1)
      // 最后插入图片
      insertFn(url)
    },
  }
  //#endregion
  //#region 保存和发布
  const showSubmitModal = ref(false)
  const title = ref('')
  const contentText = ref('')
  const contentImgList = ref([])
  async function saveDraft() {
    if(!title.value) return ElMessage.error('标题不能为空')
    if(editorRef.value.isEmpty()) return ElMessage.error('内容不能为空')
    contentText.value = editorRef.value.getText()
    draftId.value = await saveDraftApi({
      draftId:draftId.value,
      title:title.value,
      content:contentHtml.value
    })
    ElMessage.success('保存成功')
  }
  function publishArticle() {
    if(!title.value) return ElMessage.error('标题不能为空')
    if(editorRef.value.isEmpty()) return ElMessage.error('内容不能为空')
    showSubmitModal.value = true
    contentText.value = editorRef.value.getText()
    contentImgList.value = editorRef.value.getElemsByType('image')
  }
  //#endregion
  
  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
</script>

<template>
  <div class="bs-submit-article">
    <div class="editor-box">
      <Toolbar
        style=
        "
          border-bottom: 1px solid #e8e8e8;
          width: 100%;
          position: sticky;
          top: 60px;
          z-index: 10;
        "
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <div class="editor-input-box">
        <div class="title-editor">
          <div class="input-box">
            <input v-model="title" maxlength="100" type="text" placeholder="请输入文字标题（100字以内）">
          </div>
        </div>
        <Editor
          class="content-editor"
          style="height: 1000px; overflow-y: hidden;"
          v-model="contentHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
        />
      </div>
    </div>
    <div class="bs-submit-footer">
      <div class="bs-submit-wrap">
        <div class="total">
          <span class="total-count">共 6 字</span>
        </div>
        <div class="tools">
          <button @click="saveDraft" class="save-btn">保存草稿</button>
          <button @click="publishArticle" class="publish-btn">提交文章</button>
        </div>
      </div>
    </div>
  </div>
  <submit-article-modal 
    v-if="showSubmitModal" 
    @close="showSubmitModal = false"
    :title="title"
    :contentHtml="contentHtml"
    :contentText="contentText"
    :contentImgList="contentImgList"
    :articleId="articleId"
    :articleInfo="articleInfo"
  >
  </submit-article-modal>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .bs-submit-article {
    padding-bottom: 90px;
    .editor-box {
      .w-e-bar.w-e-bar-show.w-e-toolbar {
        justify-content: center;
        background-color:#f5f5f5;
      }
      .editor-input-box {
        padding: 0 340px;
        margin-top: 26px;
        border-radius: 4px;
        .title-editor {
          margin: 0 auto;
          padding: 0 26px;
          background-color: $colorG;
          .input-box {
            width: 100%;
            padding: 30px 0;
            border-bottom: 1px solid $colorF;
            input {
              width: 100%;
              border: none;
              font-size: $fontG;
            }
          }
        }
        .content-editor {
          .w-e-text-container {
            [data-slate-editor] {
              padding: 0 26px;
            }
            .w-e-text-placeholder {
              left: 26px;
              top: 15px;
              font-size: $fontI;
            }
          }
        }
      }
    }
    .bs-submit-footer {
      @include flex(center);
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1px solid $colorN;
      box-sizing: border-box;
      background-color: $colorG;
      .bs-submit-wrap {
        @include flex();
        height: 64px;
        width: 880px;
        .total {
          color: $colorD;
          font-size: $fontJ;
        }
        .tools {
          .save-btn,.publish-btn {
            width: 100px;
            height: 40px;
            border-radius: 20px;
            border: none;
            cursor: pointer;
          }
          .save-btn {
            border: 1px solid $colorE;
            color: $colorD;
            &:hover {
              background-color: $colorN;
            }
          }
          .publish-btn {
            background-color: $colorM;
            color: $colorG;
            margin-left: 15px;
            &:hover {
              background-color: $colorP;
            }
          }
        }
      }
    }
  }
</style>