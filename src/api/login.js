import requestLogin from '@/utils/requestLogin'
import request from '@/utils/request'
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return requestLogin({
    url: '/authoritymanage/Login',
    method: 'post',
    data
  })
}

export function logout() {
  return requestLogin({
    url: '/authoritymanage/Logout',
    method: 'post'
  })
}
export function getPermissions(token) {
  return requestLogin({
    url: '/authoritymanage/GetUserPermission',
    method: 'get',
    params: { token }
  })
}

export function getUserInfo(token) {
  const data = {
    token
  }
  return request({
    url: '/Power/getUserInfo.do',
    method: 'post',
    data
  })
}
