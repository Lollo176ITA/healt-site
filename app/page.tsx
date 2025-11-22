"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[#0d131c]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#12223a] via-[#0d131c] to-[#0d131c] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,140,255,0.08),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(255,204,112,0.08),transparent_28%),radial-gradient(circle_at_60%_70%,rgba(82,255,197,0.06),transparent_26%)]" />

      <main className="relative mx-auto flex max-w-7xl flex-col gap-20 px-4 pb-20 pt-20 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center"
        >
          <div className="space-y-8">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-teal-100 border border-white/10 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Assistente salute proattivo
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl font-bold leading-tight sm:text-6xl tracking-tight text-white">
              La tua salute, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                gestita da un assistente dedicato
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-slate-300 leading-relaxed max-w-xl">
              Inserisci i dati essenziali, ottieni raccomandazioni di visite e
              richieste verso l&apos;ente salute con un flusso automatico e chiaro,
              senza dover gestire la complessità.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              {[
                "Profilazione personalizzata",
                "Agenda dinamica",
                "Richieste ente salute",
                "Tono clinico, output pronti",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/profilo"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-8 py-4 text-base font-semibold text-slate-900 transition-all hover:translate-y-[-2px] hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/20"
              >
                Crea foto del paziente
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/40"
              >
                Vai alla dashboard
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={fadeInUp}
            className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            <p className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-6 font-semibold">
              Come funziona
            </p>
            <div className="space-y-6">
              <div className="group rounded-2xl bg-white/5 p-5 transition-colors hover:bg-white/10 border border-transparent hover:border-white/5">
                <p className="text-emerald-300 text-xs font-bold uppercase tracking-[0.18em] mb-2">
                  1 · Foto iniziale
                </p>
                <p className="text-slate-200 leading-relaxed">
                  Inserisci età, sesso, cronico, allergie, regione e note. L&apos;assistente crea uno snapshot clinico essenziale.
                </p>
              </div>
              <div className="group rounded-2xl bg-white/5 p-5 transition-colors hover:bg-white/10 border border-transparent hover:border-white/5">
                <p className="text-sky-300 text-xs font-bold uppercase tracking-[0.18em] mb-2">
                  2 · Deleghe automatiche
                </p>
                <p className="text-slate-200 leading-relaxed">
                  Valutiamo rischi, suggeriamo le visite con priorità e chiediamo i referti all&apos;ente salute.
                </p>
              </div>
              <div className="group rounded-2xl bg-white/5 p-5 transition-colors hover:bg-white/10 border border-transparent hover:border-white/5">
                <p className="text-amber-300 text-xs font-bold uppercase tracking-[0.18em] mb-2">
                  3 · Azioni subito
                </p>
                <p className="text-slate-200 leading-relaxed">
                  La dashboard mostra visite consigliate e follow-up pronti da confermare.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-3"
        >
          {[
            {
              title: "Privacy-by-design",
              desc: "Nessun dato sensibile in chiaro. Le richieste a DataLink sono sintetiche.",
              icon: (
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ),
            },
            {
              title: "Agenda guidata",
              desc: "Visite con priorità alta/media/bassa e fasce temporali consigliate.",
              icon: (
                <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              title: "Tono clinico",
              desc: "Output concisi, in italiano, pronti per il medico e per il paziente.",
              icon: (
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={fadeInUp}
              className="group rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all hover:bg-white/[0.07] hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
              <p className="text-slate-300 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-400 font-semibold">
                Demo rapida
              </p>
              <h2 className="text-3xl font-bold text-white">
                Prova la dashboard con dati di esempio
              </h2>
              <p className="text-slate-300 max-w-xl">
                Vedi come l&apos;AI orchestra le visite e i dati in tempo reale.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-8 py-4 text-sm font-bold transition-all hover:bg-slate-200 hover:scale-105"
            >
              Apri dashboard
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
