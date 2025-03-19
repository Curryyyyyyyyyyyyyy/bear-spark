<template>
  <div>
    <!-- 文件上传 -->
    <input type="file" accept="video/*" @change="handleFileUpload" />
    <video ref="videoPlayer" controls style="display: none;"></video>

    <!-- 显示提取的帧 -->
    <div v-if="frames.length > 0">
      <h3>选择封面：</h3>
      <div class="frame-grid">
        <div
          v-for="(frame, index) in frames"
          :key="index"
          class="frame-item"
          :class="{ selected: selectedFrameIndex === index }"
          @click="selectFrame(index)"
        >
          <img :src="frame" alt="Frame" />
        </div>
      </div>
    </div>

    <!-- 显示选中的封面 -->
    <div v-if="selectedFrame">
      <h3>已选封面：</h3>
      <img :src="selectedFrame" alt="Selected Cover" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const videoPlayer = ref(null); // 视频元素
    const frames = ref([]); // 存储所有帧
    const selectedFrameIndex = ref(-1); // 当前选中的帧索引
    const selectedFrame = ref(''); // 当前选中的封面

    // 处理文件上传
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const videoURL = URL.createObjectURL(file);
        videoPlayer.value.src = videoURL;
        videoPlayer.value.load(); // 加载视频
        extractAllFrames(); // 提取所有帧
      }
    };

    // 提取所有帧
    const extractAllFrames = () => {
      const video = videoPlayer.value;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // 监听视频元数据加载完成
      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 定义帧间隔时间（单位：秒）
        const frameInterval = video.duration / 7; // 每3秒提取一帧
        let currentTime = 0;

        // 递归提取帧
        const extractFrame = () => {
          if (currentTime <= video.duration) {
            video.currentTime = currentTime;
            currentTime += frameInterval;
          } else {
            console.log('帧提取完成');
            return;
          }
        };

        // 监听 seeked 事件，确保视频跳转到指定时间后提取帧
        video.addEventListener('seeked', () => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL('image/png');
          console.log(imageData.length)
          frames.value.push(imageData); // 将帧数据保存到数组中
          extractFrame(); // 继续提取下一帧
        });

        // 开始提取
        extractFrame();
      });
    };

    // 选择某一帧作为封面
    const selectFrame = (index) => {
      selectedFrameIndex.value = index;
      selectedFrame.value = frames.value[index];
    };

    return {
      videoPlayer,
      frames,
      selectedFrameIndex,
      selectedFrame,
      handleFileUpload,
      selectFrame,
    };
  },
};
</script>

<style>
.frame-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.frame-item {
  border: 2px solid #ccc;
  cursor: pointer;
  transition: border-color 0.3s;
}

.frame-item.selected {
  border-color: #007bff;
}

img {
  max-width: 100%;
  height: auto;
}
</style>