import { useEffect, useState } from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ChatIcon } from "../assets/icons/Chatcon";
import { TokenIcon } from "../assets/icons/TokenIcon";
import { BackButton } from "../components/BackButton";
import { ActionBar } from "../components/gameplay/ActionBar";
import { Hand } from "../components/gameplay/Hand";
import { Player } from "../components/gameplay/Player";
import { Table } from "../components/gameplay/Table";
import { Button } from "../components/ui/Button";
import { ROUTES } from "../routes/routes";
import { useAuthStore } from "../stores/auth.store";
import { useChatStore } from "../stores/chat.store";
import { useModalStore } from "../stores/modal.store";
import { useRoomStore } from "../stores/room.store";
import { useSocketStore } from "../stores/socket.store";
import type { CardType } from "../type/card";
import { useSoundStore } from "../stores/sound.store";


export default function GamePlay() {
  const user = useAuthStore.getState().user
  const isConnected = useSocketStore((s) => s.isConnected)
  const openModal = useModalStore((s) => s.open);
  const playCard = useSoundStore((s) => s.playCard);
  // Responsive timer size: 60px mobile, 80px sm, 120px lg+
  const [timerSize, setTimerSize] = useState(() =>
    window.innerWidth >= 1024 ? 120 : window.innerWidth >= 640 ? 60 : 40
  );
  useEffect(() => {
    const update = () =>
      setTimerSize(window.innerWidth >= 1024 ? 120 : window.innerWidth >= 640 ? 60 : 40);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const navigate = useNavigate();
  const handleBackClick = () => {
    useSocketStore.getState().disconnect()
    navigate(ROUTES.HOME)
    useChatStore.setState({ messages: [] })
    setSelectedIds([])
  }
  // useEffect(() => {
  //   const roomId = localStorage.getItem("roomId");
  //   const wsUrl = localStorage.getItem("wsUrl");
  //   if (roomId && wsUrl) {
  //     useSocketStore.getState().connect(Number(roomId), wsUrl);
  //   }
  // }, []);

  const message = useChatStore((state) => state.messages[state.messages.length - 1])

  const roomStore = useRoomStore.getState()
  const room = useRoomStore((state) => state.room)

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const handleSelectedCard = (card: CardType) => {
    setSelectedIds(prev => {
      const exists = prev.includes(card.id)
      if (exists) {
        // bỏ chọn
        return prev.filter(
          c => c !== card.id
        )
      } else {
        // chọn thêm
        return [...prev, card.id]
      }
    })
  }

  const handlePassTurn = () => {
    useSocketStore.getState().sendPass();
  }
  const handleAttack = () => {
    if (!isMyTurn()) {
      return toast.error("Chưa tới lượt");
    }

    if (selectedIds.length == 0) {
      return toast.error("Hay chon la");
    }

    useSocketStore.getState().sendAttack(selectedIds);
    playCard()
    setSelectedIds([])
  }

  const getRelativePosition = (playerSeat: number) => {
    const mySeat = room.me?.playerIndex || 0;
    const total = room.players.length;

    return (playerSeat - mySeat + total) % total;
  };

  const renderWhenWaiting = () => {
    return (
      <Button
        onClick={room.me?.ready ? useSocketStore.getState().sendUnReady : useSocketStore.getState().sendReady}
        className={`px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm lg:px-6 lg:py-3 lg:text-base
          rounded-lg lg:rounded-xl
          text-white font-bold
          shadow-lg shadow-red-900/50
          hover:scale-110            
          transition 
          ${room.me?.ready ? `
            bg-gradient-to-r from-red-600 to-red-800
          hover:from-red-500 hover:to-red-700`: `
            bg-zinc-700
          text-white font-semibold
          shadow-md
          hover:bg-zinc-600
          `}
      `}>READY</Button>
    )
  }

  const renderWhenPlaying = () => {
    return <>
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: timerSize, height: timerSize }}
      >
        {isMyTurn() && (<CountdownCircleTimer
          isPlaying
          duration={15}
          size={timerSize}
          strokeWidth={timerSize >= 120 ? 10 : timerSize >= 80 ? 7 : 5}
          colors={["#00C9A7", "#FFC75F", "#FF4B5C"]}
          colorsTime={[10, 5, 2]}
          trailColor="#1e293b"
        >
          {({ remainingTime }) => (
            <div
              style={{
                fontSize: timerSize >= 120 ? "30px" : timerSize >= 80 ? "20px" : "14px",
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
        </CountdownCircleTimer>)}
      </div>
      <Hand
        hands={room.me?.handCards || []}
        selectedIds={selectedIds}
        onSelected={(card) => handleSelectedCard(card)}
      />
      <ActionBar
        onAttackCard={handleAttack}
        onPassTurn={handlePassTurn}
      />
    </>
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
            <div key={player.playerIndex} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2">
              {basePlayer}
            </div>
          );

        case 2:
          return (
            <div key={player.playerIndex} className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2">
              {basePlayer}
            </div>
          );

        case 3:
          return (
            <div key={player.playerIndex} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2">
              {basePlayer}
            </div>
          );

        default:
          return null;
      }
    });
  };

  const isMyTurn = () => {
    return room.me?.playerIndex === room.currentTurn
  }

  const renderCountDown = () => {
    return (<div className="flex flex-col gap-1 sm:gap-3 items-center">
      <CountdownCircleTimer
        isPlaying
        duration={5}
        size={timerSize}
        strokeWidth={timerSize >= 120 ? 10 : timerSize >= 80 ? 7 : 5}
        colors={["#00C9A7", "#FFC75F", "#FF4B5C"]}
        colorsTime={[10, 5, 2]}
        trailColor="#1e293b"
      >
        {({ remainingTime }) => (
          <div
            style={{
              fontSize: timerSize >= 120 ? "30px" : timerSize >= 80 ? "20px" : "14px",
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
      <h1 className="font-bold text-xs sm:text-base lg:text-lg text-yellow-500">Trò chơi sắp bắt đầu</h1>
    </div>)
  }

  return (
    <div
      className="w-full h-screen bg-cover bg-center relative overflow-hidden p-1"
      style={{ backgroundImage: "url(/bg-room.png)" }}
    >
      <div className="flex gap-2 sm:gap-3 lg:gap-5">
        <BackButton onClick={() => handleBackClick()} />
        <div className="p-1.5 sm:px-2 lg:w-40 rounded-xl sm:rounded-2xl bg-amber-50/20 shadow-lg shadow-red-900/40">
          <div className="flex justify-between">
            <h1 className="font-bold text-[10px] lg:text-lg">Room ID: </h1>
            <h1 className="font-bold text-[10px] lg:text-lg text-yellow-500">{room.roomId}</h1>
          </div>
          <div className="flex justify-between">
            <h1 className="font-bold text-[10px] lg:text-lg">Đặt cược:</h1>
            <h1 className="font-bold text-[10px] lg:text-lg text-yellow-500 flex items-center">{room.betToken} <TokenIcon className="w-4 sm:w-5 lg:w-6" /></h1>
          </div>
        </div>
      </div>

      {roomStore.room && renderPlayer()}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Table cards={room.table || []} />
        {room.status === 'READY' && renderCountDown()}
      </div>

      {/* Actions */}
      <div className="absolute bottom-2 sm:bottom-4 lg:bottom-6 w-full flex justify-center items-center gap-2 sm:gap-3 lg:gap-4 px-2">
        {room.status !== 'PLAYING' && renderWhenWaiting()}
        {room.status === 'PLAYING' && renderWhenPlaying()}
      </div>

      {!isConnected && (<div className="absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-900/80 px-3 py-1 rounded-xl">
        <h1 className="font-bold text-xs sm:text-base lg:text-lg text-yellow-500">Bạn bị mất kết nối! Hãy thoát Room</h1>
      </div>)}

      <div className="w-fit max-w-[40%] sm:max-w-[30%] lg:max-w-[15%] h-min bg-gray-700/40 overflow-auto flex justify-between items-center absolute top-0 right-0 rounded-bl-2xl px-2 py-1">
        <Button onClick={() => openModal("CHAT_ROOM")}>
          <ChatIcon className="w-6 sm:w-10 lg:w-16" />
        </Button>
        {message && (
          <div
            className={`max-w-[80%] w-fit px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl text-[10px] sm:text-xs lg:text-sm overflow-hidden 
              ${message.user.id === user?.id ? "ml-auto bg-blue-600/80 text-white" : "bg-gray-200 text-gray-900"}`}
          >
            <div className="font-semibold text-[9px] sm:text-xs opacity-80 mb-0.5 truncate whitespace-nowrap">
              <b>#{String(message.user.id).slice(0, 4)} - {message.user.name}:</b> {message.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
