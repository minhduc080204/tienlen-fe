import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import ChatTab from "../components/ChatTab";
import { ActionBar } from "../components/gameplay/ActionBar";
import { Player } from "../components/gameplay/Player";
import { ROUTES } from "../routes/routes";
import { useSocketStore } from "../stores/socket.store";
import type { CardType } from "../type/card";
import toast from "react-hot-toast";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { Hand } from "../components/gameplay/Hand";

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


  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const handleSelectedCard = (card:CardType)=> {
    setSelectedIds(prev => {
      const exists = prev.includes(card.id)
      if (exists) {
          // bỏ chọn
          return prev.filter(
              c => c!==card.id
          )
      } else {
          // chọn thêm
          return [...prev, card.id]
      }
    })
  }
  const handlePassTurn = () => {

  }
  const handleAttack = () => {
    if(selectedIds.length==0){
      return toast.error("Hay chon la");
    }
  }
  const hands: CardType[] = [
      {id: "1", rank: 3, suit: 0},
      {id: "12", rank: 4, suit: 1},
      {id: "13", rank: 5, suit: 2},
      {id: "14", rank: 6, suit: 3},
      {id: "15", rank: 7, suit: 0},
      {id: "16", rank: 8, suit: 1},
      {id: "17", rank: 9, suit: 2},
      {id: "18", rank: 10, suit: 3},
      {id: "19", rank: 11, suit: 0},
      {id: "10", rank: 12, suit: 1},
      {id: "11", rank: 13, suit: 2},
      {id: "111", rank: 14, suit: 3},
      {id: "112", rank: 15, suit: 0},
  ]
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
      <div className="absolute bottom-6 w-full flex justify-center items-center gap-4">
        <div className="mr-10">
          <CountdownCircleTimer
            isPlaying
            duration={10}
            size={120}                 // 👈 nhỏ lại
            strokeWidth={10}           // 👈 viền mảnh hơn
            colors={["#00C9A7", "#FFC75F", "#FF4B5C"]}
            colorsTime={[10, 5, 2]}
            trailColor="#1e293b"      // màu nền vòng (dark mode đẹp)
          >
            {({ remainingTime }) => (
              <div
                style={{
                  fontSize: "30px",     // 👈 số to hơn
                  fontWeight: 700,
                  color:
                    remainingTime <= 2
                      ? "#FF4B5C"
                      : remainingTime <= 5
                      ? "#FFC75F"
                      : "#00C9A7",
                }}
              >
                {remainingTime}
              </div>
            )}
          </CountdownCircleTimer>
        </div>
        <Hand
          hands={hands}
          selectedIds={selectedIds}
          onSelected={(card)=>handleSelectedCard(card)}
        />
        <ActionBar
          onAttackCard={handleAttack}
          onPassTurn={handlePassTurn}
        />
      </div>


      <div className="w-1/4 h-min bg-gray-700/40 overflow-auto absolute top-0 right-0 rounded-2xl">
        <ChatTab />
      </div>
    </div>
  );
}
