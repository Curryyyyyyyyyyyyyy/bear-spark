<script setup>
  import { ref,defineEmits } from 'vue';
  import useUser from '../store/user';

  const userStore = useUser()
  let showPwd = ref(false)
  let account = ref('')
  let password = ref('')
  const emit = defineEmits(['closeLogin'])
  function closeLogin(){
    emit('closeLogin')
  }
  function register(){
    userStore.userId = account
    closeLogin()
  }
  function login(){
    userStore.userId = account
    closeLogin()
  }
</script>

<template>
  <div class="login">
    <div class="mask"></div>
    <div class="login-box">
      <div class="box-header clearfix">
        <span class="title">登录</span>
        <i @click="closeLogin" class="iconfont icon-cuowu fr"></i>
      </div>
      <div class="input-box">
        <div class="account">
          <span>账号</span>
          <input type="text" placeholder="请输入账号" v-model="account">
        </div>
        <div class="password">
          <span>密码</span>
          <input :type="showPwd ? 'text' : 'password'" placeholder="请输入密码" v-model="password">
          <i class="iconfont" @click="showPwd = !showPwd" :class="showPwd ? 'icon-yanjing' : 'icon-biyan'"></i>
        </div>
      </div>
      <button class="regBtn" @click="register">注册</button>
      <button class="logBtn" @click="login">登录</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '../assets/sass/config.scss' as *;
  .login {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: .5;
      background-color: #000000;
    }
    .login-box {
      height: 200px;
      width: 500px;
      padding: 10px 25px 20px;
      border-radius: 5px;
      background-color: $colorG;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      font-size: $fontJ;
      .box-header {
        height: 25px;
        line-height: 25px;
        margin-bottom:10px;
        text-align: center;
        .title {
          font-size: $fontI;
          font-weight: bold;
        }
        .icon-cuowu {
          font-size: 20px;
          cursor: pointer;
          transition: transform .2s;
          &:hover {
            transform: scale(1.5);
          }
        }
      }
      .input-box {
        width: 500px;
        height: 100px;
        border: 1px solid $colorF;
        border-radius: 5px;
        margin-bottom: 25px;
        .account,.password {
          height: 50px;
          line-height: 50px;
          padding: 0 10px;
          box-sizing: border-box;
          span {
            display: inline-block;
            width: 40px;
          }
          input {
            height: 40px;
            width: 400px;
            border: none;
          }
        }
        .account {
          border-bottom: 1px solid $colorF;
        }
        .password {
          .iconfont {
            font-size: $fontD;
            vertical-align: middle;
            margin-left: 5px;
            cursor: pointer;
            &:hover{
              color: $colorM;
            }
          }
        }
      }
      .regBtn,.logBtn {
        width: 245px;
        height: 40px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .regBtn {
        margin-right: 10px;
        border: 1px solid $colorF;
        background-color: $colorG;
        &:hover {
          border: 1px solid $colorM;
        }
      }
      .logBtn {
        background-color: $colorM;
        color: $colorG
      }
    }
  }
</style>