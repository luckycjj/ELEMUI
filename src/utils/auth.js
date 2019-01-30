import Cookies from 'js-cookie'

const TokenKey = 'TMS-Token'
const SysCodeKey = 'TMS-SysCode'
const UserCodeKey = 'TMS-UserCode'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getSysCode() {
  return Cookies.get(SysCodeKey)
}

export function setSysCode(token) {
  return Cookies.set(SysCodeKey, token)
}

export function removeSysCode() {
  return Cookies.remove(SysCodeKey)
}

export function getUserCode() {
  return Cookies.get(UserCodeKey)
}

export function setUserCode(userCode) {
  return Cookies.set(UserCodeKey, userCode)
}

export function removeUserCode() {
  return Cookies.remove(UserCodeKey)
}
