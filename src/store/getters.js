const getters = {
  token: state => state.user.token,
  user: state => state.user.user,
  menus: state => state.user.menus,
  cache: state => state.user.cache,
  permissions: state => state.user.permissions,
  roles: state => state.user.roles,
  tags: state => state.user.tags
}
export default getters
