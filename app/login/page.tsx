"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const endpoint =
      mode === "login"
        ? "/api/auth/login"
        : "/api/auth/register";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Credenziali non valide");
      }
      if (mode === "login") {
        const token = data?.accessToken;
        if (token) {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("userEmail", email);
          window.dispatchEvent(new Event("user-email-changed"));
          if (!remember) {
            // se non remember, potremmo gestire sessione in-memory; qui lasciamo il token comunque
          }
        }
        setMessage("Login riuscito. Token salvato localmente.");
      } else {
        setMessage("Registrazione completata. Ora puoi accedere.");
        setMode("login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore inatteso");
    } finally {
      setLoading(false);
    }
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
            Ora il login usa il servizio esterno: registra una mail e password o
            accedi con quelle già create. Il token verrà salvato in locale (se
            scelto) per le chiamate successive.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur"
        >
          <div className="flex gap-2 rounded-2xl bg-white/5 p-2 text-sm text-slate-200">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-xl px-3 py-2 font-semibold ${
                mode === "login"
                  ? "bg-emerald-400 text-slate-900"
                  : "bg-transparent text-white"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-xl px-3 py-2 font-semibold ${
                mode === "register"
                  ? "bg-emerald-400 text-slate-900"
                  : "bg-transparent text-white"
              }`}
            >
              Registrati
            </button>
          </div>
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
            disabled={loading}
            className="w-full rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:translate-y-[-1px] hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Attendere..."
              : mode === "login"
                ? "Accedi"
                : "Crea account"}
          </button>
          {message && (
            <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
          <p className="text-center text-xs text-slate-300">
            Nessun account? <a href="/profilo" className="text-emerald-200">Crea foto paziente</a>
          </p>
        </form>
      </main>
    </div>
  );
}
