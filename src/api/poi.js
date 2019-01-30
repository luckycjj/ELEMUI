import request from '@/utils/request'

export function exportInvoice(data) {
  return request({
    url: '/poi/exportInvoice.do',
    method: 'get',
    params: data,
    headers: { 'Content-Type': 'application/vnd.ms-excel;charset=UTF-8' },
    responseType: 'blob'
  })
}

export function exportEntrust(data) {
  return request({
    url: '/poi/exportEntrust.do',
    method: 'get',
    params: data,
    headers: { 'Content-Type': 'application/vnd.ms-excel;charset=UTF-8' },
    responseType: 'blob'
  })
}
export function downloadZip(data) {
  return request({
    url: '/poi/downloadZip.do',
    method: 'get',
    params: data,
    headers: { 'Content-Type': 'application/force-download' },
    responseType: 'blob'
  })
}
export function exportPayFeeInfo(data) {
  return request({
    url: '/poi/exportPayFeeInfo.do',
    method: 'get',
    params: data,
    headers: { 'Content-Type': 'application/vnd.ms-excel;charset=UTF-8' },
    responseType: 'blob'
  })
}

