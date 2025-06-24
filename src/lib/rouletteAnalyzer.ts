// src/lib/rouletteAnalyzer.ts
import type { RouletteStats, StatItem, Bet } from "./types";

type ColorKey = keyof RouletteStats["colors"];
type ParityKey = keyof RouletteStats["parities"];
type DozenKey = keyof RouletteStats["dozens"];
type ColumnKey = keyof RouletteStats["columns"];
type RangeKey = keyof RouletteStats["ranges"];

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
  };

  constructor(
    thresholds = {
      color: 5,
      parity: 5,
      dozen: 3,
      column: 3,
      range: 5,
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
    };
  }

  private getColor(number: number): ColorKey {
    if (number === 0) return "red";
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(number) ? "red" : "black";
  }

  private getParity(number: number): ParityKey {
    if (number === 0) return "even";
    return number % 2 === 0 ? "even" : "odd";
  }

  private getDozen(number: number): DozenKey {
    if (number === 0) return "first";
    if (number <= 12) return "first";
    if (number <= 24) return "second";
    return "third";
  }

  private getColumn(number: number): ColumnKey {
    if (number === 0) return "center";
    const mod = number % 3;
    if (mod === 1) return "left";
    if (mod === 2) return "center";
    return "right";
  }

  private getRange(number: number): RangeKey {
    if (number === 0) return "low";
    return number <= 18 ? "low" : "high";
  }

  resetStats() {
    this.stats = this.createInitialStats();
  }

  updateStats(number: number) {
    // Najpierw zaktualizuj wszystkie absence streak
    this.updateAllAbsenceStreaks();

    // Teraz zaktualizuj statystyki dla aktualnej liczby
    this.updateForNumber(number);

    console.log("Red:", this.stats.colors.red);
    console.log("Black:", this.stats.colors.black);
    console.log("-------------------------------");
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
    const color = this.getColor(number);
    const parity = this.getParity(number);
    const dozen = this.getDozen(number);
    const column = this.getColumn(number);
    const range = this.getRange(number);

    // Resetuj absence streak dla aktualnych wartości
    this.resetAbsenceForItem("colors", color);
    this.resetAbsenceForItem("parities", parity);
    this.resetAbsenceForItem("dozens", dozen);
    this.resetAbsenceForItem("columns", column);
    this.resetAbsenceForItem("ranges", range);

    // Aktualizuj statystyki
    this.updateCategoryStats("colors", color);
    this.updateCategoryStats("parities", parity);
    this.updateCategoryStats("dozens", dozen);
    this.updateCategoryStats("columns", column);
    this.updateCategoryStats("ranges", range);
  }

  private resetAbsenceForItem(category: keyof RouletteStats, value: string) {
    const categoryObj = this.stats[category] as Record<string, StatItem>;
    const item = categoryObj[value];
    item.absenceStreak = 0;
  }

  private updateCategoryStats(category: keyof RouletteStats, value: string) {
    const categoryObj = this.stats[category] as Record<string, StatItem>;

    // Resetuj streak dla innych wartości
    Object.keys(categoryObj).forEach((key) => {
      if (key !== value) {
        const item = categoryObj[key];
        item.streak = 0;
      }
    });

    // Aktualizuj statystyki dla aktualnej wartości
    const item = categoryObj[value];
    item.count++;
    item.streak++;

    if (item.streak > item.maxStreak) {
      item.maxStreak = item.streak;
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

    return bets;
  }

  getStats(): RouletteStats {
    return this.stats;
  }
}
