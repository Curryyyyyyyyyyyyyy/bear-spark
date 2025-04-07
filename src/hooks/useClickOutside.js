// import { onMounted, onUnmounted } from "vue";

const useClickOutside = (element, callback) => {
  const hanlder = (e) => {
    if(element && e.target) {
      if(!element.contains(e.target)) {
        callback(e)
      }
    }
  }
  document.addEventListener('click', hanlder)
  // onMounted(() => {
  //   document.addEventListener('click', hanlder)
  // })
  // onUnmounted(() => {
  //   document.removeEventListener('click', hanlder)
  // })
}

export default useClickOutside
