import type { UserType } from "../../type/user";
import { formatNumber } from "../../utils/formatNumber";

export const ProfileTab = ({ user }: { user: UserType }) => (
  <div className="flex items-center gap-5 bg-zinc-950 p-4 rounded-lg overflow-y-auto custom-scrollbar h-full">
    <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-red-500 flex items-center justify-center text-3xl overflow-hidden shrink-0">
      {user.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : "👤"}
    </div>
    <div>
      <div className="text-xl font-bold text-red-500">{user.name}</div>
      <div className="text-zinc-400 text-sm mb-2">{user.id}</div>
      <div className="flex items-center gap-2 font-semibold">
        <span className="text-yellow-500">💰</span> {formatNumber(user.tokenBalance)}
      </div>
    </div>
  </div>
);
