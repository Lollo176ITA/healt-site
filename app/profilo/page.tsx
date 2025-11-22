"use client";

import { useMemo, useState } from "react";

type FormData = {
  name: string;
  age: string;
  sex: string;
  chronic: string;
  allergies: string;
  region: string;
  other: string;
  goals: string[];
};

const goalOptions = [
  "Prevenzione",
  "Gestione cronica",
  "Sport",
  "Nutrizione",
  "Benessere mentale",
  "Ritorno al lavoro",
];

export default function ProfiloPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    age: "",
    sex: "",
    chronic: "",
    allergies: "",
    region: "",
    other: "",
    goals: ["Prevenzione"],
  });
  const [saving, setSaving] = useState(false);
  const readiness = useMemo(() => {
    const filled =
      form.age.trim() &&
      form.sex.trim() &&
      (form.chronic.trim() || form.allergies.trim() || form.other.trim());
    return filled ? "Pronto per orchestrare" : "Inserisci i dati base";
  }, [form]);

  const toggleGoal = (goal: string) => {
    setForm((prev) => {
      const exists = prev.goals.includes(goal);
      return {
        ...prev,
        goals: exists
          ? prev.goals.filter((item) => item !== goal)
          : [...prev.goals, goal],
      };
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Qui potresti salvare su backend o localStorage; usiamo alert per demo.
    alert("Profilo salvato (demo). Vai in dashboard per vedere le visite.");
    setSaving(false);
  };

  return (
    <div className="relative overflow-hidden bg-[#0d131c]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#12223a] via-[#0d131c] to-[#0d131c] opacity-80" />
      <main className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            Foto iniziale del paziente
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Inserisci i dati essenziali del profilo
          </h1>
          <p className="text-slate-200">
            Età, sesso, allergie, patologie croniche e altre note servono per
            personalizzare le raccomandazioni e le richieste verso l&apos;ente salute.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-teal-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Stato: {readiness}
          </div>
        </header>

        <form
          onSubmit={submit}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-200">
              Nome / Alias
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
                placeholder="Es. Marta R."
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              Età
              <input
                type="number"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
                placeholder="Es. 38"
                value={form.age}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, age: e.target.value }))
                }
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              Sesso
              <select
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
                value={form.sex}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, sex: e.target.value }))
                }
              >
                <option value="">Seleziona</option>
                <option value="femminile">Femminile</option>
                <option value="maschile">Maschile</option>
                <option value="non specificato">Non specificato</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              Regione
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
                placeholder="Es. Lombardia"
                value={form.region}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, region: e.target.value }))
                }
              />
            </label>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-200">
              Malattie croniche / familiarità
              <textarea
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
                placeholder="Es. asma, familiarità diabete"
                value={form.chronic}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, chronic: e.target.value }))
                }
              />
            </label>
            <label className="space-y-2 text-sm text-slate-200">
              Allergie note
              <textarea
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
                placeholder="Es. antibiotici beta-lattamici"
                value={form.allergies}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, allergies: e.target.value }))
                }
              />
            </label>
          </div>
          <div className="mt-4">
            <label className="space-y-2 text-sm text-slate-200">
              Altre info utili
              <textarea
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
                placeholder="Stile di vita, sport, preferenze, vincoli orari"
                value={form.other}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, other: e.target.value }))
                }
              />
            </label>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-slate-200">
              Obiettivi principali (seleziona più elementi)
            </p>
            <div className="flex flex-wrap gap-2">
              {goalOptions.map((goal) => {
                const active = form.goals.includes(goal);
                return (
                  <button
                    type="button"
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      active
                        ? "bg-emerald-400 text-slate-900"
                        : "bg-white/10 text-slate-100 hover:bg-white/20"
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300">
              Dopo il salvataggio, vai in dashboard per generare le visite
              consigliate con gli agenti.
            </p>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:translate-y-[-1px] hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Salvataggio..." : "Salva profilo"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
