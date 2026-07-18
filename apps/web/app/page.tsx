"use client";

import { useEffect, useState } from "react";
import { demoProject } from "@bugcourt-ai/shared";
import type { ModelProviderType, ModelSettings } from "@bugcourt-ai/shared";
import { CourtCaseCard } from "./components/CourtCaseCard";

const MODEL_SETTINGS_STORAGE_KEY = "bugcourt:model-settings";

const defaultModelSettings: ModelSettings = {
  provider: "mock",
  model: "mock-courtroom-model",
  baseUrl: "",
  apiKey: "",
  temperature: 0.2,
};

const providerDefaults: Record<ModelProviderType, Pick<ModelSettings, "model" | "baseUrl">> = {
  mock: { model: "mock-courtroom-model", baseUrl: "" },
  openai: { model: "gpt-4.1-mini", baseUrl: "https://api.openai.com/v1" },
  groq: { model: "llama-3.1-8b-instant", baseUrl: "https://api.groq.com/openai/v1" },
  ollama: { model: "llama3.1", baseUrl: "http://localhost:11434/v1" },
  custom: { model: "", baseUrl: "" },
};

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [modelSettings, setModelSettings] = useState<ModelSettings>(defaultModelSettings);
  const [modelSettingsSaved, setModelSettingsSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<string>("Idle");
  const project = demoProject;

  const cases = analyzed ? project.cases : [];

  useEffect(() => {
    const savedSettings = window.localStorage.getItem(MODEL_SETTINGS_STORAGE_KEY);
    if (!savedSettings) {
      return;
    }

    try {
      setModelSettings({ ...defaultModelSettings, ...JSON.parse(savedSettings) });
    } catch {
      window.localStorage.removeItem(MODEL_SETTINGS_STORAGE_KEY);
    }
  }, []);

  function updateModelSettings(nextSettings: Partial<ModelSettings>) {
    setModelSettingsSaved(false);
    setModelSettings((current) => ({ ...current, ...nextSettings }));
  }

  function handleProviderChange(provider: ModelProviderType) {
    updateModelSettings({
      provider,
      ...providerDefaults[provider],
      apiKey: provider === "ollama" || provider === "mock" ? "" : modelSettings.apiKey,
    });
  }

  function saveModelSettings() {
    window.localStorage.setItem(MODEL_SETTINGS_STORAGE_KEY, JSON.stringify(modelSettings));
    setModelSettingsSaved(true);
  }

  async function testModelSettings() {
    setTestStatus("Testing...");
    const response = await fetch("/api/model/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modelSettings),
    });
    const result = (await response.json()) as { success?: boolean; message?: string };
    setTestStatus(result.message ?? (result.success ? "Connection test passed." : "Connection test failed."));
  }

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

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Model Settings</p>
            <h2 className="text-2xl font-semibold text-slate-900">Provider Configuration</h2>
            <p className="text-sm text-slate-500">
              Development only: API keys saved here are stored locally in this browser.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              Provider
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-900 outline-none focus:border-slate-400"
                value={modelSettings.provider}
                onChange={(event) => handleProviderChange(event.target.value as ModelProviderType)}
              >
                <option value="mock">Mock</option>
                <option value="openai">OpenAI</option>
                <option value="groq">Groq</option>
                <option value="ollama">Ollama</option>
                <option value="custom">Custom</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              Model
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-900 outline-none focus:border-slate-400"
                value={modelSettings.model}
                onChange={(event) => updateModelSettings({ model: event.target.value })}
                placeholder="mock-courtroom-model"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              Base URL
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-900 outline-none focus:border-slate-400"
                value={modelSettings.baseUrl ?? ""}
                onChange={(event) => updateModelSettings({ baseUrl: event.target.value })}
                placeholder="http://localhost:11434/v1"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              API Key
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-900 outline-none focus:border-slate-400"
                type="password"
                value={modelSettings.apiKey ?? ""}
                onChange={(event) => updateModelSettings({ apiKey: event.target.value })}
                placeholder={modelSettings.provider === "ollama" ? "Optional for local Ollama" : "Optional for mock"}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              Temperature
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-900 outline-none focus:border-slate-400"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={modelSettings.temperature ?? 0.2}
                onChange={(event) => updateModelSettings({ temperature: Number(event.target.value) })}
              />
            </label>

            <div className="flex flex-wrap items-end gap-3">
              <button
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                onClick={saveModelSettings}
              >
                Save Settings
              </button>
              <button
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                onClick={testModelSettings}
              >
                Test Connection
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            {modelSettingsSaved ? "Settings saved locally. " : ""}
            Test status: {testStatus}
          </p>
        </section>

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
