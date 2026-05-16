import type { Transaction } from "../../type/transaction";

interface TransactionsTabProps {
  transactions: Transaction[];
  formatDate: (date: string) => string;
}

export const TransactionsTab = ({ transactions, formatDate }: TransactionsTabProps) => (
  <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar h-full pr-2 min-h-0">
    {transactions.length === 0 ? (
      <div className="text-center text-zinc-500 py-4">No transactions found</div>
    ) : (
      transactions.map((tx) => (
        <div
          key={tx.id}
          className={`bg-zinc-950 p-3 rounded-lg border-l-4 ${
            tx.amount > 0 ? "border-green-500" : tx.amount < 0 ? "border-red-500" : "border-zinc-500"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-sm text-zinc-200">{tx.type}</span>
            <span
              className={`font-bold ${
                tx.amount > 0 ? "text-green-500" : tx.amount < 0 ? "text-red-500" : "text-zinc-400"
              }`}
            >
              {tx.amount > 0 ? "+" : ""}
              {tx.amount}
            </span>
          </div>
          <div className="text-xs text-zinc-400 mb-1">{tx.description}</div>
          <div className="text-[10px] text-zinc-500">{formatDate(tx.createdAt)}</div>
        </div>
      ))
    )}
  </div>
);
