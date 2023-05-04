// 角色权限处理
import store from '@/store'

export default {
  inserted (el, binding, vnode) {
    const { value } = binding
    const superAdmin = 'admin'
    const roles = store.getters.roles
    if (value && (value instanceof Array) && value.length > 0) {
      const roleFlag = value
      const hasRole = roles.some(role => {
        return superAdmin === role || roleFlag.includes(role)
      })
      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      return false
    }
  }
}
