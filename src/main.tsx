import { createRoot } from 'react-dom/client'
import './index.css'
// 导入provider
import { RouterProvider } from 'react-router-dom'
// 导入router实例
import { router } from './routers/index.tsx'

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)
