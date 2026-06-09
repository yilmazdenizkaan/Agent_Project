# Microsoft IQ / Foundry IQ Integration

BugCourt AI is designed to integrate with Microsoft IQ and Foundry IQ by grounding agent reasoning in static findings, repository metadata, and indexed evidence.

Integration plan:

- Use shared `StaticFinding` and `CourtCase` models to capture evidence.
- Index repository metadata, file paths, and line ranges so IQ pipelines can correlate evidence to code.
- Keep agent prompts grounded in visible code snippets and static analysis results.
- Use reports and case summaries to feed external intelligence workflows.

This MVP focuses on a design that can later connect to IQ systems while preserving safety and transparency.
