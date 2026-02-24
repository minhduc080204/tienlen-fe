import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./auth.store";
import type { SocketResponseType } from "../type/socket-response";
import type { ChatType } from "../type/chat";

type SocketStore = {
  socket: WebSocket | null;
  roomId: number | null;
  wsUrl: string | null;
  isConnected: boolean,
  messages: ChatType[];
  connect: (roomId: number, wsUrl: string) => void;
  disconnect: () => void;
  sendChat: (content: string) => void;
  reconnect: () => void,
};

let reconnectTimer: any = null;
export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  roomId: null,
  wsUrl: null,
  isConnected: false,
  messages: [],

  connect: (roomId, wsUrl) => {
    set((state) => {
      if (state.socket) return state;
      const token = useAuthStore.getState().token;;
      const url = `${import.meta.env.VITE_WS_BASE_URL}${wsUrl}&token=${token}`;
      console.log("URL", url);

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
          const res: SocketResponseType<ChatType> = JSON.parse(e.data);
          console.log("T got", res);

          if (res.action === "CHAT") {
            set(
              (state): Partial<SocketStore> => ({
                messages: [...state.messages, res.data],
              }),
            );
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

        get().reconnect();
      };

      return { socket };
    });
  },

  disconnect: () => {
    get().socket?.close();
    set({ 
      socket: null, 
      roomId: null,
      wsUrl: null,
      isConnected: false 
    });
  },

  sendChat: (content: string) => {
    const socket = get().socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const message = {
      action: "CHAT",
      content,
      roomId: get().roomId,
    };

    socket.send(JSON.stringify(message));
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
