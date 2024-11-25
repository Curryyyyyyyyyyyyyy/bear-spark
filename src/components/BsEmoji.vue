<script setup>
  import { ref } from 'vue';
  const emojiImgList = ref([
    'beaming-face-with-smiling-eyes',
    'cold-face',
    'confused-face',
    'drooling-face',
    'enraged-face',
    'face-blowing-a-kiss',
    'face-exhaling',
    'face-holding-back-tears',
    'face-savoring-food',
    'face-screaming-in-fear',
    'face-vomiting',
    'face-with-crossed-out-eyes',
    'face-with-hand-over-mouth',
    'face-with-head-bandage',
    'face-with-medical-mask',
    'face-with-monocle',
    'face-with-peeking-eye',
    'face-with-raised-eyebrow',
    'face-with-rolling-eyes',
    'face-with-spiral-eyes',
    'face-with-steam-from-nose',
    'face-with-symbols-on-mouth',
    'face-with-tears-of-joy',
    'face-with-thermometer',
    'face-with-thermometer',
    'face-with-tongue',
    'face-without-mouth',
    'fearful-face',
    'flexed-biceps',
    'flushed-face',
    'folded-hands',
    'frowning-face',
    'ghost',
    'grimacing-face',
    'grinning-face-with-sweat',
    'grinning-face',
    'grinning-squinting-face',
    'hand-with-index-finger-and-thumb-crossed',
    'head-shaking-horizontally',
    'hear-no-evil-monkey',
    'heart-with-arrow',
    'heart-with-ribbon',
    'hot-face',
    'hundred-points',
    'hushed-face',
    'kiss-mark',
    'kissing-face',
    'love-letter',
    'melting-face',
    'mending-heart',
    'money-mouth-face',
    'nerd-face',
    'neutral-face',
    'OK-hand',
    'oudly-crying-face',
    'partying-face',
    'pensive-face',
    'pile-of-poo',
    'pinched-fingers',
    'pinching-hand',
    'pleading-face',
    'raised-fist',
    'red-heart',
    'relieved-face',
    'rolling-on-the-floor-laughing',
    'sad-but-relieved-face',
    'saluting-face',
    'ear',
    'see-no-evil-monkey',
    'shushing-face',
    'skull-and-crossbones',
    'skull',
    'sleeping-face',
    'sleepy-face',
    'slightly-smiling-face',
    'smiling-face-with-halo',
    'smiling-face-with-heart-eyes',
    'smiling-face-with-hearts',
    'smiling-face-with-horns',
    'smiling-face-with-open-hands',
    'smiling-face-with-smiling-eyes',
    'smiling-face-with-sunglasses',
    'smirking-face',
    'speak-no-evil-monkey',
    'sweat-droplets',
    'thinking-face',
    'thumbs-down',
    'thumbs-up',
    'unamused-face',
    'upside-down-face',
    'victory-hand',
    'winking-face-with-tongue',
    'winking-face',
    'woozy-face',
    'worried-face',
    'zipper-mouth-face',
    'anger-symbol',
    'beating-heart',
    'broken-heart',
    'call-me-hand',
    'clown-face',
  ])
  const emit = defineEmits(['insertEmoji'])
  function insertEmoji(event) {
    let emojiUrl
    if(event.target.tagName === 'LI') {
      emojiUrl = event.target.childNodes[0].src.split('/')
    } else {
      emojiUrl = event.target.src.split('/')
    }
    emit('insertEmoji', emojiUrl[emojiUrl.length-1])
  }
</script>

<template>
  <div class="bs-emoji">
    <ul class="bs-emoji-list">
      <li @click="insertEmoji" class="bs-emoji-item" v-for="(item,index) in emojiImgList" :key="index">
        <img v-lazy="'/imgs/emojis/' + item + '.png'" alt="表情">
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  .bs-emoji {
    display: flex;
    flex-direction: column;
    width: 384px;
    height: 252px;
    padding: 5px 4px 5px 12px;
    border: 1px solid $colorE;
    box-sizing: border-box;
    border-radius: 6px;
    box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.17);
    .bs-emoji-list {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      overflow: auto;
      .bs-emoji-item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 6px;
        &:hover {
          background-color: $colorL;
        }
        img {
          width: 26px;
          height: 26px;
          user-select: none;
        }
      }
    }
    .bs-emoji-list::-webkit-scrollbar {
      width: 4px;
    }
    .bs-emoji-list::-webkit-scrollbar-thumb {
      background-color: $colorE;
      border-radius: 2px;
    }
  }
</style>