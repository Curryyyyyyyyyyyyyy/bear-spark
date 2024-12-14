import useUser from "@/store/user"
import {getUserInfoApi} from '@/api/user'
const userStore = useUser()

export function updateUserInfo() {
  getUserInfoApi().then(userInfo => {
    userStore.userId = userInfo.userId
    userStore.username = userInfo.username
    userStore.avatarUrl = userInfo.avatarUrl
    userStore.followerNumInfo = userInfo.followerNumInfo
    userStore.fanNumInfo = userInfo.fanNumInfo
    userStore.happeningNumInfo = userInfo.happeningNumInfo
    userStore.currencyInfo.meritNumInfo = userInfo.currencyInfo.meritNumInfo
    userStore.currencyInfo.coinNumInfo = userInfo.currencyInfo.coinNumInfo
  })
}
export function deleteUserInfo() {
  userStore.token = ''
  userStore.username = ''
  userStore.avatarUrl = ''
  userStore.followerNumInfo = ''
  userStore.fanNumInfo = ''
  userStore.happeningNumInfo = ''
  userStore.currencyInfo.meritNumInfo = ''
  userStore.currencyInfo.coinNumInfo = ''
}