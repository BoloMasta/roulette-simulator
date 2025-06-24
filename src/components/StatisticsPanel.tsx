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

const StatItemDisplay: React.FC<{
  label: string;
  item: StatItem;
  threshold: number;
}> = ({ label, item, threshold }) => (
  <div className="flex flex-col items-center mb-1.5 p-2">
    <div className="text-sm font-medium mb-1 text-blue-800">{label}</div>
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

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div className={`bg-gray-50 p-4 rounded-lg border border-gray-100 ${className}`}>
    <h3 className="font-semibold text-gray-700 mb-3 text-center">{title}</h3>
    <div className="flex justify-around">{children}</div>
  </div>
);

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats, thresholds }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Statistics</h2>

      {/* Pierwszy rząd - 3 sekcje obok siebie */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Section title="Colors" className="h-full">
          <StatItemDisplay label="Red" item={stats.colors.red} threshold={thresholds.color} />
          <StatItemDisplay label="Black" item={stats.colors.black} threshold={thresholds.color} />
        </Section>

        <Section title="Parity" className="h-full">
          <StatItemDisplay label="Even" item={stats.parities.even} threshold={thresholds.parity} />
          <StatItemDisplay label="Odd" item={stats.parities.odd} threshold={thresholds.parity} />
        </Section>

        <Section title="Ranges" className="h-full">
          <StatItemDisplay
            label="Low (1-18)"
            item={stats.ranges.low}
            threshold={thresholds.range}
          />
          <StatItemDisplay
            label="High (19-36)"
            item={stats.ranges.high}
            threshold={thresholds.range}
          />
        </Section>
      </div>

      {/* Drugi rząd - 2 sekcje obok siebie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Dozens">
          <StatItemDisplay label="1-12" item={stats.dozens.first} threshold={thresholds.dozen} />
          <StatItemDisplay label="13-24" item={stats.dozens.second} threshold={thresholds.dozen} />
          <StatItemDisplay label="25-36" item={stats.dozens.third} threshold={thresholds.dozen} />
        </Section>

        <Section title="Columns">
          <StatItemDisplay label="Left" item={stats.columns.left} threshold={thresholds.column} />
          <StatItemDisplay
            label="Center"
            item={stats.columns.center}
            threshold={thresholds.column}
          />
          <StatItemDisplay label="Right" item={stats.columns.right} threshold={thresholds.column} />
        </Section>
      </div>
    </div>
  );
};

export default StatisticsPanel;
