import React, { useState } from 'react';
import { ethers } from 'ethers';

// This matches the Call struct in your FlashloanArb.sol [cite: 11]
interface SwapLevel {
  venue: string;
  target: string; // The Router Address
  tokenIn: string;
  tokenOut: string;
  fee: number;
}

export const ManualBuilder = () => {
  const [levels, setLevels] = useState<SwapLevel[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const addLevel = () => {
    setLevels([...levels, { 
      venue: 'Uniswap V3', 
      target: process.env.NEXT_PUBLIC_UNI_ROUTER!, 
      tokenIn: '', 
      tokenOut: '', 
      fee: 3000 
    }]);
  };

  const executeTrade = async () => {
    setIsExecuting(true);
    try {
      // Logic here connects to your deployed contract at FLASHLOAN_ARB 
      // It passes the levels array as the 'calls' parameter to contract.start() [cite: 18]
      console.log("Executing Flashloan Arbitrage with levels:", levels);
    } catch (error) {
      console.error("Execution failed", error);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-700">
      <h2 className="text-2xl font-bold mb-4">Manual Route Builder</h2>
      
      {levels.map((level, index) => (
        <div key={index} className="flex gap-4 mb-4 p-4 bg-slate-800 rounded-lg border border-slate-600">
          <span className="bg-blue-600 px-3 py-1 rounded-full text-xs self-center">Step {index + 1}</span>
          <select className="bg-slate-700 p-2 rounded">
            <option>Uniswap V3</option>
            <option>Camelot</option>
            <option>SushiSwap</option>
          </select>
          <input placeholder="Token In" className="bg-slate-700 p-2 rounded w-full" />
          <input placeholder="Token Out" className="bg-slate-700 p-2 rounded w-full" />
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <button 
          onClick={addLevel}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition"
        >
          + Add Swap Level
        </button>
        
        <button 
          onClick={executeTrade}
          disabled={levels.length < 2 || isExecuting}
          className="bg-green-600 hover:bg-green-500 disabled:bg-slate-600 px-8 py-2 rounded-lg font-bold transition"
        >
          {isExecuting ? 'Processing...' : 'Execute Arbitrage'}
        </button>
      </div>
    </div>
  );
};
