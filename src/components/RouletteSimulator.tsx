// src/components/RouletteSimulator.tsx
import { useState, useEffect, useCallback, useRef, useReducer } from "react";
import { RouletteAnalyzer } from "../lib/rouletteAnalyzer";
import Controls from "./Controls";
import StatisticsPanel from "./StatisticsPanel";
import BetRecommendations from "./BetRecommendations";
import BettingHistory from "./BettingHistory";
import type { Bet, RouletteStats } from "../lib/types";

// Stan symulatora
type SimulatorState = {
  stats: RouletteStats;
  bets: Bet[];
  history: number[];
  isPlaying: boolean;
  speed: number;
  stake: number;
  spinCount: number;
};

// Akcje do aktualizacji stanu
type SimulatorAction =
  | { type: "ADD_NUMBER"; number: number; stats: RouletteStats; bets: Bet[] }
  | { type: "SET_PLAYING"; isPlaying: boolean }
  | { type: "SET_SPEED"; speed: number }
  | { type: "SET_STAKE"; stake: number }
  | { type: "SET_SPIN_COUNT"; spinCount: number };

// Reducer do zarządzania stanem
function simulatorReducer(state: SimulatorState, action: SimulatorAction): SimulatorState {
  switch (action.type) {
    case "ADD_NUMBER": {
      // Usuwamy wywołanie analyzer.updateStats
      return {
        ...state,
        history: [...state.history, action.number].slice(-100),
        stats: action.stats, // przekazujemy już zaktualizowane statystyki
        bets: action.bets, // przekazujemy już zaktualizowane rekomendacje
      };
    }

    case "SET_PLAYING":
      return { ...state, isPlaying: action.isPlaying };

    case "SET_SPEED":
      return { ...state, speed: action.speed };

    case "SET_STAKE":
      return { ...state, stake: action.stake };

    case "SET_SPIN_COUNT":
      return { ...state, spinCount: action.spinCount };

    default:
      return state;
  }
}

const RouletteSimulator = () => {
  const [analyzer] = useState(() => new RouletteAnalyzer());
  const [state, dispatch] = useReducer(simulatorReducer, {
    stats: analyzer.getStats(),
    bets: [],
    history: [],
    isPlaying: false,
    speed: 1000,
    stake: 10,
    spinCount: 10,
  });

  const animationRef = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const spinsLeft = useRef<number>(0);
  const isProcessing = useRef(false); // Flaga zapobiegająca podwójnemu przetwarzaniu

  const spin = useCallback(() => {
    if (isProcessing.current) return;

    isProcessing.current = true;
    const number = Math.floor(Math.random() * 37);
    analyzer.updateStats(number);
    const stats = analyzer.getStats();
    const bets = analyzer.shouldBet();
    dispatch({ type: "ADD_NUMBER", number, stats, bets });
    isProcessing.current = false;
  }, [analyzer]);

  const stopSimulation = useCallback(() => {
    dispatch({ type: "SET_PLAYING", isPlaying: false });
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    lastUpdateTime.current = 0;
    spinsLeft.current = 0;
  }, []);

  useEffect(() => {
    if (!state.isPlaying) return;

    const animate = (timestamp: number) => {
      if (!lastUpdateTime.current) lastUpdateTime.current = timestamp;

      const elapsed = timestamp - lastUpdateTime.current;

      if (elapsed > state.speed) {
        spin();
        lastUpdateTime.current = timestamp;

        if (state.spinCount > 0) {
          spinsLeft.current = spinsLeft.current - 1;
          if (spinsLeft.current <= 0) {
            stopSimulation();
            return;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (state.spinCount > 0) {
      spinsLeft.current = state.spinCount;
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.isPlaying, state.speed, spin, state.spinCount, stopSimulation]);

  const handleManualResult = useCallback(
    (result: number) => {
      if (state.isPlaying) {
        stopSimulation();
      }
      analyzer.updateStats(result);
      const stats = analyzer.getStats();
      const bets = analyzer.shouldBet();
      dispatch({ type: "ADD_NUMBER", number: result, stats, bets });
    },
    [state.isPlaying, stopSimulation, analyzer]
  );

  const handleSpeedChange = (newSpeed: number) => {
    dispatch({ type: "SET_SPEED", speed: newSpeed });
  };

  const handleStakeChange = (newStake: number) => {
    dispatch({ type: "SET_STAKE", stake: newStake });
  };

  const handleSpinCountChange = (count: number) => {
    dispatch({ type: "SET_SPIN_COUNT", spinCount: count });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StatisticsPanel
            stats={state.stats}
            thresholds={{
              color: 5,
              parity: 5,
              dozen: 3,
              column: 3,
              range: 5,
            }}
          />
          <div className="mt-6">
            <BetRecommendations bets={state.bets} baseStake={state.stake} />
          </div>
        </div>
        <div className="space-y-6">
          <Controls
            isPlaying={state.isPlaying}
            onPlayToggle={() => {
              if (state.isPlaying) {
                stopSimulation();
              } else {
                dispatch({ type: "SET_PLAYING", isPlaying: true });
              }
            }}
            onSingleSpin={spin}
            onSpeedChange={handleSpeedChange}
            onStakeChange={handleStakeChange}
            onSpinCountChange={handleSpinCountChange}
            onManualResult={handleManualResult}
            currentSpeed={state.speed}
            currentStake={state.stake}
            spinCount={state.spinCount}
          />
          <BettingHistory history={state.history} />
        </div>
      </div>
    </div>
  );
};

export default RouletteSimulator;
