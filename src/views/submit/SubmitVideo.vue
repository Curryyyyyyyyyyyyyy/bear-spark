<script setup>
  import { onMounted, ref, watch } from 'vue'
  import SparkMD5 from 'spark-md5'
  import Loading from '@/components/common/Loading.vue'
  import { publishVideoApi } from '../../api/video'

  const chunkSize = 1024 * 1024  // 1MB
  const videoFileHash = ref(null)
  const coverFileHash = ref(null)
  const uploadedChunks = ref([])
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const isChange = ref(false)
  const videoPlayer = ref(null); // 视频元素
  const frames = ref([]); // 存储所有帧
  const loadingCover = ref(true) // 封面加载
  const selectedCoverIndex = ref(0)
  const coverData = ref(null)
  const title = ref('') // 视频标题
  const desc = ref('') // 视频简介

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
  })
  // 处理刷新页面和关闭页面
  const handleBeforeUnload = (e) => {
    e.preventDefault()
  }
  watch(selectedCoverIndex, (newValue) => {
    coverData.value = frames.value[newValue]
  })
  const handleDrop = (e) => {
    const files = e.dataTransfer.files
    if(files.lengt === 0) return
    handleUpload(files[0])
  }
  const handleChange = (e) => {
    const files = e.target.files
    if(files.lengt === 0) return
    handleUpload(files[0])
  }
  const handleUpload = async (file) => {
    loadingCover.value = true
    selectedCoverIndex.value = 0
    isChange.value = true
    uploadProgress.value = 0

    // 获取视频原始名字
    const lastDotIndex = file.name.lastIndexOf('.')
    if(lastDotIndex !== -1) {
      title.value = file.name.slice(0, lastDotIndex)
    } else {
      title.value = file.name
    }

    videoFileHash.value = await calculateFileHash(file)
    const fileKey = `uploadedChunks_${videoFileHash.value}`
    const storedChunks = localStorage.getItem(fileKey)
    if (storedChunks) {
      uploadedChunks.value = JSON.parse(storedChunks)
    }
    startUpload(file, videoFileHash.value)
    const videoURL = URL.createObjectURL(file);
    videoPlayer.value.src = videoURL;
    videoPlayer.value.load(); // 加载视频
    frames.value = []
    extractAllFrames(); // 提取所有帧
  }
  // 开始上传
  const startUpload = async (file, fileHash) => {
    if (file) {
      isUploading.value = true
      const fileKey = `uploadedChunks_${fileHash}`
      localStorage.setItem(fileKey, JSON.stringify(uploadedChunks.value))
      await uploadNextChunk(file, fileHash)
    }
  };
  // 上传下一个切片
  const uploadNextChunk = async (file, fileHash) => {
    const totalChunks = Math.ceil(file.size / chunkSize)
    for (let i = 0; i < totalChunks; i++) {
      if (!uploadedChunks.value.includes(i)) {
        const start = i * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        const chunk = file.slice(start, end)
        const formData = new FormData()
        formData.append('file', chunk)
        formData.append('chunkIndex', i)
        formData.append('totalChunks', totalChunks)
        formData.append('fileHash', fileHash)
        try {
          const response = await fetch('http://192.168.1.133:8080/chunk', {
            method: 'POST',
            body: formData
          })
          const data = await response.json()
          if (data.success) {
            uploadedChunks.value.push(i)
            const fileKey = `uploadedChunks_${fileHash}`
            localStorage.setItem(fileKey, JSON.stringify(uploadedChunks.value))
            uploadProgress.value = (uploadedChunks.value.length / totalChunks) * 100
            if (uploadedChunks.value.length === totalChunks) {
              // 所有切片上传完成
              isUploading.value = false
              uploadedChunks.value = []
              localStorage.removeItem(fileKey)
            } else {
              // 继续上传下一个切片
              await uploadNextChunk(file, fileHash)
            }
          }
        } catch (error) {
          console.error('上传失败:', error)
          isUploading.value = false
        }
        break;
      }
    }
  };
  // 计算文件哈希值
  const calculateFileHash = (file) => {
    return new Promise((resolve) => {
      const fileReader = new FileReader() // 用于读取文件内容的 API
      const spark = new SparkMD5.ArrayBuffer()
      fileReader.readAsArrayBuffer(file) // 将传入的 file 对象的内容读取为 ArrayBuffer 格式。ArrayBuffer 是一种用于表示二进制数据的对象，适合用于处理二进制文件
      fileReader.onload = (e) => {
        spark.append(e.target.result)
        const hash = spark.end()
        resolve(hash)
      }
    })
  }
  // 提取所有帧
  const extractAllFrames = () => {
    const video = videoPlayer.value
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    // 监听视频元数据加载完成
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      // 定义帧间隔时间（单位：秒）
      const frameInterval = video.duration / 7 // 提取7帧
      let currentTime = 0
      // 递归提取帧
      const extractFrame = () => {
        if (currentTime <= video.duration) {
          video.currentTime = currentTime
          currentTime += frameInterval
        } else {
          loadingCover.value = false
          coverData.value = frames.value[0]
          console.log('帧提取完成')
          return;
        }
      };

      // 监听 seeked 事件，确保视频跳转到指定时间后提取帧
      video.addEventListener('seeked', () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = canvas.toDataURL('image/png')
        frames.value.push(imageData) // 将帧数据保存到数组中
        extractFrame() // 继续提取下一帧
      });

      // 开始提取
      extractFrame()
    });
  };
  // base64转Blob
  const base64ToBlob = (base64Data) => {
    const parts = base64Data.split(';base64,')
    const mimeType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: mimeType })
  }
  // 投稿视频
  const submit = async () => {
    const blob = base64ToBlob(coverData.value)
    coverFileHash.value = await calculateFileHash(blob)
    const file = new File([blob], coverFileHash.value, {type: 'image/png'})
    startUpload(file, coverFileHash.value)
    await publishVideoApi({
      videoFileHash:videoFileHash.value,
      coverFileHash:coverFileHash.value,
      title:title.value,
      duration: videoPlayer.value.duration,
      description:desc.value
    })
  }
</script>

<template>
  <div class="bs-submit-video">
    <label 
      v-if="!isChange"
      class="upload-wrapper" 
      for="video-upload"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <div class="upload-tips">
        <i class="iconfont icon-shangchuan tip-icon"></i>
        <p class="tip-text">拖拽到此处也可上传</p>
      </div>
      <div class="upload-btn-box">
        <div class="upload-btn">上传视频</div>
      </div>
    </label>
    <div v-else class="submit-wrapper">
      <div class="submit-wrapper__header">
        <span class="submit-wrapper__header-title">发布视频</span>
      </div>
      <div class="submit-wrapper__body">
        <div class="submit-wrapper__body-card">
          <div class="body-card__icon">
            <i class="iconfont icon-shipinshangchuan"></i>
          </div>
          <div class="body-card__upload-info">
            <div class="upload-info__status">
              <div class="video-info">
                <div class="video-title">小电影</div>
                <div class="video-uploaded">
                  <i v-show="uploadProgress === 100" class="iconfont icon-gou2"></i>
                  <span class="text">{{ uploadProgress === 100 ? '上传完成' : '上传中' }}</span>
                </div>
              </div>
              <label for="video-upload" class="replace-btn">
                <i class="iconfont icon-yulanxuanzhuan"></i>
                <span class="text">更换视频</span>
              </label>
            </div>
            <div class="upload-info__progress">
              <transition>
                <div v-if="uploadProgress > 0" :style="{width: `${uploadProgress / 100 * 680}px`}" class="upload-info__progress-inner"></div>
              </transition>
            </div>
          </div>
        </div>
        <div class="submit-wrapper__body-settings">
          <div class="body-settings__header">基本设置</div>
          <div class="body-settings__body">
            <ul class="settings">
              <li class="setting-item setting-item-cover">
                <div class="setting-item-desc">
                  <p class="required">
                    <span>*</span>
                  </p>
                  <h4 class="text">封面</h4>
                </div>
                <div class="setting-item-content">
                  <div class="cover-box">
                    <img v-if="!loadingCover" :src="coverData" alt="封面">
                    <Loading v-else></Loading>
                  </div>
                  <div v-if="!loadingCover" class="cover-more">
                    <p class="cover-more-desc">系统默认选中第一帧为视频封面，以下为更多智能推荐封面</p>
                    <ul class="cover-list">
                      <li v-for="(item, index) in frames.slice(1, 4)" :key="index" @click="selectedCoverIndex = index + 1" class="cover-item selected">
                        <img :src="item" alt="封面">
                        <div v-if="selectedCoverIndex === index + 1" class="selected-mask" :class="{'selected': selectedCoverIndex === index + 1}">
                          <i class="iconfont icon-gou"></i>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li class="setting-item setting-item-title">
                <div class="setting-item-desc">
                  <p class="required">
                    <span>*</span>
                  </p>
                  <h4 class="text">标题</h4>
                </div>
                <div class="setting-item-content">
                  <input v-model="title" type="text" maxlength="50" placeholder="请输入标题">
                  <span class="title-stat">{{ title.length }}/50</span>
                </div>
              </li>
              <li class="setting-item setting-item-description">
                <div class="setting-item-desc">
                  <p class="required">
                    <span></span>
                  </p>
                  <h4 class="text">简介</h4>
                </div>
                <div class="setting-item-content">
                  <textarea v-model="desc" type="text" maxlength="100" placeholder="请输入简介"></textarea>
                  <span class="textarea-stat">{{ desc.length }}/100</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="submit-wrapper__footer">
        <button @click="submit" class="submit-btn">立即投稿</button>
      </div>
    </div>
    <input @change="handleChange" type="file" v-show="false" id="video-upload" accept="video/*">
    <video v-show="false" ref="videoPlayer" controls></video>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;

  .bs-submit-video {
    margin-top: 60px;
    padding-top: 50px;
    .upload-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 800px;
      height: 400px;
      border: 2px dashed $colorD;
      box-sizing: border-box;
      margin: 0 auto;
      cursor: pointer;
      &:hover {
        border: 2px dashed $colorM;
      }
      .upload-tips {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: $fontJ;
        color: $colorD;
        .tip-icon {
          font-size: $fontC;
          margin-bottom: 6px;
        }
      }
      .upload-btn-box {
        .upload-btn {
          border: none;
          width: 160px;
          height: 46px;
          line-height: 46px;
          text-align: center;
          background-color: $colorM;
          color: $colorG;
          border-radius: 6px;
          margin-top: 22px;
          font-size: $fontJ;
          cursor: pointer;
        }
      }
    }
    .submit-wrapper {
      width: 800px;
      background-color: $colorG;
      margin: 0 auto;
      box-sizing: border-box;
      border-radius: 4px;
      .submit-wrapper__header {
        font-size: $fontJ;
        font-weight: 550;
        padding: 20px;
        border-bottom: 1px solid $colorE;
      }
      .submit-wrapper__body {
        padding: 20px;
        .submit-wrapper__body-card {
          display: flex;
          align-items: center;
          padding: 10px;
          border-radius: 6px;
          background-color: $colorN;
          .body-card__icon {
            .iconfont {
              font-size: $fontB;
              color: $colorM;
            }
          }
          .body-card__upload-info {
            width: 680px;
            margin-left: 16px;
            .upload-info__status {
              @include flex();
              .video-info {
                .video-uploaded {
                  display: flex;
                  align-items: center;
                  font-size: 10px;
                  margin-top: 4px;
                  .iconfont {
                    color: greenyellow;
                  }
                  .text {
                    color: $colorD;
                  }
                }
              }
              .replace-btn {
                @include flex();
                color: $colorM;
                cursor: pointer;
                .iconfont {
                  margin-right: 4px;
                }
              }
            }
            .upload-info__progress {
              height: 2px;
              border-radius: 1px;
              background-color: $colorE;
              margin-top: 10px;
              .upload-info__progress-inner {
                width: 0;
                height: 2px;
                border-radius: 1px;
                background-color: greenyellow;
                transition: width;
              }
            }
          }

        }
        .submit-wrapper__body-settings {
          margin-top: 12px;
          .body-settings__header {
            padding: 10px 0;
            font-size: $fontJ;
            font-weight: 550;
          }
          .body-settings__body {
            .settings {
              .setting-item {
                @include flex(left, flex-start);
                margin-top: 24px;
                .setting-item-desc {
                  display: inline-flex;
                  align-items: center;
                  font-size: $fontJ;
                  padding-right: 80px;
                  .required {
                    color: #ff3b30;
                    font-size: $fontH;
                    line-height: $fontH;
                    width: 12px;
                  }
                  .text {
                    font-weight: 400;
                    line-height: 21px;
                  }
                }
                &.setting-item-cover {
                  .setting-item-content {
                    display: flex;
                    align-items: end;
                    .cover-box {
                      width: 160px;
                      height: 120px;
                      @include flex(center);
                      margin-right: 24px;
                      img {
                        width: 160px;
                        height: 120px;
                        border-radius: 6px;
                      }
                    }
                    .cover-more {
                      .cover-more-desc {
                        font-size: $fontK;
                        color: $colorD;
                        margin-bottom: 10px
                      }
                      .cover-list {
                        @include flex(left);
                        .cover-item {
                          position: relative;
                          width: 120px;
                          height: 80px;
                          margin-right: 10px;
                          cursor: pointer;
                          img {
                            width: 100%;
                            height: 100%;
                            border-radius: 6px;
                          }
                          &.selected {
                            .selected-mask {
                              @include flex(center, center);
                              position: absolute;
                              left: 0;
                              top: 0;
                              width: 100%;
                              height: 100%;
                              border-radius: 6px;
                              background-color: rgba(0, 0, 0, .5);
                              border: 1px solid $colorM;
                              .iconfont {
                                font-size: $fontD;
                                color: $colorM;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                &.setting-item-title {
                  .setting-item-content {
                    position: relative;
                    input {
                      width: 560px;
                      height: 30px;
                      border: 1px solid $colorD;
                      border-radius: 4px;
                      padding: 0 8px;
                      &:hover, &:focus {
                        border: 1px solid $colorM;
                      }
                    }
                    .title-stat {
                      position: absolute;
                      display: inline-block;
                      height: 30px;
                      line-height: 30px;
                      right: 6px;
                      color: $colorD;
                    }
                  }
                }
                &.setting-item-description {
                  .setting-item-content {
                    position: relative;
                    textarea {
                      width: 560px;
                      height: 60px;
                      border: 1px solid $colorD;
                      border-radius: 4px;
                      padding: 8px;
                      resize: none;
                      &:hover, &:focus {
                        border: 1px solid $colorM;
                      }
                    }
                    .textarea-stat {
                      position: absolute;
                      display: inline-block;
                      height: 30px;
                      line-height: 30px;
                      bottom: 0;
                      right: 6px;
                      color: $colorD;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .submit-wrapper__footer {
        text-align: center;
        padding: 20px;
        padding-top: 40px;
        .submit-btn {
          width: 120px;
          height: 40px;
          background-color: $colorM;
          color: $colorG;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          &:hover {
            background-color: $colorP;
          }
        }
      }
    }
  }
</style>