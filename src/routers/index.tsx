import { createBrowserRouter } from 'react-router-dom'
import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import Home from '@/pages/Home'
import GithubCallback from '@/pages/GithubCallback'
import Setting from '@/pages/Setting'

const router = createBrowserRouter([
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
])

export { router }