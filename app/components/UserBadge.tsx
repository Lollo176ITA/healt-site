"use client";

import { useSyncExternalStore } from "react";

function getUserEmail() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userEmail");
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("user-email-changed", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("user-email-changed", handler);
  };
}

export function UserBadge() {
  const user = useSyncExternalStore(subscribe, getUserEmail, () => null);

  return (
    <div className="flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-100">
      <div className="h-8 w-8 rounded-full bg-emerald-400/30 text-center leading-8 text-emerald-50">
        <span suppressHydrationWarning>
          {(user ?? "O")[0]?.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xs uppercase tracking-[0.18em] text-slate-300">
          Utente
        </span>
        <span className="font-semibold" suppressHydrationWarning>
          {user ?? "Ospite"}
        </span>
      </div>
    </div>
  );
}
