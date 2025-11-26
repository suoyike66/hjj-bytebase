import { createHashRouter } from 'react-router-dom'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import Home from '@/pages/Home'
import GithubCallback from '@/pages/GithubCallback'
import Setting from '@/pages/Setting'

// 检查用户是否已登录
const isAuthenticated = () => {
  const token = localStorage.getItem('github_token')
  return !!token
}

// 定义路由配置
const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
  },
  {
    path: '/home',
    element: <Home />,
    children: [
      {
        path: 'setting',
        element: <Setting />,
      },
    ],
  },
  {
    path: '/github/callback',
    element: <GithubCallback />,
  },
]

// 创建路由器实例
const router = createHashRouter(
  routes.map(route => {
    // 对于需要认证的路由（除了登录页、回调页和根路径）
    if (route.path !== '/login' && route.path !== '/github/callback' && route.path !== '/') {
      return {
        ...route,
        loader: () => {
          // 检查是否已登录
          if (!isAuthenticated()) {
            // 如果未登录，重定向到登录页
            throw new Response('', {
              status: 302,
              headers: {
                Location: '/login',
              },
            })
          }
          return null
        },
      }
    }
    return route
  })
)

export { router }