import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { ROUTES } from '../routes/routes';
import { ShieldAlert, Sparkles, Home } from 'lucide-react';
import { gameToast } from './ui/toast';

export function AdminRoute() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  
  // Elevate current user to Admin for development/auditing
  const handleElevateRole = () => {
    if (user) {
      useAuthStore.setState({
        user: {
          ...user,
          role: 'ADMIN'
        }
      });
      gameToast.success("🔑 Đã cấp quyền ADMIN thành công! Chào mừng tới Hệ thống Quản trị.");
    } else {
      gameToast.error("Vui lòng đăng nhập trước khi cấp quyền!");
    }
  };

  // If not logged in at all, redirect to login page
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If role is not admin, show custom Access Denied screen
  if (user?.role !== 'ADMIN') {
    return (
      <div className="fixed inset-0 bg-stone-950 flex flex-col items-center justify-center p-4 font-sans select-none text-stone-100">
        {/* Glow glow */}
        <div className="absolute w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="bg-stone-900 border border-stone-850 p-8 rounded-2xl max-w-md w-full text-center flex flex-col items-center gap-6 shadow-2xl relative">
          <div className="p-4 rounded-full bg-red-950/20 text-red-500 border border-red-500/30 animate-bounce">
            <ShieldAlert size={48} />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-black uppercase text-yellow-500 tracking-wider">Từ chối truy cập!</h1>
            <p className="text-xs text-stone-400 font-semibold leading-relaxed">
              Bạn không có đủ thẩm quyền truy cập Hệ thống Quản trị. Trang này chỉ dành riêng cho tài khoản có phân quyền <span className="text-red-400 font-extrabold uppercase bg-red-900/20 px-1.5 py-0.5 rounded border border-red-900/30">ADMIN</span>.
            </p>
          </div>

          {/* Dev Bypass Section */}
          <div className="w-full bg-stone-950 border border-stone-850 rounded-xl p-4 flex flex-col gap-3">
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block">
              🔧 Hộp cát thử nghiệm (Sandbox)
            </span>
            <p className="text-[10px] text-stone-400 font-semibold leading-normal">
              Đang ở môi trường kiểm thử. Nhấp bên dưới để giả lập quyền Admin cho tài khoản hiện tại của bạn.
            </p>
            <button
              onClick={handleElevateRole}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-stone-950 font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md select-none"
            >
              <Sparkles size={12} className="fill-stone-950" />
              <span>Kích hoạt quyền Admin</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full">
            <Link
              to={ROUTES.HOME}
              className="flex-1 bg-stone-950 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
            >
              <Home size={14} />
              <span>Sảnh chính</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin: Proceed to child routes
  return <Outlet />;
}
