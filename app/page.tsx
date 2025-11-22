export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[#0d131c]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#12223a] via-[#0d131c] to-[#0d131c] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,140,255,0.08),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(255,204,112,0.08),transparent_28%),radial-gradient(circle_at_60%_70%,rgba(82,255,197,0.06),transparent_26%)]" />
      <main className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-teal-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Assistente salute proattivo
            </div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              La tua salute, gestita da un assistente dedicato
            </h1>
            <p className="text-lg text-slate-200">
              Inserisci i dati essenziali, ottieni raccomandazioni di visite e
              richieste verso l&apos;ente salute con un flusso automatico e chiaro,
              senza dover gestire la complessità.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                "Profilazione personalizzata",
                "Agenda dinamica",
                "Richieste ente salute",
                "Tono clinico, output pronti",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-100"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/profilo"
                className="inline-flex items-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:translate-y-[-1px] hover:bg-emerald-300"
              >
                Crea foto del paziente
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40"
              >
                Vai alla dashboard
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
              Come funziona
            </p>
            <div className="mt-4 space-y-4 text-sm text-slate-100">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-emerald-200 text-xs font-semibold uppercase tracking-[0.18em]">
                  1 · Foto iniziale
                </p>
                <p className="mt-2">
                  Inserisci età, sesso, cronico, allergie, regione e note. L&apos;assistente crea uno snapshot clinico essenziale.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sky-200 text-xs font-semibold uppercase tracking-[0.18em]">
                  2 · Deleghe automatiche
                </p>
                <p className="mt-2">
                  Valutiamo rischi, suggeriamo le visite con priorità e chiediamo i referti all&apos;ente salute.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-amber-200 text-xs font-semibold uppercase tracking-[0.18em]">
              3 · Azioni subito
                </p>
                <p className="mt-2">
                  La dashboard mostra visite consigliate e follow-up pronti da confermare.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Privacy-by-design",
              desc: "Nessun dato sensibile in chiaro. Le richieste a DataLink sono sintetiche.",
            },
            {
              title: "Agenda guidata",
              desc: "Visite con priorità alta/media/bassa e fasce temporali consigliate.",
            },
            {
              title: "Tono clinico",
              desc: "Output concisi, in italiano, pronti per il medico e per il paziente.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            >
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-100">{card.desc}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
                Demo rapida
              </p>
              <h2 className="text-2xl font-semibold text-white">
                Prova la dashboard con dati di esempio
              </h2>
            </div>
            <a
              href="/dashboard"
              className="inline-flex items-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
            >
              Apri dashboard
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
