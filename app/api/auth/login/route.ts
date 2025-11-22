import { NextResponse } from "next/server";

const AUTH_BASE = "https://maturamente-api.onrender.com/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${AUTH_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = await parseSafe(res);
    return NextResponse.json(payload, { status: res.status });
  } catch (err) {
    console.error("Errore proxy login:", err);
    return NextResponse.json(
      { message: "Errore nel contattare il servizio di login" },
      { status: 500 },
    );
  }
}

async function parseSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    const text = await res.text();
    return { message: text || "Nessun contenuto" };
  }
}
