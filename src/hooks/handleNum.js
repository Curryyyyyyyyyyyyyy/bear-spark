const handleNumInfo = (num) => {
  if(num >= 1e12) {
    return (num / 1e12).toFixed(1) + '兆'
  } else if(num >= 1e8) {
    return (num / 1e8).toFixed(1) + '亿'
  } else if(num >= 1e4) {
    return (num / 1e4).toFixed(1) + '万'
  } else {
    return num
  }
}

export default handleNumInfo