// src/components/Controls.tsx
import React, { useState } from "react";

interface ControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onSingleSpin: () => void;
  onSpeedChange: (speed: number) => void;
  onStakeChange: (stake: number) => void;
  onSpinCountChange: (count: number) => void;
  onManualResult: (result: number) => void;
  currentSpeed: number;
  currentStake: number;
  spinCount: number;
  disabled?: boolean;
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
  onThresholdsChange: (t: ControlsProps["thresholds"]) => void;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayToggle,
  onSingleSpin,
  onSpeedChange,
  onStakeChange,
  onSpinCountChange,
  onManualResult,
  currentSpeed,
  currentStake,
  spinCount,
  disabled = false,
  thresholds,
  onThresholdsChange,
}) => {
  const [manualInput, setManualInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleManualSubmit = () => {
    setError(null);
    if (!manualInput.trim()) {
      setError("Please enter a number");
      return;
    }

    const numberValue = parseInt(manualInput, 10);

    if (isNaN(numberValue)) {
      setError("Invalid number");
      return;
    }

    if (numberValue < 0 || numberValue > 36) {
      setError("Number must be between 0 and 36");
      return;
    }

    onManualResult(numberValue);
    setManualInput("");
  };

  const handleThresholdChange = (key: keyof typeof thresholds, value: number) => {
    onThresholdsChange({ ...thresholds, [key]: value });
  };

  // Create typed threshold keys array
  const thresholdKeys = Object.keys(thresholds) as Array<keyof typeof thresholds>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-lg">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Controls</h2>

      <div className="space-y-3">
        {/* Zmieniona sekcja ręcznego wprowadzania */}
        <div className="p-2 rounded-lg border border-gray-100 bg-blue-50">
          <div className="flex items-center gap-2">
            <label className="block text-xs font-medium text-gray-700 whitespace-nowrap">
              Manual Result (0-36)
            </label>
            <input
              type="number"
              min="0"
              max="36"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              disabled={isPlaying || disabled}
              className="flex-1 p-1.5 border border-gray-300 rounded text-xs"
              placeholder="Enter number"
            />
            <button
              onClick={handleManualSubmit}
              disabled={isPlaying || disabled || !manualInput.trim()}
              className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-xs whitespace-nowrap"
            >
              Add
            </button>
          </div>
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onPlayToggle}
            className={`flex-1 py-2 px-3 rounded font-bold text-white text-sm transition ${
              isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={disabled}
          >
            {isPlaying ? "Stop" : "Start"}
          </button>

          <button
            onClick={onSingleSpin}
            disabled={isPlaying || disabled}
            className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 rounded font-bold text-white disabled:opacity-50 text-sm"
          >
            Single Spin
          </button>
        </div>

        <div className="p-2 rounded border border-gray-100">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-gray-700">Speed</label>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
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
            className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="p-2 rounded border border-gray-100">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-gray-700">Spins</label>
            <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
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
            className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        <div className="p-2 rounded border border-gray-100">
          <label className="block text-xs font-medium text-gray-700 mb-1">Stake</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-1 flex items-center text-gray-500 text-xs">
              $
            </span>
            <input
              type="number"
              min="1"
              max="1000"
              value={currentStake}
              onChange={(e) => onStakeChange(Math.max(1, Number(e.target.value)))}
              disabled={disabled}
              className="w-full pl-5 p-1.5 border border-gray-300 rounded text-xs"
            />
          </div>
        </div>

        {/* Compact thresholds section */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Thresholds</h3>
          <div className="grid grid-cols-5 gap-1">
            {thresholdKeys.map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-xs text-gray-600 capitalize mb-1">{key}</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={thresholds[key]}
                  onChange={(e) => handleThresholdChange(key, Number(e.target.value))}
                  className="border rounded px-0 py-0.5 w-full text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
