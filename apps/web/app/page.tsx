"use client";

import { useMemo, useState } from "react";
import { demoProject } from "@bugcourt-ai/shared";
import { CourtCaseCard } from "./components/CourtCaseCard";

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [project, setProject] = useState(demoProject);

  const cases = useMemo(() => (analyzed ? project.cases : []), [analyzed, project]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">BugCourt AI</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">AI-Powered Courtroom Code Review</h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Turn suspicious code patterns into courtroom cases with grounded evidence, debate, and verdicts.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-400"
              placeholder="Enter repository URL"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
            />
            <button
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              onClick={() => setAnalyzed(true)}
            >
              Analyze Repository
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Demo repository: {project.repositoryUrl}
          </p>
        </header>

        <section className="grid gap-6">
          <div className="flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Generated Court Cases</h2>
                <p className="mt-1 text-sm text-slate-500">Each case maps back to a static finding and visible code evidence.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                {cases.length} case{cases.length === 1 ? "" : "s"}
              </span>
            </div>

            {!analyzed ? (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-6 text-slate-600">
                Click Analyze Repository to load the demo courtroom case.
              </p>
            ) : (
              <div className="space-y-6">
                {cases.map((courtCase) => (
                  <CourtCaseCard key={courtCase.caseId} courtCase={courtCase} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
