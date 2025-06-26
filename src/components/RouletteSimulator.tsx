// src/components/RouletteSimulator.tsx
import { useEffect, useCallback, useRef, useReducer } from "react";
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
  thresholds: {
    color: number;
    parity: number;
    range: number;
    dozen: number;
    column: number;
    straight: number;
    split: number;
    street: number;
    corner: number;
    sixline: number;
  };
  initialBankroll: number; // Added
};

// Akcje do aktualizacji stanu
type SimulatorAction =
  | { type: "ADD_NUMBER"; number: number; stats: RouletteStats; bets: Bet[] }
  | { type: "SET_PLAYING"; isPlaying: boolean }
  | { type: "SET_SPEED"; speed: number }
  | { type: "SET_STAKE"; stake: number }
  | { type: "SET_SPIN_COUNT"; spinCount: number }
  | { type: "SET_THRESHOLDS"; thresholds: SimulatorState["thresholds"] }
  | { type: "SET_INITIAL_BANKROLL"; bankroll: number }
  | { type: "RESET_ALL" };

// Reducer do zarządzania stanem
function simulatorReducer(state: SimulatorState, action: SimulatorAction): SimulatorState {
  switch (action.type) {
    case "ADD_NUMBER": {
      return {
        ...state,
        history: [...state.history, action.number].slice(-100),
        stats: action.stats,
        bets: action.bets,
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

    case "SET_THRESHOLDS":
      return { ...state, thresholds: action.thresholds };

    case "SET_INITIAL_BANKROLL": // Added
      return { ...state, initialBankroll: action.bankroll };

    case "RESET_ALL":
      return {
        stats: new RouletteAnalyzer().getStats(),
        bets: [],
        history: [],
        isPlaying: false,
        speed: 100,
        stake: 10,
        spinCount: 20,
        initialBankroll: 1000,
        thresholds: {
          color: 8,
          parity: 8,
          range: 8,
          dozen: 5,
          column: 5,
          sixline: 10,
          corner: 12,
          street: 14,
          split: 18,
          straight: 25,
        },
      };

    default:
      return state;
  }
}

const RouletteSimulator = () => {
  const [state, dispatch] = useReducer(simulatorReducer, {
    stats: new RouletteAnalyzer().getStats(),
    bets: [],
    history: [],
    isPlaying: false,
    speed: 100, // Changed default to 100ms
    stake: 10,
    spinCount: 20, // Changed default to 20 spins
    initialBankroll: 1000, // Added
    thresholds: {
      color: 8,
      parity: 8,
      range: 8,
      dozen: 5,
      column: 5,
      sixline: 10,
      corner: 12,
      street: 14,
      split: 18,
      straight: 25,
    },
  });

  // Twórz analyzer na podstawie thresholds
  const analyzerRef = useRef<RouletteAnalyzer>(new RouletteAnalyzer(state.thresholds));

  useEffect(() => {
    analyzerRef.current = new RouletteAnalyzer(state.thresholds);
    analyzerRef.current.resetStats();
  }, [state.thresholds]);

  const animationRef = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const spinsLeft = useRef<number>(0);
  const isProcessing = useRef(false);

  const spin = useCallback(() => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    const number = Math.floor(Math.random() * 37);
    analyzerRef.current.updateStats(number);
    const stats = analyzerRef.current.getStats();
    const bets = analyzerRef.current.shouldBet();
    dispatch({ type: "ADD_NUMBER", number, stats, bets });
    isProcessing.current = false;
  }, []);

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
      analyzerRef.current.updateStats(result);
      const stats = analyzerRef.current.getStats();
      const bets = analyzerRef.current.shouldBet();
      dispatch({ type: "ADD_NUMBER", number: result, stats, bets });
    },
    [state.isPlaying, stopSimulation, analyzerRef]
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

  // Added clear handler
  const handleClear = useCallback(() => {
    stopSimulation();
    dispatch({ type: "RESET_ALL" });
  }, [stopSimulation]);

  // Added bankroll handler
  const handleBankrollChange = (bankroll: number) => {
    dispatch({ type: "SET_INITIAL_BANKROLL", bankroll });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StatisticsPanel stats={state.stats} thresholds={state.thresholds} />
          <div className="mt-6">
            <BetRecommendations
              bets={state.bets}
              baseStake={state.stake}
              bankroll={state.initialBankroll} // Pass bankroll to recommendations
            />
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
            thresholds={state.thresholds}
            onThresholdsChange={(newThresholds) =>
              dispatch({ type: "SET_THRESHOLDS", thresholds: newThresholds })
            }
            currentSpeed={state.speed}
            currentStake={state.stake}
            spinCount={state.spinCount}
            onClear={handleClear} // Added
            onBankrollChange={handleBankrollChange} // Added
            initialBankroll={state.initialBankroll} // Added
          />
          <BettingHistory history={state.history} />
        </div>
      </div>
    </div>
  );
};

export default RouletteSimulator;
