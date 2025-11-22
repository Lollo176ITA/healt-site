"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login demo: nessuna autenticazione reale implementata.");
  };

  return (
    <div className="relative overflow-hidden bg-[#0d131c]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#12223a] via-[#0d131c] to-[#0d131c] opacity-80" />
      <main className="relative mx-auto flex min-h-[80vh] max-w-3xl flex-col gap-8 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            Accesso
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Entra e riprendi la tua regia AI
          </h1>
          <p className="text-slate-200">
            Questa è una pagina demo: usa qualsiasi email e password per vedere
            la dashboard. In produzione collegheresti IdP o auth custom.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur"
        >
          <label className="space-y-2 text-sm text-slate-200">
            Email
            <input
              type="email"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
              placeholder="tu@esempio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Password
            <input
              type="password"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-white/10"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember">Ricordami per 14 giorni</label>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:translate-y-[-1px] hover:bg-emerald-300"
          >
            Accedi
          </button>
          <p className="text-center text-xs text-slate-300">
            Nessun account? <a href="/profilo" className="text-emerald-200">Crea foto paziente</a>
          </p>
        </form>
      </main>
    </div>
  );
}
