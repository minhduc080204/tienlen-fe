import { useEffect, useState } from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useLocation, useNavigate } from "react-router-dom";
import { TokenIcon } from "../assets/icons/TokenIcon";
import { BackButton } from "../components/BackButton";
import { ActionBar } from "../components/gameplay/ActionBar";
import { Hand } from "../components/gameplay/Hand";
import { Player } from "../components/gameplay/Player";
import { Table } from "../components/gameplay/Table";
import { Button } from "../components/ui/Button";
import { gameToast } from "../components/ui/toast";
import { ROUTES } from "../routes/routes";
import { useAuthStore } from "../stores/auth.store";
import type { CardType } from "../type/card";
import type { RoomType } from "../type/room";
import { cardIdToCard } from "../utils/cardIdToCard";
import { createDeck, shuffleDeck } from "../utils/gameUtils";
import { chooseMove, isValidMove } from "../utils/tienlenAI";
import type { PlayerType } from "../type/player";
import { BOT_DIFFICULTY_MAP } from "../type/game-ai";

export default function GamePlayBot() {
    const location = useLocation();
    const { bet, difficulty } = location.state || { bet: 10, difficulty: 1 };
    const user = useAuthStore((s) => s.user);
    const navigate = useNavigate();

    const [room, setRoom] = useState<RoomType>({
        roomId: 8888,
        table: [],
        players: [],
        status: "WAITING",
        currentTurn: 0,
        betToken: bet
    });

    const [isReady, setIsReady] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [timerSize, setTimerSize] = useState(() =>
        window.innerWidth >= 1024 ? 120 : window.innerWidth >= 640 ? 60 : 40
    );

    // Initial Setup: Me and Bot
    useEffect(() => {
        const me: PlayerType = {
          user: {
            id: 1000,
            name: "Stupid Player",
            avatarUrl: "",
            tokenBalance: 999999
          },
          ready: false,
          handSize: 0,
          handCards: [],
          playerIndex: 0
        };
        const bot: PlayerType = {
          user: {
            id: 1000,
            name: "🤖 Bot " + (BOT_DIFFICULTY_MAP[difficulty] || "EASY"),
            avatarUrl: "",
            tokenBalance: 999999
          },
          ready: true,
          handSize: 0,
          handCards: [],
          playerIndex: 1
        };
        setRoom(prev => ({ ...prev, me, players: [me, bot] }));
    }, [user, difficulty]);

    useEffect(() => {
        const update = () =>
            setTimerSize(window.innerWidth >= 1024 ? 120 : window.innerWidth >= 640 ? 60 : 40);
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const handleBackClick = () => {
        navigate(ROUTES.HOME);
    };

    const handleReady = () => {
        setIsReady(!isReady);
        if (!isReady) {
            // Start game after a short delay if ready
            setRoom(prev => ({ ...prev, status: "READY" }));
            setTimeout(() => {
                startGame();
            }, 3000);
        } else {
            setRoom(prev => ({ ...prev, status: "WAITING" }));
        }
    };

    const startGame = () => {
        const deck = shuffleDeck(createDeck());
        const myCards = deck.slice(0, 13).sort((a, b) => a.rank - b.rank || a.suit - b.suit);
        const botCards = deck.slice(13, 26).sort((a, b) => a.rank - b.rank || a.suit - b.suit);

        setRoom(prev => {
            const newMe = { ...prev.me!, handCards: myCards, handSize: 13, ready: true };
            const newBot = { ...prev.players[1], handCards: botCards, handSize: 13, ready: true };
            return {
                ...prev,
                status: "PLAYING",
                me: newMe,
                players: [newMe, newBot],
                table: [],
                currentTurn: 0 // Player goes first
            };
        });
        gameToast.success("Trò chơi bắt đầu!");
    };

    const handleSelectedCard = (card: CardType) => {
        setSelectedIds(prev => {
            const exists = prev.includes(card.id);
            if (exists) return prev.filter(c => c !== card.id);
            return [...prev, card.id];
        });
    };

    const isMyTurn = () => room.status === "PLAYING" && room.currentTurn === 0;

    const handleAttack = () => {
        if (!isMyTurn()) return gameToast.error("Chưa tới lượt");
        if (selectedIds.length === 0) return gameToast.error("Hãy chọn lá bài");

        const selectedCards = selectedIds.map(cardIdToCard);
        const tableCards = room.table.map(cardIdToCard);

        if (!isValidMove(tableCards, selectedCards)) {
          return gameToast.error("Nước đi không hợp lệ!");
        }

        // Apply attack
        setRoom(prev => {
          const newHand = prev.me!.handCards!.filter(c => !selectedIds.includes(c.id));
          const newMe = { ...prev.me!, handCards: newHand, handSize: newHand.length };

          if (newHand.length === 0) {
              gameToast.success("Bạn đã thắng!");
              setIsReady(false);
              return { ...prev, status: "WAITING", table: [], me: newMe, players: [newMe, prev.players[1]] };
          }

          return {
              ...prev,
              table: selectedIds,
              me: newMe,
              players: [newMe, prev.players[1]],
              currentTurn: 1
          };
        });
        setSelectedIds([]);
    };

    const handlePassTurn = () => {
      if (!isMyTurn()) return;
      if (room.table.length === 0) return gameToast.error("Bạn không thể bỏ lượt khi đang cầm cái");

      setRoom(prev => ({ ...prev, table: [], currentTurn: 1 }));
      gameToast.info("Bạn đã bỏ lượt");
    };

    // Bot Logic
    useEffect(() => {
      if (room.status === "PLAYING" && room.currentTurn === 1) {
        const timer = setTimeout(() => {
          const bot = room.players[1];
          const botHand = bot.handCards || [];
          const tableCards = room.table.map(cardIdToCard);

          const move = chooseMove(
            botHand,
            tableCards,
            BOT_DIFFICULTY_MAP[difficulty] || "EASY",
            [room.me?.handSize || 0]
        );

          if (move.length > 0) {
            const moveIds = move.map(c => c.id);
            setRoom(prev => {
              const newBotHand = prev.players[1].handCards!.filter(c => !moveIds.includes(c.id));
              const newBot = { ...prev.players[1], handCards: newBotHand, handSize: newBotHand.length };

              if (newBotHand.length === 0) {
                  gameToast.error("Bot đã thắng!");
                  return { ...prev, status: "WAITING", table: [], players: [prev.me!, newBot] };
              }

              return {
                  ...prev,
                  table: moveIds,
                  players: [prev.me!, newBot],
                  currentTurn: 0
              };
            });
            gameToast.info("Bot đã đánh bài");
          } else {
            // Bot passes
            setRoom(prev => ({ ...prev, table: [], currentTurn: 0 }));
            gameToast.info("Bot đã bỏ lượt");
          }
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [room.status, room.currentTurn, difficulty]);

    const renderWhenWaiting = () => {
      return (
        <Button
          onClick={handleReady}
          className={`px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm lg:px-6 lg:py-3 lg:text-base
          rounded-lg lg:rounded-xl
          text-white font-bold
          shadow-lg shadow-red-900/50
          hover:scale-110
          transition
          ${isReady ? `
            bg-gradient-to-r from-red-600 to-red-800
          hover:from-red-500 hover:to-red-700`: `
            bg-zinc-700
          text-white font-semibold
          shadow-md
          hover:bg-zinc-600
          `}
      `}>{isReady ? "CANCEL" : "READY"}</Button>
      );
    };

    const renderWhenPlaying = () => {
      return <>
        <div
            className="flex items-center justify-center shrink-0"
            style={{ width: timerSize, height: timerSize }}
        >
            {isMyTurn() && (<CountdownCircleTimer
                key={room.currentTurn}
                isPlaying
                duration={15}
                size={timerSize}
                strokeWidth={timerSize >= 120 ? 10 : timerSize >= 80 ? 7 : 5}
                colors={["#00C9A7", "#FFC75F", "#FF4B5C"]}
                colorsTime={[10, 5, 2]}
                trailColor="#1e293b"
                onComplete={() => {
                    handlePassTurn();
                    return { shouldRepeat: false };
                }}
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
      </>;
    };

    const renderCountDown = () => {
      return (<div className="flex flex-col gap-1 sm:gap-3 items-center">
        <CountdownCircleTimer
            isPlaying
            duration={3}
            size={timerSize}
            strokeWidth={timerSize >= 120 ? 10 : timerSize >= 80 ? 7 : 5}
            colors={["#00C9A7", "#FFC75F", "#FF4B5C"]}
            colorsTime={[3, 2, 1]}
            trailColor="#1e293b"
        >
            {({ remainingTime }) => (
                <div
                    style={{
                        fontSize: timerSize >= 120 ? "30px" : timerSize >= 80 ? "20px" : "14px",
                        fontWeight: 700,
                        color:
                            remainingTime <= 1
                                ? "#FF4B5C"
                                : remainingTime <= 2
                                    ? "#FFC75F"
                                    : "#00C9A7",
                    }}
                >
                    {remainingTime}
                </div>
            )}
        </CountdownCircleTimer>
        <h1 className="font-bold text-xs sm:text-base lg:text-lg text-yellow-500">Trò chơi sắp bắt đầu</h1>
      </div>);
    };

    return (
      <div
          className="w-full h-screen bg-cover bg-center relative overflow-hidden p-1"
          style={{ backgroundImage: "url(/bg-room.png)" }}
      >
        <div className="flex gap-2 sm:gap-3 lg:gap-5">
            <BackButton onClick={handleBackClick} />
            <div className="p-1.5 sm:px-2 lg:w-40 rounded-xl sm:rounded-2xl bg-amber-50/20 shadow-lg shadow-red-900/40">
                <div className="flex justify-between">
                    <h1 className="font-bold text-[10px] lg:text-lg">Bot Mode </h1>
                    <h1 className="font-bold text-[10px] lg:text-lg text-yellow-500">{room.roomId}</h1>
                </div>
                <div className="flex justify-between">
                    <h1 className="font-bold text-[10px] lg:text-lg">Đặt cược:</h1>
                    <h1 className="font-bold text-[10px] lg:text-lg text-yellow-500 flex items-center">{room.betToken} <TokenIcon className="w-4 sm:w-5 lg:w-6" /></h1>
                </div>
            </div>
        </div>

        {/* Render Bot */}
        <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2">
            {room.players[1] && <Player player={room.players[1]} />}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Table cards={room.table || []} />
            {room.status === 'READY' && renderCountDown()}
        </div>

        {/* Actions */}
        <div className="absolute bottom-2 sm:bottom-4 lg:bottom-6 w-full flex justify-center items-center gap-2 sm:gap-3 lg:gap-4 px-2">
            {room.status !== 'PLAYING' && renderWhenWaiting()}
            {room.status === 'PLAYING' && renderWhenPlaying()}
        </div>
      </div>
    );
}
