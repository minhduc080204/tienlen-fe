# Build Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the application to optimize build size and reduce chunk sizes below the 500kB warning limit.

**Architecture:** We will use `React.lazy` and `Suspense` for component-level code splitting in routes and modals. We will also configure Vite's manual chunking to split large vendor libraries into separate files.

**Tech Stack:** Vite, Rollup, React (Lazy/Suspense).

---

### Task 1: Optimize Vite Configuration

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Configure manual chunks in Rollup options**

Update `vite.config.ts` to include `build.rollupOptions.output.manualChunks`.

```typescript
// vite.config.ts (partial update)
export default defineConfig({
  // ... existing plugins
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion';
            }
            if (id.includes('axios') || id.includes('zustand')) {
              return 'vendor-utils';
            }
            return 'vendor'; // all other node_modules
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Optional: increase limit slightly if needed after splitting
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add vite.config.ts
git commit -m "chore: configure manual chunks for build optimization"
```

### Task 2: Code Split Modals

**Files:**
- Modify: `src/ModalRoot.tsx`

- [ ] **Step 1: Refactor ModalRoot to use React.lazy and Suspense**

```tsx
import { AnimatePresence, motion } from "framer-motion";
import { useModalStore } from "./stores/modal.store";
import { lazy, Suspense } from "react";

// Lazy load modals
const CreateRoomModal = lazy(() => import("./components/modals/CreateRoomModel"));
const SettingsModal = lazy(() => import("./components/modals/SettingsModal"));
const JoinRoomModal = lazy(() => import("./components/modals/JoinRoomModal"));
const ChatTab = lazy(() => import("./components/ChatTab"));
const BotPlayModal = lazy(() => import("./components/modals/BotPlayModal"));
const BotPlayOfflineModal = lazy(() => import("./components/modals/BotPlayOfflineModal"));
const ProfileModal = lazy(() => import("./components/modals/ProfileModal"));

export default function ModalRoot() {
  const { modal, close } = useModalStore();

  return (
    <AnimatePresence>
      {modal && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Modal Container */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.25 }}
          >
            <div className="pointer-events-auto">
              <Suspense fallback={null}>
                {modal === "PROFILE" && <ProfileModal />}
                {modal === "SETTINGS" && <SettingsModal />}
                {modal === "CREATE_ROOM" && <CreateRoomModal />}
                {modal === "JOIN_ROOM" && <JoinRoomModal />}
                {modal === "CHAT_ROOM" && <ChatTab />}
                {modal === "BOT_PLAY" && <BotPlayModal />}
                {modal === "BOT_OFFLINE_PLAY" && <BotPlayOfflineModal />}
              </Suspense>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/ModalRoot.tsx
git commit -m "refactor: lazy load modal components for code splitting"
```

### Task 3: Code Split Routes

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Refactor App.tsx to use React.lazy and Suspense for pages**

```tsx
import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ROUTES } from './routes/routes'
import ModalRoot from './ModalRoot'
import DeviceOrientationWarning from './components/DeviceOrientationWarning'

import { ProtectedRoute } from './components/ProtectedRoute'
import { RoomGuard } from './components/RoomGuard'
import PWABadge from './components/PWABadge'

// Lazy load pages
const HomePage = lazy(() => import('./page/Home'))
const LoginPage = lazy(() => import('./page/Login'))
const RegisterPage = lazy(() => import('./page/Register'))
const GamePlay = lazy(() => import('./page/GamePlay'))
const GamePlayBot = lazy(() => import('./page/GamePlayBot'))
const GamePlayOfflineBot = lazy(() => import('./page/GamePlayOfflineBot'))

function App() {
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
            </Route>
          </Routes>
          <ModalRoot />
        </AnimatePresence>
      </Suspense>
    </>
  )
}

export default App
```

- [ ] **Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: lazy load route pages for code splitting"
```

### Task 4: Verify Build

**Files:**
- N/A

- [ ] **Step 1: Run build and check chunk sizes**

Run: `npm run build`
Expected: Build finishes without the >500kB warning for main chunks, and new smaller chunks are visible in the output.
