// src/types/global.d.ts
export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initData?: string;
        initDataUnsafe?: any;
      };
    };
  }
}
