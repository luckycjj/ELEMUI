var both = {
  getCurrentTime: () => {

  },
  time: (time, type) => {
    if (type === 0) {
      return time + ' 00:00:00'
    } else if (type === 1) {
      var nowTime = time + ' 00:00:00'
      nowTime.replace(/-/g, '/')
      var date = new Date(nowTime).getTime()
      var endTime = new Date(date + 24 * 60 * 60 * 1000)
      return endTime.getFullYear() + '-' + both.ten(endTime.getMonth() + 1) + '-' + both.ten(endTime.getDate()) + ' ' + both.ten(endTime.getHours()) + ':' + both.ten(endTime.getMinutes()) + ':' + both.ten(endTime.getSeconds())
    }
  },
  ten: (val) => {
    val = Number(val)
    return val < 10 ? '0' + val : val
  },
  telCheck: function(tel) {
    var reg = /^1([3|5|8][0-9]|4[5|7|9]|66|7[0|1|3|5|6|7|8]|9[8|9])[0-9]{8}$/
    if (!reg.test(tel)) {
      return false
    } else {
      return true
    }
  },
  idCardCheck: function(id) {
    // 1 "验证通过!", 0 //校验不通过
    var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
    // 号码规则校验
    if (!format.test(id)) {
      return false
    }
    // 区位码校验
    // 出生年月日校验   前正则限制起始年份为1900;
    var year = id.substr(6, 4)// 身份证年
    var month = id.substr(10, 2) // 身份证月
    var date = id.substr(12, 2)// 身份证日
    var time = Date.parse(month + '-' + date + '-' + year) // 身份证日期时间戳date
    var now_time = Date.parse(new Date()) // 当前时间戳
    var dates = (new Date(year, month, 0)).getDate()// 身份证当月天数
    if (time > now_time || date > dates) {
      return false
    }
    // 校验码判断
    var c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 系数
    var b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码对照表
    var id_array = id.split('')
    var sum = 0
    for (var k = 0; k < 17; k++) {
      sum += parseInt(id_array[k]) * parseInt(c[k])
    }
    if (id_array[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
      return false
    }
    return true
  }
}
export {
  both
}
