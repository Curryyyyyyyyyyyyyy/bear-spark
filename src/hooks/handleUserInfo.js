import useUser from "@/store/user"
import {getUserInfoApi} from '@/api/user'
const userStore = useUser()

export function updateUserInfo() {
  getUserInfoApi().then(userInfo => {
    userStore.username = userInfo.username
    userStore.avatarUrl = userInfo.avatarUrl
    userStore.followerNumInfo = userInfo.followerNumInfo
    userStore.fanNumInfo = userInfo.fanNumInfo
    userStore.happeningNumInfo = userInfo.happeningNumInfo
    userStore.meritNumInfo = userInfo.meritNumInfo
    userStore.coinNumInfo = userInfo.coinNumInfo
  })
}
export function deleteUserInfo() {
  userStore.username = ''
  userStore.avatarUrl = ''
  userStore.followerNumInfo = ''
  userStore.fanNumInfo = ''
  userStore.happeningNumInfo = ''
  userStore.meritNumInfo = ''
  userStore.coinNumInfo = ''
}