// src/components/BetRecommendations.tsx
import type { Bet } from "../lib/types";

interface BetRecommendationsProps {
  bets: Bet[];
  baseStake: number;
  bankroll: number; // Optional bankroll prop for future use
}

const BetRecommendations: React.FC<BetRecommendationsProps> = ({ bets, baseStake, bankroll }) => {
  const getColorClass = (absenceStreak: number) => {
    return absenceStreak >= 5
      ? "bg-green-100 border-green-300 text-green-800"
      : "bg-yellow-100 border-yellow-300 text-yellow-800";
  };

  const calculateStake = (type: string, absenceStreak: number) => {
    let stake = baseStake;

    if (absenceStreak >= 5) {
      stake *= 1 + (absenceStreak - 4) * 0.25;
    }

    if (["color", "parity", "range"].includes(type)) {
      stake *= 1.2;
    }

    return Math.round(stake * 100) / 100;
  };

  const getReason = (absenceStreak: number, type: string) => {
    const reasons = [];

    if (absenceStreak >= 5) {
      reasons.push(`long absence streak (${absenceStreak})`);
    }

    if (["color", "parity", "range"].includes(type)) {
      reasons.push("better odds");
    }

    return reasons.length > 0
      ? `Recommended because of ${reasons.join(" and ")}`
      : "Standard recommendation";
  };

  const sortedBets = [...bets].sort((a, b) => {
    if (a.absenceStreak >= 5 && b.absenceStreak < 5) return -1;
    if (b.absenceStreak >= 5 && a.absenceStreak < 5) return 1;

    const simpleTypes = ["color", "parity", "range"];
    if (simpleTypes.includes(a.type) && !simpleTypes.includes(b.type)) return -1;
    if (simpleTypes.includes(b.type) && !simpleTypes.includes(a.type)) return 1;

    return b.absenceStreak - a.absenceStreak;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="text-xl font-bold mb-3 text-gray-800">Recommended Bets</h2>

      {sortedBets.length === 0 ? (
        <div className="text-center py-4 text-gray-500 italic">
          No recommended bets at this time
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sortedBets.map((bet) => {
            const absenceStreak = bet.absenceStreak || 0;
            const stake = calculateStake(bet.type, absenceStreak);
            const colorClass = getColorClass(absenceStreak);
            const reason = getReason(absenceStreak, bet.type);
            const key = `${bet.type}-${bet.value}-${absenceStreak}`;

            return (
              <div key={key} className={`p-3 rounded-lg border ${colorClass} flex flex-col`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium capitalize">{bet.value}</div>
                    <div className="text-xs opacity-80 capitalize">{bet.type}</div>
                  </div>
                  <div className="text-xs bg-white px-2 py-1 rounded-full font-bold">
                    Absence: -{absenceStreak}
                  </div>
                </div>

                <div className="text-sm mt-2">
                  Stake: <span className="font-bold">${stake.toFixed(2)}</span>
                </div>

                <div className="mt-1 text-xs text-gray-600 italic">{reason}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BetRecommendations;
