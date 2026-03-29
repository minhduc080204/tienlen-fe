import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/ui/Input";
import { useSoundStore } from "../stores/sound.store";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import { gameToast } from "../components/ui/toast";
import { authApi } from "../api/auth.api";
import { Spinner } from "../components/ui/Spiner";
import { useAuthStore } from "../stores/auth.store";
import SettingsButton from "../components/SettingsButton";
import { Button } from "../components/ui/Button";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const loginStore = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const { playClick } = useSoundStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (isLoading) return;

    playClick();
    if (!account || !password) {
      gameToast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    const toastId = gameToast.loading("Đang đăng nhập...");

    try {
      const res = await authApi.login({ account, password });
      loginStore.login(res.token, res.user);

      gameToast.dismiss(toastId);
      gameToast.success("Đăng nhập thành công");
      navigate("/home");
    } catch (err) {
      gameToast.dismiss(toastId);
      gameToast.error("Sai tài khoản hoặc mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (token?: string) => {
    if (isLoading) return;
    if (!token) return gameToast.error("Có lỗi xảy ra");

    playClick();
    setIsLoading(true);
    const toastId = gameToast.loading("Đang đăng nhập...");

    try {
      const res = await authApi.loginWithGoogle(token);

      loginStore.login(res.token, res.user);

      gameToast.dismiss(toastId);
      gameToast.success("Đăng nhập thành công");
      navigate("/home");
    } catch (err) {
      gameToast.dismiss(toastId);
      gameToast.error("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    playClick();
    navigate(ROUTES.REGISTER);
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

      {/* Login Card */}
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
          {/* ── Branding (top on portrait / left on landscape) ── */}
          <div className="
            flex flex-col items-center justify-center
            px-5 pt-5 pb-2
            landscape:px-6 landscape:py-6 landscape:min-w-[148px]
            landscape:border-r landscape:border-red-900/40
            landscape:bg-gradient-to-b landscape:from-red-950/30 landscape:to-transparent
            lg:items-center lg:px-0 lg:pt-0 lg:pb-5
            lg:landscape:border-r-0 lg:landscape:bg-transparent
            lg:landscape:min-w-0
          ">
            <div className="flex gap-1.5 mb-2 text-red-600/60 text-xs tracking-widest lg:mb-3">
              <span>♠</span><span>♥</span><span>♦</span><span>♣</span>
            </div>
            <h1 className="
              text-[1.2rem] font-extrabold text-red-500 tracking-wider leading-snug text-center
              landscape:text-xl
              lg:text-3xl lg:tracking-wide
            ">
              TIẾN LÊN<br />MIỀN NÚI
            </h1>
            <p className="text-[9px] text-zinc-500 mt-1.5 tracking-[0.2em] uppercase text-center">
              Multiplayer • Realtime • AI
            </p>
          </div>

          {/* ── Form (bottom on portrait / right on landscape) ── */}
          <div className="
            flex flex-col gap-2
            px-5 pb-5 pt-2
            landscape:px-5 landscape:py-5 landscape:min-w-[220px] landscape:justify-center
            lg:px-0 lg:pb-0 lg:pt-0 lg:gap-4
          ">
            <Input
              label="Tài khoản"
              value={account}
              placeholder="Nhập tài khoản"
              onChange={setAccount}
              onEnter={handleLogin}
              inputClassName="py-1.5 lg:py-2"
            />

            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              placeholder="Nhập mật khẩu"
              onChange={setPassword}
              onEnter={handleLogin}
              inputClassName="py-1.5 lg:py-2"
            />

            {/* Login */}
            <Button
              onClick={handleLogin}
              className="
                mt-0.5 py-2 text-sm font-semibold rounded-lg
                bg-red-600 hover:bg-red-500 active:scale-[0.98]
                text-white transition-all
                shadow-md shadow-red-900/40
                lg:py-2.5 lg:text-base lg:mt-2
              "
            >
              Đăng nhập
            </Button>

            {/* Register */}
            <Button
              onClick={handleRegister}
              className="
                py-1.5 text-sm rounded-lg
                border border-red-700/50
                text-red-400 hover:bg-red-600/10 hover:text-red-300
                transition
                lg:py-2
              "
            >
              Đăng ký tài khoản
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-2 my-0.5">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[9px] text-zinc-600 tracking-[0.15em] uppercase">hoặc</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Google */}
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={(res) => {
                  handleGoogleLogin(res.credential);
                }}
                onError={() => {
                  console.log("Google Login Failed");
                }}
              />
            </div>

            {/* Offline Mode */}
            <Button
              onClick={() => {
                loginStore.setOfflineMode(true);
                navigate("/home");
              }}
              className="
                py-1.5 text-sm rounded-lg
                border border-zinc-700/50
                text-zinc-400 hover:bg-white/5 hover:text-white
                transition
                lg:py-2
              "
            >
              Chơi Offline
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
