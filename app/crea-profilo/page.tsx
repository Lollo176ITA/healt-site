"use client";

import { useState } from "react";

export default function CreaProfiloPage() {
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    alert("Funzionalità non attiva in questa demo.");
    setSaving(false);
  };

  return (
    <div className="relative overflow-hidden bg-[#0d131c]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#12223a] via-[#0d131c] to-[#0d131c] opacity-80" />
      <main className="relative mx-auto flex max-w-4xl flex-col gap-8 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            Crea profilo
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Inizia con le tue informazioni di base
          </h1>
          <p className="text-slate-200">
            Questa pagina è una demo non ancora collegata: puoi esplorare i
            campi, ma il salvataggio non è attivo.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome / Alias" placeholder="Es. l.lollo" />
            <Field label="Età" placeholder="Es. 32" type="number" />
            <Field label="Sesso" placeholder="Es. maschile" />
            <Field label="Regione" placeholder="Es. Lazio" />
          </div>
          <TextArea
            label="Malattie croniche / familiarità"
            placeholder="Es. asma, familiarità diabete"
          />
          <TextArea label="Allergie note" placeholder="Es. antibiotici beta-lattamici" />
          <TextArea
            label="Altre info utili"
            placeholder="Stile di vita, sport, vincoli orari"
          />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "..." : "Salva (non attivo)"}
          </button>
        </form>
      </main>
    </div>
  );
}

type FieldProps = {
  label: string;
  placeholder?: string;
  type?: string;
};

function Field({ label, placeholder, type = "text" }: FieldProps) {
  return (
    <label className="space-y-2 text-sm text-slate-200">
      {label}
      <input
        type={type}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
        placeholder={placeholder}
      />
    </label>
  );
}

type TextAreaProps = {
  label: string;
  placeholder?: string;
};

function TextArea({ label, placeholder }: TextAreaProps) {
  return (
    <label className="space-y-2 text-sm text-slate-200">
      {label}
      <textarea
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-2"
        placeholder={placeholder}
      />
    </label>
  );
}
