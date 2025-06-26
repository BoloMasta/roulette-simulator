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
    street: number;
    sixline: number;
    corner: number;
    split: number;
    straight: number;
  };
}

const StatItemDisplay: React.FC<{
  label: string;
  item: StatItem;
  threshold: number;
  showStreak?: boolean;
  showMaxStreak?: boolean;
}> = ({ label, item, threshold, showStreak = true, showMaxStreak = true }) => (
  <div className="flex flex-col items-center mb-1 p-1">
    <div className="text-xs font-medium mb-0.5 text-blue-800 truncate max-w-[80px]" title={label}>
      {label.length > 8 ? `${label.substring(0, 8)}...` : label}
    </div>
    <div className="text-center">
      <div
        className={`text-xs ${
          item.absenceStreak >= threshold ? "text-red-600 font-bold" : "text-gray-500"
        }`}
      >
        Abs: <span className="font-semibold">{item.absenceStreak}</span>
      </div>
      {showStreak && (
        <div className="text-xs text-gray-500">
          Str: <span className="font-semibold">{item.streak}</span>
        </div>
      )}
      {showMaxStreak && (
        <div className="text-xs text-gray-500">
          Max: <span className="font-semibold">{item.maxStreak}</span>
        </div>
      )}
      <div className="text-xs text-gray-500">
        Cnt: <span className="font-semibold">{item.count}</span>
      </div>
    </div>
  </div>
);

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  gridClass?: string;
}> = ({ title, children, className = "", gridClass = "grid-cols-2" }) => (
  <div className={`bg-gray-50 p-3 rounded-lg border border-gray-100 ${className}`}>
    <h3 className="font-semibold text-gray-700 mb-2 text-center text-sm">{title}</h3>
    <div className={`grid ${gridClass} gap-1`}>{children}</div>
  </div>
);

// Funkcja pomocnicza do pobierania top 3 elementów z największym absenceStreak
const getTopItemsByAbsence = (items: Record<string, StatItem>, count: number = 3) => {
  return Object.entries(items)
    .map(([key, item]) => ({ key, item }))
    .sort((a, b) => b.item.absenceStreak - a.item.absenceStreak)
    .slice(0, count);
};

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats, thresholds }) => {
  // Pobierz top 3 elementy dla każdej kategorii
  const topSplits = getTopItemsByAbsence(stats.splits);
  const topCorners = getTopItemsByAbsence(stats.corners);
  const topSixlines = getTopItemsByAbsence(stats.sixlines);
  const topStreets = getTopItemsByAbsence(stats.streets);
  const topStraights = getTopItemsByAbsence(stats.straights);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Statistics</h2>

      {/* Pierwszy rząd - 3 sekcje obok siebie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
        <Section title="Colors" gridClass="grid-cols-2">
          <StatItemDisplay label="Red" item={stats.colors.red} threshold={thresholds.color} />
          <StatItemDisplay label="Black" item={stats.colors.black} threshold={thresholds.color} />
        </Section>

        <Section title="Parity" gridClass="grid-cols-2">
          <StatItemDisplay label="Even" item={stats.parities.even} threshold={thresholds.parity} />
          <StatItemDisplay label="Odd" item={stats.parities.odd} threshold={thresholds.parity} />
        </Section>

        <Section title="Ranges" gridClass="grid-cols-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <Section title="Dozens" gridClass="grid-cols-3">
          <StatItemDisplay label="1-12" item={stats.dozens.first} threshold={thresholds.dozen} />
          <StatItemDisplay label="13-24" item={stats.dozens.second} threshold={thresholds.dozen} />
          <StatItemDisplay label="25-36" item={stats.dozens.third} threshold={thresholds.dozen} />
        </Section>

        <Section title="Columns" gridClass="grid-cols-3">
          <StatItemDisplay label="Left" item={stats.columns.left} threshold={thresholds.column} />
          <StatItemDisplay
            label="Center"
            item={stats.columns.center}
            threshold={thresholds.column}
          />
          <StatItemDisplay label="Right" item={stats.columns.right} threshold={thresholds.column} />
        </Section>
      </div>

      {/* Trzeci rząd - sekcje z kombinacjami */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Sixlines */}
        {topSixlines.length > 0 && (
          <Section title="Sixlines" gridClass="grid-cols-2 sm:grid-cols-3">
            {topSixlines.map(({ key, item }) => (
              <StatItemDisplay
                key={key}
                label={key}
                item={item}
                threshold={thresholds.sixline}
                showStreak={false}
              />
            ))}
          </Section>
        )}

        {/* Cornery */}
        {topCorners.length > 0 && (
          <Section title="Corners" gridClass="grid-cols-2 sm:grid-cols-3">
            {topCorners.map(({ key, item }) => (
              <StatItemDisplay
                key={key}
                label={key}
                item={item}
                threshold={thresholds.corner}
                showStreak={false}
              />
            ))}
          </Section>
        )}

        {/* Streets */}
        {topStreets.length > 0 && (
          <Section title="Streets" gridClass="grid-cols-2 sm:grid-cols-3">
            {topStreets.map(({ key, item }) => (
              <StatItemDisplay
                key={key}
                label={key}
                item={item}
                threshold={thresholds.street}
                showStreak={false}
              />
            ))}
          </Section>
        )}

        {/* Splity */}
        {topSplits.length > 0 && (
          <Section title="Splits" gridClass="grid-cols-2 sm:grid-cols-3">
            {topSplits.map(({ key, item }) => (
              <StatItemDisplay
                key={key}
                label={key}
                item={item}
                threshold={thresholds.split}
                showStreak={false}
              />
            ))}
          </Section>
        )}

        {/* Straights */}
        {topStraights.length > 0 && (
          <Section title="Straights" gridClass="grid-cols-2 sm:grid-cols-3">
            {topStraights.map(({ key, item }) => (
              <StatItemDisplay
                key={key}
                label={`${key}`}
                item={item}
                threshold={thresholds.straight}
                showStreak={false}
              />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
};

export default StatisticsPanel;
