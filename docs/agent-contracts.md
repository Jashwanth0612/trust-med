# Agent Contracts v0.1

## Clinical Agent
Input: patient context + user question.
Output: clinical question, candidate hypotheses, missing information.

## Evidence Agent
Input: clinical question.
Output: retrieved evidence with provenance.

## Verification Agent
Input: claims + evidence.
Output: supported / unsupported / conflicting claims.

## Safety Agent
Input: patient context + candidate recommendation.
Output: contraindications, conflicts, missing safety information.

## Trust Agent
Input: verified evidence + model outputs + safety signals + monitoring signals.
Output: trust profile + rationale.

## Governance Agent
Input: trust profile + risk category + intended use.
Output: action policy: proceed / verify / human review / do not rely.

## Principle
Least privilege. Agents should only access the data and tools required for their responsibility.
