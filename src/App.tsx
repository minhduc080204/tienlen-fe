import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './page/Home'
import LoginPage from './page/Login'
import RegisterPage from './page/Register'
import { ROUTES } from './routes/routes'
import GamePlay from './page/GamePlay'
import ModalRoot from './ModalRoot'
import DeviceOrientationWarning from './components/DeviceOrientationWarning'

import { ProtectedRoute } from './components/ProtectedRoute'
import { RoomGuard } from './components/RoomGuard'
import PWABadge from './components/PWABadge'

import GamePlayBot from './page/GamePlayBot'

function App() {
  return (
    <>
      <PWABadge />
      <DeviceOrientationWarning />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.GAME_PLAY_BOT} element={<GamePlayBot />} />

            <Route element={<RoomGuard />}>
              <Route path={ROUTES.ROOM} element={<GamePlay />} />
            </Route>
          </Route>
        </Routes>
        <ModalRoot />
      </AnimatePresence>
    </>
  )
}

export default App
