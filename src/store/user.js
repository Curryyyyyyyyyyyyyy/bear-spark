import {defineStore} from 'pinia'

const useUser = defineStore('user', {
  state: () => ({
    token:'',
    username:''
  }),
  getters:{},
  actions:{},
  persist:{
    key:'bear-spark-user',
    pick:['token']
  }
})

export default useUser