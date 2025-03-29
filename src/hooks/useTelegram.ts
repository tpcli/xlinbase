// src/hooks/useTelegram.ts
import { useEffect, useState } from "react";

export function useTelegram() {
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setTg(window.Telegram.WebApp);
      window.Telegram.WebApp.ready();
    }
  }, []);

  return tg;
}
