import { Route, Routes } from 'react-router-dom'
import { Admin } from './pages/private/admin'
import { User } from './pages/users'
import { Login } from './pages/login'
import { ForgotPassword } from './pages/forgot-password'
import { Private } from './pages/private'

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/users/*" element={<User />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/*" element={<Private />} />
        <Route path="*" element={<div>404 - Página não encontrada</div>} />
      </Routes>
    </>
  )
}

export default App
