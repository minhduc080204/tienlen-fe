# Profile Modal Design Spec

This specification defines the implementation of the `ProfileModal` in the Tien Len game frontend.

## 1. Overview
The `ProfileModal` provides users with a comprehensive view of their account information, match history, and token transactions. It uses a tabbed interface for organized data presentation.

## 2. Architecture & UI
- **Modal Component:** `src/components/modals/ProfileModal.tsx` (renamed from `ProfileModel.tsx`).
- **Styling:** Tailwind CSS with a dark theme (Zinc-900), red accents (Red-700/900), and Framer Motion for animations.
- **Tab Layout:** Three horizontal tabs stretching across the full width of the modal header.
    - **PROFILE**
    - **MATCHES**
    - **TRANSACTIONS**

## 3. Data Requirements & API Integration
Data is fetched from `dataApi` (defined in `src/api/data.api.ts`).

### 3.1 Profile Tab
- **Endpoint:** `GET /users/me` (via `dataApi.profile()`)
- **Display:**
    - Avatar (Circular, red border).
    - User Name (Large, red accent).
    - Account Email/ID.
    - Token Balance (with 💰 icon).

### 3.2 Matches Tab
- **Endpoint:** `GET /users/matches` (via `dataApi.matches()`)
- **Display:** Table with columns:
    - **Type:** Room type (e.g., PVP, PVB).
    - **Rank:** User's finishing rank (e.g., #1 in red/bold).
    - **Change:** Token win/loss (e.g., +400 in green, -100 in red).
    - **Time:** Start time of the match.

### 3.3 Transactions Tab
- **Endpoint:** `GET /users/transactions` (via `dataApi.transactions()`)
- **Display:** Vertical list of transaction cards:
    - **Type:** Transaction type (e.g., GAME_WIN, GAME_BET).
    - **Amount:** Colored based on positive/negative value.
    - **Description:** Context of the transaction.
    - **Time:** Formatted creation date.

## 4. State Management
- **Modal Control:** Managed via `useModalStore` (Zustand).
- **Active Tab:** Local component state (`useState`).
- **Data Fetching:** Managed within the component using `useEffect` and `useState` for loading/data.

## 5. Technical Details
- **Renaming:** `ProfileModel.tsx` -> `ProfileModal.tsx` for consistency.
- **Icon Usage:** Reuse icons from `src/assets/icons/` where applicable (e.g., `MoneyIcon`, `TokenIcon`).
- **Date Formatting:** Use standard locale strings or a utility if available.
