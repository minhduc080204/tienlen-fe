import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import SettingsButton from "../components/SettingsButton";
import { Button } from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Spinner } from "../components/ui/Spiner";
import { gameToast } from "../components/ui/toast";
import { ROUTES } from "../routes/routes";
import { useSoundStore } from "../stores/sound.store";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [account, setAccount] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const playClick = useSoundStore((s) => s.playClick);
    const navigate = useNavigate();

    const handleRegister = async () => {
        playClick();
        if (isLoading) return;

        playClick();

        if (!validator()) {
            return;
        }

        setIsLoading(true);
        const toastId = gameToast.loading("Đang đăng ký...");

        try {
            await authApi.register({ account, name, password, rePassword });

            gameToast.dismiss(toastId);
            gameToast.success("Đăng ký thành công");
            navigate(ROUTES.LOGIN);
        } catch (err: any) {
            gameToast.dismiss(toastId);
            console.log(err);

            gameToast.error(err.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    };

    const validator = () => {
        if (!account || !password || !rePassword) {
            gameToast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (account.length < 6 || password.length < 6) {
            gameToast.error("Tài khoản và mật khẩu phải dài hơn 6 ký tự");
            return;
        }

        if (password != rePassword) {
            gameToast.error("Mật khẩu chưa khớp");
            return;
        }

        return true;
    }

    const handleLogin = () => {
        playClick();
        navigate(ROUTES.LOGIN);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <SettingsButton isFixed={true} />

            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{ backgroundImage: "url(/bg-login.png)" }}
            />
            <div className="absolute inset-0 bg-black/70" />

            {/* Register Card */}
            {isLoading ? (
                <Spinner />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="
                        relative z-10
                        w-[88vw] max-w-sm
                        landscape:max-w-none landscape:w-auto
                        landscape:flex landscape:flex-row landscape:items-stretch landscape:gap-0
                        rounded-2xl overflow-hidden
                        bg-gradient-to-b from-zinc-900/95 to-black/95
                        border border-red-800/50
                        shadow-[0_0_50px_rgba(185,28,28,0.2)]
                        backdrop-blur-sm
                        lg:w-[420px] lg:max-w-[420px] lg:flex-col lg:p-8 lg:gap-0 lg:overflow-visible lg:rounded-2xl
                        lg:landscape:flex-col lg:landscape:w-[420px]
                    "
                >
                    {/* ── Branding ── */}
                    <div className="
                        flex flex-col items-center justify-center
                        px-5 pt-5 pb-2
                        landscape:px-6 landscape:py-6 landscape:min-w-[148px]
                        landscape:border-r landscape:border-red-900/40
                        landscape:bg-gradient-to-b landscape:from-red-950/30 landscape:to-transparent
                        lg:items-center lg:px-0 lg:pt-0 lg:pb-5
                        lg:landscape:border-r-0 lg:landscape:bg-transparent lg:landscape:min-w-0
                    ">
                        <div className="flex gap-1.5 mb-2 text-red-600/60 text-xs tracking-widest lg:mb-3">
                            <span>♠</span><span>♥</span><span>♦</span><span>♣</span>
                        </div>
                        <h1 className="
                            text-[1.2rem] font-extrabold text-red-500 tracking-wider leading-snug text-center
                            landscape:text-xl
                            lg:text-3xl lg:tracking-wide
                        ">
                            ĐĂNG KÝ<br />TÀI KHOẢN
                        </h1>
                        <p className="text-[9px] text-zinc-500 mt-1.5 tracking-[0.2em] uppercase text-center">
                            Tạo tài khoản • Vào bàn chơi
                        </p>
                    </div>

                    {/* ── Form ── */}
                    <div className="
                        flex flex-col gap-2
                        px-5 pb-5 pt-2
                        landscape:px-5 landscape:py-4 landscape:min-w-[230px] landscape:justify-center
                        lg:px-0 lg:pb-0 lg:pt-0 lg:gap-4
                    ">
                        <Input
                            label="Tài khoản"
                            value={account}
                            placeholder="Nhập tài khoản"
                            onChange={setAccount}
                            onEnter={handleRegister}
                            inputClassName="py-1.5 lg:py-2"
                        />

                        <Input
                            label="Tên hiển thị"
                            value={name}
                            placeholder="Nhập tên của bạn"
                            onChange={setName}
                            onEnter={handleRegister}
                            inputClassName="py-1.5 lg:py-2"
                        />

                        <Input
                            label="Mật khẩu"
                            type="password"
                            value={password}
                            placeholder="Nhập mật khẩu"
                            onChange={setPassword}
                            onEnter={handleRegister}
                            inputClassName="py-1.5 lg:py-2"
                        />

                        <Input
                            label="Xác nhận mật khẩu"
                            type="password"
                            value={rePassword}
                            placeholder="Nhập lại mật khẩu"
                            onChange={setRePassword}
                            onEnter={handleRegister}
                            inputClassName="py-1.5 lg:py-2"
                        />

                        {/* Register */}
                        <Button
                            onClick={handleRegister}
                            className="
                                mt-0.5 py-2 text-sm font-semibold rounded-lg
                                bg-red-600 hover:bg-red-500 active:scale-[0.98]
                                text-white transition-all
                                shadow-md shadow-red-900/40
                                lg:py-2.5 lg:text-base lg:mt-2
                            "
                        >
                            Đăng ký
                        </Button>

                        {/* Back to Login */}
                        <Button
                            onClick={handleLogin}
                            className="
                                py-1.5 text-sm rounded-lg
                                border border-red-700/50
                                text-red-400 hover:bg-red-600/10 hover:text-red-300
                                transition
                                lg:py-2
                            "
                        >
                            Quay lại đăng nhập
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
