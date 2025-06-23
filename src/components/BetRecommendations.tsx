// src/components/BetRecommendations.tsx

import type { Bet } from "../lib/types";

interface BetRecommendationsProps {
  bets: Bet[];
  stake: number;
}

const BetRecommendations: React.FC<BetRecommendationsProps> = ({ bets, stake }) => {
  const getColorClass = (type: string) => {
    switch (type) {
      case "color":
        return "bg-red-100 border-red-300 text-red-800";
      case "parity":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "dozen":
        return "bg-green-100 border-green-300 text-green-800";
      case "range":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "column":
        return "bg-purple-100 border-purple-300 text-purple-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="text-xl font-bold mb-3 text-gray-800">Recommended Bets</h2>

      {bets.length === 0 ? (
        <div className="text-center py-4 text-gray-500 italic">
          No recommended bets at this time
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bets.map((bet, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getColorClass(bet.type)}`}>
              <div className="font-medium capitalize">{bet.value}</div>
              <div className="text-xs opacity-80">{bet.type}</div>
              <div className="text-sm mt-1">
                Stake: <span className="font-bold">${stake}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BetRecommendations;
