import request from '@/utils/request'

export function feeList(data) {
  return request({
    url: '/Fee/feeList.do',
    method: 'post',
    data
  })
}
export function checkList(data) {
  return request({
    url: '/ReceCheck/checkList.do',
    method: 'post',
    data
  })
}
export function checkPayList(data) {
  return request({
    url: '/PayCheck/checkList.do',
    method: 'post',
    data
  })
}
export function createCheck(data) {
  return request({
    url: '/ReceCheck/createCheck.do',
    method: 'post',
    data
  })
}
export function PayCheckcreateCheck(data) {
  return request({
    url: '/PayCheck/createCheck.do',
    method: 'post',
    data
  })
}

export function choosepkbala(data) {
  return request({
    url: '/Order/getEntCustomer.do',
    method: 'post',
    data
  })
}
export function feeConfirm(data) {
  return request({
    url: '/Fee/feeConfirm.do',
    method: 'post',
    data
  })
}
export function feeUnConfirm(data) {
  return request({
    url: '/Fee/feeUnConfirm.do',
    method: 'post',
    data
  })
}
export function createBill(data) {
  return request({
    url: '/Fee/createBill.do',
    method: 'post',
    data
  })
}
export function ReceCheck(data) {
  return request({
    url: '/ReceCheck/feeCheck.do',
    method: 'post',
    data
  })
}
export function deleteCheck(data) {
  return request({
    url: '/ReceCheck/deleteCheck.do',
    method: 'post',
    data
  })
}

export function addCheck(data) {
  return request({
    url: '/ReceCheck/addCheck.do',
    method: 'post',
    data
  })
}
export function lookCheck(data) {
  return request({
    url: '/ReceCheck/lookCheck.do',
    method: 'post',
    data
  })
}
export function payCreateBill(data) {
  return request({
    url: '/PayCheck/createBill.do',
    method: 'post',
    data
  })
}

export function costInfo(data) {
  return request({
    url: '/Fee/costInfo.do',
    method: 'post',
    data
  })
}
export function ReceCheckList(data) {
  return request({
    url: '/ReceCheck/checkList.do',
    method: 'post',
    data
  })
}
export function PayCheckCheckList(data) {
  return request({
    url: '/PayCheck/checkList.do',
    method: 'post',
    data
  })
}
export function ReceCheckConfirmCheck(data) {
  return request({
    url: '/ReceCheck/confirmCheck.do',
    method: 'post',
    data
  })
}
export function ReceCheckDeleteCheckHead(data) {
  return request({
    url: '/ReceCheck/deleteCheckHead.do',
    method: 'post',
    data
  })
}
