// src/lib/rouletteAnalyzer.ts
import type { RouletteStats, StatItem, Bet } from "./types";

const createStatItem = (): StatItem => ({
  count: 0,
  streak: 0,
  maxStreak: 0,
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

  resetStats() {
    this.stats = this.createInitialStats();
  }

  updateStats(number: number) {
    const color = this.getColor(number);
    const parity = this.getParity(number);
    const dozen = this.getDozen(number);
    const column = this.getColumn(number);
    const range = this.getRange(number);

    this.updateCategory("colors", color);
    this.updateCategory("parities", parity);
    this.updateCategory("dozens", dozen);
    this.updateCategory("columns", column);
    this.updateCategory("ranges", range);
  }

  private updateCategory(category: keyof RouletteStats, value: string) {
    const categoryObj = this.stats[category] as Record<string, StatItem>;

    Object.keys(categoryObj).forEach((key) => {
      if (key !== value) {
        categoryObj[key].streak = 0;
      }
    });

    const item = categoryObj[value];
    item.count++;
    item.streak++;

    if (item.streak > item.maxStreak) {
      item.maxStreak = item.streak;
    }
  }

  shouldBet(): Bet[] {
    const bets: Bet[] = [];

    // Sprawdź kolory
    if (this.stats.colors.red.streak >= this.thresholds.color) {
      bets.push({ type: "color", value: "black" });
    }
    if (this.stats.colors.black.streak >= this.thresholds.color) {
      bets.push({ type: "color", value: "red" });
    }

    // Sprawdź parzystości
    if (this.stats.parities.even.streak >= this.thresholds.parity) {
      bets.push({ type: "parity", value: "odd" });
    }
    if (this.stats.parities.odd.streak >= this.thresholds.parity) {
      bets.push({ type: "parity", value: "even" });
    }

    // Sprawdź tuziny
    if (this.stats.dozens.first.streak >= this.thresholds.dozen) {
      bets.push({ type: "dozen", value: "second" });
      bets.push({ type: "dozen", value: "third" });
    }
    if (this.stats.dozens.second.streak >= this.thresholds.dozen) {
      bets.push({ type: "dozen", value: "first" });
      bets.push({ type: "dozen", value: "third" });
    }
    if (this.stats.dozens.third.streak >= this.thresholds.dozen) {
      bets.push({ type: "dozen", value: "first" });
      bets.push({ type: "dozen", value: "second" });
    }

    // Sprawdź zakresy
    if (this.stats.ranges.low.streak >= this.thresholds.range) {
      bets.push({ type: "range", value: "high" });
    }
    if (this.stats.ranges.high.streak >= this.thresholds.range) {
      bets.push({ type: "range", value: "low" });
    }

    // Sprawdź kolumny
    if (this.stats.columns.left.streak >= this.thresholds.column) {
      bets.push({ type: "column", value: "center" });
      bets.push({ type: "column", value: "right" });
    }
    if (this.stats.columns.center.streak >= this.thresholds.column) {
      bets.push({ type: "column", value: "left" });
      bets.push({ type: "column", value: "right" });
    }
    if (this.stats.columns.right.streak >= this.thresholds.column) {
      bets.push({ type: "column", value: "left" });
      bets.push({ type: "column", value: "center" });
    }

    return bets;
  }

  private getColor(number: number): string {
    if (number === 0) return "red"; // Traktujemy 0 jako czerwone dla uproszczenia
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(number) ? "red" : "black";
  }

  private getParity(number: number): string {
    if (number === 0) return "even"; // Traktujemy 0 jako parzyste dla uproszczenia
    return number % 2 === 0 ? "even" : "odd";
  }

  private getDozen(number: number): string {
    if (number === 0) return "first";
    if (number <= 12) return "first";
    if (number <= 24) return "second";
    return "third";
  }

  private getColumn(number: number): string {
    if (number === 0) return "center";
    const mod = number % 3;
    if (mod === 1) return "left";
    if (mod === 2) return "center";
    return "right";
  }

  private getRange(number: number): string {
    if (number === 0) return "low";
    return number <= 18 ? "low" : "high";
  }

  getStats(): RouletteStats {
    return this.stats;
  }
}
