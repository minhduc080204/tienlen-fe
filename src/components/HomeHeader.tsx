import { MoneyIcon } from "../assets/icons/MoneyIcon";
import { PlusIcon } from "../assets/icons/PlusIcon";
import { TokenIcon } from "../assets/icons/TokenIcon";
import { useAuthStore } from "../stores/auth.store";
import { formatNumber } from "../utils/formatNumber";
import SettingsButton from "./SettingsButton";

export default function HomeHeader() {
    const user = useAuthStore.getState().user
    return (
        <div className="w-full flex justify-center">
            <div className=" w-4/5 flex items-center justify-around">

                <div className=" flex items-center gap-4px-4 py-2">
                    <img
                        src="https://i.pravatar.cc/100"
                        className="w-12 h-12 rounded-full border-2 border-red-500/80 "
                    />

                    <div className="text-white bg-stone-700/20 rounded-full backdrop-blur-md p-2 pr-6">
                        <p className="text-lg font-semibold">minhduc82</p>
                        <p>🟢<label className="text-md text-white/80">Online</label></p>
                    </div>
                </div>

                <div className="relative">
                    <TokenIcon
                        className="
                            absolute
                            z-1 -left-4 -top-3
                            w-16
                            drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]
                        "
                    />
                    <div className="
                            backdrop-blur-md
                            bg-amber-50/10
                            text-2xl text-white/90                            
                            rounded-full
                            px-1 py-0.5
                            flex items-center gap-10
                            shadow-lg
                            border-1 border-yellow-500/60

                        "
                    >
                        <p className="font-semibold ml-20">
                            {formatNumber(user?.tokenBalance)}
                        </p>

                        <PlusIcon className="
                                w-7 h-7 cursor-pointer hover:scale-130 transition
                            "
                        />
                    </div>

                </div>

                <div className="relative">
                    <MoneyIcon
                        className="
                            absolute
                            z-1 -left-4 -top-5
                            w-16
                            drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]
                        "
                    />
                    <div className="
                            backdrop-blur-md
                            bg-amber-50/10
                            text-2xl text-white/90                            
                            rounded-full
                            px-1 py-0.5
                            flex items-center gap-10
                            shadow-lg
                        "
                    >
                        <p className="font-semibold ml-20">
                            100.000.000
                        </p>

                        <PlusIcon
                            className="
                                w-7 h-7
                            "
                        />
                    </div>

                </div>
                <div className="relative">
                    <MoneyIcon
                        className="
                            absolute
                            z-1 -left-4 -top-5
                            w-16
                            drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]
                        "
                    />
                    <div className="
                            backdrop-blur-md
                            bg-amber-50/10
                            text-2xl text-white/90                            
                            rounded-full
                            px-1 py-0.5
                            flex items-center gap-10
                            shadow-lg
                        "
                    >
                        <p className="font-semibold ml-20">
                            100.000.000
                        </p>

                        <PlusIcon
                            className="
                                w-7 h-7
                            "
                        />
                    </div>

                </div>

                <SettingsButton />
            </div>
        </div>
    );
}
