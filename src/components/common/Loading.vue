<script setup>

</script>

<template>
  <div class="bs-loading">
    <div class="box">
      <div class="coin"></div>
    </div>
  </div>
</template>

<style lang="scss">
  .bs-loading {
    display: flex;
    justify-content: center;
    .box {
      perspective: 120px;
      .coin {
        width: 2em;
        height: 2em;
        border-radius: 50%;
        border: 4px solid #3cefff;
        animation: spin 1.5s ease-in-out infinite;
      }
    }
  }
  @keyframes spin {
    to {
      transform: rotateY(540deg);
    }
  }
</style>