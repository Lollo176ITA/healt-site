import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Input, Select } from "@/app/components/ui/Form";

type AiVisit = {
    title: string;
    timeframe: string;
    reason: string;
    priority: "alta" | "media" | "bassa";
    category: "fortemente consigliata" | "routine" | "benessere" | "altre";
};

type VisitStatus = "non_fatta" | "fatta" | "da_prenotare";

type VisitSelection = {
    status: VisitStatus;
    when: string;
};

interface RecommendedVisitsCardProps {
    visits: AiVisit[];
    selections: Record<string, VisitSelection>;
    setSelections: React.Dispatch<
        React.SetStateAction<Record<string, VisitSelection>>
    >;
    generateSlots: () => void;
    loadingSlots: boolean;
}

export function RecommendedVisitsCard({
    visits,
    selections,
    setSelections,
    generateSlots,
    loadingSlots,
}: RecommendedVisitsCardProps) {
    const categories = [
        "fortemente consigliata",
        "routine",
        "benessere",
        "altre",
    ] as const;

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle>Visite consigliate</CardTitle>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-300 hidden sm:block">
                    Seleziona stato e genera slot
                </span>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                    {categories.map((cat) => {
                        const catVisits = visits.filter((v) => v.category === cat);
                        if (!catVisits.length) return null;

                        return (
                            <div
                                key={cat}
                                className="rounded-2xl border border-white/10 bg-white/5 p-4"
                            >
                                <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                                    {cat}
                                </p>
                                <div className="space-y-3">
                                    {catVisits.map((visit) => (
                                        <div
                                            key={visit.title}
                                            className="group rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/[0.07]"
                                        >
                                            <div className="mb-3">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <p className="text-xs text-slate-400">
                                                        {visit.timeframe}
                                                    </p>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${visit.priority === "alta"
                                                            ? "bg-red-500/20 text-red-200"
                                                            : visit.priority === "media"
                                                                ? "bg-amber-500/20 text-amber-200"
                                                                : "bg-emerald-500/20 text-emerald-200"
                                                            }`}
                                                    >
                                                        Priorità {visit.priority}
                                                    </span>
                                                </div>
                                                <h3 className="mt-1 text-base font-semibold text-white">
                                                    {visit.title}
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-300">
                                                    {visit.reason}
                                                </p>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr]">
                                                <Select
                                                    value={
                                                        selections[visit.title]?.status ?? "da_prenotare"
                                                    }
                                                    onChange={(e) =>
                                                        setSelections((prev) => ({
                                                            ...prev,
                                                            [visit.title]: {
                                                                status: e.target.value as VisitStatus,
                                                                when:
                                                                    e.target.value === "fatta"
                                                                        ? prev[visit.title]?.when ??
                                                                        "meno di 1 mese fa"
                                                                        : "",
                                                            },
                                                        }))
                                                    }
                                                    className="h-10 py-2 text-xs"
                                                >
                                                    <option value="da_prenotare">Da prenotare</option>
                                                    <option value="fatta">Già fatta</option>
                                                    <option value="non_fatta">Non fatta</option>
                                                </Select>

                                                {selections[visit.title]?.status === "fatta" && (
                                                    <Input
                                                        value={selections[visit.title]?.when ?? ""}
                                                        onChange={(e) =>
                                                            setSelections((prev) => ({
                                                                ...prev,
                                                                [visit.title]: {
                                                                    status:
                                                                        prev[visit.title]?.status ?? "da_prenotare",
                                                                    when: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                        placeholder="Quando?"
                                                        className="h-10 py-2 text-xs"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-6">
                    <p className="text-sm text-slate-300">
                        Segna lo stato delle visite, poi genera opzioni tra pubblico e
                        privato.
                    </p>
                    <Button
                        onClick={generateSlots}
                        disabled={loadingSlots}
                        className="w-full sm:w-auto"
                    >
                        {loadingSlots ? "Calcolo opzioni..." : "Genera slot e prezzi"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
