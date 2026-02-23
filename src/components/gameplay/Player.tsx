import type { PlayerType } from "../../type/player";

// components/gameplay/Player.tsx
type Props = {
  player: PlayerType;
};

export const Player = ({ player }: Props) => {
  return (
    <div className="flex flex-col items-center text-white">
      <img
        src={player.avatar || "https://i.pravatar.cc/100"}
        className="w-14 h-14 rounded-full border-2 border-yellow-400"
      />
      <p className="text-sm mt-1">{player.name}</p>
      <span className="text-xs opacity-80">{player.cardsCount} lá</span>
    </div>
  );
};
