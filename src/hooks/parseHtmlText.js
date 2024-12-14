export function parseImg(content) {
  const emojiUrlList = []
  let index = 0
  while (true) {
    let openIndex = content.indexOf('<img content="', index)
    if (openIndex == -1) {
      return {
        content,
        emojiUrlList
      };
    }
    let closeIndex = content.indexOf('">', openIndex);
    emojiUrlList.push(content.substring(openIndex + '<img content="'.length, closeIndex));
    content = content.substring(0, openIndex) +
              "<i>" +
              content.substring(closeIndex + '">'.length);
  }
}

export function unparseImg(content, emojiUrlList) {
  if (!emojiUrlList.length) {
      return content
  }
  let index = 0;
  let emojiUrlIndex = 0
  while (true) {
    let openIndex = content.indexOf("<i>", index);
    if (openIndex == -1) {
      return content
    }
    content = content.substring(0, openIndex) +
              '< img content="' +
              emojiUrlList[emojiUrlIndex++] +
              '">' +
              content.substring(openIndex + "<i>".length)
    index = content.indexOf('">', openIndex) + '">'.length
  }
}

export function parseSpan(content) {
    let atUsernameList = []
    let index = 0;
    while (true) {
      let openIndex = content.indexOf('<span class="username" contenteditable="false">@', index)
      if (openIndex == -1) {
        return {
          content,
          atUsernameList
        }
      }
      let closeIndex = content.indexOf("</span>", openIndex);
      atUsernameList.push(
        content.substring(openIndex + '<span class="username" contenteditable="false">@'.length, closeIndex)
      );
      content = content.substring(0, openIndex) +
                "<s>" +
                content.substring(closeIndex + "</span>".length);
    }
}

export function unparseSpan(content, atUserInfoList) {
    if (!atUserInfoList.length) {
      return {
        content,
        isAtSpan:0
      }
    }
    let index = 0;
    let atUserIndex = 0;
    let res = []
    while (true) {
      let openIndex = content.indexOf("<s>", index);
      if (openIndex == -1) {
        res.push({
          content,
          isAtSpan:0
        })
        return res
      }
      res.push({
        content:content.substring(0, openIndex),
        isAtSpan:0
      })
      content = content.substring(openIndex + "<s>".length)
      res.push({
        content:atUserInfoList[atUserIndex].atUsername,
        isAtSpan:1,
        atUserId:atUserInfoList[atUserIndex].atUserId
      })
      atUserIndex++
    }
}