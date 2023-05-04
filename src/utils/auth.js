export function getStorage (name) {
  return sessionStorage.getItem(name)
}

export function setStorage (name, value) {
  return sessionStorage.setItem(name, value)
}

export function removeStorage (name) {
  return sessionStorage.removeItem(name)
}
