// src/lib/types.ts
export interface StatItem {
  count: number;
  streak: number;
  maxStreak: number;
  absenceStreak: number;
}

export interface Bet {
  type: string;
  value: string;
  absenceStreak: number;
}

export interface RouletteStats {
  colors: {
    red: StatItem;
    black: StatItem;
  };
  parities: {
    even: StatItem;
    odd: StatItem;
  };
  dozens: {
    first: StatItem;
    second: StatItem;
    third: StatItem;
  };
  columns: {
    left: StatItem;
    center: StatItem;
    right: StatItem;
  };
  ranges: {
    low: StatItem;
    high: StatItem;
  };
}
