import request from '@/utils/request'

export function baseMsg(userCode) {
  const data = {
    userCode
  }
  return request({
    url: '/FirstPage/baseMsg.do',
    method: 'post',
    data
  })
}

export function expTypeDistri(userCode) {
  const data = {
    userCode
  }
  return request({
    url: '/FirstPage/expTypeDistri.do',
    method: 'post',
    data
  })
}

export function hotMap(userCode) {
  const data = {
    userCode
  }
  return request({
    url: '/FirstPage/hotMap.do',
    method: 'post',
    data
  })
}

export function carTrackingMsg(userCode) {
  const data = {
    userCode
  }
  return request({
    url: '/FirstPage/carTrackingMsg.do',
    method: 'post',
    data
  })
}
export function distance(userCode) {
  const data = {
    userCode
  }
  return request({
    url: '/FirstPage/distance.do',
    method: 'post',
    data
  })
}

