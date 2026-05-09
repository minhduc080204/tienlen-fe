import { useEffect, useState } from "react";
import { dataApi } from "../../api/data.api";
import type { MatchParticipant } from "../../type/match-history";
import type { Transaction } from "../../type/transaction";
import type { UserType } from "../../type/user";
import { formatNumber } from "../../utils/formatNumber";
import { ModalContainer } from "./ModalContainer";

type TabType = "PROFILE" | "MATCHES" | "TRANSACTIONS";

export default function ProfileModal() {
  const [activeTab, setActiveTab] = useState<TabType>("PROFILE");

  const [user, setUser] = useState<UserType | null>(null);
  const [matches, setMatches] = useState<MatchParticipant[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === "PROFILE" && !user) {
          const data = await dataApi.profile();
          setUser(data);
        } else if (activeTab === "MATCHES" && matches.length === 0) {
          const data = await dataApi.matches();
          setMatches(data);
        } else if (activeTab === "TRANSACTIONS" && transactions.length === 0) {
          const data = await dataApi.transactions();
          setTransactions(data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <ModalContainer className="w-[92vw] max-w-112.5 max-h-[80vh] overflow-hidden flex flex-col">
      {/* Tabs Header */}
      <div className="flex border-b border-zinc-800 bg-zinc-950">
        <button
          onClick={() => setActiveTab("PROFILE")}
          className={`flex-1 text-center py-3 text-sm font-bold transition ${activeTab === "PROFILE" ? "border-b-2 border-red-500 text-red-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          PROFILE
        </button>
        <button
          onClick={() => setActiveTab("MATCHES")}
          className={`flex-1 text-center py-3 text-sm font-bold transition ${activeTab === "MATCHES" ? "border-b-2 border-red-500 text-red-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          MATCHES
        </button>
        <button
          onClick={() => setActiveTab("TRANSACTIONS")}
          className={`flex-1 text-center py-3 text-sm font-bold transition ${activeTab === "TRANSACTIONS" ? "border-b-2 border-red-500 text-red-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          TRANSACTIONS
        </button>
      </div>

      {/* Content Body */}
      <div className="p-4 lg:p-6 overflow-y-auto flex-1 custom-scrollbar">
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
          </div>
        )}

        {error && !loading && (
          <div className="text-red-500 text-center py-5">{error}</div>
        )}

        {!loading && !error && activeTab === "PROFILE" && user && (
          <div className="flex items-center gap-5 bg-zinc-950 p-4 rounded-lg">
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
        )}

        {!loading && !error && activeTab === "MATCHES" && (
          <div className="bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="p-3 text-zinc-300 font-semibold">Type</th>
                  <th className="p-3 text-zinc-300 font-semibold">Rank</th>
                  <th className="p-3 text-zinc-300 font-semibold">Change</th>
                  <th className="p-3 text-zinc-300 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {matches.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-zinc-500">No matches found</td></tr>
                ) : (
                  matches.map(m => (
                    <tr key={m.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20">
                      <td className="p-3 text-zinc-300">{m.match.roomType}</td>
                      <td className={`p-3 font-bold ${m.rank === 1 ? 'text-red-500' : 'text-zinc-400'}`}>#{m.rank}</td>
                      <td className={`p-3 font-medium ${m.tokenChange > 0 ? 'text-green-500' : m.tokenChange < 0 ? 'text-red-500' : 'text-zinc-400'}`}>
                        {m.tokenChange > 0 ? '+' : ''}{m.tokenChange}
                      </td>
                      <td className="p-3 text-zinc-500 text-xs">{formatDate(m.match.startTime)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && activeTab === "TRANSACTIONS" && (
          <div className="flex flex-col gap-3">
            {transactions.length === 0 ? (
              <div className="text-center text-zinc-500 py-4">No transactions found</div>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} className={`bg-zinc-950 p-3 rounded-lg border-l-4 ${tx.amount > 0 ? 'border-green-500' : tx.amount < 0 ? 'border-red-500' : 'border-zinc-500'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-zinc-200">{tx.type}</span>
                    <span className={`font-bold ${tx.amount > 0 ? 'text-green-500' : tx.amount < 0 ? 'text-red-500' : 'text-zinc-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 mb-1">{tx.description}</div>
                  <div className="text-[10px] text-zinc-500">{formatDate(tx.createdAt)}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </ModalContainer>
  );
}
