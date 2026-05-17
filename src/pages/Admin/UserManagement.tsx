import { useState, useEffect, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { AdminTable } from '../../components/AdminTable';
import type { TableColumn } from '../../components/AdminTable';
import type { AdminUser } from '../../type/admin';
import { 
  Search, 
  UserPlus, 
  X, 
  Trash2, 
  Edit, 
  UserCheck, 
  UserX,
  Coins
} from 'lucide-react';
import { gameToast } from '../../components/ui/toast';
import { useSearchParams } from 'react-router-dom';

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useAdmin();
  const [searchParams] = useSearchParams();

  // Search & Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');

  // Sorting State
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tokenBalance: 0,
    role: 'USER' as 'ADMIN' | 'USER',
    status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED',
    avatarUrl: ''
  });

  // Check URL triggers (e.g., action=create from Quick Shortcut)
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      handleOpenCreateModal();
    }
  }, [searchParams]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      tokenBalance: 100000, // Seed 100K to start
      role: 'USER',
      status: 'ACTIVE',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random().toString(36).substring(7)}`
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      tokenBalance: user.tokenBalance,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`
    });
    setIsModalOpen(true);
  };

  // Form Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      gameToast.error("Vui lòng điền đầy đủ Tên và Email!");
      return;
    }

    try {
      if (editingUser) {
        // Edit flow
        await updateUser(editingUser.id, formData);
        gameToast.success(`Cập nhật người dùng "${formData.name}" thành công!`);
      } else {
        // Create flow
        await addUser(formData);
        gameToast.success(`Tạo tài khoản "${formData.name}" thành công!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      gameToast.error("Có lỗi xảy ra, vui lòng kiểm tra lại!");
    }
  };

  // Toggle user active status directly
  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await updateUser(user.id, { status: nextStatus });
      if (nextStatus === 'SUSPENDED') {
        gameToast.error(`Tài khoản "${user.name}" đã bị đình chỉ hoạt động!`);
      } else {
        gameToast.success(`Tài khoản "${user.name}" đã được mở khóa!`);
      }
    } catch (err) {
      gameToast.error("Thay đổi trạng thái thất bại!");
    }
  };

  // Handle Delete
  const handleDeleteUser = async (user: AdminUser) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${user.name}" khỏi hệ thống?`)) {
      try {
        await deleteUser(user.id);
        gameToast.success(`Đã xóa tài khoản "${user.name}"!`);
      } catch (err) {
        gameToast.error("Xóa tài khoản thất bại!");
      }
    }
  };

  // Filter & Sort logic
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchesSearch = 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => {
        let aVal = a[sortField as keyof AdminUser] ?? '';
        let bVal = b[sortField as keyof AdminUser] ?? '';

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = (bVal as string).toLowerCase();
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [users, searchTerm, roleFilter, statusFilter, sortField, sortOrder]);

  // Paginated records
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Table Columns Definition
  const columns: TableColumn<AdminUser>[] = [
    {
      header: "Mã ID",
      key: "id",
      sortable: true,
      align: "center",
      render: (user) => (
        <span className="font-mono text-stone-500 text-xs">#{user.id}</span>
      )
    },
    {
      header: "Tên Người Chơi",
      key: "name",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <img 
            src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} 
            alt={user.name} 
            className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 p-0.5 object-cover" 
          />
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm leading-tight">{user.name}</span>
            <span className="text-stone-500 text-[10px] tracking-wide mt-0.5">{user.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "Phân Quyền",
      key: "role",
      sortable: true,
      align: "center",
      render: (user) => {
        const isAdmin = user.role === 'ADMIN';
        return (
          <span className={`
            px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border
            ${isAdmin 
              ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }
          `}>
            {user.role}
          </span>
        );
      }
    },
    {
      header: "Số Dư (Coin)",
      key: "tokenBalance",
      sortable: true,
      align: "right",
      render: (user) => (
        <div className="inline-flex items-center gap-1.5 font-black text-yellow-400 text-xs tracking-wide">
          <Coins size={12} className="shrink-0" />
          <span>{user.tokenBalance.toLocaleString('vi-VN')}</span>
        </div>
      )
    },
    {
      header: "Trạng Thái",
      key: "status",
      sortable: true,
      align: "center",
      render: (user) => {
        const isActive = user.status === 'ACTIVE';
        return (
          <button
            onClick={() => handleToggleStatus(user)}
            title="Nhấp để đổi trạng thái"
            className={`
              px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer select-none transition-all hover:scale-105 active:scale-95
              ${isActive 
                ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
              }
            `}
          >
            {isActive ? 'Đang hoạt động' : 'Bị Khóa'}
          </button>
        );
      }
    },
    {
      header: "Ngày Tạo",
      key: "createdAt",
      sortable: true,
      render: (user) => (
        <span className="text-stone-500 text-xs">
          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
        </span>
      )
    },
    {
      header: "Hành Động",
      key: "actions",
      align: "center",
      render: (user) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => handleOpenEditModal(user)}
            className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition-all cursor-pointer"
            title="Sửa thông tin"
          >
            <Edit size={14} />
          </button>
          
          <button
            onClick={() => handleToggleStatus(user)}
            className={`
              p-1.5 rounded-lg border bg-stone-900 border-stone-800 transition-all cursor-pointer
              ${user.status === 'ACTIVE' 
                ? 'text-amber-500 hover:text-amber-400 hover:border-amber-700' 
                : 'text-green-500 hover:text-green-400 hover:border-green-700'
              }
            `}
            title={user.status === 'ACTIVE' ? "Đình chỉ hoạt động" : "Kích hoạt trở lại"}
          >
            {user.status === 'ACTIVE' ? <UserX size={14} /> : <UserCheck size={14} />}
          </button>

          <button
            onClick={() => handleDeleteUser(user)}
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
          placeholder="Tìm tên, email người chơi..."
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
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="bg-stone-950 border border-stone-800 hover:border-stone-700 rounded-xl py-2 px-3 text-xs font-semibold text-stone-300 outline-none transition-all cursor-pointer"
        >
          <option value="ALL">Tất cả Phân quyền</option>
          <option value="ADMIN">Chỉ Admin</option>
          <option value="USER">Chỉ Người chơi</option>
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
          <option value="ACTIVE">Hoạt động</option>
          <option value="SUSPENDED">Bị khóa</option>
        </select>

        <button
          onClick={handleOpenCreateModal}
          className="bg-yellow-500 hover:bg-yellow-400 text-stone-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md select-none"
        >
          <UserPlus size={14} />
          <span>Tạo Tài Khoản</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Description */}
      <div>
        <h2 className="text-xl lg:text-2xl font-black text-white uppercase tracking-wide">Quản Lý Người Dùng</h2>
        <p className="text-xs text-stone-400 mt-1 font-semibold">
          Thêm, sửa đổi thông tin, kiểm tra số dư xu và kiểm soát trạng thái hoạt động của mọi tài khoản người chơi.
        </p>
      </div>

      {/* The Reusable AdminTable */}
      <AdminTable
        columns={columns}
        data={paginatedUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredUsers.length}
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
            {/* Background Blur Sparkle */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold text-yellow-500 uppercase tracking-wider">
                {editingUser ? 'Cập nhật tài khoản' : 'Đăng ký tài khoản mới'}
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
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Tên hiển thị</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ví dụ: Anh Tuấn"
                  className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Địa chỉ Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Vd: user@gmail.com"
                  className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Số dư Coin (Xử lý xu)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.tokenBalance}
                  onChange={(e) => setFormData(prev => ({ ...prev, tokenBalance: parseInt(e.target.value) || 0 }))}
                  className="bg-stone-950 border border-stone-800 focus:border-stone-600 rounded-xl py-2.5 px-4 text-xs text-white outline-none font-semibold transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Phân quyền</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                    className="bg-stone-950 border border-stone-800 rounded-xl py-2.5 px-3 text-xs font-semibold text-white outline-none cursor-pointer"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="bg-stone-950 border border-stone-800 rounded-xl py-2.5 px-3 text-xs font-semibold text-white outline-none cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
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
                  {editingUser ? 'Cập nhật' : 'Đăng ký'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
