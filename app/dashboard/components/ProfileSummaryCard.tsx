import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";

interface ProfileSummaryCardProps {
    summary: string;
    risks: string[];
    dataPulls: string[];
    proactiveMessage: string;
}

export function ProfileSummaryCard({
    summary,
    risks,
    dataPulls,
    proactiveMessage,
}: ProfileSummaryCardProps) {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg">Sintesi del profilo</CardTitle>
                    <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-200">
                        Snapshot
                    </span>
                </CardHeader>
                <CardContent>
                    <p className="text-sm leading-relaxed text-slate-100">{summary}</p>
                    <div className="mt-4 space-y-2">
                        {risks.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-100 transition-colors hover:bg-white/10"
                            >
                                <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg">
                        Dati richiesti all&apos;ente salute
                    </CardTitle>
                    <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-200">
                        Richieste
                    </span>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 text-sm text-slate-100">
                        {dataPulls.map((item, i) => (
                            <li
                                key={i}
                                className="rounded-xl bg-white/5 px-3 py-2 leading-relaxed transition-colors hover:bg-white/10"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">
                        <p className="text-sm text-emerald-200">{proactiveMessage}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
