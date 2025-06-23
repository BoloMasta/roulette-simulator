// src/App.tsx

import RouletteSimulator from "./components/RouletteSimulator";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Roulette Series Analyzer
        </h1>
        <RouletteSimulator />
      </div>
    </div>
  );
}

export default App;
