<script setup>
  import { ref } from 'vue';
  const emit = defineEmits(['update:modelValue'])
  const props = defineProps(['placeholder'])
  const selectInputDom = ref()
  const showOptions = ref(false)
  const selectLabel = ref('')
  function focusSelect() {
    selectInputDom.value.focus()
    showOptions.value = true
  }
  function blurSelect() {
    setTimeout(()=>{
      showOptions.value = false
    },100)
  }
  function selectOption(event) {
    selectLabel.value = event.target.innerText
    emit('update:modelValue', event.target.dataset.optionValue)
  }
</script>

<template>
  <div class="bs-select">
    <div class="bs-select-box">
      <div @blur="blurSelect" @click="focusSelect" :class="{'active':showOptions}" tabindex="1" ref="selectInputDom" class="bs-select-input">
        <span class="bs-select-value">{{ selectLabel || props.placeholder }}</span>
        <i class="iconfont icon-down"></i>
      </div>
      <div @click="selectOption" v-if="showOptions" class="bs-option-list">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .bs-select {
    .bs-select-box {
      position: relative;
      .bs-select-input {
        position: relative;
        display: flex;
        align-items: center;
        width: 400px;
        height: 40px;
        padding: 0 10px;
        border: 1px solid #e3e5e7;
        border-radius: 6px;
        box-sizing: border-box;
        background-color: #ffffff;
        cursor: pointer;
        .bs-select-value {
          font-size: 14px;
        }
        .icon-down {
          position: absolute;
          right: 5px;
          top: 6px;
          font-size: 22px; 
          color: #a4a9ae;
          transition: all .3s;
        }
      }
      .active {
        border: 1px solid #3280ef;
        .icon-down {
          transform: rotate(180deg);
        }
      }
      .bs-option-list {
        z-index: 10;
        position: absolute;
        top: 110%;
        width: 400px;
        max-height: 130px;
        padding: 10px 0;
        border: 1px solid #e3e5e7;
        border-radius: 6px;
        box-sizing: border-box;
        background-color: #ffffff;
        overflow-x: hidden;
        overflow-y: auto;
      }
      .bs-option-list::-webkit-scrollbar {
        width: 4px;
      }
      .bs-option-list::-webkit-scrollbar-thumb {
        background-color: #d7d7d7;
        border-radius: 2px;
      }
    }
  }
</style>