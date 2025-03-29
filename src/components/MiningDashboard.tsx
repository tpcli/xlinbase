"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function MiningDashboard() {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [mining, setMining] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand(); // Fullscreen mode
      setUser(tg.initDataUnsafe?.user);
      loadBalance(tg.initDataUnsafe?.user?.id);
      loadHistory();
      loadLeaderboard();
    }
  }, []);

  async function loadBalance(telegramId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("balance")
      .eq("telegram_id", telegramId)
      .single();

    if (error) console.error("Error loading balance:", error);
    else setBalance(data?.balance || 0);
  }

  async function loadHistory() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setHistory(data);
  }

  async function loadLeaderboard() {
    const { data, error } = await supabase
      .from("users")
      .select("telegram_id, balance")
      .order("balance", { ascending: false })
      .limit(5);

    if (!error) setLeaderboard(data);
  }

  async function startMining() {
    setMining(true);
    setTimeout(async () => {
      const reward = Math.floor(Math.random() * 10) + 1; // Random 1-10 coins
      const newBalance = balance + reward;

      const { error } = await supabase
        .from("users")
        .upsert([{ telegram_id: user?.id, balance: newBalance }]);

      if (!error) {
        setBalance(newBalance);
        setHistory([{ telegram_id: user?.id, amount: reward, created_at: new Date() }, ...history]);
      }
      setMining(false);
    }, 3000);
  }

  return (
    <div className="p-6 space-y-6">
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
      <motion.div
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={startMining}
          disabled={mining}
          className="w-full py-4 text-lg font-semibold shadow-lg"
        >
          {mining ? "⛏️ Mining in progress..." : "⚡ Start Mining"}
        </Button>
      </motion.div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {history.map((tx, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 border rounded-lg bg-gray-100"
              >
                +{tx.amount} ⚡ - {new Date(tx.created_at).toLocaleString()}
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {leaderboard.map((user, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 border rounded-lg bg-gray-100 flex justify-between"
              >
                <span>🥇 {user.telegram_id}</span>
                <span className="font-bold">{user.balance} ⚡</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
