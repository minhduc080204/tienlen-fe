import { useState, useEffect, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { AdminTable } from '../../components/AdminTable';
import type { TableColumn } from '../../components/AdminTable';
import type { AdminNFT } from '../../type/admin';
import { R2_BASE_URL } from '../../type/nft';
import { 
  Search, 
  PlusCircle, 
  X, 
  Trash2, 
  Edit, 
  Check, 
  FileCode,
  Tag,
  Sparkles,
  Info
} from 'lucide-react';
import { gameToast } from '../../components/ui/toast';
import { useSearchParams } from 'react-router-dom';

export default function NFTManagement() {
  const { nfts, addNFT, updateNFT, deleteNFT } = useAdmin();
  const [searchParams] = useSearchParams();

  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'STANDARD' | 'PREMIUM' | 'LEGENDARY'>('ALL');
  const [defaultFilter, setDefaultFilter] = useState<'ALL' | 'DEFAULT' | 'STORE'>('ALL');

  // Sorting State
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNft, setEditingNft] = useState<AdminNFT | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    priceMatic: '0.0',
    sourceKey: '',
    type: 'STANDARD' as 'STANDARD' | 'PREMIUM' | 'LEGENDARY',
    description: '',
    isDefault: false
  });

  // Watch URL triggers
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      handleOpenCreateModal();
    }
  }, [searchParams]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingNft(null);
    setFormData({
      name: '',
      priceMatic: '0.1',
      sourceKey: '',
      type: 'STANDARD',
      description: '',
      isDefault: false
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (nft: AdminNFT) => {
    setEditingNft(nft);
    setFormData({
      name: nft.name,
      priceMatic: nft.priceMatic,
      sourceKey: nft.sourceKey,
      type: nft.type,
      description: nft.description,
      isDefault: nft.isDefault
    });
    setIsModalOpen(true);
  };

  // Form Submit Handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.sourceKey) {
      gameToast.error("Vui lòng nhập Tên và Từ khóa mã nguồn NFT!");
      return;
    }

    try {
      if (editingNft) {
        updateNFT(editingNft.id, formData);
        gameToast.success(`Cập nhật skin "${formData.name}" thành công!`);
      } else {
        addNFT(formData);
        gameToast.success(`Thêm mới skin "${formData.name}" thành công!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      gameToast.error("Đã có lỗi xảy ra!");
    }
  };

  // Toggle Default status quickly
  const handleToggleDefault = (nft: AdminNFT) => {
    const nextDefault = !nft.isDefault;
    updateNFT(nft.id, { isDefault: nextDefault });
    gameToast.success(
      nextDefault 
        ? `Đã cài đặt "${nft.name}" thành skin mặc định miễn phí!`
        : `Đã hủy thuộc tính mặc định của "${nft.name}"!`
    );
  };

  // Delete skin
  const handleDeleteNft = (nft: AdminNFT) => {
    if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn Card Skin "${nft.name}" khỏi cửa hàng?`)) {
      deleteNFT(nft.id);
      gameToast.success(`Đã gỡ bỏ skin "${nft.name}"!`);
    }
  };

  // Filter & Sort
  const filteredNfts = useMemo(() => {
    return nfts
      .filter((nft) => {
        const matchesSearch = 
          nft.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          nft.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = typeFilter === 'ALL' || nft.type === typeFilter;
        
        const matchesDefault = 
          defaultFilter === 'ALL' 
            ? true 
            : defaultFilter === 'DEFAULT' 
              ? nft.isDefault 
              : !nft.isDefault;

        return matchesSearch && matchesType && matchesDefault;
      })
      .sort((a, b) => {
        let aVal = a[sortField as keyof AdminNFT] ?? '';
        let bVal = b[sortField as keyof AdminNFT] ?? '';

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = (bVal as string).toLowerCase();
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [nfts, searchTerm, typeFilter, defaultFilter, sortField, sortOrder]);

  // Paginated records
  const paginatedNfts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNfts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNfts, currentPage]);

  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Table Columns Definition
  const columns: TableColumn<AdminNFT>[] = [
    {
      header: "Mã ID",
      key: "id",
      sortable: true,
      align: "center",
      render: (nft) => <span className="font-mono text-stone-500 text-xs">#{nft.id}</span>
    },
    {
      header: "Ảnh Skin",
      key: "id",
      align: "center",
      render: (nft) => {
        // Construct R2 promote image path or show styled fallback
        const imageUrl = `${R2_BASE_URL}/${nft.id}/promote_ic.png`;
        const gradientClass = 
          nft.type === 'LEGENDARY' 
            ? 'from-amber-500 to-yellow-600' 
            : nft.type === 'PREMIUM'
              ? 'from-blue-500 to-indigo-600'
              : 'from-stone-600 to-stone-700';

        return (
          <div className="flex items-center justify-center">
            <div className={`
              w-12 h-16 rounded-lg bg-linear-to-b ${gradientClass}
              border border-stone-850 p-1 flex items-center justify-center shadow-md relative group overflow-hidden
            `}>
              <img 
                src={imageUrl} 
                alt={nft.name} 
                onError={(e) => {
                  // If image fails, hide it and just show the gradient badge
                  (e.target as any).style.display = 'none';
                }}
                className="w-full h-full object-contain drop-shadow-md z-10 transition-transform group-hover:scale-110" 
              />
              <span className="text-[8px] font-black text-white/50 uppercase tracking-widest pointer-events-none select-none z-0 absolute">
                SKIN
              </span>
            </div>
          </div>
        );
      }
    },
    {
      header: "Tên Skin & Mô Tả",
      key: "name",
      sortable: true,
      render: (nft) => (
        <div className="flex flex-col gap-1 max-w-xs md:max-w-sm">
          <span className="text-white font-extrabold text-sm">{nft.name}</span>
          <span className="text-stone-500 text-xs truncate" title={nft.description}>
            {nft.description || 'Chưa cấu hình mô tả chi tiết'}
          </span>
        </div>
      )
    },
    {
      header: "Từ Khóa File (R2)",
      key: "sourceKey",
      sortable: true,
      render: (nft) => (
        <div className="inline-flex items-center gap-1.5 font-mono text-stone-400 text-xs">
          <FileCode size={12} className="text-stone-500" />
          <span>{nft.sourceKey}</span>
        </div>
      )
    },
    {
      header: "Phẩm Cấp",
      key: "type",
      sortable: true,
      align: "center",
      render: (nft) => {
        const isLeg = nft.type === 'LEGENDARY';
        const isPrem = nft.type === 'PREMIUM';

        return (
          <span className={`
            px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border
            ${isLeg 
              ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
              : isPrem
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : 'bg-stone-550/10 text-stone-400 border-stone-700'
            }
          `}>
            {nft.type}
          </span>
        );
      }
    },
    {
      header: "Giá Cả (Matic)",
      key: "priceMatic",
      sortable: true,
      align: "right",
      render: (nft) => {
        const isFree = parseFloat(nft.priceMatic) === 0;
        return (
          <span className={`font-black text-xs tracking-wider ${isFree ? 'text-stone-500' : 'text-purple-400'}`}>
            {isFree ? 'Miễn phí' : `${nft.priceMatic} MATIC`}
          </span>
        );
      }
    },
    {
      header: "Mặc Định",
      key: "isDefault",
      sortable: true,
      align: "center",
      render: (nft) => (
        <button
          onClick={() => handleToggleDefault(nft)}
          title="Nhấp để chuyển chế độ mặc định"
          className={`
            w-6 h-6 rounded-full border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer
            ${nft.isDefault 
              ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' 
              : 'bg-stone-900 border-stone-800 text-stone-600 hover:text-stone-400'
            }
          `}
        >
          <Check size={14} className={nft.isDefault ? 'stroke-[3px]' : 'opacity-40'} />
        </button>
      )
    },
    {
      header: "Ngày Tạo",
      key: "createdAt",
      sortable: true,
      render: (nft) => (
        <span className="text-stone-500 text-xs">
          {new Date(nft.createdAt).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    {
      header: "Tùy Chọn",
      key: "actions",
      align: "center",
      render: (nft) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => handleOpenEditModal(nft)}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition-all cursor-pointer"
            title="Sửa vật phẩm"
          >
            <Edit size={14} />
          </button>
          
          <button
            onClick={() => handleDeleteNft(nft)}
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
          placeholder="Tìm tên, từ khóa, mô tả Card Skin..."
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
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="bg-stone-950 border border-stone-800 hover:border-stone-700 rounded-xl py-2 px-3 text-xs font-semibold text-stone-300 outline-none transition-all cursor-pointer"
        >
          <option value="ALL">Tất cả Phẩm cấp</option>
          <option value="STANDARD">STANDARD (Thường)</option>
          <option value="PREMIUM">PREMIUM (Đặc biệt)</option>
          <option value="LEGENDARY">LEGENDARY (Huyền thoại)</option>
        </select>

        <select
          value={defaultFilter}
          onChange={(e) => {
            setDefaultFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="bg-stone-950 border border-stone-800 hover:border-stone-700 rounded-xl py-2 px-3 text-xs font-semibold text-stone-300 outline-none transition-all cursor-pointer"
        >
          <option value="ALL">Tất cả Chế độ mua</option>
          <option value="DEFAULT">Mặc định miễn phí</option>
          <option value="STORE">Sản phẩm có phí (Cửa hàng)</option>
        </select>

        <button
          onClick={handleOpenCreateModal}
          className="bg-yellow-500 hover:bg-yellow-400 text-stone-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md select-none"
        >
          <PlusCircle size={14} />
          <span>Thêm Mới Skin</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Description */}
      <div>
        <h2 className="text-xl lg:text-2xl font-black text-white uppercase tracking-wide">Quản Lý Cửa Hàng NFTs</h2>
        <p className="text-xs text-stone-400 mt-1 font-semibold">
          Thêm, sửa đổi các gói hình nền lá bài (Card Skin) được đẩy lên Cloudflare R2 bucket. Định cấu hình giá bán (MATIC) và phẩm cấp.
        </p>
      </div>

      {/* The Reusable AdminTable */}
      <AdminTable
        columns={columns}
        data={paginatedNfts}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredNfts.length}
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
              <div className={`
                w-32 h-44 rounded-xl bg-linear-to-b ${
                  formData.type === 'LEGENDARY' 
                    ? 'from-yellow-500 via-amber-600 to-yellow-800' 
                    : formData.type === 'PREMIUM'
                      ? 'from-blue-500 via-indigo-600 to-blue-900'
                      : 'from-stone-600 to-stone-850'
                }
                border-2 border-stone-900/50 shadow-lg p-2.5 flex flex-col justify-between items-center relative overflow-hidden group
              `}>
                <div className="absolute inset-0 bg-radial-to-t from-black/60 to-transparent z-0" />
                
                {/* Shiny highlight */}
                <div className="absolute -inset-full rotate-45 bg-linear-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine z-10 pointer-events-none" />
                
                <div className="flex justify-between w-full z-10">
                  <span className="text-[9px] font-black text-white tracking-widest uppercase leading-none drop-shadow-md">
                    {formData.type}
                  </span>
                  <Sparkles size={10} className="text-white animate-pulse" />
                </div>
                
                <div className="w-14 h-14 rounded-lg bg-black/20 border border-white/5 flex items-center justify-center z-10">
                  <Tag size={20} className="text-white/60" />
                </div>
                
                <div className="text-center w-full z-10">
                  <h4 className="text-[10px] font-bold text-white truncate drop-shadow-md">
                    {formData.name || 'Tên Card Skin'}
                  </h4>
                  <p className="text-[8px] text-yellow-400 font-extrabold mt-0.5 drop-shadow-md">
                    {formData.isDefault ? 'MẶC ĐỊNH' : `${formData.priceMatic} MATIC`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold max-w-[140px] text-center">
                <Info size={12} className="shrink-0" />
                <span>Thiết kế hiển thị dựa trên Phẩm cấp của NFT</span>
              </div>
            </div>

            {/* Right Col (Form content) */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-extrabold text-yellow-500 uppercase tracking-wider">
                  {editingNft ? 'Cập nhật Card Skin' : 'Thêm gói Card Skin mới'}
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
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Tên gói vật phẩm</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ví dụ: Rồng Lửa Thần Thoại"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Từ khóa (sourceKey)</label>
                    <input
                      type="text"
                      required
                      value={formData.sourceKey}
                      onChange={(e) => setFormData(prev => ({ ...prev, sourceKey: e.target.value }))}
                      placeholder="Ví dụ: nft-dragon"
                      className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Giá bán (MATIC)</label>
                    <input
                      type="text"
                      required
                      value={formData.priceMatic}
                      onChange={(e) => setFormData(prev => ({ ...prev, priceMatic: e.target.value }))}
                      placeholder="Ví dụ: 0.25"
                      className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Phẩm cấp vật phẩm</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="bg-stone-950 border border-stone-800 rounded-xl py-2.5 px-3 text-xs font-semibold text-white outline-none cursor-pointer"
                  >
                    <option value="STANDARD">STANDARD (Lá bài Thường)</option>
                    <option value="PREMIUM">PREMIUM (Đặc biệt Neon)</option>
                    <option value="LEGENDARY">LEGENDARY (Huyền thoại Hoàng gia)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Mô tả vật phẩm</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả các hiệu ứng hoặc đặc điểm nổi trội..."
                    rows={2}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2 px-4 text-xs text-white outline-none font-semibold transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-2.5 mt-2 p-3 bg-stone-950/30 border border-stone-850 rounded-xl">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="w-4 h-4 text-yellow-500 bg-stone-950 border-stone-800 rounded-md outline-none cursor-pointer"
                  />
                  <label htmlFor="isDefault" className="text-xs font-bold text-stone-400 uppercase cursor-pointer select-none">
                    Cài đặt làm Skin Mặc định (Miễn phí)
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
                    {editingNft ? 'Cập nhật' : 'Đăng bán'}
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
