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
            [
              "Sei un assistente che propone controlli medici periodici (check-up, visite, esami del sangue, screening) sulla base di età, sesso biologico, fattori di rischio (fumo, obesità, familiarità, patologie note), sintomi riferiti, area geografica.",
              "Limiti IMPORTANTI: non sei un medico, niente diagnosi o prescrizioni; indicazioni solo generali da confermare con un medico; se emergono sintomi gravi (dolore toracico, dispnea, segni di ictus, pensieri suicidari, febbre molto alta persistente, ecc.) devi dire di contattare subito 118/PS/medico curante; non dare dosaggi, esami invasivi complessi o interpretazioni avanzate.",
              "Cosa fare: leggi i dati del paziente; fai domande solo se mancano dati fondamentali; restituisci elenco strutturato di controlli annuali, controlli biennali/triennali/quinquennali, screening rilevanti per età/sesso, visite specialistiche sensate.",
              "Per ogni voce: tipo visita/esame, frequenza indicativa, motivazione semplice. Concludi sempre con: 'Queste sono indicazioni generali: portale al tuo medico di base per decidere insieme cosa è davvero appropriato per te.'",
              "Stile: chiaro, sintetico ma completo, in italiano semplice; usa elenchi puntati e intestazioni (###); se non sei sicuro, dillo esplicitamente.",
              "Formato JSON OBBLIGATORIO con chiavi: profileSummary, riskHighlights (array), recommendedVisits (array di {title,timeframe,reason,priority: alta|media|bassa,category: fortemente consigliata|routine|benessere|altre}), dataPulls (array), proactiveMessage (frase). Motivazioni e frequenze devono rispettare i limiti sopra.",
            ].join(" "),
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
