"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [error, setError] = useState<string | null>(null);

  // Fungsi load balance
  const loadBalance = useCallback(async (telegramId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("balance")
      .eq("telegram_id", telegramId)
      .single();

    if (error) {
      console.error("❌ Error loading balance:", error);
      setError("Gagal mengambil saldo.");
    } else {
      setBalance(data?.balance || 0);
    }
  }, []);

  // Fungsi load transaksi
  const loadHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error loading history:", error);
      setError("Gagal mengambil riwayat transaksi.");
    } else {
      setHistory(data);
    }
  }, []);

  // Fungsi load leaderboard
  const loadLeaderboard = useCallback(async () => {
    const { data, error } = await supabase
      .from("users")
      .select("telegram_id, balance")
      .order("balance", { ascending: false })
      .limit(5);

    if (error) {
      console.error("❌ Error loading leaderboard:", error);
      setError("Gagal mengambil leaderboard.");
    } else {
      setLeaderboard(data);
    }
  }, []);

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
      loadBalance(tg.initDataUnsafe.user.id);
      loadHistory();
      loadLeaderboard();
    } else {
      console.error("❌ Telegram WebApp tidak tersedia!");
      setError("Telegram WebApp tidak dapat diakses.");
    }
  }, [loadBalance, loadHistory, loadLeaderboard]);

  async function startMining() {
    if (!user?.id) {
      setError("User tidak ditemukan! Silakan login ke Telegram.");
      return;
    }

    setMining(true);
    setTimeout(async () => {
      const reward = Math.floor(Math.random() * 10) + 1;
      const newBalance = balance + reward;

      const { error } = await supabase
        .from("users")
        .upsert([{ telegram_id: user.id, balance: newBalance }]);

      if (error) {
        console.error("❌ Error saat upsert:", error);
        setError("Gagal memperbarui saldo.");
      } else {
        setBalance(newBalance);
        setHistory([{ telegram_id: user.id, amount: reward, created_at: new Date() }, ...history]);
      }
      setMining(false);
    }, 3000);
  }

  return (
    <div className="p-6 space-y-6">
      {error && <div className="p-3 bg-red-500 text-white rounded-lg">{error}</div>}

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
    </div>
  );
}
