import { motion } from "framer-motion";
import { CartIcon } from "../assets/icons/CartIcon";
import { MoneyIcon } from "../assets/icons/MoneyIcon";
import { PlusIcon } from "../assets/icons/PlusIcon";
import { TokenIcon } from "../assets/icons/TokenIcon";
import { useAuthStore } from "../stores/auth.store";
import { useModalStore } from "../stores/modal.store";
import { formatNumber } from "../utils/formatNumber";
import SettingsButton from "./SettingsButton";
import { Button } from "./ui/Button";

export default function HomeHeader() {
    const user = useAuthStore((s) => s.user);
    const openModal = useModalStore((s) => s.open);
    return (
        <div className="w-full flex justify-center px-3 py-2">
            <div className="w-full lg:w-4/5 flex items-center justify-between lg:justify-around gap-2 lg:gap-0">

                {/* Avatar + Name */}
                <Button className="flex items-center gap-2" onClick={() => openModal('PROFILE')}>
                    <img
                        src={user?.avatarUrl || import.meta.env.VITE_BASE_AVATAR_URL}
                        className="w-9 h-9 lg:w-12 lg:h-12 rounded-full border-2 border-red-500/80 shrink-0"
                    />
                    <div className="text-white bg-stone-700/20 rounded-full backdrop-blur-md px-3 py-1 lg:p-2 lg:pr-6">
                        <p className="text-sm lg:text-lg font-semibold leading-tight">
                            {user?.name ?? "minhduc82"}
                        </p>
                        <p className="text-xs lg:text-sm leading-tight">
                            🟢<label className="text-white/80">Online</label>
                        </p>
                    </div>
                </Button>

                {/* Balances */}
                <div className="flex items-center  gap-6">
                    <motion.div
                        animate={{
                            x: [0, -2, 2, -2, 2, -1, 1, 0],
                            y: [0, 1, -1, 1, -1, 0, 0, 0],
                            rotate: [0, -4, 4, -4, 4, -1, 1, 0]
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                        className="flex items-center"
                    >
                        <Button
                            onClick={() => openModal('NFT_SHOP')}
                            className="
                                w-9 h-9 lg:w-12 lg:h-12 rounded-full
                                backdrop-blur-md
                                bg-amber-500/20 hover:bg-amber-500/30
                                border border-yellow-500/60
                                shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50
                                flex justify-center items-center
                                transition duration-300
                                cursor-pointer
                            "
                        >
                            <CartIcon className="w-7 lg:w-11 object-contain" />
                        </Button>
                    </motion.div>

                    {/* Token */}
                    <div className="relative flex items-center h-7 lg:h-10">
                        <TokenIcon
                            className="
                                absolute z-10 -left-3 top-1/2 -translate-y-1/2
                                w-10 lg:w-16
                                drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]
                            "
                        />
                        <div className="
                            h-full
                            backdrop-blur-md bg-amber-50/10
                            text-white/90
                            rounded-full
                            px-1
                            flex items-center gap-3 lg:gap-10
                            shadow-lg border border-yellow-500/60
                        ">
                            <p className="font-semibold ml-9 lg:ml-20 pr-1 lg:pr-0 text-sm lg:text-2xl leading-none flex items-center">
                                {formatNumber(user?.tokenBalance)}
                            </p>
                            <PlusIcon className="w-5 h-5 lg:w-7 lg:h-7 cursor-pointer hover:scale-125 transition shrink-0" />
                        </div>
                    </div>

                    {/* Money — ẩn trên mobile nhỏ, hiện từ sm+ */}
                    <div className="relative hidden sm:flex items-center h-7 lg:h-10">
                        <MoneyIcon
                            className="
                                absolute z-10 -left-3 top-1/2 -translate-y-1/2
                                w-10 lg:w-16
                                drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]
                            "
                        />
                        <div className="
                            h-full
                            backdrop-blur-md bg-amber-50/10
                            text-white/90
                            rounded-full
                            px-1
                            flex items-center gap-3 lg:gap-10
                            shadow-lg
                        ">
                            <p className="font-semibold ml-9 lg:ml-20 pr-1 lg:pr-0 text-sm lg:text-2xl leading-none flex items-center">
                                100.000.000
                            </p>
                            <PlusIcon className="w-5 h-5 lg:w-7 lg:h-7 cursor-pointer hover:scale-125 transition shrink-0" />
                        </div>
                    </div>
                </div>

                <SettingsButton />
            </div>
        </div>
    );
}
