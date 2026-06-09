import type { CourtCase } from "@bugcourt-ai/shared";

interface CourtCaseCardProps {
  courtCase: CourtCase;
}

export function CourtCaseCard({ courtCase }: CourtCaseCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{courtCase.severity}</p>
          <h2 className="text-xl font-semibold text-slate-900">{courtCase.title}</h2>
          <p className="text-sm text-slate-600">{courtCase.file}:{courtCase.lineStart}-{courtCase.lineEnd}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{courtCase.verdict.status}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="font-semibold text-slate-800">Evidence</p>
          <ul className="mt-2 space-y-2 text-slate-600">
            {courtCase.evidence.map((item) => (
              <li key={item} className="list-disc pl-5">{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-800">Recommended Fix</p>
          <p className="mt-2 text-slate-600">{courtCase.recommendedFix}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Prosecutor</p>
          <p className="mt-2 text-slate-600">{courtCase.prosecutorArgument}</p>
        </section>
        <section className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Defense</p>
          <p className="mt-2 text-slate-600">{courtCase.defenseArgument}</p>
        </section>
        <section className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
          <p className="text-sm font-semibold text-slate-700">Expert Witness</p>
          <p className="mt-2 text-slate-600">{courtCase.expertWitnessArgument}</p>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
        <span>Confidence: {(courtCase.verdict.confidence * 100).toFixed(0)}%</span>
        <span>Reasoning: {courtCase.verdict.reasoning}</span>
      </div>
    </div>
  );
}
