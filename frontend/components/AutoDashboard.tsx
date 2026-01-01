'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Opportunity {
  id: string;
  venue_a: string;
  venue_b: string;
  expected_profit: number;
  timestamp: string;
  status: 'PENDING' | 'EXECUTED' | 'FAILED';
}

export const AutoDashboard = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    // Real-time subscription to the 'Opportunities' table
    const channel = supabase
      .channel('live-trades')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'opportunities' }, 
        (payload) => {
          setOpportunities((prev) => [payload.new as Opportunity, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-800 rounded-xl border border-blue-500/30">
          <p className="text-slate-400 text-sm">Total 24h Profit</p>
          <p className="text-2xl font-bold text-green-400">+$142.50 USDC</p>
        </div>
        {/* Additional stat cards here */}
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
          <h3 className="font-bold">Live Execution Feed</h3>
          <span className="flex items-center gap-2 text-xs text-green-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Scanner Active (0.1s)
          </span>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="p-4">Route</th>
              <th className="p-4">Potential Profit</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {opportunities.map((opp) => (
              <tr key={opp.id} className="hover:bg-slate-700/30 transition">
                <td className="p-4 text-sm">
                  {opp.venue_a} <span className="text-slate-500">→</span> {opp.venue_b}
                </td>
                <td className="p-4 text-green-400 font-mono">
                  +${opp.expected_profit.toFixed(2)}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-[10px] bg-slate-700">
                    {opp.status}
                  </span>
                </td>
                <td className="p-4 text-right text-slate-500 text-sm">
                  {new Date(opp.timestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
