import {defineStore} from 'pinia'

const useUser = defineStore('user', {
  state: () => ({
    token:'',
    username:'',
    avatarUrl:'',
    followerNumInfo:'',
    fanNumInfo:'',
    happeningNumInfo:'',
    meritNumInfo:'',
    coinNumInfo:''
  }),
  getters:{},
  actions:{},
  persist:{
    key:'bear-spark-user',
    // pick:['token']
    storage:localStorage
  }
})

export default useUser