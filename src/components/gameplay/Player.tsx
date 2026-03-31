import type { PlayerType } from "../../type/player";

// components/gameplay/Player.tsx
type Props = {
  player: PlayerType;
};

export const Player = ({ player }: Props) => {
  const avatarUrl = player.user&&player.user.avatarUrl
  return (
    <div className="flex flex-col items-center text-white">
      <img
        src={avatarUrl || 'logo.png'}
        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full border-2 border-yellow-400"
      />
      <p className="text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1">{player.user.name}</p>
      <span className="text-[9px] sm:text-xs opacity-80">{player.handSize} lá</span>
    </div>
  );
};
