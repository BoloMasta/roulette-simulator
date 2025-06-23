// src/components/BettingHistory.tsx
import React from "react";

interface BettingHistoryProps {
  history: number[];
}

const getColorClass = (number: number): string => {
  if (number === 0) return "text-green-600 font-bold";
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  return redNumbers.includes(number) ? "text-red-600" : "text-gray-800";
};

const BettingHistory: React.FC<BettingHistoryProps> = ({ history }) => {
  // Odwracamy historię, aby najnowsze były na początku
  const reversedHistory = [...history].reverse();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h2 className="text-xl font-bold mb-3 text-gray-800">Last Spins</h2>
      <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto p-1 bg-gray-50 rounded-lg">
        {reversedHistory.map((number, index) => (
          <div
            key={index}
            className={`${getColorClass(number)} px-2 py-1 rounded-md bg-white border shadow-sm`}
            title={`Spin: ${number}`}
          >
            {number}
            {index < reversedHistory.length - 1 && ","}
          </div>
        ))}
        {history.length === 0 && <div className="text-gray-500 italic text-sm">No spins yet</div>}
      </div>
    </div>
  );
};

export default BettingHistory;
