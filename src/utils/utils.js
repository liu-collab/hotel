import md5 from 'js-md5';

//将字符串用md5加密
export const str2md2 = (str) => {
  return md5(md5(str).split('').reverse().join(''))
}