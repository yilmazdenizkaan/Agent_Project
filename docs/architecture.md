# Architecture

BugCourt AI is designed as a lightweight static analysis monorepo with a clear separation between frontend, backend, shared types, analysis logic, and agent orchestration.

Flow:

1. Repository import is simulated through the frontend UI and project metadata.
2. A static analyzer package scans repository files and converts findings into court case seeds.
3. Each suspicious pattern is represented as a `CourtCase` with structured evidence and agent arguments.
4. Agents debate the evidence in a controlled courtroom flow: Clerk, Prosecutor, Defense, Expert Witness, Judge, Reporter.
5. A verdict is rendered and stored as structured metadata.
6. Reports are exposed through a mock reports API.

Key boundaries:

- `apps/web` contains the UI and API placeholders.
- `packages/shared` defines shared TypeScript models and mock data.
- `packages/analyzer` contains the static analysis scaffolding and conversion utilities.
- `packages/agents` contains agent prompt templates and rules for grounded debate.
- No runtime execution of imported repositories is performed in this MVP.
