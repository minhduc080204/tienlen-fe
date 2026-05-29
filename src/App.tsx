import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from './routes/routes'
import ModalRoot from './ModalRoot'
import DeviceOrientationWarning from './components/DeviceOrientationWarning'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoomGuard } from './components/RoomGuard'
import PWABadge from './components/PWABadge'
import { useSyncSettings } from './hooks/useSyncSettings'
import { AdminRoute } from './components/AdminRoute'
import { AdminProvider } from './hooks/useAdmin'
import { AdminLayout } from './components/AdminLayout'

// Lazy load pages
const HomePage = lazy(() => import('./page/Home'))
const LoginPage = lazy(() => import('./page/Login'))
const RegisterPage = lazy(() => import('./page/Register'))
const GamePlay = lazy(() => import('./page/GamePlay'))
const GamePlayBot = lazy(() => import('./page/GamePlayBot'))
const GamePlayOfflineBot = lazy(() => import('./page/GamePlayOfflineBot'))

// Lazy load admin pages
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'))
const AdminUserManagement = lazy(() => import('./pages/Admin/UserManagement'))
const AdminNFTManagement = lazy(() => import('./pages/Admin/NFTManagement'))
const AdminMatchManagement = lazy(() => import('./pages/Admin/MatchManagement'))
const AdminTransactionManagement = lazy(() => import('./pages/Admin/TransactionManagement'))
const AdminAvatarManagement = lazy(() => import('./pages/Admin/AvatarManagement'))
const AdminTokenPackageManagement = lazy(() => import('./pages/Admin/TokenPackageManagement'))

function App() {
  useSyncSettings();

  return (
    <>
      <PWABadge />
      <DeviceOrientationWarning />
      <Suspense fallback={<div className="fixed inset-0 bg-zinc-950 flex items-center justify-center text-white">Loading...</div>}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.GAME_PLAY_OFFLINE_BOT} element={<GamePlayOfflineBot />} />

            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.GAME_PLAY_BOT} element={<GamePlayBot />} />

              <Route element={<RoomGuard />}>
                <Route path={ROUTES.ROOM} element={<GamePlay />} />
              </Route>

              {/* Admin Panel Routes */}
              <Route element={<AdminRoute />}>
                <Route element={
                  <AdminProvider>
                    <AdminLayout>
                      <Outlet />
                    </AdminLayout>
                  </AdminProvider>
                }>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUserManagement />} />
                  <Route path="/admin/nfts" element={<AdminNFTManagement />} />
                  <Route path="/admin/matches" element={<AdminMatchManagement />} />
                  <Route path="/admin/transactions" element={<AdminTransactionManagement />} />
                  <Route path="/admin/avatars" element={<AdminAvatarManagement />} />
                  <Route path="/admin/token-packages" element={<AdminTokenPackageManagement />} />
                </Route>
              </Route>
            </Route>
          </Routes>
          <ModalRoot />
        </AnimatePresence>
      </Suspense>
    </>
  )
}

export default App
