import { pushIm } from '../api/im'
import '../../static/IM/jmessage-sdk-web.2.6.0.min'
import { cookie } from './cookie'
var im = {
  init(_this) {
    var JIM = new window.JMessage()
    pushIm({
      'userCode': cookie.getcookie('TMS-UserCode')
    }).then(response => {
      if (response.data.success === 'false') {
        _this.$message({
          type: 'warning',
          message: response.data.msg
        })
      } else {
        var nick_name = ''
        var username = response.data.data.userCode || cookie.getcookie('TMS-UserCode')
        var signature = response.data.data.signature
        var timestamp = response.data.data.timestamp
        var appkey = 'ca1d6a0d5d1983d874001cea'
        var random_str = '123'
        im.iminit(_this, JIM, username, nick_name, signature, appkey, random_str, timestamp)
      }
    })
  },
  imlogin(JIM, username, nick_name, signature, appkey, random_str, timestamp) {
    JIM.login({
      'username': username,
      'password': '123456'
    }).onSuccess(function(data) {
      console.log('login success:' + JSON.stringify(data))
      JIM.updateSelfInfo({
        'nick_name': nick_name,
        'signature': signature
      }).onSuccess(function(data) {
        console.log('updateSelfInfo success:' + JSON.stringify(data))
      })
    })
  },
  iminit(_this, JIM, username, nick_name, signature, appkey, random_str, timestamp) {
    JIM.init({
      'appkey': appkey,
      'random_str': random_str,
      'signature': signature,
      'timestamp': timestamp
    }).onSuccess(function(data) {
      console.log('init success:' + JSON.stringify(data))
      JIM.register({
        'username': username,
        'password': '123456'
      }).onSuccess(function(data) {
        console.log('register success:' + JSON.stringify(data))
        im.imlogin(JIM, username, nick_name, signature, appkey, random_str, timestamp)
      }).onFail(function(data) {
        // 已存在
        if (data.code === 882002) {
          im.imlogin(JIM, username, nick_name, signature, appkey, random_str, timestamp)
        }
      })
    }).onFail(function(data) {
      console.log('init fail:' + JSON.stringify(data))
    })
    JIM.onMsgReceive(function(data) {
      console.log('receive msg: ' + JSON.stringify(data))
      im.getDom(_this, data)
    })
    JIM.onEventNotification(function(data) {
      console.log('event msg: ' + JSON.stringify(data))
    })
  },
  getDom(_this, data) {
    var msgList = data.messages
    for (var i = 0; i < msgList.length; i++) {
      im.domGo(_this, msgList[i].content.msg_body.text)
    }
  },
  domGo(_this, message) {
    message = im.utf8to16(im.base64decode(message))
    var domBox = document.getElementById('IMBODYBOX')
    var body = document.getElementsByTagName('body')[0]
    if (domBox === null) {
      domBox = document.createElement('div')
      domBox.id = 'IMBODYBOX'
      domBox.style.position = 'fixed'
      domBox.style.bottom = '10px'
      domBox.style.right = '10px'
      domBox.style.zIndex = '1300'
      body.appendChild(domBox)
    }
    var dom = document.createElement('div')
    var msg = JSON.parse(message).msg
    var sound = JSON.parse(message).sound
    dom.style.width = '375px'
    dom.style.backgroundColor = sound === 'ddyc' || sound === 'ycqianshou' ? 'rgba(248,148,6,0.8)' : 'rgba(64, 158, 255, 0.8)'
    dom.style.padding = '10px 0'
    dom.style.overflow = 'hidden'
    dom.style.opacity = 0
    dom.style.marginTop = '5px'
    dom.style.position = 'relative'
    dom.style.backgroundRepeat = 'no-repeat'
    dom.style.backgroundPosition = '5% 50%'
    dom.style.backgroundSize = '25px'
    dom.style.backgroundImage = sound === 'ddyc' || sound === 'ycqianshou' ? 'url(' + require('../../static/car/yichang.png') + ')' : 'url(' + require('../../static/car/tishi.png') + ')'
    var title = sound === 'renwu' || sound === 'queren' || sound === 'qianshou' ? '温馨提示' : sound === 'ddyc' ? '订单异常' : sound === 'ycqianshou' ? '签收异常' : '温馨提示'
    var domVideo = sound === 'renwu' ? "<audio style='display: none;' autoPlay  src='" + require('../../static/IM/lzl.wav') + "'></audio>" : sound === 'queren' ? "<audio autoPlay style='display: none;' src='" + require('../../static/IM/xdd.wav') + "'></audio>" : sound === 'qianshou' ? "<audio autoPlay style='display: none;' src='" + require('../../static/IM/qs.wav') + "'></audio>" : ''
    var str = "<img style='position: absolute;cursor:pointer;width:10px;right:10px;top:10px;' src='" + require('../../static/car/closed2.png') + "'><p style='width:75%;font-size: 16px;color:white;margin:0 0 10px 16.5%;position: relative;font-weight: bold;'>" + title + "</p><div style='width:75%;margin-left:16.5%;font-size: 14px;color:white;'><div class='videoBox'>" + domVideo + "</div><h1 style='font-size: 14px;margin:0;color:white;cursor: pointer'>" + msg + '</h1></div>'
    dom.innerHTML = str
    domBox.appendChild(dom)
    if (domVideo !== '') {
      var video = dom.getElementsByTagName('audio')[0]
      video.addEventListener('ended', function() {
        dom.getElementsByClassName('videoBox')[0].innerHTML = ''
      })
    }
    dom.getElementsByTagName('h1')[0].onclick = function() {
      var list = JSON.parse(message).no
      if (list !== '' && list.indexOf('FHD') !== -1) {
        im.remove(dom, domBox)
        if (sound === 'qianshou') {
          _this.$router.push({ path: '/ordercenter/order-details/' + list })
        } else if (sound === 'queren') {
          _this.$router.push({ path: '/operationCenter/dispatch?fhd=' + list })
        }
      }
    }
    dom.getElementsByTagName('img')[0].onclick = function() {
      im.remove(dom, domBox)
    }
    dom.addEventListener('mouseleave', function() {
      dom.style.backgroundColor = sound === 'ddyc' || sound === 'ycqianshou' ? 'rgba(248,148,6,0.8)' : 'rgba(64, 158, 255, 0.8)'
    }, false)

    dom.addEventListener('mouseenter', function() {
      dom.style.backgroundColor = sound === 'ddyc' || sound === 'ycqianshou' ? 'rgba(248,148,6,1)' : 'rgba(64, 158, 255, 1)'
    }, false)
    var setTime = setInterval(function() {
      var op = dom.style.opacity
      if (op <= 1) {
        dom.style.opacity = op * 1 + 0.01
      } else {
        clearInterval(setTime)
      }
    }, 1)
  },
  remove(dom, domBox) {
    var op = dom.style.opacity
    if (op >= 1) {
      var set = setInterval(function() {
        var op = dom.style.opacity
        if (op <= 0.2) {
          domBox.removeChild(dom)
          clearInterval(set)
        }
        dom.style.opacity = op - 0.01
      }, 1)
    }
  },
  base64encode(str) {
    var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    var out, i, len
    var c1, c2, c3
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff
      if (i === len) {
        out += base64EncodeChars.charAt(c1 >> 2)
        out += base64EncodeChars.charAt((c1 & 0x3) << 4)
        out += '=='
        break
      }
      c2 = str.charCodeAt(i++)
      if (i === len) {
        out += base64EncodeChars.charAt(c1 >> 2)
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
        out += base64EncodeChars.charAt((c2 & 0xF) << 2)
        out += '='
        break
      }
      c3 = str.charCodeAt(i++)
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
      out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))
      out += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return out
  },
  base64decode(str) {
    var base64DecodeChars = [
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
      -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
      -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1]
    var c1, c2, c3, c4
    var i, len, out
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      } while (i < len && c1 === -1)
      if (c1 === -1) { break }

      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
      } while (i < len && c2 === -1)
      if (c2 === -1) { break }
      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))

      do {
        c3 = str.charCodeAt(i++) & 0xff
        if (c3 === 61) { return out }
        c3 = base64DecodeChars[c3]
      } while (i < len && c3 === -1)
      if (c3 === -1) { break }
      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2))

      do {
        c4 = str.charCodeAt(i++) & 0xff
        if (c4 === 61) { return out }
        c4 = base64DecodeChars[c4]
      } while (i < len && c4 === -1)
      if (c4 === -1) { break }
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
    }
    return out
  },
  utf16to8(str) {
    var out, i, len, c
    out = ''
    len = str.length
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i)
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      }
    }
    return out
  },
  utf8to16(str) {
    var out, i, len, c
    var char2, char3
    out = ''
    len = str.length
    i = 0
    while (i < len) {
      c = str.charCodeAt(i++)
      switch (c >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
          out += str.charAt(i - 1)
          break
        case 12: case 13:
        // 110x xxxx   10xx xxxx
          char2 = str.charCodeAt(i++)
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
          break
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = str.charCodeAt(i++)
          char3 = str.charCodeAt(i++)
          out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) |
            ((char3 & 0x3F) << 0))
          break
      }
    }
    return out
  }
}
export {
  im
}
