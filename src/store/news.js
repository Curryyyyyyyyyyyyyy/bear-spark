import { defineStore } from "pinia";

const useNews = defineStore('news', {
  state:()=>({
    pictureList:[]
  }),
  getters:{},
  actions:{},
  persist:{
    key:'bear-spark-news',
    pick:['pictureList']
  }
})

export default useNews