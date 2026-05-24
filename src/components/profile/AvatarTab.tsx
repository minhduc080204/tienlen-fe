import { useEffect, useState } from "react";
import { avatarApi } from "../../api/avatar.api";
import { useAuthStore } from "../../stores/auth.store";
import { useModalStore } from "../../stores/modal.store";
import type { AvatarItemData } from "../../type/avatar";
import type { UserType } from "../../type/user";
import { gameToast } from "../ui/toast";
import { Sparkles, Smile, RefreshCw, Lock } from "lucide-react";

export const AvatarTab = ({
  user,
  onUpdateUser,
}: {
  user: UserType;
  onUpdateUser?: (user: UserType) => void;
}) => {
  const [avatars, setAvatars] = useState<AvatarItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<"presets" | "custom">("presets");
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>("all");

  // Custom avatar states
  const [customStyle, setCustomStyle] = useState<string>("adventurer");
  const [customSeed, setCustomSeed] = useState<string>("");
  const [customPreviewUrl, setCustomPreviewUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const openModal = useModalStore((s) => s.open);
  const updateUserStore = useAuthStore((s) => s.updateUser);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const list = await avatarApi.getAvatars();
        setAvatars(list);
      } catch (err) {
        console.error("Failed to fetch avatars", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvatars();
  }, []);

  // Update preview URL when style or seed changes
  useEffect(() => {
    if (customStyle) {
      const seed = customSeed.trim() || user.name || "Default";
      setCustomPreviewUrl(`https://api.dicebear.com/9.x/${customStyle}/svg?seed=${encodeURIComponent(seed)}`);
    }
  }, [customStyle, customSeed, user.name]);

  // Free styles vs paid
  const freeStyles = ["adventurer", "adventurer-neutral", "big-ears"];
  const uniqueStyles = Array.from(new Set(avatars.map((a) => a.style)));
  const ownedStyles = uniqueStyles.filter(
    (style) => freeStyles.includes(style) || avatars.some((a) => a.style === style && a.owned)
  );

  // List of unique styles in general for presets filter
  const styleFilters = ["all", ...uniqueStyles];

  // Map backend style display names
  const styleDisplayNames: Record<string, string> = {
    all: "Tất Cả",
    adventurer: "Thám Hiểm",
    "adventurer-neutral": "Trung Lập",
    "big-ears": "Tai To",
    avataaars: "Nhân Vật",
    bottts: "Người Máy",
    thumbs: "Ngón Tay",
  };

  const handleSelectPreset = async (item: AvatarItemData) => {
    try {
      await avatarApi.selectAvatar(item.id);

      const updatedUser = { ...user, avatarUrl: item.srcUrl };
      updateUserStore(updatedUser);
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      gameToast.success(`Thay đổi avatar sang "${item.name}" thành công!`);
    } catch (err: any) {
      console.error(err);
      gameToast.error(err?.response?.data?.message || "Không thể đổi avatar");
    }
  };

  const handleSelectCustom = async () => {
    if (!customPreviewUrl) return;
    setSaving(true);
    try {
      await avatarApi.selectCustom(customPreviewUrl);

      const updatedUser = { ...user, avatarUrl: customPreviewUrl };
      updateUserStore(updatedUser);
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      gameToast.success("Thiết lập avatar tùy chỉnh thành công!");
    } catch (err: any) {
      console.error(err);
      gameToast.error(err?.response?.data?.message || "Không thể đổi avatar tùy chỉnh");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col bg-zinc-950 rounded-lg overflow-hidden h-full w-full p-2">
      {/* Select Avatar Sub-tabs */}
      <div className="flex border-b border-zinc-800 gap-4 mt-1 lg:mt-3 shrink-0">
        <button
          onClick={() => setActiveSubTab("presets")}
          className={`pb-2 text-xs lg:text-sm font-semibold transition-colors relative flex items-center gap-2 ${activeSubTab === "presets" ? "text-red-500" : "text-zinc-400 hover:text-zinc-200"
            }`}
        >
          <Smile size={16} />
          Mẫu Có Sẵn
          {activeSubTab === "presets" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("custom")}
          className={`pb-2 text-xs lg:text-sm font-semibold transition-colors relative flex items-center gap-2 ${activeSubTab === "custom" ? "text-red-500" : "text-zinc-400 hover:text-zinc-200"
            }`}
        >
          <Sparkles size={16} />
          Tự Tạo Avatar
          {activeSubTab === "custom" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex-1 flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : activeSubTab === "presets" ? (
        <div className="flex-1 flex flex-col min-h-0 mt-3 overflow-hidden">
          {/* Style Filters */}
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 shrink-0">
            {styleFilters.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyleFilter(style)}
                className={`px-3 py-1 text-xs rounded-full border transition font-medium shrink-0 cursor-pointer ${selectedStyleFilter === style
                    ? "bg-red-500/10 border-red-500 text-red-500 font-bold"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
              >
                {styleDisplayNames[style] || style}
              </button>
            ))}
          </div>

          {/* Preset Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 mt-2 min-h-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-4">
              {avatars
                .filter((item) => selectedStyleFilter === "all" || item.style === selectedStyleFilter)
                .map((item) => {
                  const isEquipped = user.avatarUrl === item.srcUrl;
                  const isFree = freeStyles.includes(item.style);
                  const isUnlocked = isFree || item.owned;

                  return (
                    <div
                      key={item.id}
                      className={`relative group bg-zinc-900 border rounded-xl p-3 flex flex-col items-center gap-3 transition-all duration-300 ${isEquipped
                          ? "border-green-500/50 shadow-md shadow-green-950/10"
                          : "border-zinc-800 hover:border-zinc-700"
                        }`}
                    >
                      {/* Avatar preview */}
                      <div className="w-16 h-16 rounded-full bg-zinc-850 p-1 flex items-center justify-center overflow-hidden border border-zinc-800 shadow-inner shrink-0">
                        <img src={item.srcUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Info */}
                      <div className="text-center w-full min-w-0 flex-1 flex flex-col justify-center">
                        <div className="text-xs font-semibold text-zinc-200 truncate">{item.name}</div>
                        <div className="text-[10px] text-zinc-500 capitalize">
                          {styleDisplayNames[item.style] || item.style}
                        </div>
                      </div>

                      {/* Lock Overlay if locked */}
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                          <Lock className="text-yellow-500 mb-1" size={16} />
                          <div className="text-[10px] text-yellow-500 font-semibold text-center mb-2">Bộ này chưa mua</div>
                          <button
                            onClick={() => openModal("NFT_SHOP")}
                            className="w-full bg-yellow-600 hover:bg-yellow-500 text-black text-[10px] font-bold py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1 shadow-md cursor-pointer"
                          >
                            Đến Shop Mua
                          </button>
                        </div>
                      )}

                      {/* Lock Icon shown when not hovered (if locked) */}
                      {!isUnlocked && (
                        <div className="absolute top-2 right-2 bg-zinc-950/80 border border-zinc-850 p-1 rounded-full text-zinc-400 group-hover:hidden transition-all z-10">
                          <Lock size={10} className="text-yellow-500/80" />
                        </div>
                      )}

                      {/* Use / Equipped Button (if unlocked) */}
                      {isUnlocked && (
                        <div className="w-full shrink-0 mt-auto">
                          {isEquipped ? (
                            <div className="w-full bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-bold py-1.5 px-3 rounded-lg text-center">
                              Đang dùng
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSelectPreset(item)}
                              className="w-full bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer"
                            >
                              Sử dụng
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        // Custom Avatar Generator Tab
        <div className="flex-1 flex flex-col sm:flex-row gap-4 mt-3 overflow-y-auto custom-scrollbar pb-4 min-h-0">
          {/* Preview card */}
          <div className="w-full sm:w-2/5 bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 shrink-0">
            <div className="text-xs font-semibold text-zinc-400">Xem Trước Avatar</div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-zinc-850 p-2 flex items-center justify-center overflow-hidden border border-zinc-800 shadow-lg shadow-black/40 relative">
              {customPreviewUrl ? (
                <img src={customPreviewUrl} alt="custom-preview" className="w-full h-full object-cover" />
              ) : (
                <div className="animate-pulse w-full h-full bg-zinc-800 rounded-full" />
              )}
            </div>
            <button
              onClick={handleSelectCustom}
              disabled={saving || !customPreviewUrl}
              className="w-full max-w-[180px] bg-green-600 hover:bg-green-500 disabled:bg-zinc-850 disabled:text-zinc-500 active:scale-95 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
            >
              {saving ? "Đang lưu..." : "Thiết lập Avatar"}
            </button>
          </div>

          {/* Configuration controls */}
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Bộ Thiết Kế (Style)</label>
              <select
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 focus:outline-none rounded-lg p-2.5 text-xs text-zinc-200"
              >
                {ownedStyles.length === 0 ? (
                  <option value="adventurer">Thám Hiểm (Free)</option>
                ) : (
                  ownedStyles.map((style) => (
                    <option key={style} value={style}>
                      {styleDisplayNames[style] || style} {freeStyles.includes(style) ? "(Miễn phí)" : ""}
                    </option>
                  ))
                )}
              </select>
              <p className="text-[10px] text-zinc-500 mt-1">
                * Chỉ hiển thị các bộ thiết kế miễn phí hoặc đã sở hữu.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Mã Hạt Giống (Seed)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSeed}
                  onChange={(e) => setCustomSeed(e.target.value)}
                  placeholder="Gõ chữ để tạo diện mạo..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-red-500 focus:outline-none rounded-lg p-2.5 text-xs text-zinc-200 min-w-0"
                />
                <button
                  onClick={() => setCustomSeed(Math.random().toString(36).substring(2, 8).toUpperCase())}
                  className="bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 p-2.5 rounded-lg transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  title="Ngẫu nhiên hạt giống"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Mỗi từ khóa sẽ tự động sinh ra một diện mạo độc nhất.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
