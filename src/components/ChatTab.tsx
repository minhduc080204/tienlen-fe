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
          w-[320px]
          bg-zinc-900 border border-red-700
          rounded-2xl p-6
          shadow-2xl shadow-red-900/30
        "
            >
                <div className="flex-1 flex flex-col p-1 gap-3 h-60 ">
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {messages.map((m, i) => (
                            <div
                                key={`chatID-${i}`}
                                className={`max-w-[80%] w-fit px-3 py-1 rounded-xl text-sm break-words $
                        ${m.user.id === user?.id ? "ml-auto bg-blue-600/80 text-white" : "bg-gray-200 text-gray-900"}`}
                            >
                                <div className="font-semibold text-xs opacity-80 mb-0.5">
                                    <b>#{m.user.id} - {m.user.name}:</b> {m.content}
                                </div>

                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                        <input
                            value={input}
                            onChange={(e) => { if (input.length < 100) { setInput(e.target.value) } }}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 px-3 rounded-xl text-white border focus:outline-none focus:ring-2 focus:ring-blue-500 h-8 text-sm"
                        />
                        <Button onClick={handleSend} className="rounded-xl">
                            <Send size={16} />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
