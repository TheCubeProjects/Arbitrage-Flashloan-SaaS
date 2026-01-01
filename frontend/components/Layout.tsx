import React from 'react';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { StatsBar } from '@/components/StatsBar';

export const metadata = {
  title: 'Arbitrage-Flashloan-SaaS',
  description: 'Cutting-edge Arbitrum Flashloan Bot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex overflow-hidden">
        {/* Persistent Sidebar Navigation */}
        <Sidebar />

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Bar for real-time network/wallet stats */}
          <StatsBar />

          {/* Main Content Area with smooth scrolling */}
          <main className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
