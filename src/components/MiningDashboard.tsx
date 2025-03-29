"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

// Dummy data leaderboard
const dummyLeaderboard = [
  { telegram_id: "12345", username: "Alice", balance: 150 },
  { telegram_id: "67890", username: "Bob", balance: 120 },
  { telegram_id: "54321", username: "Charlie", balance: 100 },
];

export default function MiningDashboard() {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [mining, setMining] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [leaderboard] = useState(dummyLeaderboard);
  const [error, setError] = useState<string | null>(null);

  // UseEffect untuk deteksi Telegram WebApp & load data
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();

      console.log("🔍 Telegram Data:", tg.initDataUnsafe);

      if (!tg.initDataUnsafe?.user) {
        console.error("❌ User data tidak tersedia!");
        setError("Silakan login ke Telegram terlebih dahulu.");
        return;
      }

      setUser(tg.initDataUnsafe.user);
    } else {
      console.error("❌ Telegram WebApp tidak tersedia!");
      setError("Telegram WebApp tidak dapat diakses.");
    }
  }, []);

  // Fungsi mulai mining (tanpa backend, hanya update state)
  async function startMining() {
    if (!user?.id) {
      setError("User tidak ditemukan! Silakan login ke Telegram.");
      return;
    }

    setMining(true);
    setTimeout(() => {
      const reward = Math.floor(Math.random() * 10) + 1;
      const newBalance = balance + reward;

      setBalance(newBalance);
      setHistory([{ telegram_id: user.id, amount: reward, created_at: new Date() }, ...history]);

      setMining(false);
    }, 3000);
  }

  return (
    <div className="p-6 space-y-6">
      {error && <div className="p-3 bg-red-500 text-white rounded-lg">{error}</div>}

      {/* User Info */}
      {user && (
        <Card className="bg-gray-800 text-white shadow-xl">
          <CardHeader className="flex items-center space-x-4">
            <img src={user.photo_url} alt="Profile" className="w-12 h-12 rounded-full" />
            <div>
              <CardTitle className="text-xl font-bold">{user.first_name} {user.last_name}</CardTitle>
              <p className="text-sm">@{user.username}</p>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Balance</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-3xl font-semibold">
          {balance} ⚡
        </CardContent>
      </Card>

      {/* Mining Button */}
      <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
        <Button onClick={startMining} disabled={mining} className="w-full py-4 text-lg font-semibold shadow-lg">
          {mining ? "⛏️ Mining in progress..." : "⚡ Start Mining"}
        </Button>
      </motion.div>

      {/* Mining History */}
      <Card className="bg-gray-800 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Mining History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-gray-400">Belum ada transaksi</p>
          ) : (
            <ul className="space-y-2">
              {history.map((tx, index) => (
                <li key={index} className="flex justify-between border-b border-gray-600 pb-1">
                  <span>⚡ {tx.amount} earned</span>
                  <span className="text-sm text-gray-400">{new Date(tx.created_at).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card className="bg-gray-800 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">🏆 Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {leaderboard.map((player, index) => (
              <li key={player.telegram_id} className="flex justify-between border-b border-gray-600 pb-1">
                <span>
                  {index + 1}. @{player.username}
                </span>
                <span>{player.balance} ⚡</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
