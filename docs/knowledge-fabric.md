# TRUST-MED Knowledge Fabric v0.1

## Node classes
Patient, Symptom, Condition, Lab, Medication, Evidence, Guideline, Model, Prediction, Decision, Outcome.

## Required metadata
Every clinically meaningful knowledge claim should carry:
- provenance
- source type
- source date
- population/context
- validation state
- temporal validity
- confidence
- review status

## Memory separation
1. Structured database: authoritative facts/events.
2. Vector store: semantic retrieval of documents.
3. Graph store: relationships and temporal context.
4. Audit log: immutable record of agent actions and human decisions.

## Safety rule
Agent-generated claims do not automatically become trusted graph facts. They enter a pending state until verified against an allowed source or human review.
