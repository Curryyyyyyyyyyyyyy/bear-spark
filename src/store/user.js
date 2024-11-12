import {defineStore} from 'pinia'

const useUser = defineStore('user', {
  state: () => ({
    token:'',
    username:''
  }),
  getters:{},
  actions:{},
  persist:{
    pick:['token']
  }
})

export default useUser