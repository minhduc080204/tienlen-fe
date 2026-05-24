import { useMemo } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Layers, 
  Coins, 
  Swords, 
  PlusCircle, 
  Sparkles, 
  TrendingUp, 
  ChevronRight,
  Smile
} from 'lucide-react';

export default function Dashboard() {
  const { stats, transactions, matches } = useAdmin();
  const navigate = useNavigate();

  // Get recent 5 transactions
  const recentTransactions = transactions
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Compute game mode distribution for standard CSS charts
  const modeStats = useMemo(() => {
    const total = matches.length || 1;
    const bot = matches.filter(m => m.mode === 'BOT').length;
    const offline = matches.filter(m => m.mode === 'OFFLINE').length;
    const multi = matches.filter(m => m.mode === 'MULTIPLAYER').length;

    return {
      botPercent: Math.round((bot / total) * 100),
      offlinePercent: Math.round((offline / total) * 100),
      multiPercent: Math.round((multi / total) * 100),
      bot,
      offline,
      multi
    };
  }, [matches]);

  const cards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      subtext: `${stats.activeUsers} tài khoản đang hoạt động`,
      icon: Users,
      color: "from-blue-600/20 to-indigo-600/10 border-blue-500/30 text-blue-400",
      path: "/admin/users"
    },
    {
      title: "Cửa hàng NFTs",
      value: stats.totalNFTs,
      subtext: "Vật phẩm Card Skin hoạt động",
      icon: Layers,
      color: "from-yellow-600/20 to-amber-600/10 border-yellow-500/30 text-yellow-400",
      path: "/admin/nfts"
    },
    {
      title: "Khối lượng giao dịch",
      value: `${stats.totalVolumeMatic} MATIC`,
      subtext: "Doanh thu xác thực trên chuỗi",
      icon: Coins,
      color: "from-emerald-600/20 to-teal-600/10 border-emerald-500/30 text-emerald-400",
      path: "/admin/transactions"
    },
    {
      title: "Trận đấu hoạt động",
      value: stats.activeMatches,
      subtext: `Tổng ${stats.totalMatchesPlayed} phòng đã khởi tạo`,
      icon: Swords,
      color: "from-rose-600/20 to-pink-600/10 border-rose-500/30 text-rose-400",
      path: "/admin/matches"
    }
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-stone-900 via-stone-900 to-yellow-950/20 border border-stone-850 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="flex flex-col gap-1 z-10">
          <h2 className="text-xl lg:text-2xl font-extrabold text-white flex items-center gap-2">
            Chào mừng trở lại, Admin <Sparkles className="text-yellow-500 fill-yellow-500/20 w-5 h-5 animate-pulse" />
          </h2>
          <p className="text-xs text-stone-400 font-semibold tracking-wide">
            Đây là giao diện tổng quan dữ liệu thời gian thực của ứng dụng Tiến Lên miền Nam.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 z-10">
          <button 
            onClick={() => navigate('/admin/nfts')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-yellow-500 text-stone-950 hover:bg-yellow-400 rounded-xl transition-all cursor-pointer shadow-md"
          >
            <PlusCircle size={14} />
            <span>Thêm NFT Skin</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(card.path)}
              className={`
                bg-linear-to-br ${card.color}
                border p-5 rounded-2xl flex flex-col justify-between gap-4 cursor-pointer
                hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200 shadow-md group
              `}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{card.title}</span>
                <div className="p-2 rounded-xl bg-stone-950/40 border border-stone-800">
                  <Icon size={18} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl lg:text-3xl font-black text-white group-hover:text-yellow-400 transition-colors">
                  {card.value}
                </span>
                <span className="text-[11px] text-stone-400 font-bold">{card.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Stats breakdown and lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Distribution + Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Mode Distribution Chart */}
          <div className="bg-stone-950/80 border border-stone-850 rounded-2xl p-5 flex flex-col gap-6 backdrop-blur-md">
            <div>
              <h3 className="text-sm font-extrabold text-stone-200 uppercase tracking-wider flex items-center gap-2">
                 Phân bổ Chế độ chơi
              </h3>
              <p className="text-xs text-stone-500 font-semibold mt-1">
                Tỉ lệ các loại phòng đang được tạo và vận hành trên hệ thống
              </p>
            </div>

            {/* Distribution CSS Bar Chart */}
            <div className="flex flex-col gap-4">
              <div className="h-4 w-full bg-stone-900 rounded-full overflow-hidden flex border border-stone-850">
                <div 
                  style={{ width: `${modeStats.multiPercent}%` }}
                  className="bg-yellow-500 hover:brightness-110 transition-all duration-300"
                  title={`Multiplayer: ${modeStats.multiPercent}%`}
                />
                <div 
                  style={{ width: `${modeStats.botPercent}%` }}
                  className="bg-blue-500 hover:brightness-110 transition-all duration-300"
                  title={`AI Bot: ${modeStats.botPercent}%`}
                />
                <div 
                  style={{ width: `${modeStats.offlinePercent}%` }}
                  className="bg-stone-600 hover:brightness-110 transition-all duration-300"
                  title={`Offline: ${modeStats.offlinePercent}%`}
                />
              </div>

              {/* Labels Grid */}
              <div className="grid grid-cols-3 gap-4 text-center mt-2">
                <div className="flex flex-col gap-1 items-center p-2 rounded-xl bg-stone-900/30 border border-stone-850">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span>Mạng (Multi)</span>
                  </div>
                  <span className="text-sm font-black text-white mt-0.5">{modeStats.multi}</span>
                  <span className="text-[10px] text-stone-500 font-bold">{modeStats.multiPercent}%</span>
                </div>

                <div className="flex flex-col gap-1 items-center p-2 rounded-xl bg-stone-900/30 border border-stone-850">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Robot (Bot)</span>
                  </div>
                  <span className="text-sm font-black text-white mt-0.5">{modeStats.bot}</span>
                  <span className="text-[10px] text-stone-500 font-bold">{modeStats.botPercent}%</span>
                </div>

                <div className="flex flex-col gap-1 items-center p-2 rounded-xl bg-stone-900/30 border border-stone-850">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-650" />
                    <span>Ngoại tuyến</span>
                  </div>
                  <span className="text-sm font-black text-white mt-0.5">{modeStats.offline}</span>
                  <span className="text-[10px] text-stone-500 font-bold">{modeStats.offlinePercent}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-stone-950/80 border border-stone-850 rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-stone-200 uppercase tracking-wider">
              Lối tắt tác vụ nhanh
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => navigate('/admin/users?action=create')}
                className="flex items-center justify-between p-3.5 rounded-xl border border-stone-850 hover:border-stone-750 bg-stone-900/40 hover:bg-stone-900/80 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Users size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">Thêm người dùng mới</h4>
                    <p className="text-[10px] text-stone-500">Cấp tài khoản và số dư</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-stone-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => navigate('/admin/nfts?action=create')}
                className="flex items-center justify-between p-3.5 rounded-xl border border-stone-850 hover:border-stone-750 bg-stone-900/40 hover:bg-stone-900/80 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">Đăng bán Card Skin</h4>
                    <p className="text-[10px] text-stone-500">Tạo NFT mới cho cửa hàng</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-stone-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => navigate('/admin/avatars?action=create')}
                className="flex items-center justify-between p-3.5 rounded-xl border border-stone-850 hover:border-stone-750 bg-stone-900/40 hover:bg-stone-900/80 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Smile size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">Cấu hình Avatar mẫu</h4>
                    <p className="text-[10px] text-stone-500">Thêm mới bộ Avatar</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-stone-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Transactions Feed */}
        <div className="bg-stone-950/80 border border-stone-850 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-stone-200 uppercase tracking-wider">Giao dịch gần đây</h3>
            <button
              onClick={() => navigate('/admin/transactions')}
              className="text-[10px] font-extrabold text-yellow-500 hover:text-yellow-400 uppercase tracking-wider flex items-center gap-0.5"
            >
              <span>Tất cả</span>
              <ChevronRight size={12} />
            </button>
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[360px] custom-scrollbar pr-1">
            {recentTransactions.map((tx) => {
              const isPurchase = tx.type === 'PURCHASE_NFT';
              const isDeposit = tx.type === 'DEPOSIT';
              const isSuccess = tx.status === 'SUCCESS';

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-900 bg-stone-900/30 hover:bg-stone-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 border ${
                      isDeposit 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : isPurchase 
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {isDeposit ? <TrendingUp size={14} /> : <Coins size={14} />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-200 truncate">{tx.userName}</h4>
                      <p className="text-[9px] text-stone-500 font-semibold uppercase tracking-wider truncate mt-0.5">
                        {isDeposit ? 'Nạp tiền' : isPurchase ? 'Mua NFT' : 'Rút tiền'} • {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-black block ${
                      isDeposit ? 'text-emerald-400' : 'text-yellow-400'
                    }`}>
                      {isDeposit ? '+' : '-'}{tx.amount} MATIC
                    </span>
                    <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border inline-block mt-1 ${
                      isSuccess 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : tx.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}

            {recentTransactions.length === 0 && (
              <div className="h-full flex items-center justify-center text-stone-600 text-xs font-medium py-12">
                Chưa có giao dịch nào được ghi nhận.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
