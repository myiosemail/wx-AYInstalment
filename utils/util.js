const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/* 
* formatMoney(s,n) 
* 功能：金额按千位逗号分割 
* 参数：s，需要格式化的金额数值. 
* 参数：n,保留几位小数. 
* 返回：返回格式化后的数值字符串. 
*/
function fmoney(s,n) {
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
  var t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;  
}
/* 
* randomString(len)
* 功能：生成任意长度的随机字符串.
* 参数：n,字符串长度. 
* 返回：返回随机字符串. 
*/
function randomString(len) {
  　　len = len || 32;
  　　var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  　　var maxPos = $chars.length;
  　　var pwd = '';
  　　for (i = 0; i < len; i++) {
    //0~32的整数  
    　　　　pwd += $chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
  　　}
  　　return pwd;
}  
module.exports = {
  formatTime: formatTime,
  fmoney: fmoney,
  randomString: randomString
}
