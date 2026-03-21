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
    <div className="flex gap-4">
      <Button
        onClick={onAttackCard}
        className="
          px-6 py-3
          rounded-xl
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
          px-6 py-3
          rounded-xl
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
