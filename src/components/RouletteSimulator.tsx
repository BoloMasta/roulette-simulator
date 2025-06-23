// src/components/RouletteSimulator.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { RouletteAnalyzer } from "../lib/rouletteAnalyzer";
import Controls from "./Controls";
import StatisticsPanel from "./StatisticsPanel";
import BetRecommendations from "./BetRecommendations";
import BettingHistory from "./BettingHistory";
import type { Bet, RouletteStats } from "../lib/types";

const RouletteSimulator = () => {
  const [analyzer] = useState(() => new RouletteAnalyzer());
  const [stats, setStats] = useState<RouletteStats>(analyzer.getStats());
  const [bets, setBets] = useState<Bet[]>([]);
  const [history, setHistory] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [stake, setStake] = useState(10);
  const [spinCount, setSpinCount] = useState(10); // Nowy stan dla liczby rzutów

  // Ref do śledzenia stanu animacji
  const animationRef = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const spinsLeft = useRef<number>(0); // Licznik pozostałych rzutów

  const spin = useCallback(() => {
    const number = Math.floor(Math.random() * 37);
    analyzer.updateStats(number);

    setHistory((prev) => {
      const newHistory = [...prev, number];
      return newHistory.slice(-100);
    });

    // Aktualizuj stan w requestAnimationFrame dla płynności
    requestAnimationFrame(() => {
      setStats({ ...analyzer.getStats() });
      setBets([...analyzer.shouldBet()]);
    });
  }, [analyzer]);

  // Funkcja do zatrzymania symulacji
  const stopSimulation = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    lastUpdateTime.current = 0;
    spinsLeft.current = 0;
  }, []);

  // Efekt dla symulacji
  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      if (!lastUpdateTime.current) lastUpdateTime.current = timestamp;

      const elapsed = timestamp - lastUpdateTime.current;

      if (elapsed > speed) {
        spin();
        lastUpdateTime.current = timestamp;

        // Dekrementuj licznik jeśli używamy ograniczonej liczby rzutów
        if (spinCount > 0) {
          spinsLeft.current = spinsLeft.current - 1;
          if (spinsLeft.current <= 0) {
            stopSimulation();
            return;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Ustaw początkową liczbę rzutów
    if (spinCount > 0) {
      spinsLeft.current = spinCount;
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, spin, spinCount, stopSimulation]);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const handleStakeChange = (newStake: number) => {
    setStake(newStake);
  };

  const handleSpinCountChange = (count: number) => {
    setSpinCount(count);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StatisticsPanel stats={stats} />
          <div className="mt-6">
            <BetRecommendations bets={bets} stake={stake} />
          </div>
        </div>
        <div className="space-y-6">
          <Controls
            isPlaying={isPlaying}
            onPlayToggle={() => {
              if (isPlaying) {
                stopSimulation();
              } else {
                setIsPlaying(true);
              }
            }}
            onSingleSpin={spin}
            onSpeedChange={handleSpeedChange}
            onStakeChange={handleStakeChange}
            onSpinCountChange={handleSpinCountChange}
            currentSpeed={speed}
            currentStake={stake}
            spinCount={spinCount}
          />
          <BettingHistory history={history} />
        </div>
      </div>
    </div>
  );
};

export default RouletteSimulator;
