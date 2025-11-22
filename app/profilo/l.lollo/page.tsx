export default function LLolloProfile() {
  return (
    <div className="relative overflow-hidden bg-[#0d131c]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#12223a] via-[#0d131c] to-[#0d131c] opacity-80" />
      <main className="relative mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            Profilo utente
          </p>
          <h1 className="text-3xl font-semibold text-white">l.lollo</h1>
          <p className="text-slate-200">
            Dati ancora da inserire. Completa le informazioni di base per poter
            ricevere raccomandazioni e richieste verso l&apos;ente salute.
          </p>
        </div>

        <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-slate-200">
          Nessuna informazione salvata. Vai su{" "}
          <a className="text-emerald-200 underline" href="/crea-profilo">
            crea profilo
          </a>{" "}
          per compilare i dati di l.lollo.
        </div>
      </main>
    </div>
  );
}
