# BugCourt AI

BugCourt AI is a hackathon MVP that turns code review into an AI-powered courtroom. Instead of a flat list of warnings, every suspicious code pattern becomes a court case with evidence, prosecutor and defense arguments, expert witness analysis, judge verdict, and a reporter summary.

## Tech Stack

- Next.js + TypeScript frontend
- Tailwind CSS for simple styling
- Monorepo structure with shared types and mock packages
- Mock API routes for project import, analysis, cases, and reports
- Static analysis and agent scaffolding in placeholder packages

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the frontend app:

   ```bash
   npm run dev
   ```

3. Open the app in your browser at `http://localhost:3000`.

## MVP Demo Flow

- Paste a repository URL into the dashboard input.
- Click **Analyze Repository**.
- View generated court cases with evidence, arguments, verdict, confidence, and recommended fix.
- The first demo case is "Possible Authentication Bypass".

## Project Structure

- `apps/web` — Next.js app and API route placeholders.
- `packages/shared` — Shared TypeScript models and demo data.
- `packages/analyzer` — Static analysis scaffolding.
- `packages/agents` — Agent prompt templates and debate rules.
- `docs` — Architecture, safety, demo script, and IQ integration notes.
- `vulnerable-demo-repo` — Sample vulnerable route used for the demo case.

## Microsoft IQ Integration

BugCourt AI is designed to integrate with Microsoft IQ / Foundry IQ by grounding reasoning in static findings, code evidence, repository metadata, and indexed project history. The MVP preserves safe, explainable case generation while preparing for intelligence integration.

## Safety

- No repository code execution.
- Static analysis only for the MVP.
- Secrets are not exposed or processed.
- Court cases map back to visible evidence and findings.

## Notes

This project was bootstrapped as a minimal, safe hackathon prototype. AI-assisted development is welcome, and GitHub Copilot helped shape the UI and package scaffolding.
