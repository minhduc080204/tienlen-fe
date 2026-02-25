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
import { Table } from "../components/gameplay/Table";
import { useRoomStore } from "../stores/room.store";
import { TokenIcon } from "../assets/icons/TokenIcon";

export default function GamePlay() {
  const navigate = useNavigate();
  const sendReadySocket = useSocketStore((s) => s.sendReady);
  const handleBackClick = () => {
    useSocketStore.getState().disconnect()
    navigate(ROUTES.HOME)
  }
  useEffect(() => {
    const roomId = localStorage.getItem("roomId");
    const wsUrl = localStorage.getItem("wsUrl");
    if (roomId && wsUrl) {
      useSocketStore.getState().connect(Number(roomId), wsUrl);
      console.log("STORE OK");
      
    }
  }, []);

  const roomStore = useRoomStore.getState()
  const room = useRoomStore((state) => state.room)

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
        // {id: "12", rank: 4, suit: 1},
        // {id: "13", rank: 5, suit: 2},
        // {id: "14", rank: 6, suit: 3},
        // {id: "15", rank: 7, suit: 0},
        // {id: "16", rank: 8, suit: 1},
        // {id: "17", rank: 9, suit: 2},
        // {id: "18", rank: 10, suit: 3},
      // {id: "19", rank: 11, suit: 0},
      // {id: "19", rank: 11, suit: 1},
      // {id: "19", rank: 11, suit: 2},
      // {id: "19", rank: 11, suit: 3},
      // {id: "10", rank: 12, suit: 1},
      // {id: "10", rank: 12, suit: 2},
      // {id: "10", rank: 12, suit: 3},
      // {id: "10", rank: 12, suit: 0},
      // {id: "11", rank: 13, suit: 1},
      // {id: "11", rank: 13, suit: 2},
      // {id: "11", rank: 13, suit: 3},
      // {id: "11", rank: 13, suit: 0},
      // {id: "112", rank: 10, suit: 0},
  ]

  const getCuurrentDataRoom = () => {
    console.log(room);
    
  }

  const getRelativePosition = (playerSeat: number) => {
    const mySeat = room.me?.playerIndex||0;
    const total = room.players.length;

    return (playerSeat - mySeat + total) % total;
  };

  const renderWhenWaiting = ()=> {
    return(
      <button
        onClick={sendReadySocket}
        className={`px-6 py-3
          rounded-xl
          text-white font-bold
          shadow-lg shadow-red-900/50
          hover:scale-110            
          transition 
          ${ room.me?.ready?`
            bg-gradient-to-r from-red-600 to-red-800
          hover:from-red-500 hover:to-red-700`:`
            bg-zinc-700
          text-white font-semibold
          shadow-md
          hover:bg-zinc-600
          `}
      `}>READY</button>
    )
  }

  const renderWhenPlaying = () => {
    return<>
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
                  fontSize: "30px",    
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
    </>
  }

  const renderWhenReady = () => {
    return <></>
  }

  const renderPlayer = () => {
  return room.players.map((player) => {
    const relative = getRelativePosition(player.playerIndex);

    const basePlayer = (
      <Player key={player.playerIndex} player={player} />
    );

    switch (relative) {
      // case 0:
      //   return (
      //     <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      //       {basePlayer}
      //     </div>
      //   );

      case 1:
        return (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {basePlayer}
          </div>
        );

      case 2:
        return (
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            {basePlayer}
          </div>
        );

      case 3:
        return (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {basePlayer}
          </div>
        );

      default:
        return null;
    }
  });
};
  
  return (
    <div
      className="w-full h-screen bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: "url(/bg-room.png)" }}
    >
      <div className="flex gap-5">
        <BackButton onClick={() => handleBackClick()} />
        <div className="p-2 w-40 rounded-2xl bg-amber-50/20 shadow-lg shadow-red-900/40">
          <div className="flex justify-between">
            <h1 className="font-bold text-md">Room ID: </h1>
            <h1 className="font-bold text-md text-yellow-500">{room.roomId}</h1>
          </div>
          <div className="flex justify-between">
            <h1 className="font-bold text-md">Cược:</h1>
            <h1 className="font-bold text-md text-yellow-500 flex">{room.betToken} <TokenIcon className="w-6"/></h1>
          </div>
        </div>
      </div>
      
      {roomStore.room&&renderPlayer()}
    
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Table cards={[hands[0], hands[0], hands[0]]} />
      </div>

      <button onClick={getCuurrentDataRoom}>
        GetData
      </button>


      {/* Actions */}
      <div className="absolute bottom-6 w-full flex justify-center items-center gap-4">
        
        {room.status==='WAITING'&&renderWhenWaiting()}
        {room.status==='PLAYING'&&renderWhenPlaying()}
        {room.status==='READY'&&renderWhenReady()}
      </div>


      <div className="w-1/4 h-min bg-gray-700/40 overflow-auto absolute top-0 right-0 rounded-2xl">
        <ChatTab />
      </div>
    </div>
  );
}
