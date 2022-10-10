import ReleaseNotes from 'pages/release-notes'
import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import DeviceManagement from './pages/device'
import Login from './pages/login'
import Monitoring from './pages/monitoring'
import NotFound from './pages/not-found'
import Setting from './pages/setting'
import UserManagement from './pages/user'
import { getCookie, NotificationProvider, ThemeProvider, useAuthStore } from './sdk'

interface LocationState {
  from: {
    pathname: string
  }
}
function App() {
  const [isLogged, setIsLogged] = useState<boolean | undefined>(undefined)
  const setAuth = useAuthStore((store) => store.setAuth)
  useEffect(() => {
    const accessToken = getCookie('access')

    try {
      const decodeToken = JSON.parse(atob(accessToken.split('.')[1]))
      setAuth(decodeToken)
    } catch (e) {}

    const hasAccess = Boolean(accessToken)
    setIsLogged(hasAccess)

    const current = location.pathname
    if (hasAccess && !current.includes('login')) {
      return
    } else if (hasAccess && !current.includes('login')) {
      const redirectUrl = new URLSearchParams(location.search).get('redirectUrl')
      window.history.replaceState({}, '', redirectUrl || location.pathname)
    } else {
      if (current.includes('login')) return
      window.history.replaceState({}, '', '/login' + (current !== '/' ? '?redirectUrl=' + current : ''))
    }
  }, [])

  if (isLogged === undefined) return <></>

  return (
    <ThemeProvider>
      <>
        <BrowserRouter>{isLogged ? <AuthorizedRoutes /> : <UnauthorizedRoutes />}</BrowserRouter>
        <NotificationProvider />
      </>
    </ThemeProvider>
  )
}

function AuthorizedRoutes() {
  const isRoleAdmin = useAuthStore((store) => store.auth?.role === 'ADMIN')
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/monitoring' element={<Monitoring />} />
      {isRoleAdmin && <Route path='/setting' element={<Setting />} />}
      <Route path='/devices' element={<DeviceManagement />} />
      {isRoleAdmin && <Route path='/user' element={<UserManagement />} />}
      <Route path='/release-notes' element={<ReleaseNotes />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

function UnauthorizedRoutes() {
  return (
    <Routes>
      <Route path='*' element={<Navigate to='/login' replace state={{ from: location.pathname }} />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App
