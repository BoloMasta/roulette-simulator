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
    zero?: StatItem;
  };
  parities: {
    even: StatItem;
    odd: StatItem;
    zero?: StatItem;
  };
  dozens: {
    first: StatItem;
    second: StatItem;
    third: StatItem;
    zero?: StatItem;
  };
  columns: {
    left: StatItem;
    center: StatItem;
    right: StatItem;
    zero?: StatItem;
  };
  ranges: {
    low: StatItem;
    high: StatItem;
    zero?: StatItem;
  };
  sixlines: {
    "1-2-3-4-5-6": StatItem;
    "4-5-6-7-8-9": StatItem;
    "7-8-9-10-11-12": StatItem;
    "10-11-12-13-14-15": StatItem;
    "13-14-15-16-17-18": StatItem;
    "16-17-18-19-20-21": StatItem;
    "19-20-21-22-23-24": StatItem;
    "22-23-24-25-26-27": StatItem;
    "25-26-27-28-29-30": StatItem;
    "28-29-30-31-32-33": StatItem;
    "31-32-33-34-35-36": StatItem;
    zero?: StatItem;
  };
  corners: {
    "1-2-4-5": StatItem;
    "2-3-5-6": StatItem;
    "4-5-7-8": StatItem;
    "5-6-8-9": StatItem;
    "7-8-10-11": StatItem;
    "8-9-11-12": StatItem;
    "10-11-13-14": StatItem;
    "11-12-14-15": StatItem;
    "13-14-16-17": StatItem;
    "14-15-17-18": StatItem;
    "16-17-19-20": StatItem;
    "17-18-20-21": StatItem;
    "19-20-22-23": StatItem;
    "20-21-23-24": StatItem;
    "22-23-25-26": StatItem;
    "23-24-26-27": StatItem;
    "25-26-28-29": StatItem;
    "26-27-29-30": StatItem;
    "28-29-31-32": StatItem;
    "29-30-32-33": StatItem;
    "31-32-34-35": StatItem;
    "32-33-35-36": StatItem;
    zero?: StatItem;
  };
  streets: {
    "1-2-3": StatItem;
    "4-5-6": StatItem;
    "7-8-9": StatItem;
    "10-11-12": StatItem;
    "13-14-15": StatItem;
    "16-17-18": StatItem;
    "19-20-21": StatItem;
    "22-23-24": StatItem;
    "25-26-27": StatItem;
    "28-29-30": StatItem;
    "31-32-33": StatItem;
    "34-35-36": StatItem;
    zero?: StatItem;
  };
  splits: {
    "1-2": StatItem;
    "2-3": StatItem;
    "4-5": StatItem;
    "5-6": StatItem;
    "7-8": StatItem;
    "8-9": StatItem;
    "10-11": StatItem;
    "11-12": StatItem;
    "13-14": StatItem;
    "14-15": StatItem;
    "16-17": StatItem;
    "17-18": StatItem;
    "19-20": StatItem;
    "20-21": StatItem;
    "22-23": StatItem;
    "23-24": StatItem;
    "25-26": StatItem;
    "26-27": StatItem;
    "28-29": StatItem;
    "29-30": StatItem;
    "31-32": StatItem;
    "32-33": StatItem;
    "34-35": StatItem;
    "35-36": StatItem;

    "1-4": StatItem;
    "2-5": StatItem;
    "3-6": StatItem;
    "4-7": StatItem;
    "5-8": StatItem;
    "6-9": StatItem;
    "7-10": StatItem;
    "8-11": StatItem;
    "9-12": StatItem;
    "10-13": StatItem;
    "11-14": StatItem;
    "12-15": StatItem;
    "13-16": StatItem;
    "14-17": StatItem;
    "15-18": StatItem;
    "16-19": StatItem;
    "17-20": StatItem;
    "18-21": StatItem;
    "19-22": StatItem;
    "20-23": StatItem;
    "21-24": StatItem;
    "22-25": StatItem;
    "23-26": StatItem;
    "24-27": StatItem;
    "25-28": StatItem;
    "26-29": StatItem;
    "27-30": StatItem;
    "28-31": StatItem;
    "29-32": StatItem;
    "30-33": StatItem;
    "31-34": StatItem;
    "32-35": StatItem;
    "33-36": StatItem;
    zero?: StatItem;
  };
  straights: {
    "0": StatItem;
    "1": StatItem;
    "2": StatItem;
    "3": StatItem;
    "4": StatItem;
    "5": StatItem;
    "6": StatItem;
    "7": StatItem;
    "8": StatItem;
    "9": StatItem;
    "10": StatItem;
    "11": StatItem;
    "12": StatItem;
    "13": StatItem;
    "14": StatItem;
    "15": StatItem;
    "16": StatItem;
    "17": StatItem;
    "18": StatItem;
    "19": StatItem;
    "20": StatItem;
    "21": StatItem;
    "22": StatItem;
    "23": StatItem;
    "24": StatItem;
    "25": StatItem;
    "26": StatItem;
    "27": StatItem;
    "28": StatItem;
    "29": StatItem;
    "30": StatItem;
    "31": StatItem;
    "32": StatItem;
    "33": StatItem;
    "34": StatItem;
    "35": StatItem;
    "36": StatItem;
  };
}
