import toast from "react-hot-toast";
import { create } from "zustand";
import type { ActionType } from "../type/action";
import type { SocketRequestType } from "../type/socket-request";
import { useAuthStore } from "./auth.store";
import { useChatStore } from "./chat.store";
import { useRoomStore } from "./room.store";
import { useSoundStore } from "./sound.store";

type SocketStore = {
  socket: WebSocket | null;
  roomId: number | null;
  wsUrl: string | null;
  isConnected: boolean;

  connect: (roomId: number, wsUrl: string) => void;
  disconnect: () => void;
  sendChat: (content: string) => void;
  sendReady: () => void;
  sendAttack: (cardIds: string[]) => void;
  sendPass: () => void;  
  sendUnReady: () => void;  
  reconnect: () => void;
};

let reconnectTimer: any = null;
export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  roomId: null,
  wsUrl: null,
  isConnected: false,

  connect: (roomId, wsUrl) => {
    set((state) => {
      if (state.socket) return state;
      const token = useAuthStore.getState().token;;
      const url = `${import.meta.env.VITE_WS_BASE_URL}${wsUrl}&token=${token}`;

      const socket = new WebSocket(url);

      socket.onopen = () => {
        clearTimeout(reconnectTimer);

        set({
          socket,
          roomId,
          wsUrl,
          isConnected: true,
        });
        console.log("🟢 WebSocket connected");
      };

      socket.onmessage = (e) => {
        try {
          const res = JSON.parse(e.data);
          const action = res.action as ActionType
          // console.log("T got", res);
          

          switch (action) {
            case "CHAT":
              useSoundStore.getState().chattingReceived();
              useChatStore.getState().addMessage(res.data);
              break;            

            case "JOIN_ROOM":
              useSoundStore.getState().joinRoom();
              useRoomStore.getState().addPlayer(res.data);
              break;

            case "LEFT_ROOM":
              useSoundStore.getState().leftRoom();
              useRoomStore.getState().removePlayer(res.data.userId);
              break;

            case "READY":
              useRoomStore.getState().setReady(res.data.userId);
              break;

            case "UNREADY":
              useRoomStore.getState().setUnReady(res.data.userId);
              break;

            case "START_COUNTDOWN":
              useRoomStore.getState().setStartCountdown();
              break;

            case "NEXT_TURN":
              useRoomStore.getState().setNextTurn(res.data.currentTurn);
              break;

            case "ATTACK":
              if (res.data.table.length > 0) {
                useSoundStore.getState().playCard();
              }
              useRoomStore.getState().setTable(res.data.table);
              break;

            case "START_GAME":
              useSoundStore.getState().dealingCard();
              // useRoomStore.getState().setStartCountdown();
              break;

            case "SYNC_DATA":
              useRoomStore.getState().setRoomType(res.data);
              break;

            case "GAME_MESSAGE":
              useRoomStore.getState().setGameMessage(res.data);
              break;
          
            default:
              break;
          }

        } catch (e) {
          console.error("❌ Parse message error", e);
          toast.error("❌ Lỗi khi gửi tin nhắn");
        }
      };

      socket.onerror = (e) => {
        console.log("🔴 WS closed → reconnecting...", e);
        set({ socket: null, isConnected: false });
        get().reconnect();
      };

      socket.onclose = () => {
        console.log("🔴 WebSocket disconnected");
          set({
          socket: null,
          isConnected: false,
        });

        // get().reconnect();
      };

      return { socket };
    });
  },
  
  sendChat: (content: string) => {
    const socket = get().socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const message: SocketRequestType<string> = {
      action: "CHAT",
      data: content
    };

    socket.send(JSON.stringify(message));
  },

  sendReady: () => {
    const socket = get().socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const message: SocketRequestType<null> = {
      action: "READY",
      data: null,
    };

    socket.send(JSON.stringify(message));
  },
  sendUnReady: () => {
    const socket = get().socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const message: SocketRequestType<null> = {
      action: "UNREADY",
      data: null,
    };

    socket.send(JSON.stringify(message));
  },

  sendAttack: (cardIds: string[]) => {
    const socket = get().socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const message: SocketRequestType<string[]> = {
      action: "ATTACK",
      data: cardIds
    };
    socket.send(JSON.stringify(message));
  },

  sendPass: () => {
    const socket = get().socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const message: SocketRequestType<null> = {
      action: "PASS",
      data: null,
    };
    socket.send(JSON.stringify(message)); 
  },

  disconnect: () => {
    console.log("JUST DISCONECT !!!!");
    
    get().socket?.close();
    set({ 
      socket: null, 
      roomId: null,
      wsUrl: null,
      isConnected: false 
    });
  },

  reconnect: () => {
    const { roomId, wsUrl } = get();
    
    if (!roomId || !wsUrl) return;

    reconnectTimer = setTimeout(() => {
      console.log("🔁 Reconnecting WS...");
      get().connect(roomId, wsUrl);
    }, 2000);
  },
}));
