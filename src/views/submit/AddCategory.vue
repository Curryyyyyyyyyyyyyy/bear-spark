<script setup>
  import BsModal from '@/components/common/BsModal.vue'
  import {uploadApi} from '@/api/file'
  import {addCategoryApi} from '@/api/article'
  import { ref } from 'vue';
  import { ElMessage } from 'element-plus';

  const emit = defineEmits(['close'])

  const categoryName = ref('')
  const categoryPhotoUrl = ref('')
  async function changePhoto(event) {
    if(event.target.files[0].size / 1024 / 1024 > 1) return ElMessage.error('图片大小不能超过1MB')
    const fd = new FormData()
    fd.append('file', event.target.files[0])
    categoryPhotoUrl.value = await uploadApi(fd, 2)
  }
  function closeModal() {
    emit('close')
  }
  async function submit() {
    if(!categoryName.value) return ElMessage.error('请输入专栏分类名称')
    if(!categoryPhotoUrl.value) return ElMessage.error('请上传专栏分类配图')
    await addCategoryApi({
      categoryName:categoryName.value,
      categoryPhotoUrl:categoryPhotoUrl.value
    })
    ElMessage.success('添加成功')
    categoryName.value = ''
    categoryPhotoUrl.value = ''
    closeModal()
  }
</script>

<template>
  <bs-modal 
    @closeModal="closeModal"
    title="新建专栏分类"
    button1Text="提交"
    @submit="submit"
  >
    <template v-slot:modal>
      <div class="add-category">
        <div class="category-title">
          <span class="category-title-text">分类专栏名称：</span>
          <input v-model="categoryName" type="text" maxlength="7" placeholder="请输入分类专栏名称（最多7个字）">
        </div>
        <div class="category-photo">
          <span class="category-photo-text">分类专栏配图：</span>
          <label v-if="categoryPhotoUrl" for="photoInput" class="photo-box">
            <img :src="categoryPhotoUrl" alt="">
          </label>
          <label v-else for="photoInput" class="upload-box">
            <i class="iconfont icon-shangchuan"></i>
            <span class="upload-box-text">点击上传图片</span>
          </label>
          <input @change="changePhoto" v-show="false" id="photoInput" type="file" accept="image/*">
        </div>
      </div>
    </template>
  </bs-modal>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .add-category {
    .category-title {
      @include flex(left);
      .category-title-text {
        font-size: $fontJ;
        color: $colorC;
      }
      input {
        flex: 1;
        height: 32px;
        padding: 4px 10px;
        border: 1px solid $colorF;
        border-radius: 6px;
        box-sizing: border-box;
      }
    }
    .category-photo {
      @include flex(left, start);
      margin-top: 20px;
      .category-photo-text {
        font-size: $fontJ;
        color: $colorC;
      }
      .photo-box {
        height: 120px;
        width: 160px;
        border: 1px solid $colorN;
        border-radius: 6px;
        cursor: pointer;
        img {
          height: 100%;
          width: 100%;
          border-radius: 6px
        }
      }
      .upload-box {
        @include flex(center);
        flex-direction: column;
        height: 120px;
        width: 160px;
        border: 1px dotted $colorF;
        border-radius: 6px;
        color: $colorD;
        cursor: pointer;
        .icon-shangchuan {
          font-size: $fontF;
        }
      }
    }
  }
</style>