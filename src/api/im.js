import request from '@/utils/request'

export function pushIm(data) {
  return request({
    url: '/Power/pushIm.do',
    method: 'post',
    data
  })
}
