<script setup>
  import { ElDatePicker, ElSelect, ElOption, dayjs, ElMessage } from 'element-plus';
  import {hourOptions, minuteOptions} from '../../hooks/timeOptions'
  import { ref } from 'vue';
  import { timeFormat } from '@/hooks/timeFormat';

  const emit = defineEmits(['close','publishArticle'])

  function close() {
    emit('close')
  }
  /* 禁用某些日期 */
  const disabledPubDate = (time) => {
    return time.getTime() < Date.now() - 8.64e7 || time.getTime() > Date.now() + 7 * 8.64e7
  }
  const publishDate = ref('')
  const publishHour = ref()
  const publishMinute = ref()
  const pubHourOptions = ref([...hourOptions])
  const pubMinuteOptions = ref([...minuteOptions])
  function changePubDate() {
    const date = dayjs(publishDate.value)
    if(date.$D === new Date().getDate()) {
      if(new Date().getMinutes() >= 55) {
        pubHourOptions.value.splice(0, new Date().getHours() + 1)
      } else {
        pubHourOptions.value.splice(0, new Date().getHours())
      }
    } else {
      pubHourOptions.value = [...hourOptions]
      pubMinuteOptions.value = [...minuteOptions]
    }
    publishHour.value = ''
    publishMinute.value = ''
  }
  function changePubHour() {
    const date = dayjs(publishDate.value)
    if(date.$D === new Date().getDate() && +publishHour.value === new Date().getHours()) {
      pubMinuteOptions.value.splice(0, new Date().getMinutes() + 5)
    } else {
      pubMinuteOptions.value = [...minuteOptions]
    }
    publishMinute.value = ''
  }
  const defaultTime = dayjs(new Date().getTime() + 86400000)
  publishDate.value = defaultTime.format('YYYY-MM-DD')
  function publish() {
    if(!publishDate.value || !publishHour.value || !publishMinute.value) return ElMessage.error('请将发布时间填写完整')
    const pubTime = timeFormat(publishDate.value,publishHour.value,publishMinute.value)
    emit('publishArticle',pubTime)
  }
</script>

<template>
  <div class="set-time-mask"></div>
  <div class="set-time-submit">
    <div class="header">
      <div class="title">定时发布</div>
      <i @click="close" class="iconfont icon-cuowu"></i>
    </div>
    <div class="main">
      <div class="desc">请选择当前时间后 5分钟 至 7天 进行定时发布</div>
      <div class="time-box">
        <el-date-picker
          v-model="publishDate"
          type="date"
          placeholder="日期"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledPubDate"
          @change="changePubDate"
          style="width: 176px;"
        />
        <el-select v-model="publishHour" @change="changePubHour" placeholder="时" style="width: 80px">
          <el-option
            v-for="item in pubHourOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select v-model="publishMinute" placeholder="分" style="width: 80px">
          <el-option
            v-for="item in pubMinuteOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="footer">
      <button @click="close" class="footer-btn cancel-btn">取消</button>
      <button @click="publish" class="footer-btn publish-btn">发布</button>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/sass/config.scss' as *;
  @use '@/assets/sass/mixin.scss' as *;
  .set-time-mask {
    z-index: 1100;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: $colorI;
    opacity: .5;
  }
  .set-time-submit {
    z-index: 1101;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -100%);
    background-color: $colorG;
    width: 420px;
    padding: 15px 25px;
    border-radius: 6px;
    box-sizing: border-box;
    .header {
      @include flex();
      position: relative;
      .title {
        font-size: $fontI;
      }
      .icon-cuowu {
        position: absolute;
        right: 0;
        font-size: $fontH;
        color: $colorD;
        cursor: pointer;
        transition: all .2s;
        &:hover {
          transform: scale(1.3);
        }
      }
    }
    .main {
      margin-top: 20px;
      .time-box {
        margin-top: 12px;
        .el-select {
          margin-left: 16px;
        }
      }
    }
    .footer {
      @include flex(right);
      margin-top: 16px;
      .footer-btn {
        height: 30px;
        width: 70px;
        border-radius: 15px;
        cursor: pointer;
        &.cancel-btn {
          border: 1px solid $colorF;
          color: $colorD;
          &:hover {
            background-color: $colorR;
          }
        }
        &.publish-btn {
          border: none;
          background-color: $colorM;
          color: $colorG;
          margin-left: 10px;
          &:hover {
            background-color: $colorP;
          }
        }
      }
    }
  }
</style>