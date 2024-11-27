<script setup>
  import { ref } from 'vue';
  import {loginApi,sendVEcodeApi,verifyVEcodeApi,registerPwdApi,modifyPwdApi} from '@/api/user.js'
  import {regPhone,regPwd,regVEcode} from '@/util/reg.js'
  import useUser from '../store/user';
  import { ElMessage } from 'element-plus';

  let showPwd = ref(false)
  let curWay = ref(0)
  let isReg = ref(false)

  const inputBigBox = ref()
  const emit = defineEmits(['closeLogin'])
  function closeLogin(){
    emit('closeLogin')
  }

  let registerPhoneNum = ref('')
  let registerVEcode = ref('')
  async function register(){
    if(!regPhone(registerPhoneNum.value)) return alert('请输入正确的手机号')
    if(!regVEcode(registerVEcode.value)) return alert('请输入正确的验证码')
    await verifyVEcodeApi(registerPhoneNum.value,registerVEcode.value)
    registerPhoneNum.value = ''
    registerVEcode.value = ''
    inputBigBox.value.style.transform = `translateX(${(-3)*375}px)`
    curWay.value = 3
    isReg.value = true
  }

  let phone = ref('')
  let password = ref('')
  const userStore = useUser()
  async function login(){
    if(!regPhone(phone.value)) return alert('请输入正确的手机号')
    if(!regPwd(password.value)) return alert('密码只能由数字、字母、下划线，6~16位')
    const res = await loginApi(phone.value, password.value)
    userStore.token = res.token
    ElMessage({
      type:'success',
      message:'登录成功',
      duration:1000
    })
    closeLogin()
  }

  let registerCountDown = ref(60)
  let findCountDown = ref(60)
  let timer
  async function sendVEcode(phoneNum,way) {
    if(!regPhone(phoneNum)) return
    await sendVEcodeApi(phoneNum)
    if(way === 'register') {
      timer = setInterval(() => {
        if(registerCountDown.value === 0) {
          registerCountDown.value = 60
          clearInterval(timer)
          return
        }
        console.log(11)
        registerCountDown.value = registerCountDown.value-1
      }, 1000);
    } else {
      timer = setInterval(() => {
        if(findCountDown.value === 0) {
          findCountDown.value = 60
          clearInterval(timer)
          return
        }
        findCountDown.value = findCountDown.value-1
      }, 1000);
    }
  }

  let findPhoneNum = ref('')
  let findVEcode = ref('')
  async function submit() {
    if(!regPhone(findPhoneNum.value)) return alert('请输入正确的手机号')
    if(!regVEcode(findVEcode.value)) return alert('请输入正确的验证码')
    findPhoneNum.value = ''
    findVEcode.value = ''
    await verifyVEcodeApi(findPhoneNum.value,findVEcode.value)
    inputBigBox.value.style.transform = `translateX(${(-3)*375}px)`
    curWay.value = 3
    isReg.value = false
  }

  let newPassword1 = ref('')
  let newPassword2 = ref('')
  async function confirm(isReg){
    if(newPassword1.value !== newPassword2.value) return alert('密码不一致！')
    if(!regPwd(newPassword1.value)) return alert('密码只能由数字、字母、下划线，6~16位')
    if(isReg) {
      await registerPwdApi(registerPhoneNum.value,newPassword2.value)
      ElMessage({
        type:'success',
        message:'注册成功，请登录',
        duration:1000
      })
    } else {
      await modifyPwdApi(findPhoneNum.value,newPassword2.value)
      ElMessage({
        type:'success',
        message:'修改成功，请重新登录',
        duration:1000
      })
    }
    newPassword1.value = ''
    newPassword2.value = ''
    inputBigBox.value.style.transform = `translateX(0)`
    curWay.value = 0
    changeWay(curWay.value)
  }

  const markWay = ref()
  function changeWay(pos){
    markWay.value.style.left = `${51 + pos*116}px`
    inputBigBox.value.style.transform = `translateX(${(-pos)*375}px)`
    curWay.value = pos
  }
</script>

<template>
  <div class="login">
    <div class="mask"></div>
    <div class="login-box">
      <div class="box-header clearfix">
        <span class="logo"></span>
        <i @click="closeLogin" class="iconfont icon-cuowu fr"></i>
      </div>
      <div class="way">
        <button><span @click="changeWay(0)">密码登录</span></button>
        <button class="way-reg"><span @click="changeWay(1)">注册账号</span></button>
        <button><span @click="changeWay(2)">找回密码</span></button>
      </div>
      <div class="mark-way" ref="markWay"></div>
      <div ref="inputBigBox" class="input-big-box">
        <div class="input-box">
          <div class="phone">
            <input type="text" placeholder="手机号" v-model="phone">
          </div>
          <div class="password">
            <input :type="showPwd ? 'text' : 'password'" placeholder="密码" v-model="password">
            <button class="eyeBtn"><i class="iconfont" @click="showPwd = !showPwd" :class="showPwd ? 'icon-yanjing' : 'icon-biyan'"></i></button>
          </div>
        </div>
        <div class="input-box">
          <div class="phoneNum">
            <span>+86</span>
            <input type="text" placeholder="请输入手机号" v-model="registerPhoneNum">
            <button v-if="registerCountDown === 60" :class="{'active':regPhone(registerPhoneNum)}" @click="sendVEcode(registerPhoneNum,'register')">获取验证码</button>
            <button v-else>重新获取({{ registerCountDown }})</button>
          </div>
          <div class="VEcode">
            <span>验证码</span>
            <input type="text" placeholder="请输入验证码" v-model="registerVEcode">
          </div>
        </div>
        <div class="input-box">
          <div class="phoneNum">
            <span>+86</span>
            <input type="text" placeholder="请输入手机号" v-model="findPhoneNum">
            <button v-if="findCountDown === 60" :class="{'active':regPhone(findPhoneNum)}" @click="sendVEcode(findPhoneNum,'find')">获取验证码</button>
            <button v-else>重新获取({{ findCountDown }})</button>
          </div>
          <div class="VEcode">
            <span>验证码</span>
            <input type="text" placeholder="请输入验证码" v-model="findVEcode">
          </div>
        </div>
        <div class="input-box">
          <div class="mod-password mod-password1">
            <input :type="showPwd ? 'text' : 'password'" placeholder="请输入密码" v-model="newPassword1">
          </div>
          <div class="mod-password mod-password2">
            <input :type="showPwd ? 'text' : 'password'" placeholder="请再次输入密码" v-model="newPassword2">
            <button class="eyeBtn"><i class="iconfont" @click="showPwd = !showPwd" :class="showPwd ? 'icon-yanjing' : 'icon-biyan'"></i></button>
          </div>
        </div>
      </div>
      <button v-if="curWay === 0" class="logBtn" @click="login">登录</button>
      <button v-if="curWay === 1" class="regBtn" @click="register">注册</button>
      <button v-if="curWay === 2" class="subBtn" @click="submit">提交</button>
      <button v-if="curWay === 3" class="confirmBtn" @click="confirm(isReg)">确认</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '../assets/sass/config.scss' as *;
  @use '../assets/sass/mixin.scss' as *;
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
      // height: 335px;
      width: 350px;
      padding: 10px 25px 20px;
      border-radius: 5px;
      background-color: $colorG;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      font-size: $fontJ;
      overflow: hidden;
      .box-header {
        height: 40px;
        line-height: 40px;
        margin-bottom:10px;
        text-align: center;
        .logo {
          @include bgImg(40px,40px,'/imgs/logo.png',80px);
          transform: translateX(9px);
        }
        .icon-cuowu {
          font-size: 20px;
          cursor: pointer;
          transition: transform .2s;
          color: $colorB;
          &:hover {
            transform: scale(1.5);
          }
        }
      }
      .way {
        padding-bottom: 5px;
        button {
          width: 116px;
          border: none;
          font-size: $fontI;
          cursor: pointer;
          padding: 0 10px
        }
        .way-reg {
          border-left: 2px solid $colorF;
          border-right: 2px solid $colorF;
        }
      }
      .mark-way {
        position: absolute;
        left: 51px;
        height: 2px;
        width: 64px;
        background-color: $colorP;
        transition: left .27s;
      }
      .input-big-box {
        display: flex;
        margin-top: 15px;
        margin-bottom: 25px;
        transition: all .5s;
      }
      .input-box {
        width: 350px;
        height: 100px;
        border: 1px solid $colorF;
        box-sizing: border-box;
        border-radius: 5px;
        margin-right: 25px;
        .phone,.password,.phoneNum,.VEcode,.mod-password {
          height: 50px;
          line-height: 50px;
          padding: 0 15px;
          box-sizing: border-box;
          span {
            display: inline-block;
            width: 60px;
          }
          input {
            height: 40px;
            border: none;
          }
        }
        .phone {
          border-bottom: 1px solid $colorF;
          input {
            width: 320px;
          }
        }
        .password,.mod-password2 {
          input {
            width: 280px;
          }
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
        .phoneNum {
          width: 350px;
          border-bottom: 1px solid $colorF;
          input {
            width: 160px;
          }
          button {
            border: none;
            padding-left: 20px;
            border-left: 1px solid $colorF;
            background-color: transparent;
            color: $colorE;
            cursor: not-allowed;
          }
          .active {
            color: $colorP;
            cursor: pointer;
          }
        }
        .VEcode {
          input {
            width: 255px;
          }
        }
        .mod-password1 {
          border-bottom: 1px solid $colorF;
          input {
            width: 320px;
          }
        }
        .eyeBtn {
          border: 0;
        }
      }
      .regBtn,.logBtn,.subBtn,.confirmBtn {
        display: block;
        margin: 0 auto;
        width: 200px;
        height: 40px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        background-color: $colorM;
        color: $colorG;
        &:hover {
          background-color: $colorP;
        }
      }
    }
  }
</style>