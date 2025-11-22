import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.API_KEY,
});

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { form } = body as { form?: Record<string, unknown> };

    if (!client.apiKey) {
      return NextResponse.json(
        { result: fallback, error: "API key non configurata" },
        { status: 200 },
      );
    }

    const userContext = JSON.stringify(form ?? {}, null, 2);
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Sei un master orchestrator sanitario. Hai 3 agenti virtuali: Profilatore (sintetizza rischio, vincoli, gap dati), Schedulatore (propone visite con fascia temporale e priorità), DataLink (richiede dati all'ente salute e alert ai medici). Devi prendere l'iniziativa: orchestri i 3 agenti e restituisci SOLO un JSON con chiavi profileSummary, riskHighlights (array), recommendedVisits (array di {title,timeframe,reason,priority: alta|media|bassa}), dataPulls (array), proactiveMessage (frase). Rispondi in italiano, conciso ma clinico.",
        },
        {
          role: "user",
          content: `Dati paziente: ${userContext}. Non limitarti a riassumere; proponi azioni immediate.`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ result: fallback, error: "Nessun contenuto" });
    }

    let parsed: AgentResult = fallback;
    try {
      const raw = JSON.parse(content);
      parsed = normalizeResult(raw);
    } catch (err) {
      console.error("Errore parsing AI:", err);
    }

    return NextResponse.json({ result: parsed });
  } catch (err) {
    console.error("Errore generazione AI:", err);
    return NextResponse.json(
      { result: fallback, error: "Errore inatteso" },
      { status: 200 },
    );
  }
}

function normalizeResult(input: unknown): AgentResult {
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
      }))
      .slice(0, 5);
  };

  return {
    profileSummary: safeString(
      input?.profileSummary,
      fallback.profileSummary,
    ),
    riskHighlights:
      safeArray(input?.riskHighlights).length > 0
        ? safeArray(input?.riskHighlights)
        : fallback.riskHighlights,
    recommendedVisits:
      safeVisits(input?.recommendedVisits).length > 0
        ? safeVisits(input?.recommendedVisits)
        : fallback.recommendedVisits,
    dataPulls:
      safeArray(input?.dataPulls).length > 0
        ? safeArray(input?.dataPulls)
        : fallback.dataPulls,
    proactiveMessage:
      safeString(input?.proactiveMessage, fallback.proactiveMessage) ||
      fallback.proactiveMessage,
  };
}
