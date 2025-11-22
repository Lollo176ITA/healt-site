import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

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

interface SlotsCardProps {
    slots: SlotPlan[];
}

export function SlotsCard({ slots }: SlotsCardProps) {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle>Slot pubblico/privato suggeriti</CardTitle>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-300 hidden sm:block">
                    Basati sulle visite da prenotare
                </span>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                    {slots.map((slot) => (
                        <div
                            key={slot.title}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5"
                        >
                            <h3 className="mb-4 text-lg font-semibold text-white">
                                {slot.title}
                            </h3>
                            <div className="space-y-3">
                                {slot.options.map((opt, idx) => (
                                    <div
                                        key={`${slot.title}-${idx}`}
                                        className="group relative overflow-hidden rounded-xl bg-white/5 p-4 transition-all hover:bg-white/10"
                                    >
                                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                        <div className="flex items-center justify-between mb-2">
                                            <span
                                                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${opt.channel === "pubblico"
                                                        ? "bg-sky-500/20 text-sky-200"
                                                        : "bg-purple-500/20 text-purple-200"
                                                    }`}
                                            >
                                                {opt.channel}
                                            </span>
                                            <span className="font-medium text-emerald-300">
                                                {opt.priceRange}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-200">
                                            <svg
                                                className="h-4 w-4 text-slate-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            Attesa: {opt.waitingTime}
                                        </div>
                                        <p className="mt-2 text-sm text-slate-400">{opt.notes}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
