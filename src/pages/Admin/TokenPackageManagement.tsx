import { useState, useEffect, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { AdminTable } from '../../components/AdminTable';
import type { TableColumn } from '../../components/AdminTable';
import type { AdminTokenPackage } from '../../type/admin';
import { 
  Search, 
  PlusCircle, 
  X, 
  Trash2, 
  Edit, 
  Check, 
  Coins,
  Zap,
  Info
} from 'lucide-react';
import { gameToast } from '../../components/ui/toast';
import { useSearchParams } from 'react-router-dom';

export default function TokenPackageManagement() {
  const { tokenPackages, addTokenPackage, updateTokenPackage, deleteTokenPackage } = useAdmin();
  const [searchParams] = useSearchParams();

  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Sorting State
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<AdminTokenPackage | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceMatic: '0.0',
    tokenAmount: '0',
    active: true
  });

  // Watch URL triggers
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      handleOpenCreateModal();
    }
  }, [searchParams]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      description: '',
      priceMatic: '0.1',
      tokenAmount: '1000',
      active: true
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (pkg: AdminTokenPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      priceMatic: pkg.priceMatic.toString(),
      tokenAmount: pkg.tokenAmount.toString(),
      active: pkg.active
    });
    setIsModalOpen(true);
  };

  // Form Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      gameToast.error("Vui lòng nhập tên gói!");
      return;
    }

    try {
      const dataToSave = {
        name: formData.name,
        description: formData.description,
        priceMatic: parseFloat(formData.priceMatic),
        tokenAmount: parseInt(formData.tokenAmount, 10),
        active: formData.active
      };

      if (editingPackage) {
        await updateTokenPackage(editingPackage.id, dataToSave);
        gameToast.success(`Cập nhật gói "${formData.name}" thành công!`);
      } else {
        await addTokenPackage(dataToSave);
        gameToast.success(`Thêm mới gói "${formData.name}" thành công!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      gameToast.error("Đã có lỗi xảy ra!");
    }
  };

  // Toggle Active status quickly
  const handleToggleActive = async (pkg: AdminTokenPackage) => {
    const nextActive = !pkg.active;
    try {
      await updateTokenPackage(pkg.id, { active: nextActive });
      gameToast.success(
        nextActive 
          ? `Đã kích hoạt gói "${pkg.name}"!`
          : `Đã vô hiệu hóa gói "${pkg.name}"!`
      );
    } catch (err) {
      gameToast.error("Thay đổi trạng thái thất bại!");
    }
  };

  // Delete package
  const handleDeletePackage = async (pkg: AdminTokenPackage) => {
    if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn gói "${pkg.name}" khỏi hệ thống?`)) {
      try {
        await deleteTokenPackage(pkg.id);
        gameToast.success(`Đã xóa gói "${pkg.name}"!`);
      } catch (err) {
        gameToast.error("Xóa gói thất bại!");
      }
    }
  };

  // Filter & Sort
  const filteredPackages = useMemo(() => {
    return tokenPackages
      .filter((pkg) => {
        const matchesSearch = 
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesActive = 
          activeFilter === 'ALL' 
            ? true 
            : activeFilter === 'ACTIVE' 
              ? pkg.active 
              : !pkg.active;

        return matchesSearch && matchesActive;
      })
      .sort((a, b) => {
        let aVal = a[sortField as keyof AdminTokenPackage] ?? '';
        let bVal = b[sortField as keyof AdminTokenPackage] ?? '';

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = (bVal as string).toLowerCase();
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [tokenPackages, searchTerm, activeFilter, sortField, sortOrder]);

  // Paginated records
  const paginatedPackages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPackages.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPackages, currentPage]);

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Table Columns Definition
  const columns: TableColumn<AdminTokenPackage>[] = [
    {
      header: "Mã ID",
      key: "id",
      sortable: true,
      align: "center",
      render: (pkg) => <span className="font-mono text-stone-500 text-xs">#{pkg.id}</span>
    },
    {
      header: "Tên Gói & Mô Tả",
      key: "name",
      sortable: true,
      render: (pkg) => (
        <div className="flex flex-col gap-1 max-w-xs md:max-w-sm">
          <span className="text-yellow-400 font-extrabold text-sm">{pkg.name}</span>
          <span className="text-stone-500 text-xs truncate" title={pkg.description}>
            {pkg.description || 'Chưa cấu hình mô tả'}
          </span>
        </div>
      )
    },
    {
      header: "Lượng Xu (Tokens)",
      key: "tokenAmount",
      sortable: true,
      align: "center",
      render: (pkg) => (
        <div className="flex items-center justify-center gap-1">
          <Coins size={14} className="text-yellow-500" />
          <span className="font-black text-white">{pkg.tokenAmount.toLocaleString('vi-VN')}</span>
        </div>
      )
    },
    {
      header: "Giá Cả (Matic)",
      key: "priceMatic",
      sortable: true,
      align: "center",
      render: (pkg) => (
        <span className="font-black text-xs tracking-wider text-purple-400">
          {pkg.priceMatic} MATIC
        </span>
      )
    },
    {
      header: "Kích Hoạt",
      key: "active",
      sortable: true,
      align: "center",
      render: (pkg) => (
        <button
          onClick={() => handleToggleActive(pkg)}
          title="Nhấp để thay đổi trạng thái"
          className={`
            w-6 h-6 rounded-full border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer
            ${pkg.active 
              ? 'bg-green-500/20 border-green-500 text-green-400' 
              : 'bg-stone-900 border-stone-800 text-stone-600 hover:text-stone-400'
            }
          `}
        >
          <Check size={14} className={pkg.active ? 'stroke-[3px]' : 'opacity-40'} />
        </button>
      )
    },
    {
      header: "Ngày Tạo",
      key: "createdAt",
      sortable: true,
      align: "center",
      render: (pkg) => (
        <span className="text-stone-500 text-xs">
          {pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString('vi-VN') : '-'}
        </span>
      )
    },
    {
      header: "Tùy Chọn",
      key: "actions",
      align: "center",
      render: (pkg) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => handleOpenEditModal(pkg)}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition-all cursor-pointer"
            title="Sửa gói"
          >
            <Edit size={14} />
          </button>
          
          <button
            onClick={() => handleDeletePackage(pkg)}
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
          placeholder="Tìm tên, mô tả gói nạp..."
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
          value={activeFilter}
          onChange={(e) => {
            setActiveFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="bg-stone-950 border border-stone-800 hover:border-stone-700 rounded-xl py-2 px-3 text-xs font-semibold text-stone-300 outline-none transition-all cursor-pointer"
        >
          <option value="ALL">Tất cả Trạng thái</option>
          <option value="ACTIVE">Đang kích hoạt</option>
          <option value="INACTIVE">Đã vô hiệu hóa</option>
        </select>

        <button
          onClick={handleOpenCreateModal}
          className="bg-yellow-500 hover:bg-yellow-400 text-stone-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md select-none"
        >
          <PlusCircle size={14} />
          <span>Thêm Mới Gói Nạp</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Description */}
      <div>
        <h2 className="text-xl lg:text-2xl font-black text-white uppercase tracking-wide">Quản Lý Gói Nạp Xu</h2>
        <p className="text-xs text-stone-400 mt-1 font-semibold">
          Thêm, sửa đổi hoặc xóa các gói nạp xu. Định cấu hình giá (MATIC) và lượng Xu tương ứng mà người dùng nhận được.
        </p>
      </div>

      {/* The Reusable AdminTable */}
      <AdminTable
        columns={columns}
        data={paginatedPackages}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredPackages.length}
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
            <div className="hidden md:flex flex-col items-center justify-center w-40 shrink-0 border-r border-stone-800/80 pr-6 gap-3 select-none">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Xem trước hiển thị</span>
              
              {/* Virtual Mockup Card visual */}
              <div className="relative bg-stone-900/60 border border-stone-700 hover:border-yellow-600/40 rounded-xl p-4 flex flex-col gap-3 transition-all duration-300 shadow-md group overflow-hidden w-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                     <Zap size={12} className="text-yellow-400" />
                   </div>
                   <span className="text-yellow-400 font-extrabold text-[10px] uppercase tracking-wide leading-tight line-clamp-2">
                     {formData.name || 'Tên Gói'}
                   </span>
                 </div>

                 <div className="flex items-baseline gap-1.5">
                   <Coins size={14} className="text-yellow-500 shrink-0 mb-0.5" />
                   <span className="text-lg font-black text-white">{parseInt(formData.tokenAmount || '0').toLocaleString('vi-VN')}</span>
                   <span className="text-stone-400 text-[10px] font-semibold">Xu</span>
                 </div>

                 <div className="mt-auto pt-2 border-t border-stone-700/50 flex flex-col items-center justify-between gap-1">
                   <div className="flex items-center gap-1 text-purple-300 font-bold text-[10px]">
                     <span>💎</span>
                     <span>{formData.priceMatic || '0'} MATIC</span>
                   </div>
                 </div>
               </div>

              <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold max-w-[140px] text-center">
                <Info size={12} className="shrink-0" />
                <span>Hiển thị trên Cửa Hàng NFT ở Tab Nạp Xu</span>
              </div>
            </div>

            {/* Right Col (Form content) */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-extrabold text-yellow-500 uppercase tracking-wider">
                  {editingPackage ? 'Cập nhật Gói Nạp' : 'Thêm Gói Nạp mới'}
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
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Tên gói nạp</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ví dụ: Gói Cơ Bản"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Giá bán (MATIC)</label>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      required
                      value={formData.priceMatic}
                      onChange={(e) => setFormData(prev => ({ ...prev, priceMatic: e.target.value }))}
                      placeholder="Ví dụ: 0.1"
                      className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Lượng Xu</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.tokenAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, tokenAmount: e.target.value }))}
                      placeholder="Ví dụ: 1000"
                      className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Mô tả gói nạp</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả ưu đãi của gói..."
                    rows={2}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2 px-4 text-xs text-white outline-none font-semibold transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-2.5 mt-2 p-3 bg-stone-950/30 border border-stone-850 rounded-xl">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="w-4 h-4 text-yellow-500 bg-stone-950 border-stone-800 rounded-md outline-none cursor-pointer"
                  />
                  <label htmlFor="active" className="text-xs font-bold text-stone-400 uppercase cursor-pointer select-none">
                    Kích hoạt hiển thị ngay
                  </label>
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
                    {editingPackage ? 'Cập nhật' : 'Thêm mới'}
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
