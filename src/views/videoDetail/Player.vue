<script setup>
  import Artplayer from 'artplayer';
  import Hls from 'hls.js';
  import artplayerPluginHlsControl from 'artplayer-plugin-hls-control'
  import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
  import { nextTick, onMounted, ref, watch } from 'vue';
  import {sendDanmuApi, getDanmuListApi} from '@/api/video'

  const props = defineProps(['videoUrl', 'videoId'])

  const playRef = ref(null)
  const danmuList = ref([])
  var art
  onMounted(async () => {
    await nextTick()
    danmuList.value = await getDanmuListApi({
      videoId: props.videoId
    })
    if (props.videoUrl) {
      if (art) {
        art.destroy();
      }
      initArtplayer();
    }
  })
  watch(() => props.videoUrl, (newValue) => {
  if (newValue) {
    initArtplayer();
  }
})
  const initArtplayer = () => {
    /* 关闭右键菜单 */
    Artplayer.CONTEXTMENU = false
    art = new Artplayer({
      container: '.play-style',
      url: props.videoUrl,
      settings:[
        // {
        //   html: 'Quality',
        //   width: 150,
        //   tooltip: '1080P',
        //   selector: [
        //     {
        //       default: true,
        //       html: '1080P',
        //       url: '/assets/sample/video.mp4?id=1080',
        //     },
        //     {
        //       html: '720P',
        //       url: '/assets/sample/video.mp4?id=720',
        //     },
        //     {
        //       html: '360P',
        //       url: '/assets/sample/video.mp4?id=360',
        //     },
        //   ],
        //   onSelect: function (item, $dom, event) {
        //     console.info(item, $dom, event);
        //     art.switchQuality(item.url, item.html);
        //     return item.html;
        //   },
        // },
      ],
      plugins: [
        artplayerPluginHlsControl({
          // quality: {
          //   // Show qualitys in control
          //   control: true,
          //   // Show qualitys in setting
          //   setting: true,
          //   // Get the quality name from level
          //   getName: (level) => level.height + 'P',
          //   // I18n
          //   title: 'Quality',
          //   auto: 'Auto',
          // },
          audio: {
            // Show audios in control
            control: true,
            // Show audios in setting
            setting: true,
            // Get the audio name from track
            getName: (track) => track.name,
            // I18n
            title: 'Audio',
            auto: 'Auto',
          }
        }),
        artplayerPluginDanmuku({
          danmuku: danmuList.value,
          async beforeEmit(danmu) {
            const isDirty = (/fuck/i).test(danmu.text);
            if (isDirty) return false;
            await sendDanmuApi({
              ...danmu,
              videoId:props.videoId
            });
            return true;
          },
          filter(danmu) {
            return danmu.text.length <= 30;
          },
          async beforeVisible() {
            return true;
          },
        }),
      ],
      customType: {
        m3u8: function playM3u8(video, url, art) {
          if (Hls.isSupported()) {
            if (art.hls) art.hls.destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;
            art.on('destroy', () => hls.destroy());
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          } else {
            art.notice.show = 'Unsupported playback format: m3u8';
          }
        }
      },
      setting: true,
      theme: '#3280ef',    // 主题
      volume: 0.7,         // 默认音量
      fullscreen: true,    // 播放器全屏
      fullscreenWeb: true, // 网页全屏
      playbackRate: true,  // 播放速度
      aspectRatio: true,   // 比例
      screenshot: true,    // 截图
    });
  }
</script>

<template>
  <div class="play-panel">
    <div class="play-style" ref="playRef"></div>
  </div>
</template>

<style lang="scss">
  .play-panel {
    margin: 0 auto;
    .play-style {
      margin: 0 auto;
      width: 100%;
      height: 535px;
    }
  }
</style>