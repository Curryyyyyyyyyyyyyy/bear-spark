<script setup>
  const props = defineProps(['label','value'])
</script>

<template>
  <div class="bs-option" :data-option-value="props.value">{{ props.label }}</div>
</template>

<style lang="scss">
  .bs-option {
    width: 100%;
    height: 36px;
    line-height: 36px;
    padding: 0 15px;
    color: #999999;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    &:hover {
      background-color: #f1f2f3;
    }
  }
</style>