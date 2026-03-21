import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/ui/Input";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useSoundStore } from "../stores/sound.store";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import { gameToast } from "../components/ui/toast";
import { authApi } from "../api/auth.api";
import { Spinner } from "../components/ui/Spiner";
import { useAuthStore } from "../stores/auth.store";
import SettingsButton from "../components/SettingsButton";
import { Button } from "../components/ui/Button";

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
      console.log(res);
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
      <div className="absolute inset-0 bg-black/75" />

      {/* Login Card */}
      {isLoading ? (
        <Spinner />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="
          relative z-10 w-[380px]
          rounded-2xl p-7
          bg-gradient-to-b from-zinc-900/95 to-black/90
          border border-red-700/60
          shadow-[0_0_40px_rgba(185,28,28,0.25)]
          backdrop-blur
        "
        >
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-red-500 tracking-wide">
              ♠ TIẾN LÊN ♣
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Multiplayer • Realtime • AI Bot
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label="Account"
              value={account}
              placeholder="Enter your account"
              onChange={setAccount}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={setPassword}
            />

            {/* Login */}
            <Button
              onClick={handleLogin}
              className="
              mt-2 py-2.5 rounded-lg
              bg-red-600 hover:bg-red-500 active:scale-[0.98]
              text-white font-semibold
              transition-all
              shadow-lg shadow-red-900/40
            "
            >
              Đăng nhập
            </Button>

            {/* Register */}
            <Button
              onClick={handleRegister}
              className="
              py-2 rounded-lg
              border border-red-600/70
              text-red-400
              hover:bg-red-600/10
              hover:text-red-300
              transition
            "
            >
              Đăng ký tài khoản
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-zinc-700" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-zinc-700" />
            </div>

            {/* Google */}
            <GoogleLoginButton />
          </div>
        </motion.div>
      )}
    </div>
  );
}
