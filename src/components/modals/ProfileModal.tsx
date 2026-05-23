import { useEffect, useState } from "react";
import { dataApi } from "../../api/data.api";
import type { MatchParticipant } from "../../type/match-history";
import type { Transaction } from "../../type/transaction";
import type { UserType } from "../../type/user";
import { Button } from "../ui/Button";
import { ModalContainer } from "./ModalContainer";

import { nftApi } from "../../api/nft.api";
import { useSettingsStore } from "../../stores/settings.store";
import type { NFTItemData } from "../../type/nft";
import { MatchesTab } from "../profile/MatchesTab";
import { NftsTab } from "../profile/NftsTab";
import { ProfileTab } from "../profile/ProfileTab";
import { TransactionsTab } from "../profile/TransactionsTab";

type TabType = "PROFILE" | "MATCHES" | "TRANSACTIONS" | "NFTS_ITEMS";

export default function ProfileModal() {
  const [activeTab, setActiveTab] = useState<TabType>("PROFILE");

  const [user, setUser] = useState<UserType | null>(null);
  const [matches, setMatches] = useState<MatchParticipant[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [myNfts, setMyNfts] = useState<NFTItemData[]>([]);
  const { selectedCardSkinId, setSelectedCardSkin } = useSettingsStore();
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
        } else if (activeTab === "NFTS_ITEMS" && myNfts.length === 0) {
          const data = await nftApi.getMyNFTs();
          setMyNfts(data);
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
    <ModalContainer className="w-130 h-[80vh] p-0! overflow-hidden flex flex-col">
      {/* Tabs Header */}
      <div className="flex justify-around border-b border-zinc-800 bg-zinc-950">
        <Button
          onClick={() => setActiveTab("PROFILE")}
          className={`text-center py-3 px-3 text-sm font-bold transition ${activeTab === "PROFILE" ? "border-b-2 border-red-500 text-red-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          PROFILE
        </Button>
        <Button
          onClick={() => setActiveTab("NFTS_ITEMS")}
          className={`text-center py-3 px-3 text-sm font-bold transition ${activeTab === "NFTS_ITEMS" ? "border-b-2 border-red-500 text-red-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          NFTS ITEMS
        </Button>
        <Button
          onClick={() => setActiveTab("MATCHES")}
          className={`text-center py-3 px-3 text-sm font-bold transition ${activeTab === "MATCHES" ? "border-b-2 border-red-500 text-red-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          MATCHES
        </Button>
        <Button
          onClick={() => setActiveTab("TRANSACTIONS")}
          className={`text-center py-3 px-3 text-sm font-bold transition ${activeTab === "TRANSACTIONS" ? "border-b-2 border-red-500 text-red-500" : "text-zinc-400 hover:text-zinc-200"}`}
        >
          TRANSACTIONS
        </Button>
      </div>

      {/* Content Body */}
      <div className="p-4 lg:p-6 flex-1 overflow-hidden min-h-0 flex flex-col">
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
          </div>
        )}

        {error && !loading && (
          <div className="flex justify-center items-center h-full text-red-500 text-center">{error}</div>
        )}

        {!loading && !error && (
          <div className="flex-1 min-h-0">
            {activeTab === "PROFILE" && user && (
              <ProfileTab user={user} onUpdateUser={(updatedUser) => setUser(updatedUser)} />
            )}
            {activeTab === "MATCHES" && <MatchesTab matches={matches} formatDate={formatDate} />}
            {activeTab === "TRANSACTIONS" && <TransactionsTab transactions={transactions} formatDate={formatDate} />}
            {activeTab === "NFTS_ITEMS" && (
              <NftsTab
                myNfts={myNfts}
                selectedCardSkinId={selectedCardSkinId}
                setSelectedCardSkin={setSelectedCardSkin}
              />
            )}
          </div>
        )}
      </div>
    </ModalContainer>
  );
}
