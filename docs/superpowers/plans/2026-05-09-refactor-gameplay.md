# Refactor GamePlay.tsx Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `GamePlay.tsx` to use the `GameLayout` component to ensure UI consistency and reduce code duplication.

**Architecture:** Utilize the `GameLayout` component as the top-level container for the gameplay page, passing necessary UI elements as props. Use `RoomInfo` and `MyData` sub-components from `GameLayout.tsx` where applicable.

**Tech Stack:** React, TypeScript, Tailwind CSS, Zustand.

---

### Task 1: Update Imports and Component Setup

**Files:**
- Modify: `src/page/GamePlay.tsx`

- [ ] **Step 1: Update imports**
  - Import `GameLayout`, `RoomInfo`, and `MyData` from `../components/gameplay/GameLayout`.
  - Remove `BackButton`, `TokenIcon` if they are no longer used directly in `GamePlay.tsx`.

- [ ] **Step 2: Clean up unused code**
  - Remove `renderMyData` helper function from `GamePlay.tsx` since it will be replaced by the `MyData` component from `GameLayout.tsx`.

### Task 2: Refactor Helper Components

**Files:**
- Modify: `src/page/GamePlay.tsx`

- [ ] **Step 1: Update `renderWhenWaiting`**
  - Use `<MyData user={user} tokenBalance={room.me?.user.tokenBalance || 0} />` instead of `renderMyData()`.

- [ ] **Step 2: Update `renderWhenPlaying`**
  - Use `<MyData user={user} tokenBalance={room.me?.user.tokenBalance || 0} />` when it's not the user's turn.

### Task 3: Refactor Main Render

**Files:**
- Modify: `src/page/GamePlay.tsx`

- [ ] **Step 1: Replace main return statement with `GameLayout`**
  - Use `<GameLayout ... />` as the main wrapper.
  - Pass `handleBackClick` to `onBackClick`.
  - Pass `<RoomInfo label="Room ID" value={room.roomId} bet={room.betToken} />` to `roomInfo`.
  - Pass `{roomStore.room && renderPlayer()}` to `players`.
  - Pass `<Table cards={room.table || []} />` to `table`.
  - Pass `room.status === 'READY' ? renderCountDown() : undefined` to `countdown`.
  - Pass `room.status === 'PLAYING' ? renderWhenPlaying() : renderWhenWaiting()` to `bottom`.
  - Pass the chat UI logic to the `chat` prop.
  - Pass `!isConnected` to `isDisconnected`.

### Task 4: Verification

**Files:**
- Run: `npx tsc --noEmit`

- [ ] **Step 1: Run TypeScript check**
  - Ensure there are no compilation errors.
