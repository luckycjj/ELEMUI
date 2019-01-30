import request from '@/utils/request'
export function driverList(data) {
  return request({
    url: '/driver/driverList.do',
    method: 'post',
    data
  })
}
export function carList(data) {
  return request({
    url: '/car/carList.do',
    method: 'post',
    data
  })
}
export function custList(data) {
  return request({
    url: '/cust/custList.do',
    method: 'post',
    data
  })
}
export function addOrUpdateCar(data) {
  return request({
    url: '/car/addOrUpdateCar.do',
    method: 'post',
    data
  })
}
export function deleteDriver(data) {
  return request({
    url: '/driver/deleteDriver.do',
    method: 'post',
    data
  })
}
export function deleteCar(data) {
  return request({
    url: '/car/deleteCar.do',
    method: 'post',
    data
  })
}
export function deleteCust(data) {
  return request({
    url: '/cust/deleteCust.do',
    method: 'post',
    data
  })
}
export function detailCar(data) {
  return request({
    url: '/car/detailCar.do',
    method: 'post',
    data
  })
}
export function detailDriver(data) {
  return request({
    url: '/driver/detailDriver.do ',
    method: 'post',
    data
  })
}
export function addrList(data) {
  return request({
    url: '/addrManage/addrList.do',
    method: 'post',
    data
  })
}
export function detailCust(data) {
  return request({
    url: '/cust/detailCust.do ',
    method: 'post',
    data
  })
}
export function saveOrUpdateAddr(data) {
  return request({
    url: '/addrManage/saveOrUpdateAddr.do',
    method: 'post',
    data
  })
}
export function addOrUpdateDriver(data) {
  return request({
    url: '/driver/addOrUpdateDriver.do ',
    method: 'post',
    data
  })
}
export function updateDriver(data) {
  return request({
    url: '/driver/updateDriver.do',
    method: 'post',
    data
  })
}
export function addOrUpdateCust(data) {
  return request({
    url: '/cust/addOrUpdateCust.do ',
    method: 'post',
    data
  })
}
export function removeAddr(data) {
  return request({
    url: '/addrManage/removeAddr.do',
    method: 'post',
    data
  })
}
export function editAddrStatus(data) {
  return request({
    url: '/addrManage/editAddrStatus.do',
    method: 'post',
    data
  })
}
export function updateCar(data) {
  return request({
    url: '/car/updateCar.do',
    method: 'post',
    data
  })
}
