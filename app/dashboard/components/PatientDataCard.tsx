import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Input, Select, Textarea } from "@/app/components/ui/Form";
import Link from "next/link";

type FormData = {
    name: string;
    age: string;
    sex: string;
    chronic: string;
    allergies: string;
    region: string;
    other: string;
    goals: string[];
};

interface PatientDataCardProps {
    form: FormData;
    setForm: React.Dispatch<React.SetStateAction<FormData>>;
    loading: boolean;
    submit: () => void;
    error: string | null;
}

export function PatientDataCard({
    form,
    setForm,
    loading,
    submit,
    error,
}: PatientDataCardProps) {
    const toggleGoal = (goal: string) => {
        setForm((prev) => {
            const exists = prev.goals.includes(goal);
            return {
                ...prev,
                goals: exists
                    ? prev.goals.filter((item) => item !== goal)
                    : [...prev.goals, goal],
            };
        });
    };

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Dati del paziente</CardTitle>
                <Link
                    href="/profilo"
                    className="text-sm text-emerald-200 hover:text-emerald-100 transition-colors"
                >
                    Modifica profilo →
                </Link>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <Input
                        label="Nome / Alias"
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                    />
                    <Input
                        label="Età"
                        type="number"
                        value={form.age}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, age: e.target.value }))
                        }
                    />
                    <Select
                        label="Sesso"
                        value={form.sex}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, sex: e.target.value }))
                        }
                    >
                        <option value="">Seleziona</option>
                        <option value="femminile">Femminile</option>
                        <option value="maschile">Maschile</option>
                        <option value="non specificato">Non specificato</option>
                    </Select>
                    <Input
                        label="Regione"
                        value={form.region}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, region: e.target.value }))
                        }
                    />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Textarea
                        label="Malattie croniche / familiarità"
                        value={form.chronic}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, chronic: e.target.value }))
                        }
                    />
                    <Textarea
                        label="Allergie note"
                        value={form.allergies}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, allergies: e.target.value }))
                        }
                    />
                </div>
                <Textarea
                    label="Altre info utili"
                    value={form.other}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, other: e.target.value }))
                    }
                />
                <div className="space-y-2">
                    <p className="text-sm text-slate-200">Obiettivi</p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "Prevenzione",
                            "Gestione cronica",
                            "Sport",
                            "Nutrizione",
                            "Benessere mentale",
                        ].map((goal) => {
                            const active = form.goals.includes(goal);
                            return (
                                <button
                                    key={goal}
                                    type="button"
                                    onClick={() => toggleGoal(goal)}
                                    className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${active
                                            ? "bg-emerald-400 text-slate-900 shadow-lg shadow-emerald-400/20"
                                            : "bg-white/10 text-slate-100 hover:bg-white/20"
                                        }`}
                                >
                                    {goal}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="pt-4">
                    <Button
                        onClick={submit}
                        disabled={loading}
                        className="w-full sm:w-auto"
                    >
                        {loading ? "Sto orchestrando..." : "Genera piano con AI"}
                    </Button>
                </div>
                {error && (
                    <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200 border border-red-500/20">
                        {error} — uso fallback locale.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
