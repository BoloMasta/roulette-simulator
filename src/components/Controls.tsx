// src/components/Controls.tsx
import React from "react";

interface ControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onSingleSpin: () => void;
  onSpeedChange: (speed: number) => void;
  onStakeChange: (stake: number) => void;
  onSpinCountChange: (count: number) => void;
  currentSpeed: number;
  currentStake: number;
  spinCount: number;
  disabled?: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayToggle,
  onSingleSpin,
  onSpeedChange,
  onStakeChange,
  onSpinCountChange,
  currentSpeed,
  currentStake,
  spinCount,
  disabled = false,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Controls</h2>

      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={onPlayToggle}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-white transition ${
              isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={disabled}
          >
            {isPlaying ? "Stop" : "Start"}
          </button>

          <button
            onClick={onSingleSpin}
            disabled={isPlaying || disabled}
            className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold text-white disabled:opacity-50"
          >
            Single Spin
          </button>
        </div>

        <div className="p-3 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Spin Speed</label>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
              {currentSpeed}ms
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={currentSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            disabled={disabled}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="p-3 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Spin Count</label>
            <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
              {spinCount}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={spinCount}
            onChange={(e) => onSpinCountChange(Number(e.target.value))}
            disabled={disabled}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        <div className="p-3 rounded-lg border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">Stake Amount</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500">
              $
            </span>
            <input
              type="number"
              min="1"
              max="1000"
              value={currentStake}
              onChange={(e) => onStakeChange(Math.max(1, Number(e.target.value)))}
              disabled={disabled}
              className="w-full pl-7 p-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
