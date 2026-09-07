# TRUST-MED MVP v0.5 — Adaptive Knowledge Graph

Research prototype for calibrated reliance on healthcare AI.

## New in v0.5
- Persistent-in-process Knowledge Fabric memory across analyses.
- Analysis IDs and provenance-bearing analysis events.
- Human outcome capture: accepted / overridden / deferred.
- Monitoring dashboard that reads memory and computes recorded override rate.
- Temporal graph events linking analysis → prediction → human decision.
- `/api/analyze`, `/api/memory`, and `/api/outcome` routes.
- Cream + navy UI retained.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Research boundary

Synthetic data only. No EHR, external clinical model, or real patient data is connected. Trust thresholds are illustrative and not clinically validated.

## v0.6 Model Intelligence

The Model Lab evaluates three synthetic neural-model profiles using Brier score, expected calibration error (ECE), accuracy, sensitivity, specificity, ensemble agreement, subgroup gap, probability spread, and latency. The evaluation feeds uncertainty/agreement signals into the Trust Engine. No clinical model or patient data is connected.


## Pages

- `/` — Overview / Trust Center
- `/models` — Model Intelligence Lab
- `/knowledge` — Adaptive Knowledge Fabric
- `/agents` — Agent Fabric / orchestration trace
- `/evidence` — Evidence & RAG
- `/monitoring` — Adaptive Lifecycle Memory

Navigation uses real Next.js routes, so each workspace is a separate page while sharing the same Trust-MED shell and local analysis state.
