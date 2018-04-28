
/**
 * 申请分期大状态 
 */
function getStatusName(key) {
  var StatusNameEnum = {
    '1': '申请中',
    '2': '已通过',
    '3': '未通过',
    '1024': '已过期'
  };
  return StatusNameEnum[key];
}



module.exports = {
  getStatusName: getStatusName
}
