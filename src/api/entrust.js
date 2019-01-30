import request from '@/utils/request'

export function findEntrustList(data) {
  return request({
    url: '/entrust/findEntrustList.do',
    method: 'post',
    data
  })
}
// 改配司机车辆
export function modifyMatch(data) {
  return request({
    url: '/entrust/modifyMatch.do',
    method: 'post',
    data
  })
}

// 撤销改配司机车辆
export function unModifyMatch(data) {
  return request({
    url: '/entrust/unModifyMatch.do',
    method: 'post',
    data
  })
}
// 运单跟踪
export function waybillTracking(data) {
  return request({
    url: '/entrust/waybillTracking.do',
    method: 'post',
    data
  })
}
export function gpsCarList(data) {
  return request({
    url: '/entrust/gpsCarList.do',
    method: 'post',
    data
  })
}
export function receiptList(data) {
  return request({
    url: '/entrust/receiptList.do',
    method: 'post',
    data
  })
}
export function saveReceipt(data) {
  return request({
    url: '/entrust/saveReceipt.do',
    method: 'post',
    data
  })
}
export function waybillDetail(data) {
  return request({
    url: '/entrust/waybillDetail.do',
    method: 'post',
    data
  })
}
export function findAbnormalEventByVbillno(data) {
  return request({
    url: '/entrust/findAbnormalEventByVbillno.do',
    method: 'post',
    data
  })
}
export function nodeOfExpInfo(data) {
  return request({
    url: '/entrust/nodeOfExpInfo.do',
    method: 'post',
    data
  })
}

