import type { MatchParticipant } from "../../type/match-history";

interface MatchesTabProps {
  matches: MatchParticipant[];
  formatDate: (date: string) => string;
}

export const MatchesTab = ({ matches, formatDate }: MatchesTabProps) => (
  <div className="bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 h-full overflow-y-auto custom-scrollbar min-h-0">
    <table className="w-full text-sm text-left border-collapse">
      <thead className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <tr>
          <th className="p-3 text-zinc-300 font-semibold">Type</th>
          <th className="p-3 text-zinc-300 font-semibold">Rank</th>
          <th className="p-3 text-zinc-300 font-semibold">Change</th>
          <th className="p-3 text-zinc-300 font-semibold">Time</th>
        </tr>
      </thead>
      <tbody>
        {matches.length === 0 ? (
          <tr>
            <td colSpan={4} className="p-4 text-center text-zinc-500">
              No matches found
            </td>
          </tr>
        ) : (
          matches.map((m) => (
            <tr key={m.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20">
              <td className="p-3 text-zinc-300">{m.match.roomType}</td>
              <td className={`p-3 font-bold ${m.rank === 1 ? "text-red-500" : "text-zinc-400"}`}>
                #{m.rank}
              </td>
              <td
                className={`p-3 font-medium ${
                  m.tokenChange > 0 ? "text-green-500" : m.tokenChange < 0 ? "text-red-500" : "text-zinc-400"
                }`}
              >
                {m.tokenChange > 0 ? "+" : ""}
                {m.tokenChange}
              </td>
              <td className="p-3 text-zinc-500 text-xs">{formatDate(m.match.startTime)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
