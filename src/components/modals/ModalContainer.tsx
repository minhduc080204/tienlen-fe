import { motion } from "framer-motion";
import { useModalStore } from "../../stores/modal.store";

export const ModalContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const close = useModalStore((s) => s.close);
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
            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25 }}
                className={`
                    fixed z-50
                    top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    bg-zinc-900 border border-red-700
                    rounded-2xl p-4 lg:p-6
                    shadow-2xl shadow-red-900/30
                    ${className}
                `}
            >
                {/* Modal Content */}
                {children}
            </motion.div>
        </>
    );
};