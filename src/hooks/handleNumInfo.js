const handleNumInfo = (numInfo, offset) => {
  if(
    numInfo.indexOf('万') !== -1 || 
    numInfo.indexOf('亿') !== -1 || 
    numInfo.indexOf('兆') !== -1
  ) {
    return numInfo
  } else if(numInfo === '9999' && offset > 0) {
    return '1万'
  } else {
    return `${+numInfo + offset}`
  }
}

export default handleNumInfo