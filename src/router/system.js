export const systemRoutes = [
  {
    name: 'login',
    path: '/login',
    component: () => import('../views/login')
  },
  {
    name: 'home',
    path: '/',
    component: () => import('../layout')
  }
]
