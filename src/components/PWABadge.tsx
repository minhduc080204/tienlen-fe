import './PWABadge.css'

import { useRegisterSW } from 'virtual:pwa-register/react'

function PWABadge() {
  const period = 60 * 60 * 1000 // 1 hour

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl: string, r: ServiceWorkerRegistration | undefined) {
      if (period <= 0) return
      if (r?.installing) return

      if (r) {
        setInterval(async () => {
          if (!(!r.installing && navigator.onLine)) return

          const resp = await fetch(swUrl, {
            cache: 'no-cache',
            headers: {
              'cache-control': 'no-cache',
            },
          })

          if (resp?.status === 200) await r.update()
        }, period)
      }
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="PWABadge" role="alert" aria-labelledby="toast-label">
      {(offlineReady || needRefresh) && (
        <div className="PWABadge-toast">
          <div className="PWABadge-message">
            <span id="toast-label">
              {offlineReady ? 'Ứng dụng đã sẵn sàng chạy ngoại tuyến' : 'Đã có bản cập nhật mới, làm mới để cập nhật?'}
            </span>
          </div>
          <div className="PWABadge-buttons">
            {needRefresh && (
              <button className="PWABadge-toast-button" onClick={() => updateServiceWorker(true)}>
                Cập nhật
              </button>
            )}
            <button className="PWABadge-toast-button" onClick={() => close()}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PWABadge
