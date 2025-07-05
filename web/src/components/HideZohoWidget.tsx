"use client";

import { useEffect } from "react";

// ✅ Extend the global Window type to avoid TypeScript errors
declare global {
  interface Window {
    $zoho: {
      salesiq?: {
        floatwindow?: {
          visible?: (mode: string) => void;
        };
      };
    };
  }
}

export default function HideZohoWidget() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.$zoho && window.$zoho.salesiq) {
        window.$zoho?.salesiq?.floatwindow?.visible?.("hide");

        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return null;
}
