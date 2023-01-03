// 将base64转为blob
export function dataURLtoBlob(base64, mimeType = "image/png") {
  let bytes = window.atob(base64.split(",")[1]);
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {type: mimeType});
}

// 获取base64文件类型
export function getBase64Type(base64) {
  let index0 = base64.indexOf(":");
  let index1 = base64.indexOf(";");
  let mime = "";
  if (index0 !== -1 && index1 !== -1) {
    mime = base64.slice(index0 + 1, index1);
  }
  return mime;
}


// 文件大小验证
export function fileSizeValidate(size, num) {
  if (size / 1024 / 1024 > num) {
    this.$message.info(`上传文件不得大于${num}MB`)
    return false
  } else {
    return true
  }
}

// 文件类型验证
export function validFileType(file) {
  if (!file.type) {
    return false
  }
  /**
   'application/msword',
   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
   'application/pdf',
   'image/jpeg',
   'image/png',
   'application/zip',
   'application/x-rar-compressed',
   'application/x-zip-compressed',
   */
  const fileTypes = ['application/vnd.android.package-archive', 'application/iphone']
  if (fileTypes.includes(file.type)) {
    return true
  } else {
    return false
  }
}

//格式化文件大小
export const renderSize = value => {
  if (null == value || value == '') {
    return '0 Bytes'
  }
  const unitArr = new Array('Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
  let index = 0
  const srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  let size = srcsize / Math.pow(1024, index)
  size = size.toFixed(2) //保留的小数位数
  return size + unitArr[index]
}

// 字符长度过滤器
export const lengthTooLang = (value, length) => {
  if (value.length > length) {
    return value.substr(0, length) + '...'
  }
  return value
}
