# TRUST-MED v0.2 — Knowledge + Agent Fabric

## What changed

- Added a persistent-style knowledge graph abstraction with temporal validity and provenance metadata.
- Added a local RAG layer with source, date, population and tags.
- Added a six-agent orchestration trace: Clinical → Evidence → Verification → Safety → Trust → Governance.
- Added a safety gate: agent-generated claims remain pending and human review is explicit.
- Added a `/api/analyze` endpoint so the UI can execute the orchestration instead of showing only static cards.
- Added a reasoning-trace view and lifecycle monitoring view.

## Data flow

`Synthetic patient → Clinical Agent → RAG Evidence → Verification → Safety → Trust Engine → Governance → Human decision → Outcome telemetry`

The knowledge graph stores relationships across patient context, evidence, predictions and decisions. In a production research system, this abstraction can be backed by a graph database plus a relational audit store and vector index.

## Important boundary

This implementation is a research prototype. It uses synthetic data and illustrative thresholds. It is not a clinical decision support system and should not be connected to real patient data without appropriate validation, security, governance and regulatory review.
