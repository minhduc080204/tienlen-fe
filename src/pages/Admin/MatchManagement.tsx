import { useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { AdminTable } from '../../components/AdminTable';
import type { TableColumn } from '../../components/AdminTable';
import type { AdminMatch } from '../../type/admin';
import { 
  Search, 
  Swords, 
  X, 
  Trash2, 
  Edit, 
  Play, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Coins,
  Bot,
  User,
  Users
} from 'lucide-react';
import { gameToast } from '../../components/ui/toast';

export default function MatchManagement() {
  const { matches, updateMatch, deleteMatch, addMatch } = useAdmin();

  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState<'ALL' | 'BOT' | 'OFFLINE' | 'MULTIPLAYER'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'WAITING' | 'PLAYING' | 'FINISHED'>('ALL');

  // Sorting State
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<AdminMatch | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    roomName: '',
    mode: 'MULTIPLAYER' as 'BOT' | 'OFFLINE' | 'MULTIPLAYER',
    betAmount: 1000,
    status: 'WAITING' as 'WAITING' | 'PLAYING' | 'FINISHED',
    playersCount: 1,
    maxPlayers: 4,
    winnerName: '' as string | null
  });

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingMatch(null);
    setFormData({
      roomName: '',
      mode: 'MULTIPLAYER',
      betAmount: 1000,
      status: 'WAITING',
      playersCount: 1,
      maxPlayers: 4,
      winnerName: null
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (match: AdminMatch) => {
    setEditingMatch(match);
    setFormData({
      roomName: match.roomName,
      mode: match.mode,
      betAmount: match.betAmount,
      status: match.status,
      playersCount: match.playersCount,
      maxPlayers: match.maxPlayers,
      winnerName: match.winnerName
    });
    setIsModalOpen(true);
  };

  // Form Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.roomName) {
      gameToast.error("Vui lòng đặt Tên phòng chơi!");
      return;
    }

    try {
      if (editingMatch) {
        await updateMatch(editingMatch.id, formData);
        gameToast.success(`Cập nhật phòng "${formData.roomName}" thành công!`);
      } else {
        await addMatch(formData);
        gameToast.success(`Khởi tạo phòng chơi "${formData.roomName}" thành công!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      gameToast.error("Đã xảy ra lỗi!");
    }
  };

  // Terminate match (Force status update to Finished or delete)
  const handleTerminateMatch = async (match: AdminMatch) => {
    if (match.status === 'FINISHED') {
      if (window.confirm("Bạn muốn xóa bản ghi lịch sử trận đấu này?")) {
        try {
          await deleteMatch(match.id);
          gameToast.success("Đã xóa bản ghi lịch sử!");
        } catch (err) {
          gameToast.error("Xóa bản ghi thất bại!");
        }
      }
      return;
    }

    if (window.confirm(`CẢNH BÁO: Bạn có muốn CƯỠNG CHẾ DỪNG trận đấu đang diễn ra tại phòng "${match.roomName}"? Các đấu thủ sẽ bị đẩy ra sảnh.`)) {
      try {
        await updateMatch(match.id, { 
          status: 'FINISHED', 
          winnerName: 'Cưỡng chế hủy (Hòa)' 
        });
        gameToast.error(`Trận đấu "${match.roomName}" đã bị cưỡng chế dừng hoạt động!`);
      } catch (err) {
        gameToast.error("Dừng trận đấu thất bại!");
      }
    }
  };

  // Filter & Sort
  const filteredMatches = useMemo(() => {
    return matches
      .filter((match) => {
        const matchesSearch = 
          match.roomName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          match.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesMode = modeFilter === 'ALL' || match.mode === modeFilter;
        const matchesStatus = statusFilter === 'ALL' || match.status === statusFilter;

        return matchesSearch && matchesMode && matchesStatus;
      })
      .sort((a, b) => {
        let aVal = a[sortField as keyof AdminMatch] ?? '';
        let bVal = b[sortField as keyof AdminMatch] ?? '';

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = (bVal as string).toLowerCase();
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [matches, searchTerm, modeFilter, statusFilter, sortField, sortOrder]);

  // Paginated records
  const paginatedMatches = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMatches.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMatches, currentPage]);

  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Table Columns Definition
  const columns: TableColumn<AdminMatch>[] = [
    {
      header: "Mã Phòng",
      key: "id",
      sortable: true,
      align: "center",
      render: (match) => <span className="font-mono text-stone-500 text-xs">{match.id}</span>
    },
    {
      header: "Tên Phòng",
      key: "roomName",
      sortable: true,
      render: (match) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-white font-bold text-sm">{match.roomName}</span>
          <span className="text-stone-500 text-[10px]">Được tạo: {new Date(match.createdAt).toLocaleTimeString('vi-VN')}</span>
        </div>
      )
    },
    {
      header: "Chế Độ",
      key: "mode",
      sortable: true,
      align: "center",
      render: (match) => {
        const isBot = match.mode === 'BOT';
        const isOffline = match.mode === 'OFFLINE';

        return (
          <div className="flex items-center justify-center gap-1">
            {isBot ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Bot size={10} />
                <span>AI BOT</span>
              </span>
            ) : isOffline ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-500/10 text-stone-400 border border-stone-700">
                <User size={10} />
                <span>Offline</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                <Users size={10} />
                <span>MẠNG MOKI</span>
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: "Mức Cược (Coin)",
      key: "betAmount",
      sortable: true,
      align: "right",
      render: (match) => {
        const isFree = match.betAmount === 0;
        return (
          <div className={`inline-flex items-center gap-1 font-mono text-xs font-extrabold ${isFree ? 'text-stone-500' : 'text-yellow-400'}`}>
            {!isFree && <Coins size={12} />}
            <span>{isFree ? 'Miễn phí' : match.betAmount.toLocaleString('vi-VN')}</span>
          </div>
        );
      }
    },
    {
      header: "Đấu Thủ",
      key: "playersCount",
      sortable: true,
      align: "center",
      render: (match) => {
        const percent = Math.min(100, (match.playersCount / match.maxPlayers) * 100);
        return (
          <div className="flex flex-col gap-1 items-center w-20">
            <span className="text-xs font-bold text-stone-300">
              {match.playersCount}/{match.maxPlayers}
            </span>
            <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden border border-stone-850">
              <div 
                style={{ width: `${percent}%` }}
                className={`h-full rounded-full ${
                  match.playersCount === match.maxPlayers 
                    ? 'bg-red-500' 
                    : match.playersCount >= 2 
                      ? 'bg-green-500' 
                      : 'bg-amber-500'
                }`}
              />
            </div>
          </div>
        );
      }
    },
    {
      header: "Trạng Thái",
      key: "status",
      sortable: true,
      align: "center",
      render: (match) => {
        const isPlaying = match.status === 'PLAYING';
        const isFinished = match.status === 'FINISHED';

        return (
          <div className="flex justify-center">
            {isPlaying ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-green-500/10 text-green-400 border border-green-500/20 animate-pulse">
                <Play size={10} className="fill-green-500" />
                <span>Đang đánh</span>
              </span>
            ) : isFinished ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-500/10 text-stone-500 border border-stone-700">
                <CheckCircle size={10} />
                <span>Hoàn tất</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Clock size={10} />
                <span>Đang đợi</span>
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: "Người Thắng Cuộc",
      key: "winnerName",
      sortable: true,
      render: (match) => (
        <span className={`text-xs font-semibold ${match.winnerName ? 'text-yellow-400 font-extrabold' : 'text-stone-550'}`}>
          {match.winnerName || 'Chưa xác định'}
        </span>
      )
    },
    {
      header: "Lựa Chọn",
      key: "actions",
      align: "center",
      render: (match) => {
        const isActive = match.status === 'PLAYING' || match.status === 'WAITING';
        return (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => handleOpenEditModal(match)}
              className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition-all cursor-pointer"
              title="Sửa phòng chơi"
            >
              <Edit size={14} />
            </button>
            
            <button
              onClick={() => handleTerminateMatch(match)}
              className={`
                p-1.5 rounded-lg border bg-stone-900 border-stone-800 transition-all cursor-pointer
                ${isActive 
                  ? 'text-amber-500 hover:text-amber-400 hover:border-amber-700' 
                  : 'text-red-500 hover:text-red-400 hover:border-red-900'
                }
              `}
              title={isActive ? "Cưỡng chế dừng phòng" : "Xóa lịch sử trận đấu"}
            >
              {isActive ? <AlertTriangle size={14} /> : <Trash2 size={14} />}
            </button>
          </div>
        );
      }
    }
  ];

  // Filters Node Render
  const filtersNode = (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Tìm phòng chơi theo Tên hoặc Mã phòng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2 pl-10 pr-4 text-xs font-semibold text-white placeholder-stone-500 transition-all outline-none"
        />
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <select
          value={modeFilter}
          onChange={(e) => {
            setModeFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="bg-stone-950 border border-stone-800 hover:border-stone-700 rounded-xl py-2 px-3 text-xs font-semibold text-stone-300 outline-none transition-all cursor-pointer"
        >
          <option value="ALL">Tất cả Chế độ</option>
          <option value="MULTIPLAYER">Chỉ Mạng (Multiplayer)</option>
          <option value="BOT">Chỉ Robot (AI Bot)</option>
          <option value="OFFLINE">Chỉ Ngoại tuyến</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="bg-stone-950 border border-stone-800 hover:border-stone-700 rounded-xl py-2 px-3 text-xs font-semibold text-stone-300 outline-none transition-all cursor-pointer"
        >
          <option value="ALL">Tất cả Trạng thái</option>
          <option value="WAITING">Đang chờ (Waiting)</option>
          <option value="PLAYING">Đang đánh (Playing)</option>
          <option value="FINISHED">Hoàn tất (Finished)</option>
        </select>

        <button
          onClick={handleOpenCreateModal}
          className="bg-yellow-500 hover:bg-yellow-400 text-stone-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md select-none"
        >
          <Swords size={14} />
          <span>Mở Phòng Chơi</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Description */}
      <div>
        <h2 className="text-xl lg:text-2xl font-black text-white uppercase tracking-wide">Quản Lý Phòng Chơi</h2>
        <p className="text-xs text-stone-400 mt-1 font-semibold">
          Quản lý các phòng thi đấu đang trực tuyến hoặc kiểm tra nhật ký kết quả, người thắng cuộc và thông số đặt cược.
        </p>
      </div>

      {/* The Reusable AdminTable */}
      <AdminTable
        columns={columns}
        data={paginatedMatches}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredMatches.length}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        filtersNode={filtersNode}
      />

      {/* CRUD Modal PopUp Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 overflow-hidden animate-zoom-in">
            {/* Background Blur */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold text-yellow-500 uppercase tracking-wider">
                {editingMatch ? 'Điều chỉnh phòng chơi' : 'Khởi tạo phòng chơi mới'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white transition-colors p-1 rounded-md hover:bg-stone-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Tên phòng chơi</label>
                <input
                  type="text"
                  required
                  value={formData.roomName}
                  onChange={(e) => setFormData(prev => ({ ...prev, roomName: e.target.value }))}
                  placeholder="Ví dụ: Bàn Tròn VIP Đại Gia 👑"
                  className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Chế độ chơi</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value as any }))}
                    className="bg-stone-950 border border-stone-800 rounded-xl py-2.5 px-3 text-xs font-semibold text-white outline-none cursor-pointer"
                  >
                    <option value="MULTIPLAYER">MULTIPLAYER</option>
                    <option value="BOT">AI BOT</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Mức cược phòng (Coin)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.betAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, betAmount: parseInt(e.target.value) || 0 }))}
                    className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Số người hiện tại</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={formData.maxPlayers}
                    value={formData.playersCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, playersCount: parseInt(e.target.value) || 1 }))}
                    className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Đấu thủ tối đa</label>
                  <select
                    value={formData.maxPlayers}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) || 4 }))}
                    className="bg-stone-950 border border-stone-800 rounded-xl py-2.5 px-3 text-xs font-semibold text-white outline-none cursor-pointer"
                  >
                    <option value="2">2 Đấu thủ</option>
                    <option value="3">3 Đấu thủ</option>
                    <option value="4">4 Đấu thủ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Trạng thái phòng</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="bg-stone-950 border border-stone-800 rounded-xl py-2.5 px-3 text-xs font-semibold text-white outline-none cursor-pointer"
                  >
                    <option value="WAITING">WAITING (Chờ)</option>
                    <option value="PLAYING">PLAYING (Đang đánh)</option>
                    <option value="FINISHED">FINISHED (Đã xong)</option>
                  </select>
                </div>

                {formData.status === 'FINISHED' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Người chiến thắng</label>
                    <input
                      type="text"
                      value={formData.winnerName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, winnerName: e.target.value || null }))}
                      placeholder="Tên nhà vô địch"
                      className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-stone-950 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-stone-950 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  {editingMatch ? 'Cập nhật' : 'Khởi tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
