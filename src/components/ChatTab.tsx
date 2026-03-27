import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSocketStore } from "../stores/socket.store";
import { useAuthStore } from "../stores/auth.store";
import toast from "react-hot-toast";
import { useChatStore } from "../stores/chat.store";
import { Button } from "./ui/Button";
import { useModalStore } from "../stores/modal.store";

export default function ChatTab() {
    const close = useModalStore((s) => s.close);
    const sendChatSocket = useSocketStore((s) => s.sendChat);
    const [input, setInput] = useState("");
    const messages = useChatStore((state) => state.messages)

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const user = useAuthStore.getState().user
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    const handleSend = () => {
        if (!input.trim()) return toast.error("Hãy nhập tin nhắn");
        sendChatSocket(input)
        setInput("");
    };

    return (
        <>
            {/* Overlay */}
            <motion.div
                className="fixed inset-0 bg-black/70 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
            />

            {/* Modal box */}
            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25 }}
                className="
          fixed z-50
          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[90%] sm:w-[400px] lg:w-[600px]
          bg-zinc-900 border border-red-700
          rounded-2xl p-4 sm:p-6
          shadow-2xl shadow-red-900/30
        "
            >
                <div className="flex-1 flex flex-col p-1 gap-2 sm:gap-3 h-48 sm:h-64 lg:h-[450px]">
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                        {messages.map((m, i) => (
                            <div
                                key={`chatID-${i}`}
                                className={`max-w-[85%] w-fit px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl text-[11px] sm:text-xs lg:text-sm break-words 
                        ${m.user.id === user?.id ? "ml-auto bg-blue-600/80 text-white" : "bg-gray-200 text-gray-900"}`}
                            >
                                <div className="font-semibold text-[9px] sm:text-[10px] lg:text-xs opacity-80 mb-0.5">
                                    <b>#{String(m.user.id).slice(0, 4)} - {m.user.name}:</b> {m.content}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-zinc-800">
                        <input
                            value={input}
                            onChange={(e) => { if (input.length < 100) { setInput(e.target.value) } }}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 px-3 rounded-xl text-white bg-zinc-800 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 h-7 sm:h-9 lg:h-11 text-[11px] sm:text-xs lg:text-sm"
                        />
                        <Button onClick={handleSend} className="rounded-xl h-7 sm:h-9 lg:h-11 px-3 sm:px-4">
                            <Send className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
