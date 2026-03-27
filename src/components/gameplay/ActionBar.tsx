import { Button } from "../ui/Button";

type ActionBarProps = {
  onAttackCard: () => void,
  onPassTurn: () => void,
}

export const ActionBar = ({
  onAttackCard,
  onPassTurn
}: ActionBarProps) => {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 items-center">
      <Button
        onClick={onAttackCard}
        className="
          px-5 py-1.5 text-xs
          sm:px-6 sm:py-2 sm:text-sm
          lg:px-8 lg:py-3 lg:text-base
          rounded-lg lg:rounded-xl
          bg-gradient-to-r from-red-600 to-red-800
          text-white font-bold
          shadow-lg shadow-red-900/50
          hover:scale-110
          hover:from-red-500 hover:to-red-700
          transition
        "
      >
        Đánh
      </Button>

      <Button
        onClick={onPassTurn}
        className="
          px-3 py-1.5 text-xs
          sm:px-4 sm:py-2 sm:text-sm
          lg:px-6 lg:py-3 lg:text-base
          rounded-lg lg:rounded-xl
          bg-zinc-700
          text-white font-semibold
          shadow-md
          hover:bg-zinc-600
          hover:scale-105
          transition
        "
      >
        Bỏ lượt
      </Button>
    </div>
  );
};
