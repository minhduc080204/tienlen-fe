# Tien Len FE (React + TypeScript + Vite)

Frontend client for a **Tien Len** card game platform, built with React, TypeScript, and Tailwind CSS.  
This app supports authentication, room-based online gameplay via WebSocket, bot modes, and PWA installation.

## Features

- JWT-based authentication (including Google OAuth login)
- Online multiplayer room flow (create/join/quick-join)
- Real-time gameplay updates via WebSocket
- Bot gameplay modes (online bot API mode and offline local bot mode)
- In-game chat, sound effects, and responsive game UI
- PWA support (installable web app)

## Tech Stack

- **Framework:** React 19 + Vite 7
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **State management:** Zustand
- **HTTP client:** Axios
- **Animation:** Framer Motion
- **Audio:** Howler.js
- **PWA:** vite-plugin-pwa

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+
- A running backend API/WebSocket server compatible with this frontend

## Getting Started

```bash
npm install
npm run dev
```

Default local app URL: `http://localhost:5173`

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_WS_BASE_URL=ws://localhost:8080
VITE_BASE_URL=http://localhost:8080
VITE_BASE_AVATAR_URL=https://i.pravatar.cc/100
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

| Variable | Description |
| --- | --- |
| `VITE_WS_BASE_URL` | Base WebSocket server URL |
| `VITE_BASE_URL` | Base backend URL used for REST API and some media |
| `VITE_BASE_AVATAR_URL` | Fallback avatar URL if user avatar is missing |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID for sign-in |

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Type-check and create production build
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Project Structure

```text
src/
  api/            # API clients and endpoint declarations
  components/     # Shared UI/game components and modals
  page/           # Route-level pages (login, home, gameplay...)
  routes/         # Route constants and route guards
  stores/         # Zustand stores (auth, socket, room, chat, sound...)
  type/           # Shared TypeScript types
  utils/          # Game utilities and bot helper logic
```

## Build for Production

```bash
npm run build
```

Output is generated in `dist/`.

## Deployment Notes

- This project includes a `vercel.json` rewrite setup for SPA routing.
- Make sure environment variables are configured in your deployment platform.
- Ensure the backend/API and WebSocket endpoints are publicly reachable.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License

No license file is currently included.  
For a public repository, add a `LICENSE` file (for example, MIT) before broad reuse.
