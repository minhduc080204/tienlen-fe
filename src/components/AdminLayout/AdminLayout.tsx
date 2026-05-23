import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { ROUTES } from '../../routes/routes';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Swords, 
  History, 
  LogOut, 
  Home, 
  Menu, 
  X, 
  ShieldCheck,
  Smile
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Người Dùng', path: '/admin/users', icon: Users },
    { name: 'NFTs Card Skin', path: '/admin/nfts', icon: Layers },
    { name: 'Ảnh Đại Diện', path: '/admin/avatars', icon: Smile },
    { name: 'Trận Đấu', path: '/admin/matches', icon: Swords },
    { name: 'Giao Dịch', path: '/admin/transactions', icon: History },
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex font-sans antialiased overflow-hidden">
      {/* 💻 Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-stone-800/80 bg-stone-900/60 backdrop-blur-xl shrink-0 z-20">
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-stone-800/60 bg-stone-950/20">
          <div className="p-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <ShieldCheck className="text-yellow-500 w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wider uppercase text-yellow-500 bg-clip-text">
              Tien Len Admin
            </h1>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">Quản trị hệ thống</p>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
                  ${active 
                    ? 'bg-yellow-500 text-stone-950 shadow-md shadow-yellow-500/10' 
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                  }
                `}
              >
                <Icon size={18} className={`transition-transform duration-200 group-hover:scale-105 ${active ? 'text-stone-950' : 'text-stone-400 group-hover:text-yellow-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-stone-800/80 bg-stone-950/30 flex flex-col gap-2">
          {/* Back to Home Button */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-stone-400 hover:text-white hover:bg-stone-800/50 transition-colors"
          >
            <Home size={16} />
            <span>Trở về trò chơi</span>
          </Link>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer w-full text-left"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* 📱 Mobile Sidebar / Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={() => setMobileOpen(false)}
          />
          
          <aside className="relative flex flex-col w-64 bg-stone-900 border-r border-stone-800 h-full z-50 animate-slide-in">
            {/* Mobile Header close */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-yellow-500 w-5 h-5" />
                <span className="font-extrabold text-sm tracking-wider uppercase text-yellow-500">Tien Len Admin</span>
              </div>
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                      ${active 
                        ? 'bg-yellow-500 text-stone-950' 
                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-stone-800 flex flex-col gap-2 bg-stone-950/20">
              <Link
                to={ROUTES.HOME}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-stone-400 hover:text-white transition-colors"
              >
                <Home size={16} />
                <span>Trở về trò chơi</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 transition-colors w-full text-left"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 🖥️ Main Workspace Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Sticky Top Header */}
        <header className="h-16 border-b border-stone-800/80 bg-stone-900/40 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 shrink-0 z-10 select-none">
          {/* Hamburger button (Mobile) */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition-all cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <span className="font-extrabold text-sm uppercase text-yellow-500 tracking-wider">Admin</span>
          </div>

          <div className="hidden lg:block">
            {/* Breadcrumb or Title placeholder based on route */}
            <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-widest">
              <span>Hệ Thống</span>
              <span>/</span>
              <span className="text-stone-300">
                {menuItems.find(item => isActive(item.path))?.name || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* User Status Section */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <h3 className="text-xs font-bold text-stone-200">{user?.name || 'Quản trị viên'}</h3>
              <p className="text-[10px] text-yellow-500 font-extrabold tracking-wider uppercase">
                {user?.role || 'ADMIN'}
              </p>
            </div>
            
            <div className="relative">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-9 h-9 rounded-xl border border-yellow-500/40 bg-stone-800/50 p-0.5 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl border border-stone-700 bg-stone-800 flex items-center justify-center font-bold text-sm text-yellow-500">
                  A
                </div>
              )}
              {/* Online green indicator badge */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-stone-900" />
            </div>
          </div>
        </header>

        {/* Scrollable Panel content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 relative">
          <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full animate-fade-in pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
