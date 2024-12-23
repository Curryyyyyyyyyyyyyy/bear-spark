const phoneReg = /^1\d{10}$/
const pwdReg = /^[a-zA-Z\d_]{6,16}$/
const VEcodeReg = /^\d{4}$/

export const regPhone = (value) => {
  return phoneReg.test(value)
}
export const regPwd = (value) => {
  return pwdReg.test(value)
}
export const regVEcode = (value) => {
  return VEcodeReg.test(value)
}
/* 校验时间，不能早于当前 */
/**
 * 
 * @param {YYYY-MM-DD} date 
 * @param {HH} hour 
 * @param {mm} minute 
 * @returns {boolean}
 */
export const regTime = (date, hour, minute) => {
  const time = new Date(date + ' '+ hour + ':' + minute +':00').getTime()
  const nowTime = new Date().getTime()
  console.log(new Date(date + ' '+ hour + ':' + minute +':00'))
  console.log(time, nowTime, time < nowTime)
  return time < nowTime
}