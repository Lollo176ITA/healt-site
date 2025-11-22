import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.API_KEY,
});

type VisitCategory =
  | "fortemente consigliata"
  | "routine"
  | "benessere"
  | "altre";

type AiVisit = {
  title: string;
  timeframe: string;
  reason: string;
  priority: "alta" | "media" | "bassa";
  category: VisitCategory;
};

type AgentResult = {
  profileSummary: string;
  riskHighlights: string[];
  recommendedVisits: AiVisit[];
  dataPulls: string[];
  proactiveMessage: string;
};

const fallback: AgentResult = {
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

// --- AGENTS ---

async function profilerAgent(userContext: string): Promise<{ summary: string; risks: string[] }> {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Sei il Profiler Agent. Il tuo compito è analizzare i dati grezzi del paziente ed estrarre un profilo clinico sintetico e una lista di fattori di rischio. Restituisci JSON con chiavi 'summary' (stringa) e 'risks' (array di stringhe).",
      },
      {
        role: "user",
        content: `Dati paziente: ${userContext}`,
      },
    ],
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Profiler failed");
  return JSON.parse(content);
}

async function healthEntityAgent(events: string[]): Promise<{ dataPulls: string[]; context: string }> {
  if (!events || events.length === 0) {
    return {
      dataPulls: ["Richiesta standard: ultimi 12 mesi di referti ematici."],
      context: "Nessun evento acuto segnalato.",
    };
  }

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Sei l'Ente Salute Agent. Analizzi eventi clinici segnalati in tempo reale (es. 'attacco di cuore', 'aritmia') e simuli il recupero di dati pertinenti dai sistemi ospedalieri. Restituisci JSON con 'dataPulls' (array di stringhe che descrivono i dati recuperati) e 'context' (stringa che riassume la situazione clinica esterna).",
      },
      {
        role: "user",
        content: `Eventi segnalati: ${JSON.stringify(events)}`,
      },
    ],
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Health Entity failed");
  return JSON.parse(content);
}

async function plannerAgent(
  profile: { summary: string; risks: string[] },
  healthData: { dataPulls: string[]; context: string }
): Promise<{ recommendedVisits: AiVisit[]; proactiveMessage: string }> {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Sei il Planner Agent. Generi un piano di visite mediche basato sul profilo del paziente e sui dati dell'ente salute. Se ci sono eventi acuti (es. attacco di cuore), dai priorità assoluta ai controlli correlati. Restituisci JSON con 'recommendedVisits' (array di oggetti {title, timeframe, reason, priority, category}) e 'proactiveMessage' (messaggio finale all'utente).",
      },
      {
        role: "user",
        content: `Profilo: ${JSON.stringify(profile)}. Dati Ente Salute: ${JSON.stringify(healthData)}.`,
      },
    ],
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Planner failed");
  return JSON.parse(content);
}

// --- MASTER AGENT (Orchestrator) ---

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { form, healthEvents } = body as { form?: Record<string, unknown>; healthEvents?: string[] };

    if (!client.apiKey) {
      return NextResponse.json(
        { result: fallback, error: "API key non configurata" },
        { status: 200 },
      );
    }

    const userContext = JSON.stringify(form ?? {}, null, 2);

    // Parallel execution of Profiler and Health Entity
    const [profileResult, healthResult] = await Promise.all([
      profilerAgent(userContext),
      healthEntityAgent(healthEvents ?? []),
    ]);

    // Sequential execution of Planner (needs previous outputs)
    const plannerResult = await plannerAgent(profileResult, healthResult);

    // Aggregate results
    const finalResult: AgentResult = {
      profileSummary: profileResult.summary,
      riskHighlights: profileResult.risks,
      dataPulls: healthResult.dataPulls,
      recommendedVisits: plannerResult.recommendedVisits,
      proactiveMessage: plannerResult.proactiveMessage,
    };

    // Normalize to ensure safety
    const normalized = normalizeResult(finalResult);

    return NextResponse.json({ result: normalized });
  } catch (err) {
    console.error("Errore Master Agent:", err);
    return NextResponse.json(
      { result: fallback, error: "Errore orchestrazione AI" },
      { status: 200 },
    );
  }
}

function normalizeResult(input: unknown): AgentResult {
  const raw = input as any;
  const safeString = (value: unknown, fallbackValue = "") =>
    typeof value === "string" ? value : JSON.stringify(value ?? fallbackValue);

  const safeArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value.map((item) => safeString(item));
  };

  const safeVisits = (value: unknown): AiVisit[] => {
    if (!Array.isArray(value)) return [];
    return value
      .map((visit) => ({
        title: safeString(visit?.title, "Visita"),
        timeframe: safeString(visit?.timeframe, "entro 1 mese"),
        reason: safeString(visit?.reason, "Motivo non specificato"),
        priority:
          visit?.priority === "alta" ||
            visit?.priority === "media" ||
            visit?.priority === "bassa"
            ? visit.priority
            : "media",
        category:
          visit?.category === "fortemente consigliata" ||
            visit?.category === "routine" ||
            visit?.category === "benessere" ||
            visit?.category === "altre"
            ? visit.category
            : "fortemente consigliata",
      }))
      .slice(0, 5);
  };

  return {
    profileSummary: safeString(
      raw?.profileSummary,
      fallback.profileSummary,
    ),
    riskHighlights:
      safeArray(raw?.riskHighlights).length > 0
        ? safeArray(raw?.riskHighlights)
        : fallback.riskHighlights,
    recommendedVisits:
      safeVisits(raw?.recommendedVisits).length > 0
        ? safeVisits(raw?.recommendedVisits)
        : fallback.recommendedVisits,
    dataPulls:
      safeArray(raw?.dataPulls).length > 0
        ? safeArray(raw?.dataPulls)
        : fallback.dataPulls,
    proactiveMessage:
      safeString(raw?.proactiveMessage, fallback.proactiveMessage) ||
      fallback.proactiveMessage,
  };
}
