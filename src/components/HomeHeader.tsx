import { MoneyIcon } from "../assets/icons/MoneyIcon";
import { PlusIcon } from "../assets/icons/PlusIcon";
import { TokenIcon } from "../assets/icons/TokenIcon";
import { useAuthStore } from "../stores/auth.store";
import { useModalStore } from "../stores/modal.store";
import { formatNumber } from "../utils/formatNumber";
import SettingsButton from "./SettingsButton";
import { Button } from "./ui/Button";

export default function HomeHeader() {
    const user = useAuthStore.getState().user;
    const openModal = useModalStore((s) => s.open);
    return (
        <div className="w-full flex justify-center px-3 py-2 lg:py-0">
            <div className="w-full lg:w-4/5 flex items-center justify-between lg:justify-around gap-2 lg:gap-0">

                {/* Avatar + Name */}
                <Button className="flex items-center gap-2" onClick={()=>openModal('PROFILE')}>
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
                <div className="flex items-center gap-6">
                    {/* Token */}
                    <div className="relative">
                        <TokenIcon
                            className="
                                absolute z-1 -left-3 -top-2.5
                                w-10 lg:w-16
                                drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]
                            "
                        />
                        <div className="
                            backdrop-blur-md bg-amber-50/10
                            text-white/90
                            rounded-full
                            px-1 py-0.5
                            flex items-center gap-3 lg:gap-10
                            shadow-lg border border-yellow-500/60
                        ">
                            <p className="font-semibold ml-9 lg:ml-20 pr-1 lg:pr-0 text-sm lg:text-2xl">
                                {formatNumber(user?.tokenBalance)}
                            </p>
                            <PlusIcon className="w-5 h-5 lg:w-7 lg:h-7 cursor-pointer hover:scale-125 transition" />
                        </div>
                    </div>

                    {/* Money — ẩn trên mobile nhỏ, hiện từ sm+ */}
                    <div className="relative hidden sm:block">
                        <MoneyIcon
                            className="
                                absolute z-1 -left-3 -top-3.5
                                w-10 lg:w-16
                                drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]
                            "
                        />
                        <div className="
                            backdrop-blur-md bg-amber-50/10
                            text-white/90
                            rounded-full
                            px-1 py-0.5
                            flex items-center gap-3 lg:gap-10
                            shadow-lg
                        ">
                            <p className="font-semibold ml-9 lg:ml-20 pr-1 lg:pr-0 text-sm lg:text-2xl">
                                100.000.000
                            </p>
                            <PlusIcon className="w-5 h-5 lg:w-7 lg:h-7" />
                        </div>
                    </div>
                </div>

                <SettingsButton />
            </div>
        </div>
    );
}
