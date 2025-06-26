// src/lib/rouletteAnalyzer.ts
import type { RouletteStats, StatItem, Bet } from "./types";

type ColorKey = keyof RouletteStats["colors"];
type ParityKey = keyof RouletteStats["parities"];
type DozenKey = keyof RouletteStats["dozens"];
type ColumnKey = keyof RouletteStats["columns"];
type RangeKey = keyof RouletteStats["ranges"];
type StraightKey = keyof RouletteStats["straights"];
type SplitKey = keyof RouletteStats["splits"];
type StreetKey = keyof RouletteStats["streets"];
type CornerKey = keyof RouletteStats["corners"];
type SixlineKey = keyof RouletteStats["sixlines"];

const createStatItem = (): StatItem => ({
  count: 0,
  streak: 0,
  maxStreak: 0,
  absenceStreak: 0,
});

export class RouletteAnalyzer {
  private stats: RouletteStats;
  private thresholds: {
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

  constructor(
    thresholds = {
      color: 8, // Prawdopodobieństwo: 18/37 ≈ 48.6%
      parity: 8, // Prawdopodobieństwo: 18/37 ≈ 48.6%
      range: 8, // Prawdopodobieństwo: 18/37 ≈ 48.6%
      dozen: 5, // Prawdopodobieństwo: 12/37 ≈ 32.4%
      column: 5, // Prawdopodobieństwo: 12/37 ≈ 32.4%
      sixline: 10, // Prawdopodobieństwo: 6/37 ≈ 16.2%
      corner: 12, // Prawdopodobieństwo: 4/37 ≈ 10.8%
      street: 14, // Prawdopodobieństwo: 3/37 ≈ 8.1%
      split: 18, // Prawdopodobieństwo: 2/37 ≈ 5.4%
      straight: 25, // Prawdopodobieństwo: 1/37 ≈ 2.7%
    }
  ) {
    this.thresholds = thresholds;
    this.stats = this.createInitialStats();
  }

  private createInitialStats(): RouletteStats {
    return {
      colors: {
        red: createStatItem(),
        black: createStatItem(),
      },
      parities: {
        even: createStatItem(),
        odd: createStatItem(),
      },
      dozens: {
        first: createStatItem(),
        second: createStatItem(),
        third: createStatItem(),
      },
      columns: {
        left: createStatItem(),
        center: createStatItem(),
        right: createStatItem(),
      },
      ranges: {
        low: createStatItem(),
        high: createStatItem(),
      },
      sixlines: {
        "1-2-3-4-5-6": createStatItem(),
        "4-5-6-7-8-9": createStatItem(),
        "7-8-9-10-11-12": createStatItem(),
        "10-11-12-13-14-15": createStatItem(),
        "13-14-15-16-17-18": createStatItem(),
        "16-17-18-19-20-21": createStatItem(),
        "19-20-21-22-23-24": createStatItem(),
        "22-23-24-25-26-27": createStatItem(),
        "25-26-27-28-29-30": createStatItem(),
        "28-29-30-31-32-33": createStatItem(),
        "31-32-33-34-35-36": createStatItem(),
      },
      corners: {
        "1-2-4-5": createStatItem(),
        "2-3-5-6": createStatItem(),
        "4-5-7-8": createStatItem(),
        "5-6-8-9": createStatItem(),
        "7-8-10-11": createStatItem(),
        "8-9-11-12": createStatItem(),
        "10-11-13-14": createStatItem(),
        "11-12-14-15": createStatItem(),
        "13-14-16-17": createStatItem(),
        "14-15-17-18": createStatItem(),
        "16-17-19-20": createStatItem(),
        "17-18-20-21": createStatItem(),
        "19-20-22-23": createStatItem(),
        "20-21-23-24": createStatItem(),
        "22-23-25-26": createStatItem(),
        "23-24-26-27": createStatItem(),
        "25-26-28-29": createStatItem(),
        "26-27-29-30": createStatItem(),
        "28-29-31-32": createStatItem(),
        "29-30-32-33": createStatItem(),
        "31-32-34-35": createStatItem(),
        "32-33-35-36": createStatItem(),
      },
      streets: {
        "1-2-3": createStatItem(),
        "4-5-6": createStatItem(),
        "7-8-9": createStatItem(),
        "10-11-12": createStatItem(),
        "13-14-15": createStatItem(),
        "16-17-18": createStatItem(),
        "19-20-21": createStatItem(),
        "22-23-24": createStatItem(),
        "25-26-27": createStatItem(),
        "28-29-30": createStatItem(),
        "31-32-33": createStatItem(),
        "34-35-36": createStatItem(),
      },
      splits: {
        // splity poziome
        "1-2": createStatItem(),
        "2-3": createStatItem(),
        "4-5": createStatItem(),
        "5-6": createStatItem(),
        "7-8": createStatItem(),
        "8-9": createStatItem(),
        "10-11": createStatItem(),
        "11-12": createStatItem(),
        "13-14": createStatItem(),
        "14-15": createStatItem(),
        "16-17": createStatItem(),
        "17-18": createStatItem(),
        "19-20": createStatItem(),
        "20-21": createStatItem(),
        "22-23": createStatItem(),
        "23-24": createStatItem(),
        "25-26": createStatItem(),
        "26-27": createStatItem(),
        "28-29": createStatItem(),
        "29-30": createStatItem(),
        "31-32": createStatItem(),
        "32-33": createStatItem(),
        "34-35": createStatItem(),
        "35-36": createStatItem(),
        // splity pionowe
        "1-4": createStatItem(),
        "2-5": createStatItem(),
        "3-6": createStatItem(),
        "4-7": createStatItem(),
        "5-8": createStatItem(),
        "6-9": createStatItem(),
        "7-10": createStatItem(),
        "8-11": createStatItem(),
        "9-12": createStatItem(),
        "10-13": createStatItem(),
        "11-14": createStatItem(),
        "12-15": createStatItem(),
        "13-16": createStatItem(),
        "14-17": createStatItem(),
        "15-18": createStatItem(),
        "16-19": createStatItem(),
        "17-20": createStatItem(),
        "18-21": createStatItem(),
        "19-22": createStatItem(),
        "20-23": createStatItem(),
        "21-24": createStatItem(),
        "22-25": createStatItem(),
        "23-26": createStatItem(),
        "24-27": createStatItem(),
        "25-28": createStatItem(),
        "26-29": createStatItem(),
        "27-30": createStatItem(),
        "28-31": createStatItem(),
        "29-32": createStatItem(),
        "30-33": createStatItem(),
        "31-34": createStatItem(),
        "32-35": createStatItem(),
        "33-36": createStatItem(),
      },
      straights: {
        0: createStatItem(),
        1: createStatItem(),
        2: createStatItem(),
        3: createStatItem(),
        4: createStatItem(),
        5: createStatItem(),
        6: createStatItem(),
        7: createStatItem(),
        8: createStatItem(),
        9: createStatItem(),
        10: createStatItem(),
        11: createStatItem(),
        12: createStatItem(),
        13: createStatItem(),
        14: createStatItem(),
        15: createStatItem(),
        16: createStatItem(),
        17: createStatItem(),
        18: createStatItem(),
        19: createStatItem(),
        20: createStatItem(),
        21: createStatItem(),
        22: createStatItem(),
        23: createStatItem(),
        24: createStatItem(),
        25: createStatItem(),
        26: createStatItem(),
        27: createStatItem(),
        28: createStatItem(),
        29: createStatItem(),
        30: createStatItem(),
        31: createStatItem(),
        32: createStatItem(),
        33: createStatItem(),
        34: createStatItem(),
        35: createStatItem(),
        36: createStatItem(),
      },
    };
  }

  private getColor(number: number): ColorKey | null {
    if (number === 0) return null;
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(number) ? "red" : "black";
  }

  private getParity(number: number): ParityKey | null {
    if (number === 0) return null;
    return number % 2 === 0 ? "even" : "odd";
  }

  private getDozen(number: number): DozenKey | null {
    if (number === 0) return null;
    if (number <= 12) return "first";
    if (number <= 24) return "second";
    return "third";
  }

  private getColumn(number: number): ColumnKey | null {
    if (number === 0) return null;
    const mod = number % 3;
    if (mod === 1) return "left";
    if (mod === 2) return "center";
    return "right";
  }

  private getRange(number: number): RangeKey | null {
    if (number === 0) return null;
    return number <= 18 ? "low" : "high";
  }

  private getStreet(number: number): StreetKey | null {
    if (number === 0) return null;
    const base = Math.floor((number - 1) / 3) * 3 + 1;
    return `${base}-${base + 1}-${base + 2}` as StreetKey;
  }

  private getSplit(number: number): string[] {
    if (number === 0) return [];

    const splits: string[] = [];
    const neighbors = [
      number - 1, // lewy
      number + 1, // prawy
      number - 3, // górny
      number + 3, // dolny
    ];

    for (const neighbor of neighbors) {
      if (neighbor >= 1 && neighbor <= 36) {
        // Normalizuj klucz (mniejsza liczba pierwsza)
        const min = Math.min(number, neighbor);
        const max = Math.max(number, neighbor);
        splits.push(`${min}-${max}`);
      }
    }

    return splits.map((split) => split as SplitKey);
  }

  private getCorner(number: number): CornerKey[] {
    if (number === 0) return [];

    const corners = [
      "1-2-4-5",
      "2-3-5-6",
      "4-5-7-8",
      "5-6-8-9",
      "7-8-10-11",
      "8-9-11-12",
      "10-11-13-14",
      "11-12-14-15",
      "13-14-16-17",
      "14-15-17-18",
      "16-17-19-20",
      "17-18-20-21",
      "19-20-22-23",
      "20-21-23-24",
      "22-23-25-26",
      "23-24-26-27",
      "25-26-28-29",
      "26-27-29-30",
      "28-29-31-32",
      "29-30-32-33",
      "31-32-34-35",
      "32-33-35-36",
    ];

    const result: CornerKey[] = [];
    for (const corner of corners) {
      if (corner.split("-").includes(number.toString())) {
        result.push(corner as CornerKey);
      }
    }
    return result;
  }

  private getSixline(number: number): SixlineKey[] {
    if (number === 0) return [];

    const sixlines = [
      "1-2-3-4-5-6",
      "4-5-6-7-8-9",
      "7-8-9-10-11-12",
      "10-11-12-13-14-15",
      "13-14-15-16-17-18",
      "16-17-18-19-20-21",
      "19-20-21-22-23-24",
      "22-23-24-25-26-27",
      "25-26-27-28-29-30",
      "28-29-30-31-32-33",
      "31-32-33-34-35-36",
    ];

    const result: SixlineKey[] = [];
    for (const sixline of sixlines) {
      if (sixline.split("-").includes(number.toString())) {
        result.push(sixline as SixlineKey);
      }
    }
    return result;
  }

  private getStraight(number: number): StraightKey {
    return number.toString() as StraightKey;
  }

  resetStats() {
    this.stats = this.createInitialStats();
  }

  updateStats(number: number) {
    // Najpierw zaktualizuj wszystkie absence streak
    this.updateAllAbsenceStreaks();

    // Teraz zaktualizuj statystyki dla aktualnej liczby
    this.updateForNumber(number);
  }

  private updateAllAbsenceStreaks() {
    const categories = Object.keys(this.stats) as (keyof RouletteStats)[];

    categories.forEach((categoryKey) => {
      const category = this.stats[categoryKey] as Record<string, StatItem>;
      Object.keys(category).forEach((key) => {
        const item = category[key];
        item.absenceStreak++;
      });
    });
  }

  private updateForNumber(number: number) {
    // Teraz zaktualizuj statystyki dla aktualnej liczby
    const color = this.getColor(number);
    const parity = this.getParity(number);
    const dozen = this.getDozen(number);
    const column = this.getColumn(number);
    const range = this.getRange(number);
    const street = this.getStreet(number);
    const splits = this.getSplit(number);
    const corners = this.getCorner(number); // Zmiana na corners (liczba mnoga)
    const sixlines = this.getSixline(number); // Zmiana na sixlines (liczba mnoga)
    const straight = this.getStraight(number);

    // Resetuj absence streak tylko dla nie-nullowych wartości
    if (color !== null) this.resetAbsenceForItem("colors", color);
    if (parity !== null) this.resetAbsenceForItem("parities", parity);
    if (dozen !== null) this.resetAbsenceForItem("dozens", dozen);
    if (column !== null) this.resetAbsenceForItem("columns", column);
    if (range !== null) this.resetAbsenceForItem("ranges", range);
    if (street !== null) this.resetAbsenceForItem("streets", street);

    // Dla splitu iterujemy po wszystkich możliwych kombinacjach
    if (splits.length > 0) {
      splits.forEach((split) => {
        this.resetAbsenceForItem("splits", split);
      });
    }

    // Dla cornerów iterujemy po wszystkich możliwych kombinacjach
    if (corners.length > 0) {
      corners.forEach((corner) => {
        this.resetAbsenceForItem("corners", corner);
      });
    }

    // Dla sixline'ów iterujemy po wszystkich możliwych kombinacjach
    if (sixlines.length > 0) {
      sixlines.forEach((sixline) => {
        this.resetAbsenceForItem("sixlines", sixline);
      });
    }

    // Straight zawsze istnieje, nawet dla 0
    this.resetAbsenceForItem("straights", straight);

    // Aktualizuj statystyki tylko dla nie-nullowych wartości
    if (color !== null) this.updateCategoryStats("colors", color);
    if (parity !== null) this.updateCategoryStats("parities", parity);
    if (dozen !== null) this.updateCategoryStats("dozens", dozen);
    if (column !== null) this.updateCategoryStats("columns", column);
    if (range !== null) this.updateCategoryStats("ranges", range);
    if (street !== null) this.updateCategoryStats("streets", street);

    if (splits.length > 0) {
      splits.forEach((split) => {
        this.updateCategoryStats("splits", split);
      });
    }

    if (corners.length > 0) {
      corners.forEach((corner) => {
        this.updateCategoryStats("corners", corner);
      });
    }

    if (sixlines.length > 0) {
      sixlines.forEach((sixline) => {
        this.updateCategoryStats("sixlines", sixline);
      });
    }

    this.updateCategoryStats("straights", straight);
  }

  private resetAbsenceForItem(category: keyof RouletteStats, value: string) {
    const categoryObj = this.stats[category] as Record<string, StatItem | undefined>;
    const item = categoryObj[value];

    if (item) {
      // Dodane sprawdzenie
      item.absenceStreak = 0;
    }
  }

  private updateCategoryStats(category: keyof RouletteStats, value: string) {
    const categoryObj = this.stats[category] as Record<string, StatItem | undefined>;

    // Resetuj streak dla innych wartości
    Object.keys(categoryObj).forEach((key) => {
      const item = categoryObj[key];
      if (key !== value && item) {
        // Dodane sprawdzenie item
        item.streak = 0;
      }
    });

    // Aktualizuj statystyki dla aktualnej wartości
    const item = categoryObj[value];
    if (item) {
      // Dodane sprawdzenie
      item.count++;
      item.streak++;

      if (item.streak > item.maxStreak) {
        item.maxStreak = item.streak;
      }
    }
  }

  shouldBet(): Bet[] {
    const bets: Bet[] = [];

    // Kolory
    if (this.stats.colors.red.absenceStreak >= this.thresholds.color) {
      bets.push({
        type: "color",
        value: "red",
        absenceStreak: this.stats.colors.red.absenceStreak,
      });
    }
    if (this.stats.colors.black.absenceStreak >= this.thresholds.color) {
      bets.push({
        type: "color",
        value: "black",
        absenceStreak: this.stats.colors.black.absenceStreak,
      });
    }

    // Parzystość
    if (this.stats.parities.even.absenceStreak >= this.thresholds.parity) {
      bets.push({
        type: "parity",
        value: "even",
        absenceStreak: this.stats.parities.even.absenceStreak,
      });
    }
    if (this.stats.parities.odd.absenceStreak >= this.thresholds.parity) {
      bets.push({
        type: "parity",
        value: "odd",
        absenceStreak: this.stats.parities.odd.absenceStreak,
      });
    }

    // Tuziny
    if (this.stats.dozens.first.absenceStreak >= this.thresholds.dozen) {
      bets.push({
        type: "dozen",
        value: "first",
        absenceStreak: this.stats.dozens.first.absenceStreak,
      });
    }
    if (this.stats.dozens.second.absenceStreak >= this.thresholds.dozen) {
      bets.push({
        type: "dozen",
        value: "second",
        absenceStreak: this.stats.dozens.second.absenceStreak,
      });
    }
    if (this.stats.dozens.third.absenceStreak >= this.thresholds.dozen) {
      bets.push({
        type: "dozen",
        value: "third",
        absenceStreak: this.stats.dozens.third.absenceStreak,
      });
    }

    // Kolumny
    if (this.stats.columns.left.absenceStreak >= this.thresholds.column) {
      bets.push({
        type: "column",
        value: "left",
        absenceStreak: this.stats.columns.left.absenceStreak,
      });
    }
    if (this.stats.columns.center.absenceStreak >= this.thresholds.column) {
      bets.push({
        type: "column",
        value: "center",
        absenceStreak: this.stats.columns.center.absenceStreak,
      });
    }
    if (this.stats.columns.right.absenceStreak >= this.thresholds.column) {
      bets.push({
        type: "column",
        value: "right",
        absenceStreak: this.stats.columns.right.absenceStreak,
      });
    }

    // Zakresy
    if (this.stats.ranges.low.absenceStreak >= this.thresholds.range) {
      bets.push({
        type: "range",
        value: "low",
        absenceStreak: this.stats.ranges.low.absenceStreak,
      });
    }
    if (this.stats.ranges.high.absenceStreak >= this.thresholds.range) {
      bets.push({
        type: "range",
        value: "high",
        absenceStreak: this.stats.ranges.high.absenceStreak,
      });
    }

    // Zakłady sixline
    const sixlineKeys = Object.keys(this.stats.sixlines) as (keyof typeof this.stats.sixlines)[];
    for (const key of sixlineKeys) {
      const item = this.stats.sixlines[key];
      if (item && item.absenceStreak >= this.thresholds.sixline) {
        // Dodane sprawdzenie item
        bets.push({
          type: "sixline",
          value: key,
          absenceStreak: item.absenceStreak,
        });
      }
    }

    // Zakłady uliczne (street bets)
    const streetKeys = Object.keys(this.stats.streets) as (keyof typeof this.stats.streets)[];
    for (const key of streetKeys) {
      const item = this.stats.streets[key];
      if (item && item.absenceStreak >= this.thresholds.street) {
        // Dodane sprawdzenie item
        bets.push({
          type: "street",
          value: key,
          absenceStreak: item.absenceStreak,
        });
      }
    }

    // Zakłady split
    const splitKeys = Object.keys(this.stats.splits) as (keyof typeof this.stats.splits)[];
    for (const key of splitKeys) {
      const item = this.stats.splits[key];
      if (item && item.absenceStreak >= this.thresholds.split) {
        // Dodane sprawdzenie item
        bets.push({
          type: "split",
          value: key,
          absenceStreak: item.absenceStreak,
        });
      }
    }

    // Zakłady corner
    const cornerKeys = Object.keys(this.stats.corners) as (keyof typeof this.stats.corners)[];
    for (const key of cornerKeys) {
      const item = this.stats.corners[key];
      if (item && item.absenceStreak >= this.thresholds.corner) {
        // Dodane sprawdzenie item
        bets.push({
          type: "corner",
          value: key,
          absenceStreak: item.absenceStreak,
        });
      }
    }

    // Zakłady straight
    const straightKeys = Object.keys(this.stats.straights) as (keyof typeof this.stats.straights)[];
    for (const key of straightKeys) {
      const item = this.stats.straights[key];
      if (item && item.absenceStreak >= this.thresholds.straight) {
        // Dodane sprawdzenie item
        bets.push({
          type: "straight",
          value: key,
          absenceStreak: item.absenceStreak,
        });
      }
    }

    return bets;
  }

  getStats(): RouletteStats {
    return this.stats;
  }
}
