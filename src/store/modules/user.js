import { getInfo, logout, buildMenus } from '../../api/user'
import { getStorage, setStorage, removeStorage } from '@/utils/auth'
import Layout from '@/layout'
import ParentView from '@/components/parentView'

const user = {
  state: {
    token: getStorage('token'),
    user: {},
    permissions: [],
    roles: [],
    menus: [],
    cache: [],
    tags: JSON.parse(getStorage('tags')) || []
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_CACHE: (state, cache) => {
      state.cache = cache
    },
    SET_TAGS: (state, tag) => {
      let flag = true
      for (const item of state.tags) {
        if (item.path === tag.path) {
          flag = false
          break
        }
      }
      if (flag) {
        state.tags.push(tag)
      }
      setStorage('tags', JSON.stringify(state.tags))
    },
    REMOVE_TAGS: (state, tag) => {
      for (let i = 0; i < state.tags.length; i++) {
        if (state.tags[i].path === tag.path) {
          state.tags.splice(i, 1)
        }
      }
      setStorage('tags', JSON.stringify(state.tags))
    },
    REMOVE_OTHER_TAGS: (state, tag) => {
      state.tags = [tag]
      setStorage('tags', JSON.stringify(state.tags))
    }
  },
  actions: {
    // 登录
    Login ({ commit }, token) {
      setStorage('token', token)
      commit('SET_TOKEN', token)
    },
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(res => {
            setUserInfo(res.result, commit)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 退出登录
    LogOut ({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            logOut(commit)
            resolve()
          })
          .catch(error => {
            logOut(commit)
            reject(error)
          })
      })
    },
    GetMenus ({ commit }) {
      return new Promise((resolve, reject) => {
        buildMenus()
          .then(res => {
            const accessedRoutes = filterAsyncRouter(res.result)
            setMenusInfo(accessedRoutes, commit)
            // setMenusCache(cache, commit)
            resolve(accessedRoutes)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 添加新的菜单
    AddTags ({ commit }, tag) {
      commit('SET_TAGS', tag)
    },
    // 删除某一菜单
    DelTags ({ commit }, tag) {
      commit('REMOVE_TAGS', tag)
    },
    // 删除其他所有菜单
    DelOtherTags ({ commit }, tag) {
      commit('REMOVE_OTHER_TAGS', tag)
    }
  }
}

export const logOut = commit => {
  commit('SET_TOKEN', '')
  commit('SET_PERMISSIONS', [])
  commit('SET_ROLES', [])
  commit('SET_MENUS', [])
  commit('SET_CACHE', [])
  removeStorage('token')
  removeStorage('tags')
}

export const setUserInfo = (res, commit) => {
  commit('SET_PERMISSIONS', res.permissions)
  commit('SET_ROLES', res.roles)
  commit('SET_USER', res.user)
}

export const setMenusInfo = (res, commit) => {
  commit('SET_MENUS', res)
}

export const setMenusCache = (res, commit) => {
  commit('SET_CACHE', res)
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter (asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        if (route.hidden) {
          return false
        }
        // 路由懒加载
        route.component = loadView(route.component)
      }
    }
    // 如果有子路由遍历子路由
    if (route.children !== null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

// 路由懒加载
export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default user
