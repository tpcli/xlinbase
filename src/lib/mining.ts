// src/lib/mining.ts
import { supabase } from "./supabase";

/**
 * Simpan balance ke database Supabase.
 * @param telegramId ID unik pengguna dari Telegram.
 * @param balance Jumlah koin yang disimpan.
 */
export async function saveBalanceToDB(telegramId: string, balance: number) {
    const { error } = await supabase
      .from("users")
      .upsert(
        [{ telegram_id: telegramId, balance }], // Pastikan dikirim dalam array
        { onConflict: "telegram_id" } // onConflict harus string tunggal
      );
  
    if (error) console.error("❌ Error saving balance:", error);
    else console.log("✅ Balance saved to database:", balance);
  }

/**
 * Mulai mining koin selama 30 detik.
 * @param setBalance State setter untuk memperbarui balance.
 * @param setMining State setter untuk status mining.
 * @param telegramId ID unik pengguna untuk menyimpan balance ke database.
 */
export function startMining(
  setBalance: React.Dispatch<React.SetStateAction<number>>,
  setMining: React.Dispatch<React.SetStateAction<boolean>>,
  telegramId: string
) {
  setMining(true);

  const interval = setInterval(() => {
    setBalance((prev: number) => {
      const newBalance = prev + Math.random() * 0.001; // Tambah balance dengan angka random
      localStorage.setItem("miningBalance", newBalance.toString()); // Simpan ke Local Storage
      saveBalanceToDB(telegramId, newBalance); // Simpan ke database

      return newBalance;
    });
  }, 1000); // Tambah setiap 1 detik

  setTimeout(() => {
    clearInterval(interval);
    setMining(false);
  }, 30000); // Mining selama 30 detik
}
