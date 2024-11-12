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