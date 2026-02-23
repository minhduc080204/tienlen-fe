import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import ChatTab from "../components/ChatTab";
import { ActionBar } from "../components/gameplay/ActionBar";
import { Player } from "../components/gameplay/Player";
import { ROUTES } from "../routes/routes";
import { useSocketStore } from "../stores/socket.store";
import { HandCard } from "../components/HandCard";

export default function GamePlay() {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(ROUTES.HOME)
  }
  useEffect(() => {
    const roomId = localStorage.getItem("roomId");
    const wsUrl = localStorage.getItem("wsUrl");
    if (roomId && wsUrl) {
      useSocketStore.getState().connect(Number(roomId), wsUrl);
    }
  }, []);
  return (
    <div
      className="w-full h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url(/bg-room.png)" }}
    >
      <BackButton onClick={() => handleBackClick()} />
      {/* Players */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <Player player={{ id: 2, name: "Bot A", cardsCount: 10 }} />
      </div>

      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Player player={{ id: 3, name: "Bot B", cardsCount: 8 }} />
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Player player={{ id: 4, name: "Bot C", cardsCount: 6 }} />
      </div>

      {/* Table */}
      {/* <div className="absolute inset-0 flex items-center justify-center">
        <Table cards={[]} />
      </div> */}

      {/* Hand */}
      <div className="absolute bottom-28 w-full">
        
      </div>

      {/* Actions */}
      <div className="absolute bottom-6 w-full flex justify-center">
        <HandCard/>
        <ActionBar />
      </div>


      <div className="w-1/4 h-min bg-gray-700/40 overflow-auto absolute top-0 right-0 rounded-2xl">
        <ChatTab />
      </div>
    </div>
  );
}
