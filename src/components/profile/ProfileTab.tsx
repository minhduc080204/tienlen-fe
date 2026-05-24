import { useState } from "react";
import { dataApi } from "../../api/data.api";
import { useAuthStore } from "../../stores/auth.store";
import type { UserType } from "../../type/user";
import { formatNumber } from "../../utils/formatNumber";
import { gameToast } from "../ui/toast";
import { Edit2, Save, Mail, Fingerprint, Coins, ShieldAlert } from "lucide-react";

export const ProfileTab = ({
  user,
  onUpdateUser,
}: {
  user: UserType;
  onUpdateUser?: (user: UserType) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [saving, setSaving] = useState(false);

  const updateUserStore = useAuthStore((s) => s.updateUser);

  const handleSave = async () => {
    if (!editName.trim()) {
      gameToast.error("Tên hiển thị không được để trống!");
      return;
    }

    setSaving(true);
    try {
      // Gọi API cập nhật tên
      const updatedData = await dataApi.updateProfile({ name: editName.trim() });
      const newUser = { ...user, name: updatedData.name || editName.trim() };

      updateUserStore(newUser);
      if (onUpdateUser) {
        onUpdateUser(newUser);
      }

      gameToast.success("Cập nhật tên hiển thị thành công!");
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      gameToast.error(err?.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại sau.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col bg-zinc-950 p-4 lg:p-6 rounded-lg h-full w-full overflow-hidden">
      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-red-500 flex items-center justify-center text-2xl overflow-hidden shrink-0 shadow-lg shadow-red-950/20">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : "👤"}
          </div>
          {/* Editable Display Name */}
          <div className="flex-1 bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 px-4 transition-all hover:border-zinc-700">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tên Hiển Thị</label>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-red-500 hover:text-red-400 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit2 size={12} /> Sửa
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(user.name);
                    }}
                    className="text-zinc-500 hover:text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-2.5 py-1 rounded-md text-[10px] font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Save size={12} /> {saving ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
                className="w-full bg-zinc-950 border border-red-500/50 focus:border-red-500 outline-none rounded-lg p-2 text-sm font-semibold text-white transition-all shadow-inner"
              />
            ) : (
              <div className="text-base font-bold text-white">{user.name}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto custom-scrollbar pr-1 pb-2">
          {/* Username / Email */}
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
              <Mail size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Tên Đăng Nhập</div>
              <div className="text-xs font-semibold text-zinc-200 truncate">{user.account}</div>
            </div>
          </div>

          {/* ID */}
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
              <Fingerprint size={14} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">ID Của Bạn</div>
              <div className="text-xs font-mono font-bold text-zinc-300">#{user.id}</div>
            </div>
          </div>

          {/* Token Balance */}
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0 text-yellow-500">
              <Coins size={14} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Số Dư Coin</div>
              <div className="text-xs font-black text-yellow-400">{formatNumber(user.tokenBalance)} xu</div>
            </div>
          </div>

          {/* Role */}
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400">
              <ShieldAlert size={14} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Phân Quyền</div>
              <div className="text-xs font-black text-blue-300 uppercase">{user.role || "USER"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
