import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { gameApi, type AttackBotGameResponse, type BotLevel } from "../api/game.api";
import { CustomCountDownCircle } from "../components/CustomCountDownCircle";
import { ActionBar } from "../components/gameplay/ActionBar";
import GameLayout, { MyData, RoomInfo } from "../components/gameplay/GameLayout";
import { Hand } from "../components/gameplay/Hand";
import { Player } from "../components/gameplay/Player";
import { Table } from "../components/gameplay/Table";
import { Button } from "../components/ui/Button";
import { gameToast } from "../components/ui/toast";
import { ROUTES } from "../routes/routes";
import { useAuthStore } from "../stores/auth.store";
import { useSoundStore } from "../stores/sound.store";
import type { CardType } from "../type/card";
import type { PlayerType } from "../type/player";
import type { RoomType } from "../type/room";
import { DURATION_READY_TIME, DURATION_TURN_TIME } from "../type/socket-response";
import { cardIdToCard } from "../utils/cardIdToCard";

type BotGameLocationState = {
  betToken: number;
  botLevel: BotLevel;
};

const BOT_LEVEL_LABEL: Record<BotLevel, string> = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
};

const BOT_LEVEL_NAME: Record<BotLevel, string> = {
  easy: "EASY",
  medium: "MEDIUM",
  hard: "HARD",
};

const mapTurn = (turn: "USER" | "BOT") => (turn === "USER" ? 0 : 1);

const mapCards = (cards: number[]) => cards.map((card) => String(card));
const BOT_THINKING_DELAY_MIN = 1000;
const BOT_THINKING_DELAY_MAX = 5000;

export default function GamePlayBot() {
  const location = useLocation();
  const navigate = useNavigate();
  const soundStore = useSoundStore();
  const user = useAuthStore((s) => s.user);
  const setBalanceToken = useAuthStore((s) => s.setBalanceToken);

  const gameOptions = location.state as BotGameLocationState | null;
  const betToken = gameOptions?.betToken;
  const botLevel = gameOptions?.botLevel;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);

  const [room, setRoom] = useState<RoomType>({
    table: [],
    players: [],
    status: "WAITING",
    currentTurn: 0,
    betToken,
  });

  const players = useMemo(() => {
    if (!botLevel) return [];

    const me: PlayerType = {
      user: {
        id: user?.id || 0,
        name: user?.name || "Player",
        avatarUrl: user?.avatarUrl,
        tokenBalance: user?.tokenBalance || 0,
      },
      ready: false,
      handSize: 0,
      handCards: [],
      playerIndex: 0,
    };

    const bot: PlayerType = {
      user: {
        id: -1,
        name: `🤖 Bot ${BOT_LEVEL_NAME[botLevel]}`,
        tokenBalance: 99999,
      },
      ready: true,
      handSize: 0,
      handCards: [],
      playerIndex: 1,
    };

    return [me, bot];
  }, [botLevel, user?.avatarUrl, user?.id, user?.name, user?.tokenBalance]);

  useEffect(() => {
    if (!betToken || !botLevel) {
      gameToast.error("Thiếu thông tin phòng bot. Vui lòng tạo lại.");
      navigate(ROUTES.HOME, { replace: true });
      return;
    }

    setRoom((prev) => {
      // CRITICAL FIX: Prevent overwriting players if game is already playing
      if (prev.status !== "WAITING") return prev;

      return {
        ...prev,
        betToken,
        players,
        me: players[0],
      };
    });
  }, [betToken, botLevel, navigate, players]);

  const handleBackClick = () => {
    navigate(ROUTES.HOME);
  };

  const isMyTurn = () => room.status === "PLAYING" && room.currentTurn === 0;

  const handleSelectedCard = (card: CardType) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(card.id);
      if (exists) return prev.filter((current) => current !== card.id);
      return [...prev, card.id];
    });
  };

  const applyAttackState = (response: AttackBotGameResponse, userPlayedCards: string[]) => {
    setRoom((prev) => {
      const currentMe = prev.players[0] || prev.me;
      const currentBot = prev.players[1];

      if (!currentMe || !currentBot) return prev;

      const nextHandCards = (currentMe.handCards || []).filter(
        (card) => !userPlayedCards.includes(card.id)
      );

      const nextMe: PlayerType = {
        ...currentMe,
        handCards: nextHandCards,
        handSize: response.userRemainingCards,
      };

      const nextBot: PlayerType = {
        ...currentBot,
        handSize: response.botRemainingCards,
      };

      return {
        ...prev,
        table: mapCards(response.table),
        currentTurn: mapTurn(response.currentTurn),
        status: response.finished ? "WAITING" : "PLAYING",
        me: nextMe,
        players: [nextMe, nextBot],
      };
    });

    if (response.botPlayedCards.length > 0) {
      soundStore.playCard();
      gameToast.info("Bot đã đánh bài");
    }

    if (response.finished) {
      setIsReady(false);
      const topWinner = response.winners[0];
      if (topWinner === "USER") {
        gameToast.success("Bạn đã thắng!");
      } else if (topWinner === "BOT") {
        gameToast.error("Bot đã thắng!");
      } else {
        gameToast.info("Ván đấu đã kết thúc");
      }
      return;
    }

    if (response.currentTurn === "USER") {
      gameToast.info("Đến lượt bạn");
    }
  };

  const normalizeError = (error: unknown, fallbackMessage: string) => {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.messages ||
        fallbackMessage;
      gameToast.error(message);
      return;
    }

    gameToast.error(fallbackMessage);
    console.error(error);
  };

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });

  const getRandomThinkingDelay = () =>
    Math.floor(Math.random() * (BOT_THINKING_DELAY_MAX - BOT_THINKING_DELAY_MIN + 1)) +
    BOT_THINKING_DELAY_MIN;

  const applyUserMovePreview = (userPlayedCards: string[]) => {
    setRoom((prev) => {
      const currentMe = prev.players[0] || prev.me;
      const currentBot = prev.players[1];

      if (!currentMe || !currentBot) return prev;

      const nextHandCards = (currentMe.handCards || []).filter(
        (card) => !userPlayedCards.includes(card.id)
      );

      const nextMe: PlayerType = {
        ...currentMe,
        handCards: nextHandCards,
        handSize: nextHandCards.length,
      };

      return {
        ...prev,
        me: nextMe,
        players: [nextMe, currentBot],
        currentTurn: 1,
        table: userPlayedCards.length > 0 ? userPlayedCards : prev.table,
      };
    });

    if (userPlayedCards.length > 0) {
      soundStore.playCard();
    }
  };

  const handleReady = () => {
    setSelectedIds([]);
    setRoom(prev => ({ ...prev, table: [] }));

    setIsReady(prev => {
      const next = !prev;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (next) {
        setRoom(prev => ({ ...prev, status: "READY" }));

        timeoutRef.current = setTimeout(() => {
          void startGame();
          timeoutRef.current = null;
        }, 5000);

      } else {
        setRoom(prev => ({ ...prev, status: "WAITING" }));
      }

      return next;
    });
  };

  const startGame = async () => {
    if (isStarting) return;

    try {
      setIsStarting(true);
      setSelectedIds([]);

      const response = await gameApi.startBotGame();
      const userCards = response.userCards.map((card) => cardIdToCard(String(card)));

      setBalanceToken(response.userTokenBalance);
      setRoom((prev) => {
        const currentMe = prev.players[0] || prev.me;
        const currentBot = prev.players[1];

        if (!currentMe || !currentBot) return prev;

        const nextMe: PlayerType = {
          ...currentMe,
          handCards: userCards,
          handSize: userCards.length,
          ready: true,
          user: {
            ...currentMe.user,
            tokenBalance: response.userTokenBalance,
          },
        };

        const nextBot: PlayerType = {
          ...currentBot,
          handSize: response.botRemainingCards,
          ready: true,
        };

        return {
          ...prev,
          table: mapCards(response.table),
          currentTurn: mapTurn(response.currentTurn),
          status: "PLAYING",
          me: nextMe,
          players: [nextMe, nextBot],
        };
      });

      gameToast.success("Trò chơi bắt đầu!");
    } catch (error) {
      setIsReady(false);
      setRoom((prev) => ({ ...prev, status: "WAITING" }));
      normalizeError(error, "Không thể bắt đầu ván bot");
    } finally {
      setIsStarting(false);
    }
  };

  const submitAttack = async (cards: string[]) => {
    if (!isMyTurn()) {
      gameToast.error("Chưa tới lượt");
      return;
    }

    if (isAttacking) return;

    if (cards.length === 0 && room.table.length === 0) {
      gameToast.error("Bạn không thể bỏ lượt khi đang cầm cái");
      return;
    }

    try {
      setIsAttacking(true);
      const payload = cards.map((card) => Number(card));
      const response = await gameApi.attackBotGame(payload);
      applyUserMovePreview(cards);
      setSelectedIds([]);

      if (!response.finished) {
        await wait(getRandomThinkingDelay());
      }

      applyAttackState(response, cards);
    } catch (error) {
      normalizeError(error, "Nước đi không hợp lệ");
    } finally {
      setIsAttacking(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAttack = () => {
    if (selectedIds.length === 0) {
      gameToast.error("Hãy chọn lá bài");
      return;
    }

    void submitAttack(selectedIds);
  };

  const handlePassTurn = () => {
    void submitAttack([]);
  };

  const renderWhenWaiting = () => {
    const handleReadyButton = (
      <Button
        onClick={handleReady}
        className={`px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm lg:px-6 lg:py-3 lg:text-base
          rounded-lg lg:rounded-xl
          text-white font-bold
          shadow-lg shadow-red-900/50
          hover:scale-110
          transition
          ${isReady ? `
            bg-linear-to-r from-red-600 to-red-800
          hover:from-red-500 hover:to-red-700`: `
            bg-zinc-700
          text-white font-semibold
          shadow-md
          hover:bg-zinc-600
          `}
      `}>{isReady ? "CANCEL" : "READY"}</Button>
    );

    return (
      <div className="flex flex-col gap-3">
        {handleReadyButton}
        <MyData user={user} tokenBalance={user?.tokenBalance || 0} />
      </div>
    );
  };

  const renderWhenPlaying = () => (
    <div className="w-full flex items-center justify-between shrink-0">
      <div className="flex items-center justify-center shrink-0">
        {isMyTurn() && <CustomCountDownCircle duration={DURATION_TURN_TIME} />}
        {!isMyTurn() && <MyData user={user} tokenBalance={user?.tokenBalance || 0} />}
      </div>
      <Hand
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        hands={room.me?.handCards || []}
        selectedIds={selectedIds}
        onSelected={handleSelectedCard}
      />
      <ActionBar onAttackCard={handleAttack} onPassTurn={handlePassTurn} />
    </div>
  );

  const renderCountDown = () => {
    return (<div className="flex flex-col gap-1 sm:gap-3 items-center">
      <CustomCountDownCircle duration={DURATION_READY_TIME} />
      <h1 className="font-bold text-xs sm:text-base lg:text-lg text-yellow-500">Trò chơi sắp bắt đầu</h1>
    </div>);
  };

  return (
    <GameLayout
      onBackClick={handleBackClick}
      roomInfo={
        <RoomInfo
          label="Bot Mode"
          value={botLevel ? BOT_LEVEL_LABEL[botLevel] : "-"}
          bet={room.betToken || 0}
        />
      }
      players={
        <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2">
          {room.players[1] && <Player player={room.players[1]} isMyTurn={room.currentTurn === 1} />}
        </div>
      }
      table={<Table cards={room.table || []} />}
      countdown={room.status === "READY" && renderCountDown()}
      bottom={room.status !== "PLAYING" ? renderWhenWaiting() : renderWhenPlaying()}
    />
  );
}
