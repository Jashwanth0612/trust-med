# TRUST-MED v0.5 — Adaptive Knowledge Graph

## Research objective

Turn each analysis into a longitudinal, provenance-bearing event so future evaluation can ask not only “what did the AI say?” but also “what happened after the human decision?”

## Memory model

1. **Knowledge graph** — patient context, evidence, predictions, decisions and outcomes connected by temporal relationships.
2. **Analysis memory** — each orchestration run receives an analysis ID, timestamp, trust profile and action.
3. **Outcome memory** — human decisions are recorded as accepted, overridden or deferred.
4. **Provenance gate** — AI-generated claims remain pending until an explicit verification pathway is satisfied.

## Why this comes before deep learning

A deep model can improve prediction, but it does not by itself solve longitudinal provenance, calibrated reliance, human override tracking, or post-deployment monitoring. TRUST-MED needs these evaluation primitives first so a later model can be compared against a stable safety and governance layer.

## Next experimental layer

After enough synthetic benchmark cases exist, add model-evaluation adapters for multiple candidate models. Compare discrimination, calibration, subgroup performance, uncertainty, disagreement and override-adjusted outcomes. The model should be one component of the Trust Fabric—not the authority that decides whether its own output is trusted.
