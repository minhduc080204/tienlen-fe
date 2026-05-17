import { useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { AdminTable } from '../../components/AdminTable';
import type { TableColumn } from '../../components/AdminTable';
import type { AdminTransaction } from '../../type/admin';
import { 
  Search, 
  PlusCircle, 
  X, 
  Trash2, 
  Check, 
  Slash,
  Copy
} from 'lucide-react';
import { gameToast } from '../../components/ui/toast';

export default function TransactionManagement() {
  const { transactions, updateTransaction, deleteTransaction, addTransaction } = useAdmin();

  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'DEPOSIT' | 'WITHDRAW' | 'PURCHASE_NFT'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'SUCCESS' | 'FAILED'>('ALL');

  // Sorting State
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    userName: '',
    walletAddress: '',
    txHash: '',
    amount: 0.1,
    type: 'DEPOSIT' as 'DEPOSIT' | 'WITHDRAW' | 'PURCHASE_NFT',
    status: 'SUCCESS' as 'PENDING' | 'SUCCESS' | 'FAILED'
  });

  // Copy hash utility
  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    gameToast.success("Đã sao chép mã giao dịch (TxHash)!");
  };

  // Form Submit Handler
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.userName || !formData.walletAddress) {
      gameToast.error("Vui lòng điền Tên người nhận và địa chỉ Ví!");
      return;
    }

    try {
      const generatedTxHash = formData.txHash || `0x${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}1234abcd`;
      addTransaction({
        ...formData,
        txHash: generatedTxHash
      });
      gameToast.success(`Khởi tạo log giao dịch cho "${formData.userName}" thành công!`);
      setIsModalOpen(false);
    } catch (err) {
      gameToast.error("Đã xảy ra lỗi!");
    }
  };

  // Action: Approve Pending transaction
  const handleApproveTx = (tx: AdminTransaction) => {
    updateTransaction(tx.id, { status: 'SUCCESS' });
    gameToast.success(`Đã PHÊ DUYỆT thành công giao dịch số ${tx.id}!`);
  };

  // Action: Reject Pending transaction
  const handleRejectTx = (tx: AdminTransaction) => {
    updateTransaction(tx.id, { status: 'FAILED' });
    gameToast.error(`Đã TỪ CHỐI giao dịch số ${tx.id}!`);
  };

  // Delete transaction record
  const handleDeleteTx = (tx: AdminTransaction) => {
    if (window.confirm(`Bạn muốn xóa vĩnh viễn log giao dịch số "${tx.id}"?`)) {
      deleteTransaction(tx.id);
      gameToast.success("Đã xóa bản ghi giao dịch!");
    }
  };

  // Filter & Sort
  const filteredTxs = useMemo(() => {
    return transactions
      .filter((tx) => {
        const matchesSearch = 
          tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
        const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        let aVal = a[sortField as keyof AdminTransaction] ?? '';
        let bVal = b[sortField as keyof AdminTransaction] ?? '';

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = (bVal as string).toLowerCase();
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [transactions, searchTerm, typeFilter, statusFilter, sortField, sortOrder]);

  // Paginated records
  const paginatedTxs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTxs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTxs, currentPage]);

  const totalPages = Math.ceil(filteredTxs.length / itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Table Columns Definition
  const columns: TableColumn<AdminTransaction>[] = [
    {
      header: "Mã Số",
      key: "id",
      sortable: true,
      align: "center",
      render: (tx) => <span className="font-mono text-stone-500 text-xs">{tx.id}</span>
    },
    {
      header: "Địa Chỉ Ví & Hash Chuỗi",
      key: "txHash",
      render: (tx) => (
        <div className="flex flex-col gap-1 max-w-[200px]">
          <div 
            onClick={() => handleCopyHash(tx.txHash)}
            className="inline-flex items-center gap-1 cursor-pointer text-stone-300 hover:text-yellow-400 font-mono text-xs select-none transition-colors group"
            title="Nhấp để sao chép Hash"
          >
            <span className="truncate max-w-[130px]">{tx.txHash}</span>
            <Copy size={10} className="text-stone-500 group-hover:text-yellow-400 opacity-40 group-hover:opacity-100 transition-all shrink-0" />
          </div>
          <span className="text-stone-500 font-mono text-[10px] truncate" title={tx.walletAddress}>
            Ví: {tx.walletAddress}
          </span>
        </div>
      )
    },
    {
      header: "Thành Viên",
      key: "userName",
      sortable: true,
      render: (tx) => <span className="text-white font-bold text-xs">{tx.userName}</span>
    },
    {
      header: "Khối Lượng",
      key: "amount",
      sortable: true,
      align: "right",
      render: (tx) => (
        <div className="inline-flex items-center gap-1 font-mono text-xs font-black text-purple-400">
          <span>{tx.amount} MATIC</span>
        </div>
      )
    },
    {
      header: "Loại Hành Động",
      key: "type",
      sortable: true,
      align: "center",
      render: (tx) => {
        const isDep = tx.type === 'DEPOSIT';
        const isPur = tx.type === 'PURCHASE_NFT';

        return (
          <span className={`
            px-2 py-0.5 rounded-full text-[10px] font-black uppercase border
            ${isDep 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : isPur
                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }
          `}>
            {isPur ? 'Mua NFT' : isDep ? 'Nạp tiền' : 'Rút tiền'}
          </span>
        );
      }
    },
    {
      header: "Trạng Thái",
      key: "status",
      sortable: true,
      align: "center",
      render: (tx) => {
        const isSuccess = tx.status === 'SUCCESS';
        const isPending = tx.status === 'PENDING';

        return (
          <div className="flex justify-center">
            {isSuccess ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                Thành công
              </span>
            ) : isPending ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                Đang chờ
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                Thất bại
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: "Thời Gian",
      key: "createdAt",
      sortable: true,
      render: (tx) => (
        <span className="text-stone-500 text-xs">
          {new Date(tx.createdAt).toLocaleDateString('vi-VN')} {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      )
    },
    {
      header: "Tác Vụ",
      key: "actions",
      align: "center",
      render: (tx) => {
        const isPending = tx.status === 'PENDING';
        return (
          <div className="flex items-center justify-center gap-1">
            {isPending ? (
              <>
                <button
                  onClick={() => handleApproveTx(tx)}
                  className="p-1.5 rounded-lg bg-stone-900 border border-green-800 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all cursor-pointer"
                  title="Phê duyệt"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => handleRejectTx(tx)}
                  className="p-1.5 rounded-lg bg-stone-900 border border-red-800 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
                  title="Từ chối"
                >
                  <Slash size={14} />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleDeleteTx(tx)}
                className="p-1.5 rounded-lg bg-stone-900 border border-stone-850 text-red-500 hover:text-red-400 hover:border-red-900 transition-all cursor-pointer"
                title="Xóa log"
              >
                <Trash2 size={14} />
              </button>
            )}
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
          placeholder="Tìm theo Ví, Hash hoặc Tên đấu thủ..."
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
          <option value="ALL">Tất cả Loại giao dịch</option>
          <option value="DEPOSIT">Chỉ Nạp tiền</option>
          <option value="WITHDRAW">Chỉ Rút tiền</option>
          <option value="PURCHASE_NFT">Chỉ Mua bán NFT</option>
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
          <option value="SUCCESS">Thành công</option>
          <option value="PENDING">Đang chờ</option>
          <option value="FAILED">Thất bại</option>
        </select>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-400 text-stone-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md select-none"
        >
          <PlusCircle size={14} />
          <span>Ghi Log Giao Dịch</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Description */}
      <div>
        <h2 className="text-xl lg:text-2xl font-black text-white uppercase tracking-wide">Quản Lý Giao Dịch</h2>
        <p className="text-xs text-stone-400 mt-1 font-semibold">
          Phê duyệt các giao dịch rút tiền đang chờ duyệt hoặc theo dõi nhật ký các giao dịch chuyển MATIC, mua Card Skin trên blockchain.
        </p>
      </div>

      {/* The Reusable AdminTable */}
      <AdminTable
        columns={columns}
        data={paginatedTxs}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredTxs.length}
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
                Ghi chép log giao dịch thủ công
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
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Tên người chơi nhận</label>
                <input
                  type="text"
                  required
                  value={formData.userName}
                  onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                  placeholder="Ví dụ: Gia Bảo"
                  className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Địa chỉ Ví MetaMask nhận</label>
                <input
                  type="text"
                  required
                  value={formData.walletAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
                  placeholder="0x859e6De4..."
                  className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Mã giao dịch (TxHash - Không bắt buộc)</label>
                <input
                  type="text"
                  value={formData.txHash}
                  onChange={(e) => setFormData(prev => ({ ...prev, txHash: e.target.value }))}
                  placeholder="Để trống hệ thống tự sinh mã 0x..."
                  className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Khối lượng (MATIC)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Trạng thái ghi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="bg-stone-950 border border-stone-800 rounded-xl py-2.5 px-3 text-xs font-semibold text-white outline-none cursor-pointer"
                  >
                    <option value="SUCCESS">SUCCESS (Thành công)</option>
                    <option value="PENDING">PENDING (Đang chờ)</option>
                    <option value="FAILED">FAILED (Thất bại)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Loại giao dịch</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="bg-stone-950 border border-stone-800 rounded-xl py-2.5 px-3 text-xs font-semibold text-white outline-none cursor-pointer"
                >
                  <option value="DEPOSIT">DEPOSIT (Nạp tiền)</option>
                  <option value="WITHDRAW">WITHDRAW (Rút tiền)</option>
                  <option value="PURCHASE_NFT">PURCHASE_NFT (Mua Card Skin)</option>
                </select>
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
                  Lưu giao dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
