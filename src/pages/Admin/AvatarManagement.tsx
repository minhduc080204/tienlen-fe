import { useState, useEffect, useMemo } from 'react';
import type { FormEvent } from 'react';
import { AdminTable } from '../../components/AdminTable';
import type { TableColumn } from '../../components/AdminTable';
import { adminApi } from '../../api/admin.api';
import type { AdminAvatar } from '../../type/admin';
import {
  Search,
  PlusCircle,
  X,
  Trash2,
  Edit,
  Check,
  Sparkles,
  Info,
  Smile,
  Coins,
  Globe
} from 'lucide-react';
import { gameToast } from '../../components/ui/toast';
import { useSearchParams } from 'react-router-dom';
import { formatNumber } from '../../utils/formatNumber';

export default function AvatarManagement() {
  const [searchParams] = useSearchParams();

  // Avatar State
  const [avatars, setAvatars] = useState<AdminAvatar[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [priceTypeFilter, setPriceTypeFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Sorting State
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<AdminAvatar | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    srcUrl: '',
    isFree: true,
    priceTokens: '0',
    priceMatic: '0.0',
    active: true
  });

  const fetchAvatars = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAdminAvatars();
      setAvatars(response.data);
    } catch (err) {
      console.error(err);
      gameToast.error("Không thể tải danh sách Avatar mẫu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  // Watch URL triggers
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      handleOpenCreateModal();
    }
  }, [searchParams]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingAvatar(null);
    setFormData({
      name: '',
      srcUrl: '',
      isFree: true,
      priceTokens: '0',
      priceMatic: '0.0',
      active: true
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (avatar: AdminAvatar) => {
    setEditingAvatar(avatar);
    const isFree = avatar.priceTokens === 0 && avatar.priceMatic === 0;
    setFormData({
      name: avatar.name,
      srcUrl: avatar.srcUrl,
      isFree,
      priceTokens: avatar.priceTokens.toString(),
      priceMatic: avatar.priceMatic.toString(),
      active: avatar.active
    });
    setIsModalOpen(true);
  };

  // Form Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.srcUrl) {
      gameToast.error("Vui lòng nhập Tên và Đường dẫn ảnh mẫu (URL Source)!");
      return;
    }

    const payload = {
      name: formData.name,
      srcUrl: formData.srcUrl,
      priceTokens: formData.isFree ? 0 : Math.max(0, parseInt(formData.priceTokens || '0')),
      priceMatic: formData.isFree ? 0 : Math.max(0, parseFloat(formData.priceMatic || '0')),
      active: formData.active
    };

    try {
      if (editingAvatar) {
        await adminApi.updateAdminAvatar(editingAvatar.id, payload);
        gameToast.success(`Cập nhật Avatar "${formData.name}" thành công!`);
      } else {
        await adminApi.createAdminAvatar(payload);
        gameToast.success(`Thêm mới Avatar "${formData.name}" thành công!`);
      }
      setIsModalOpen(false);
      fetchAvatars();
    } catch (err: any) {
      console.error(err);
      gameToast.error(err?.response?.data?.message || "Đã có lỗi xảy ra!");
    }
  };

  // Toggle Active status quickly
  const handleToggleActive = async (avatar: AdminAvatar) => {
    const nextActive = !avatar.active;
    try {
      await adminApi.updateAdminAvatar(avatar.id, { active: nextActive });
      setAvatars(prev => prev.map(a => a.id === avatar.id ? { ...a, active: nextActive } : a));
      gameToast.success(
        nextActive
          ? `Đã kích hoạt hoạt động cho Avatar "${avatar.name}"!`
          : `Đã tạm khóa hiển thị Avatar "${avatar.name}"!`
      );
    } catch (err) {
      console.error(err);
      gameToast.error("Cập nhật trạng thái hoạt động thất bại!");
    }
  };

  // Delete Avatar
  const handleDeleteAvatar = async (avatar: AdminAvatar) => {
    if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn mẫu Avatar "${avatar.name}" khỏi cửa hàng?`)) {
      try {
        await adminApi.deleteAdminAvatar(avatar.id);
        setAvatars(prev => prev.filter(a => a.id !== avatar.id));
        gameToast.success(`Đã gỡ bỏ Avatar "${avatar.name}" thành công!`);
      } catch (err) {
        console.error(err);
        gameToast.error("Gỡ bỏ Avatar thất bại!");
      }
    }
  };

  // Filter & Sort
  const filteredAvatars = useMemo(() => {
    return avatars
      .filter((avatar) => {
        const matchesSearch =
          avatar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          avatar.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
          avatar.srcUrl.toLowerCase().includes(searchTerm.toLowerCase());

        const isFree = avatar.priceTokens === 0 && avatar.priceMatic === 0;
        const matchesPrice =
          priceTypeFilter === 'ALL'
            ? true
            : priceTypeFilter === 'FREE'
              ? isFree
              : !isFree;

        const matchesStatus =
          statusFilter === 'ALL'
            ? true
            : statusFilter === 'ACTIVE'
              ? avatar.active
              : !avatar.active;

        return matchesSearch && matchesPrice && matchesStatus;
      })
      .sort((a, b) => {
        let aVal = a[sortField as keyof AdminAvatar] ?? '';
        let bVal = b[sortField as keyof AdminAvatar] ?? '';

        if (typeof aVal === 'string' || typeof bVal === 'string') {
          aVal = String(aVal).toLowerCase();
          bVal = String(bVal).toLowerCase();
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [avatars, searchTerm, priceTypeFilter, statusFilter, sortField, sortOrder]);

  // Paginated records
  const paginatedAvatars = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAvatars.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAvatars, currentPage]);

  const totalPages = Math.ceil(filteredAvatars.length / itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Table Columns Definition
  const columns: TableColumn<AdminAvatar>[] = [
    {
      header: "Mã ID",
      key: "id",
      sortable: true,
      align: "center",
      render: (avatar) => <span className="font-mono text-stone-500 text-xs">#{avatar.id}</span>
    },
    {
      header: "Ảnh Đại Diện",
      key: "id",
      align: "center",
      render: (avatar) => (
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 p-0.5 flex items-center justify-center shadow-md relative overflow-hidden group">
            <img
              src={avatar.srcUrl}
              alt={avatar.name}
              className="w-full h-full object-cover rounded-full z-10 transition-transform group-hover:scale-110"
            />
          </div>
        </div>
      )
    },
    {
      header: "Tên Avatar",
      key: "name",
      sortable: true,
      render: (avatar) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-white font-extrabold text-sm">{avatar.name}</span>
          <span className="text-stone-500 text-[10px] font-mono truncate max-w-xs" title={avatar.srcUrl}>
            {avatar.srcUrl}
          </span>
        </div>
      )
    },
    {
      header: "Bộ Thiết Kế (Style)",
      key: "style",
      sortable: true,
      align: "center",
      render: (avatar) => (
        <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-lg text-stone-400 font-mono text-[10px] uppercase font-bold">
          {avatar.style}
        </span>
      )
    },
    {
      header: "Giá Xu (Tokens)",
      key: "priceTokens",
      sortable: true,
      align: "right",
      render: (avatar) => {
        const isFree = avatar.priceTokens === 0;
        return (
          <span className={`font-black text-xs ${isFree ? 'text-stone-500' : 'text-yellow-500 flex items-center gap-1 justify-end'}`}>
            {isFree ? 'Miễn phí' : (
              <>
                <Coins size={12} />
                {formatNumber(avatar.priceTokens)}
              </>
            )}
          </span>
        );
      }
    },
    {
      header: "Giá MATIC (Web3)",
      key: "priceMatic",
      sortable: true,
      align: "right",
      render: (avatar) => {
        const isFree = avatar.priceMatic === 0;
        return (
          <span className={`font-black text-xs ${isFree ? 'text-stone-500' : 'text-purple-400'}`}>
            {isFree ? 'Miễn phí' : `💎 ${avatar.priceMatic}`}
          </span>
        );
      }
    },
    {
      header: "Kích Hoạt",
      key: "active",
      sortable: true,
      align: "center",
      render: (avatar) => (
        <button
          onClick={() => handleToggleActive(avatar)}
          title="Nhấp để chuyển trạng thái hoạt động"
          className={`
            w-6 h-6 rounded-full border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer
            ${avatar.active
              ? 'bg-green-500/20 border-green-500 text-green-400'
              : 'bg-stone-900 border-stone-800 text-stone-600 hover:text-stone-400'
            }
          `}
        >
          <Check size={14} className={avatar.active ? 'stroke-[3px]' : 'opacity-40'} />
        </button>
      )
    },
    {
      header: "Tùy Chọn",
      key: "actions",
      align: "center",
      render: (avatar) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => handleOpenEditModal(avatar)}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition-all cursor-pointer"
            title="Sửa Avatar"
          >
            <Edit size={14} />
          </button>

          <button
            onClick={() => handleDeleteAvatar(avatar)}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-850 text-red-500 hover:text-red-400 hover:border-red-900 transition-all cursor-pointer"
            title="Xóa vĩnh viễn"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
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
          placeholder="Tìm tên, bộ, URL ảnh nguồn..."
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
          value={priceTypeFilter}
          onChange={(e) => {
            setPriceTypeFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="bg-stone-950 border border-stone-800 hover:border-stone-700 rounded-xl py-2 px-3 text-xs font-semibold text-stone-300 outline-none transition-all cursor-pointer"
        >
          <option value="ALL">Tất cả giá cả</option>
          <option value="FREE">Bộ Miễn Phí (Free)</option>
          <option value="PAID">Bộ Trả Phí (Premium)</option>
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
          <option value="ACTIVE">Đang Hoạt động</option>
          <option value="INACTIVE">Tạm khóa hiển thị</option>
        </select>

        <button
          onClick={handleOpenCreateModal}
          className="bg-yellow-500 hover:bg-yellow-400 text-stone-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md select-none"
        >
          <PlusCircle size={14} />
          <span>Thêm Avatar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Description */}
      <div>
        <h2 className="text-xl lg:text-2xl font-black text-white uppercase tracking-wide">Quản Lý Bộ Avatar Cửa Hàng</h2>
        <p className="text-xs text-stone-400 mt-1 font-semibold">
          Quản lý danh sách avatar mẫu. Cấu hình các style miễn phí (adventurer, adventurer-neutral, big-ears) hoặc trả phí (bottts, avataaars, thumbs) và thiết lập giá bán.
        </p>
      </div>

      {/* The Reusable AdminTable */}
      <AdminTable
        columns={columns}
        data={paginatedAvatars}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredAvatars.length}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        filtersNode={filtersNode}
      />

      {/* CRUD Modal PopUp Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 overflow-hidden animate-zoom-in flex flex-col md:flex-row gap-6">
            {/* Background blur */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Left Col (Preview on Desktop) */}
            <div className="hidden md:flex flex-col items-center justify-center w-36 shrink-0 border-r border-stone-800/80 pr-6 gap-3 select-none">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Xem trước hiển thị</span>

              {/* Virtual Mockup Card visual */}
              <div className="w-32 h-44 rounded-xl bg-zinc-950 border border-stone-800/80 shadow-lg p-3 flex flex-col justify-between items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-radial-to-t from-stone-950/80 to-transparent z-0" />

                <div className="flex justify-between w-full z-10">
                  <span className={`text-[8px] font-black tracking-widest uppercase leading-none border px-1.5 py-0.5 rounded-full ${
                    formData.active
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {formData.active ? 'Mở' : 'Khóa'}
                  </span>
                  <Sparkles size={10} className="text-yellow-500 animate-pulse" />
                </div>

                <div className="w-16 h-16 rounded-full bg-zinc-900 p-0.5 flex items-center justify-center overflow-hidden border border-zinc-850 shadow-inner z-10 mt-2">
                  {formData.srcUrl ? (
                    <img src={formData.srcUrl} alt="avatar-preview" className="w-full h-full object-cover" />
                  ) : (
                    <Smile size={24} className="text-stone-600" />
                  )}
                </div>

                <div className="text-center w-full z-10 mt-2">
                  <h4 className="text-[10px] font-bold text-white truncate drop-shadow-md">
                    {formData.name || 'Tên Avatar'}
                  </h4>
                  <p className="text-[8px] text-yellow-400 font-extrabold mt-1 drop-shadow-md truncate">
                    {formData.isFree
                      ? 'MIỄN PHÍ'
                      : `${formatNumber(parseInt(formData.priceTokens || '0'))} xu / ${formData.priceMatic || '0'} MATIC`
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold max-w-[130px] text-center">
                <Info size={12} className="shrink-0" />
                <span>Hiển thị của Avatar trong cửa hàng</span>
              </div>
            </div>

            {/* Right Col (Form content) */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-extrabold text-yellow-500 uppercase tracking-wider">
                  {editingAvatar ? 'Cập nhật Avatar' : 'Thêm gói Avatar mới'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-stone-400 hover:text-white transition-colors p-1 rounded-md hover:bg-stone-800 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Tên Avatar mẫu</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ví dụ: Adventurer Leo"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2 px-3 text-xs text-white outline-none font-semibold transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                    <Globe size={12} className="text-stone-500" />
                    Đường dẫn URL nguồn (Dicebear SVG)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.srcUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, srcUrl: e.target.value }))}
                    placeholder="https://api.dicebear.com/9.x/bottts/svg?seed=Example"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2 px-3 text-xs text-white outline-none font-semibold transition-all font-mono"
                  />
                  <p className="text-[9px] text-stone-500">
                    * Style (ví dụ: bottts) sẽ được trích xuất tự động từ URL này tại Backend.
                  </p>
                </div>

                {/* Free vs Price Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Hình thức phân phối</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isFree: true }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        formData.isFree
                          ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-300'
                      }`}
                    >
                      Bộ Miễn Phí (Free)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isFree: false }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        !formData.isFree
                          ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-300'
                      }`}
                    >
                      Bán trả phí (Premium)
                    </button>
                  </div>
                </div>

                {/* Price input section (only shown if Paid selected) */}
                {!formData.isFree && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-stone-950/30 border border-stone-850 rounded-xl animate-fade-in">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Giá xu (Tokens)</label>
                      <input
                        type="number"
                        min="0"
                        required={!formData.isFree}
                        value={formData.priceTokens}
                        onChange={(e) => setFormData(prev => ({ ...prev, priceTokens: e.target.value }))}
                        placeholder="Ví dụ: 500"
                        className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-lg p-2 text-xs text-white outline-none font-semibold transition-all font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Giá MATIC (Web3)</label>
                      <input
                        type="text"
                        required={!formData.isFree}
                        value={formData.priceMatic}
                        onChange={(e) => setFormData(prev => ({ ...prev, priceMatic: e.target.value }))}
                        placeholder="Ví dụ: 0.005"
                        className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-lg p-2 text-xs text-white outline-none font-semibold transition-all font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2.5 mt-1 p-2.5 bg-stone-950/30 border border-stone-850 rounded-xl">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="w-4 h-4 text-yellow-500 bg-stone-950 border-stone-800 rounded-md outline-none cursor-pointer"
                  />
                  <label htmlFor="active" className="text-xs font-bold text-stone-400 uppercase cursor-pointer select-none">
                    Kích hoạt hiển thị công khai ngay
                  </label>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-4">
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
                    {editingAvatar ? 'Cập nhật' : 'Đăng bán'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
