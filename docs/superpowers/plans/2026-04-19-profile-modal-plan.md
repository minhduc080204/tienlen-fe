# Profile Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a 3-tab Profile Modal displaying user information, match history, and transaction history using real API endpoints.

**Architecture:** We will create TypeScript interfaces for the API responses, update the data API client, rename the modal component for consistency, update its import, and implement the modal logic with Framer Motion, Tailwind CSS, and React state for tab switching and data fetching.

**Tech Stack:** React, TypeScript, Tailwind CSS, Framer Motion, Axios.

---

### Task 1: Create Data Types

**Files:**
- Create: `src/type/match-history.ts`
- Create: `src/type/transaction.ts`

- [ ] **Step 1: Create Match History Types**

```typescript
// src/type/match-history.ts
export interface MatchData {
  id: number;
  roomType: string;
  betToken: number;
  startTime: string;
  endTime: string;
  winners: string;
}

export interface MatchParticipant {
  id: number;
  userId: number;
  name: string;
  rank: number;
  tokenChange: number;
  match: MatchData;
}
```

- [ ] **Step 2: Create Transaction Types**

```typescript
// src/type/transaction.ts
export interface Transaction {
  id: number;
  userId: number;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
  referenceId: number | null;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/type/match-history.ts src/type/transaction.ts
git commit -m "feat: add types for match history and transactions"
```

### Task 2: Update Data API

**Files:**
- Modify: `src/api/data.api.ts`

- [ ] **Step 1: Update API Client with Types**

```typescript
// src/api/data.api.ts
import type { UserType } from "../type/user";
import type { MatchParticipant } from "../type/match-history";
import type { Transaction } from "../type/transaction";
import axiosClient from "./axiosClient";
import { API_ENDPOINTS } from "./endpoints";

export const dataApi = {
  profile: () =>
    axiosClient.get<UserType>(API_ENDPOINTS.USER.PROFILE)
    .then(res=>res.data),

  transactions: () =>
    axiosClient.get<Transaction[]>(API_ENDPOINTS.USER.TRANSACTIONS)
    .then(res=>res.data),

  matches: () =>
    axiosClient.get<MatchParticipant[]>(API_ENDPOINTS.USER.MATCHES)
    .then(res=>res.data),
};
```

- [ ] **Step 2: Commit**

```bash
git add src/api/data.api.ts
git commit -m "feat: update data api with correct types and GET methods"
```

### Task 3: Rename and Implement Profile Modal

**Files:**
- Move: `src/components/modals/ProfileModel.tsx` to `src/components/modals/ProfileModal.tsx`
- Modify: `src/ModalRoot.tsx`

- [ ] **Step 1: Rename the component file**

```bash
mv src/components/modals/ProfileModel.tsx src/components/modals/ProfileModal.tsx
```

- [ ] **Step 2: Implement the ProfileModal**

Overwrite `src/components/modals/ProfileModal.tsx` with the following content:

```tsx
// src/components/modals/ProfileModal.tsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useModalStore } from "../../stores/modal.store";
import { dataApi } from "../../api/data.api";
import type { UserType } from "../../type/user";
import type { MatchParticipant } from "../../type/match-history";
import type { Transaction } from "../../type/transaction";
import { formatNumber } from "../../utils/formatNumber";

type TabType = "PROFILE" | "MATCHES" | "TRANSACTIONS";

export default function ProfileModal() {
  const close = useModalStore((s) => s.close);
  const [activeTab, setActiveTab] = useState<TabType>("PROFILE");
  
  const [user, setUser] = useState<UserType | null>(null);
  const [matches, setMatches] = useState<MatchParticipant[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === "PROFILE" && !user) {
          const data = await dataApi.profile();
          setUser(data);
        } else if (activeTab === "MATCHES" && matches.length === 0) {
          const data = await dataApi.matches();
          setMatches(data);
        } else if (activeTab === "TRANSACTIONS" && transactions.length === 0) {
          const data = await dataApi.transactions();
          setTransactions(data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/70 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.25 }}
        className="
          fixed z-50
          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[92vw] max-w-[450px]
          bg-zinc-900 border border-red-700
          rounded-2xl
          shadow-2xl shadow-red-900/30
          overflow-hidden
          flex flex-col
          max-h-[80vh]
        "
      >
        {/* Tabs Header */}
        <div className="flex border-b border-zinc-800 bg-zinc-950">
          <button
            onClick={() => setActiveTab("PROFILE")}
            className={`flex-1 text-center py-3 text-sm font-bold transition ${activeTab === "PROFILE" ? "border-b-2 border-red-500 text-red-500" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            PROFILE
          </button>
          <button
            onClick={() => setActiveTab("MATCHES")}
            className={`flex-1 text-center py-3 text-sm font-bold transition ${activeTab === "MATCHES" ? "border-b-2 border-red-500 text-red-500" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            MATCHES
          </button>
          <button
            onClick={() => setActiveTab("TRANSACTIONS")}
            className={`flex-1 text-center py-3 text-sm font-bold transition ${activeTab === "TRANSACTIONS" ? "border-b-2 border-red-500 text-red-500" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            TRANSACTIONS
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 lg:p-6 overflow-y-auto flex-1 custom-scrollbar">
          {loading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
            </div>
          )}

          {error && !loading && (
             <div className="text-red-500 text-center py-5">{error}</div>
          )}

          {!loading && !error && activeTab === "PROFILE" && user && (
            <div className="flex items-center gap-5 bg-zinc-950 p-4 rounded-lg">
              <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-red-500 flex items-center justify-center text-3xl overflow-hidden shrink-0">
                {user.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover"/> : "👤"}
              </div>
              <div>
                <div className="text-xl font-bold text-red-500">{user.name}</div>
                <div className="text-zinc-400 text-sm mb-2">{user.id}</div>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-yellow-500">💰</span> {formatNumber(user.tokenBalance)}
                </div>
              </div>
            </div>
          )}

          {!loading && !error && activeTab === "MATCHES" && (
            <div className="bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-900 border-b border-zinc-800">
                  <tr>
                    <th className="p-3 text-zinc-300 font-semibold">Type</th>
                    <th className="p-3 text-zinc-300 font-semibold">Rank</th>
                    <th className="p-3 text-zinc-300 font-semibold">Change</th>
                    <th className="p-3 text-zinc-300 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.length === 0 ? (
                    <tr><td colSpan={4} className="p-4 text-center text-zinc-500">No matches found</td></tr>
                  ) : (
                    matches.map(m => (
                      <tr key={m.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20">
                        <td className="p-3 text-zinc-300">{m.match.roomType}</td>
                        <td className={`p-3 font-bold ${m.rank === 1 ? 'text-red-500' : 'text-zinc-400'}`}>#{m.rank}</td>
                        <td className={`p-3 font-medium ${m.tokenChange > 0 ? 'text-green-500' : m.tokenChange < 0 ? 'text-red-500' : 'text-zinc-400'}`}>
                          {m.tokenChange > 0 ? '+' : ''}{m.tokenChange}
                        </td>
                        <td className="p-3 text-zinc-500 text-xs">{formatDate(m.match.startTime)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && activeTab === "TRANSACTIONS" && (
            <div className="flex flex-col gap-3">
              {transactions.length === 0 ? (
                 <div className="text-center text-zinc-500 py-4">No transactions found</div>
              ) : (
                transactions.map(tx => (
                  <div key={tx.id} className={`bg-zinc-950 p-3 rounded-lg border-l-4 ${tx.amount > 0 ? 'border-green-500' : tx.amount < 0 ? 'border-red-500' : 'border-zinc-500'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-zinc-200">{tx.type}</span>
                      <span className={`font-bold ${tx.amount > 0 ? 'text-green-500' : tx.amount < 0 ? 'text-red-500' : 'text-zinc-400'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mb-1">{tx.description}</div>
                    <div className="text-[10px] text-zinc-500">{formatDate(tx.createdAt)}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
```

- [ ] **Step 3: Update ModalRoot import**

```typescript
// src/ModalRoot.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useModalStore } from "./stores/modal.store";
import CreateRoomModal from "./components/modals/CreateRoomModel";
import SettingsModal from "./components/modals/SettingsModal";
import JoinRoomModal from "./components/modals/JoinRoomModal";
import ChatTab from "./components/ChatTab";
import BotPlayModal from "./components/modals/BotPlayModal";
import BotPlayOfflineModal from "./components/modals/BotPlayOfflineModal";
import ProfileModal from "./components/modals/ProfileModal";

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
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.25 }}
          >
            {modal === "PROFILE" && <ProfileModal />}
            {modal === "SETTINGS" && <SettingsModal />}
            {modal === "CREATE_ROOM" && <CreateRoomModal />}
            {modal === "JOIN_ROOM" && <JoinRoomModal />}
            {modal === "CHAT_ROOM" && <ChatTab />}
            {modal === "BOT_PLAY" && <BotPlayModal />}
            {modal === "BOT_OFFLINE_PLAY" && <BotPlayOfflineModal />}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/modals/ProfileModal.tsx src/ModalRoot.tsx
git commit -m "feat: implement profile modal with tabs and data fetching"
```
