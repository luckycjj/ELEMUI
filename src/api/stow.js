import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/Stow/tableList.do',
    method: 'post',
    data
  })
}
export function cancleSegment(data) {
  return request({
    url: '/Stow/cancleSegment.do',
    method: 'post',
    data
  })
}
export function carrierTable(data) {
  return request({
    url: '/Stow/carrierTable.do',
    method: 'post',
    data
  })
}
export function selectCarrier(data) {
  return request({
    url: '/Stow/selectCarrier.do',
    method: 'post',
    data
  })
}
export function selectDriver(data) {
  return request({
    url: '/Stow/selectDriver.do',
    method: 'post',
    data
  })
}
export function carDriverTable(data) {
  return request({
    url: '/Stow/carDriverTable.do',
    method: 'post',
    data
  })
}
export function carHeadTable(data) {
  return request({
    url: '/Stow/carHeadTable.do',
    method: 'post',
    data
  })
}
export function carHangTable(data) {
  return request({
    url: '/Stow/carHangTable.do',
    method: 'post',
    data
  })
}

