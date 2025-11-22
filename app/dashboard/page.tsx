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

type AiVisit = {
  title: string;
  timeframe: string;
  reason: string;
  priority: "alta" | "media" | "bassa";
};

type AgentResult = {
  profileSummary: string;
  riskHighlights: string[];
  recommendedVisits: AiVisit[];
  dataPulls: string[];
  proactiveMessage: string;
};

const defaultResult: AgentResult = {
  profileSummary:
    "Donna, 38 anni, vive in Lombardia. Profilo con allergia agli antibiotici, familiarità per diabete e stile di vita attivo ma con stress lavorativo alto.",
  riskHighlights: [
    "Monitorare glicemia e pressione per familiarità diabetica.",
    "Allergia documentata agli antibiotici: ricordare alert ai medici curanti.",
    "Stress cronico: inserire follow-up su sonno e cortisolo.",
  ],
  recommendedVisits: [
    {
      title: "Visita di controllo medicina generale",
      timeframe: "entro 2 settimane",
      reason: "Allineare storico allergie e valutare stress cronico.",
      priority: "alta",
    },
    {
      title: "Screening metabolico",
      timeframe: "entro 1 mese",
      reason: "Familiarità per diabete: glicemia, HbA1c, profilo lipidico.",
      priority: "media",
    },
    {
      title: "Counseling benessere",
      timeframe: "dopo 6 settimane",
      reason: "Gestione stress + sonno: proporre percorso breve con follow-up.",
      priority: "bassa",
    },
  ],
  dataPulls: [
    "Richiesta a ente salute: ultimi 12 mesi di referti ematici e ECG.",
    "Alert condiviso ai medici: allergia antibiotici da confermare in cartella.",
  ],
  proactiveMessage:
    "Ho già preparato un piano visite personalizzato e richiesto i dati all'ente salute. Pronta a prenotare lo slot con priorità più alta e a proporre follow-up automatici.",
};

export default function DashboardPage() {
  const [form, setForm] = useState<FormData>({
    name: "Marta R.",
    age: "38",
    sex: "femminile",
    chronic: "Asma moderata, familiarità diabete.",
    allergies: "Allergia antibiotici beta-lattamici.",
    region: "Lombardia",
    other: "Sport 2x settimana, lavoro stressante, poco sonno.",
    goals: ["Prevenzione", "Gestione cronica"],
  });
  const [result, setResult] = useState<AgentResult>(defaultResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readiness = useMemo(() => {
    const filled =
      form.age.trim() &&
      form.sex.trim() &&
      (form.chronic.trim() || form.allergies.trim() || form.other.trim());
    return filled ? "Pronto per orchestrare" : "Inserisci i dati base";
  }, [form]);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/multilayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });

      if (!response.ok) {
        throw new Error("Impossibile generare il piano adesso");
      }

      const data = await response.json();
      setResult(data.result as AgentResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Si è verificato un problema inatteso",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#0d131c]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#12223a] via-[#0d131c] to-[#0d131c] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,140,255,0.08),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(255,204,112,0.08),transparent_28%),radial-gradient(circle_at_60%_70%,rgba(82,255,197,0.06),transparent_26%)]" />
      <main className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            Dashboard paziente
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Agenda visite e dati sempre allineati
          </h1>
          <p className="text-slate-200">
            Compila o aggiorna il profilo, poi genera un piano con sintesi
            clinica, visite consigliate e richieste verso l&apos;ente salute.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-teal-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Stato: {readiness}
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Dati del paziente
              </h2>
              <a
                href="/profilo"
                className="text-sm text-emerald-200 hover:text-emerald-100"
              >
                Modifica profilo →
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nome / Alias" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
              <Field
                label="Età"
                type="number"
                value={form.age}
                onChange={(v) => setForm((p) => ({ ...p, age: v }))}
              />
              <Select
                label="Sesso"
                value={form.sex}
                onChange={(v) => setForm((p) => ({ ...p, sex: v }))}
              >
                <option value="">Seleziona</option>
                <option value="femminile">Femminile</option>
                <option value="maschile">Maschile</option>
                <option value="non specificato">Non specificato</option>
              </Select>
              <Field
                label="Regione"
                value={form.region}
                onChange={(v) => setForm((p) => ({ ...p, region: v }))}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextArea
                label="Malattie croniche / familiarità"
                value={form.chronic}
                onChange={(v) => setForm((p) => ({ ...p, chronic: v }))}
              />
              <TextArea
                label="Allergie note"
                value={form.allergies}
                onChange={(v) => setForm((p) => ({ ...p, allergies: v }))}
              />
            </div>
            <TextArea
              label="Altre info utili"
              value={form.other}
              onChange={(v) => setForm((p) => ({ ...p, other: v }))}
            />
            <div className="flex flex-wrap gap-2 pt-2">
              {["Prevenzione", "Gestione cronica", "Sport", "Nutrizione", "Benessere mentale"].map((goal) => {
                const active = form.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        goals: active
                          ? prev.goals.filter((g) => g !== goal)
                          : [...prev.goals, goal],
                      }))
                    }
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
            <button
              onClick={submit}
              disabled={loading}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:translate-y-[-1px] hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sto orchestrando..." : "Genera piano con AI"}
            </button>
            {error && (
              <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error} — uso fallback locale.
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Sintesi del profilo
                </h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-200">
                  Snapshot
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-100">
                {result.profileSummary}
              </p>
              <div className="mt-4 space-y-2">
                {result.riskHighlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-100"
                  >
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Dati richiesti all&apos;ente salute
                </h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-200">
                  Richieste
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-100">
                {result.dataPulls.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl bg-white/5 px-3 py-2 leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-emerald-200">
                {result.proactiveMessage}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Visite consigliate
            </h2>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-300">
              Azioni proattive
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {result.recommendedVisits.map((visit) => (
              <div
                key={visit.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/8 to-white/0 p-5"
              >
                <div className="absolute right-3 top-3 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">
                  Priorità {visit.priority}
                </div>
                <p className="text-sm uppercase tracking-[0.15em] text-slate-300">
                  {visit.timeframe}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {visit.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-100">
                  {visit.reason}
                </p>
                <button className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-200 hover:text-emerald-100">
                  Prenota subito →
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
};

function Field({ label, value, onChange, type = "text" }: FieldProps) {
  return (
    <label className="space-y-2 text-sm text-slate-200">
      {label}
      <input
        type={type}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function TextArea({ label, value, onChange }: TextAreaProps) {
  return (
    <label className="space-y-2 text-sm text-slate-200">
      {label}
      <textarea
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

type SelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
};

function Select({ label, value, onChange, children }: SelectProps) {
  return (
    <label className="space-y-2 text-sm text-slate-200">
      {label}
      <select
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </label>
  );
}
