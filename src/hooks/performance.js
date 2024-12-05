export function debounce(fn, delay = 500) {
  let timer
  return function() {
    if(timer) clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this,arguments)
      }, delay);
  }
}

export function throttle(fn, delay = 500) {
  let flag = true
  return function() {
    if(flag) {
      flag = false
      setTimeout(() => {
        fn.apply(this,arguments)
        flag = true;
      }, delay);
    }
  }
}