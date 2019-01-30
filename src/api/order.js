import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/Order/tableList.do',
    method: 'post',
    data
  })
}

export function fetchOrder(id) {
  return request({
    url: '/Order/detail',
    method: 'get',
    params: { id }
  })
}

export function createOrder(data) {
  return request({
    url: '/Order/createInvoice.do',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return request({
    url: '/Order/editInvoice.do',
    method: 'post',
    data
  })
}
export function cancleOrder(data) {
  return request({
    url: '/Order/cancleInvoice.do',
    method: 'post',
    data
  })
}
export function confirmOrder(data) {
  return request({
    url: '/Order/confirmInvoice.do',
    method: 'post',
    data
  })
}
export function getCarrier(data) {
  return request({
    url: '/Order/getCarrier.do',
    method: 'post',
    data
  })
}

export function getAddress(data) {
  return request({
    url: '/Order/getAddress.do',
    method: 'post',
    data
  })
}

export function orderDetails(data) {
  return request({
    url: '/Order/detailState.do',
    method: 'post',
    data
  })
}

export function getGoodsName(data) {
  return request({
    url: '/Order/getGoodsName.do',
    method: 'post',
    data
  })
}

export function editInterface(data) {
  return request({
    url: '/Order/editInterface.do',
    method: 'post',
    data
  })
}

export function getEntCustomer(data) {
  return request({
    url: '/Order/getEntCustomer.do',
    method: 'post',
    data
  })
}
export function addOrUpdateFee(data) {
  return request({
    url: '/Order/addOrUpdateFee.do',
    method: 'post',
    data
  })
}
export function deleteFee(data) {
  return request({
    url: '/Order/deleteFee.do',
    method: 'post',
    data
  })
}
export function queryByVbillnoAndType(data) {
  return request({
    url: '/Order/queryByVbillnoAndType.do',
    method: 'get',
    params: data
  })
}

