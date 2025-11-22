"use client";

import { useEffect, useMemo, useState } from "react";
import { PatientDataCard } from "./components/PatientDataCard";
import { ProfileSummaryCard } from "./components/ProfileSummaryCard";
import { RecommendedVisitsCard } from "./components/RecommendedVisitsCard";
import { SlotsCard } from "./components/SlotsCard";

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
  category: "fortemente consigliata" | "routine" | "benessere" | "altre";
};

type AgentResult = {
  profileSummary: string;
  riskHighlights: string[];
  recommendedVisits: AiVisit[];
  dataPulls: string[];
  proactiveMessage: string;
};

type VisitStatus = "non_fatta" | "fatta" | "da_prenotare";

type VisitSelection = {
  status: VisitStatus;
  when: string;
};

type SlotOption = {
  channel: "pubblico" | "privato";
  waitingTime: string;
  priceRange: string;
  notes: string;
};

type SlotPlan = {
  title: string;
  options: SlotOption[];
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
      category: "fortemente consigliata",
    },
    {
      title: "Screening metabolico",
      timeframe: "entro 1 mese",
      reason: "Familiarità per diabete: glicemia, HbA1c, profilo lipidico.",
      priority: "media",
      category: "routine",
    },
    {
      title: "Counseling benessere",
      timeframe: "dopo 6 settimane",
      reason: "Gestione stress + sonno: proporre percorso breve con follow-up.",
      priority: "bassa",
      category: "benessere",
    },
  ],
  dataPulls: [
    "Richiesta a ente salute: ultimi 12 mesi di referti ematici e ECG.",
    "Alert condiviso ai medici: allergia antibiotici da confermare in cartella.",
  ],
  proactiveMessage:
    "Ho già preparato un piano visite personalizzato e richiesto i dati all'ente salute. Pronta a prenotare lo slot con priorità più alta e a proporre follow-up automatici.",
};

declare global {
  interface Window {
    enteSalute: {
      segnala: (evento: string) => void;
    };
  }
}

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
  const [selections, setSelections] = useState<Record<string, VisitSelection>>(
    {}
  );
  const [slots, setSlots] = useState<SlotPlan[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [healthEvents, setHealthEvents] = useState<string[]>([]);

  const readiness = useMemo(() => {
    const filled =
      form.age.trim() &&
      form.sex.trim() &&
      (form.chronic.trim() || form.allergies.trim() || form.other.trim());
    return filled ? "Pronto per orchestrare" : "Inserisci i dati base";
  }, [form]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAuthed(Boolean(token));
    const savedProfile = localStorage.getItem("patientProfile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as FormData;
        setForm(parsed);
      } catch {
        // ignore parsing errors
      }
    }

    // Setup Ente Salute Console Interface
    window.enteSalute = {
      segnala: (evento: string) => {
        console.log(`%c[Ente Salute] Segnalazione ricevuta: ${evento}`, "color: #10b981; font-weight: bold;");
        setHealthEvents((prev) => [...prev, evento]);
      },
    };

    console.log(
      "%c[Ente Salute] Console pronta. Usa window.enteSalute.segnala('evento') per simulare nuovi dati.",
      "color: #3b82f6; font-weight: bold;"
    );

    return () => {
      // Cleanup if needed, though usually not strictly necessary for window props in this context
    };
  }, []);

  // Trigger update when healthEvents change
  useEffect(() => {
    if (healthEvents.length > 0) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [healthEvents]);

  const submit = async () => {
    setLoading(true);
    setError(null);
    setSlots(null);
    try {
      const response = await fetch("/api/multilayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, healthEvents }),
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
          : "Si è verificato un problema inatteso"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateSlots = async () => {
    setLoadingSlots(true);
    setError(null);
    try {
      const visitsPayload = result.recommendedVisits.map((visit) => {
        const sel = selections[visit.title];
        return {
          title: visit.title,
          status: sel?.status ?? "da_prenotare",
          when: sel?.when ?? "",
        };
      });

      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visits: visitsPayload }),
      });
      if (!res.ok) throw new Error("Impossibile generare slot");
      const data = await res.json();
      setSlots(data.slots as SlotPlan[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Si è verificato un problema inatteso"
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d131c]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#12223a] via-[#0d131c] to-[#0d131c] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,140,255,0.08),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(255,204,112,0.08),transparent_28%),radial-gradient(circle_at_60%_70%,rgba(82,255,197,0.06),transparent_26%)]" />

      <main className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <header className="space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                Dashboard paziente
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Agenda visite e dati
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {healthEvents.length > 0 && (
                <div className="animate-pulse rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-200 border border-red-500/30">
                  {healthEvents.length} Nuovi eventi clinici
                </div>
              )}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200 border border-white/10 backdrop-blur-sm">
                <span className={`h-2 w-2 rounded-full ${readiness.includes("Pronto") ? "bg-emerald-400" : "bg-amber-400"}`} />
                <span className="font-medium">Stato: {readiness}</span>
              </div>
            </div>
          </div>
          <p className="max-w-2xl text-lg text-slate-300">
            Compila o aggiorna il profilo, poi genera un piano con sintesi
            clinica, visite consigliate e richieste verso l&apos;ente salute.
          </p>

          {!authed && (
            <div className="inline-block rounded-xl border border-amber-300/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Effettua il login per usare la dashboard e generare le visite.
            </div>
          )}
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-8">
            <PatientDataCard
              form={form}
              setForm={setForm}
              loading={loading}
              submit={submit}
              error={error}
            />
          </div>

          <div className="space-y-8">
            <ProfileSummaryCard
              summary={result.profileSummary}
              risks={result.riskHighlights}
              dataPulls={result.dataPulls}
              proactiveMessage={result.proactiveMessage}
            />
          </div>
        </div>

        <div className="space-y-8">
          <RecommendedVisitsCard
            visits={result.recommendedVisits}
            selections={selections}
            setSelections={setSelections}
            generateSlots={generateSlots}
            loadingSlots={loadingSlots}
          />

          {slots && <SlotsCard slots={slots} />}
        </div>
      </main>
    </div>
  );
}
