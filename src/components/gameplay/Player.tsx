import { TokenIcon } from "../../assets/icons/TokenIcon";
import type { PlayerType } from "../../type/player";
import { DURATION_TURN_TIME } from "../../type/socket-response";
import { CustomCountDownCircle } from "../CustomCountDownCircle";

// components/gameplay/Player.tsx
type Props = {
  player: PlayerType;
  isMyTurn: boolean;
};

export const Player = ({ player, isMyTurn }: Props) => {
  const avatarUrl = player.user && player.user.avatarUrl

  const renderImage = () => {
    return <img
      src={avatarUrl || 'logo.png'}
      className={`sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full border-3
        ${player.ready ? 'border-yellow-400' : 'border-gray-400'}`
      }
    />
  }
  return (
    <div className="flex flex-col items-center text-white">
      {isMyTurn ? <CustomCountDownCircle duration={DURATION_TURN_TIME} isPlayerCircle={true}>
        {renderImage()}
      </CustomCountDownCircle > : renderImage()}
      <p className="text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1">{player.user.name}</p>
      <span className="text-[9px] sm:text-xs flex justify-center items-center bg-amber-800/80 rounded-2xl px-2 font-bold">{player.user.tokenBalance}
        <TokenIcon className="w-5 drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]"/>
      </span>
      <span className="text-[9px] sm:text-xs opacity-80">{player.handSize} lá</span>
    </div>
  );
};
