// src/components/StatisticsPanel.tsx
import React from "react";
import type { RouletteStats, StatItem } from "../lib/types";

interface StatisticsPanelProps {
  stats: RouletteStats;
  thresholds: {
    color: number;
    parity: number;
    dozen: number;
    column: number;
    range: number;
  };
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats, thresholds }) => {
  const renderStatItem = (
    label: string,
    item: StatItem,
    textColor: string = "text-gray-800",
    threshold: number
  ) => (
    <div className={`flex flex-col items-center mb-1.5 p-2 ${textColor}`} key={label}>
      <div className="text-sm font-medium mb-1">{label}</div>
      <div className="text-center">
        <div
          className={`text-xs ${
            item.streak >= threshold ? "text-green-600 font-bold" : "text-gray-500"
          }`}
        >
          Streak: <span className="font-semibold">{item.streak}</span>
        </div>
        <div className="text-xs text-gray-500">
          Count: <span className="font-semibold">{item.count}</span>
        </div>
        <div className="text-xs text-gray-500">
          Max: <span className="font-semibold">{item.maxStreak}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Statistics</h2>

      <div className="space-y-4">
        {/* Colors Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-3 text-center">Colors</h3>
          <div className="flex justify-around">
            {renderStatItem("Red", stats.colors.red, "text-blue-800", thresholds.color)}
            {renderStatItem("Black", stats.colors.black, "text-blue-800", thresholds.color)}
          </div>
        </div>

        {/* Parity Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-3 text-center">Parity</h3>
          <div className="flex justify-around">
            {renderStatItem("Even", stats.parities.even, "text-blue-800", thresholds.parity)}
            {renderStatItem("Odd", stats.parities.odd, "text-blue-800", thresholds.parity)}
          </div>
        </div>

        {/* Dozens Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-3 text-center">Dozens</h3>
          <div className="flex justify-around">
            {renderStatItem("1-12", stats.dozens.first, "text-blue-800", thresholds.dozen)}
            {renderStatItem("13-24", stats.dozens.second, "text-blue-800", thresholds.dozen)}
            {renderStatItem("25-36", stats.dozens.third, "text-blue-800", thresholds.dozen)}
          </div>
        </div>

        {/* Ranges Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-3 text-center">Ranges</h3>
          <div className="flex justify-around">
            {renderStatItem("Low (1-18)", stats.ranges.low, "text-blue-800", thresholds.range)}
            {renderStatItem("High (19-36)", stats.ranges.high, "text-blue-800", thresholds.range)}
          </div>
        </div>

        {/* Columns Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-3 text-center">Columns</h3>
          <div className="flex justify-around">
            {renderStatItem("Left", stats.columns.left, "text-blue-800", thresholds.column)}
            {renderStatItem("Center", stats.columns.center, "text-blue-800", thresholds.column)}
            {renderStatItem("Right", stats.columns.right, "text-blue-800", thresholds.column)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
