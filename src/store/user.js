import {defineStore} from 'pinia'

const useUser = defineStore('user', {
  state: () => ({
    token:'',
    userId:'',
    username:'',
    avatarUrl:'',
    followerNumInfo:'',
    fanNumInfo:'',
    happeningNumInfo:'',
    currencyInfo:{
      meritNumInfo:'',
      coinNumInfo:'',
    },
    expire:'',
    timestamp:''
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