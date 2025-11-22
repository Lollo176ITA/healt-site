import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.API_KEY,
});

type VisitRequest = {
  title: string;
  status: "fatta" | "non_fatta" | "da_prenotare";
  when?: string;
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

const fallback: SlotPlan[] = [
  {
    title: "Visita di controllo medicina generale",
    options: [
      {
        channel: "pubblico",
        waitingTime: "7-14 giorni",
        priceRange: "ticket standard",
        notes: "Prima disponibilità in ASL locale.",
      },
      {
        channel: "privato",
        waitingTime: "48-72 ore",
        priceRange: "€60-80",
        notes: "Studio convenzionato, include follow-up telefonico.",
      },
    ],
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { visits } = body as { visits?: VisitRequest[] };

    if (!client.apiKey) {
      return NextResponse.json({ slots: fallback, error: "API key mancante" });
    }

    const visitsText = JSON.stringify(visits ?? [], null, 2);
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Sei un assistente sanitario. Ricevi visite con stato fatta/non_fatta/da_prenotare e quando è stata fatta. Per le visite da_prenotare genera opzioni di prenotazione pubblico e privato con waitingTime, priceRange, notes. Rispondi SOLO con JSON {slots:[{title, options:[{channel:'pubblico'|'privato', waitingTime, priceRange, notes}]}]}",
        },
        {
          role: "user",
          content: `Visite e stato: ${visitsText}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ slots: fallback, error: "Nessun contenuto" });
    }

    let parsed: SlotPlan[] = fallback;
    try {
      const raw = JSON.parse(content);
      parsed = normalizeSlots(raw);
    } catch (err) {
      console.error("Errore parsing slots:", err);
    }

    return NextResponse.json({ slots: parsed });
  } catch (err) {
    console.error("Errore generazione slots:", err);
    return NextResponse.json({ slots: fallback, error: "Errore inatteso" });
  }
}

function normalizeSlots(input: unknown): SlotPlan[] {
  if (!input || typeof input !== "object") return fallback;
  const rawSlots = (input as { slots?: unknown }).slots;
  if (!Array.isArray(rawSlots)) return fallback;

  return rawSlots
    .map((slot) => {
      const title =
        typeof slot?.["title"] === "string"
          ? slot.title
          : JSON.stringify(slot?.["title"] ?? "Visita");
      const optionsRaw = slot?.["options"];
      const options: SlotOption[] = Array.isArray(optionsRaw)
        ? optionsRaw
            .map((opt) => {
              const channel =
                opt?.["channel"] === "pubblico" ||
                opt?.["channel"] === "privato"
                  ? opt.channel
                  : "pubblico";
              const waitingTime =
                typeof opt?.["waitingTime"] === "string"
                  ? opt.waitingTime
                  : "entro 2 settimane";
              const priceRange =
                typeof opt?.["priceRange"] === "string"
                  ? opt.priceRange
                  : "ticket standard";
              const notes =
                typeof opt?.["notes"] === "string"
                  ? opt.notes
                  : "Disponibilità soggetta a conferma.";
              return { channel, waitingTime, priceRange, notes };
            })
            .slice(0, 6)
        : [];

      return {
        title,
        options: options.length ? options : fallback[0].options,
      };
    })
    .slice(0, 6);
}
