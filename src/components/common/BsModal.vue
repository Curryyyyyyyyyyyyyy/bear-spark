<script setup>
  const props = defineProps(['title','button1Text','button1BackgroundColor','button2Text','button2BackgroundColor','button1Color','button2Color','buttonNum'])
  const emit = defineEmits(['closeModal','submit','cancel'])
  function closeModal() {
    emit('closeModal')
  }
  function handleClickBtn2() {
    emit('cancel')
  }
  function handleClickBtn1() {
    emit('submit')
  }
</script>

<template>
  <div class="bs-modal">
    <div class="mask"></div>
    <div class="modal-box">
      <div class="modal-header">
        <span class="title">{{ props.title }}</span>
        <i @click="closeModal" class="iconfont icon-cuowu"></i>
      </div>
      <div class="modal-body">
        <slot name="modal"></slot>
      </div>
      <div v-if="buttonNum !== '0'" class="modal-footer">
        <button v-if="buttonNum === '2'" @click="handleClickBtn2" :style="{backgroundColor:button2BackgroundColor,color:button2Color}">{{ props.button2Text || '取消' }}</button>
        <button @click="handleClickBtn1" :style="{backgroundColor:button1BackgroundColor,color:button1Color}">{{ props.button1Text || '完成' }}</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  .bs-modal {
    .mask {
      z-index: 2000;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-color: $colorI;
      opacity: .5;
    }
    .modal-box {
      z-index: 2001;
      position: fixed;
      top: 50%;
      left: 50%;
      width: 560px;
      transform: translate(-50%,-50%);
      background-color: $colorG;
      border-radius: 6px;
      .modal-header {
        position: relative;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid $colorF;
        .title {
          font-weight: bold;
          font-size: $fontI;
        }
        .icon-cuowu {
          position: absolute;
          right: 20px;
          font-size: $fontF;
          color: $colorD;
          cursor: pointer;
          transition: transform .3s;
          &:hover {
            transform: scale(1.5);
          }
        }
      }
      .modal-body {
        max-height: 420px;
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 20px 40px;
        box-sizing: border-box;
      }
      .modal-body::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      .modal-body::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: $colorF;
      }
      .modal-footer {
        height: 60px;
        width: 560px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        border-top: 1px solid $colorF;
        button {
          width: 140px;
          height: 40px;
          border: none;
          background-color: $colorM;
          border-radius: 6px;
          color: $colorG;
          cursor: pointer;
        }
      }
    }
  }
</style>