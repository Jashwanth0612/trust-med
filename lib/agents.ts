import { addEdge, addNode, cloneGraph, detectConflicts, GraphStore } from "./knowledge-graph";
import { retrieveEvidence } from "./rag";
import { evaluateTrust, TrustResult } from "./trust-engine";
import { modelIntelligence } from "./model-evaluator";

export type AgentStep = {
  agent: string;
  status: "complete" | "flagged";
  summary: string;
  outputs: Record<string, unknown>;
};

export type AnalysisResult = {
  recommendation: string;
  question: string;
  trust: TrustResult;
  steps: AgentStep[];
  graph: GraphStore;
  conflicts: string[];
  evidence: ReturnType<typeof retrieveEvidence>;
  modelIntelligence: ReturnType<typeof modelIntelligence>;
};

export function runAnalysis(query: string): AnalysisResult {
  const graph = cloneGraph();
  const steps: AgentStep[] = [];
  const now = new Date().toISOString();
  const question = "Does the synthetic patient context support elevated respiratory risk, and should the AI output be relied upon without human review?";

  steps.push({ agent: "Clinical Agent", status: "complete", summary: "Normalized the patient context into a clinical question and identified safety-sensitive signals.", outputs: { question, patient: "PT-001", signals: ["SpO₂ 91%", "fever", "elevated creatinine"] } });

  const evidence = retrieveEvidence(`${query} oxygen fever renal respiratory risk trust`, 3);
  const model = modelIntelligence();
  steps.push({ agent: "Model Intelligence Agent", status: model.agreement < 0.7 ? "flagged" : "complete", summary: `Evaluated ${model.models.length} synthetic deep-learning models; ensemble probability ${Math.round(model.ensembleProbability * 100)}% with ${(model.agreement * 100).toFixed(0)}% agreement.`, outputs: { benchmarkSize: model.benchmarkSize, averageEce: model.averageEce, averageBrier: model.averageBrier, modelSpread: model.modelSpread } });
  steps.push({ agent: "Evidence Agent", status: "complete", summary: `Retrieved ${evidence.length} evidence chunks and preserved source metadata.`, outputs: { evidenceIds: evidence.map((x) => x.chunk.id), topScore: evidence[0]?.score ?? 0 } });

  const verificationPass = evidence.some((x) => x.score >= 2);
  steps.push({ agent: "Verification Agent", status: verificationPass ? "complete" : "flagged", summary: verificationPass ? "Retrieved evidence supports the direction of the claim in the synthetic corpus." : "Evidence support is weak; claim remains unverified.", outputs: { verificationPass, verifiedSources: evidence.filter((x) => x.score >= 2).map((x) => x.chunk.id) } });

  const safetyFlags = ["SpO₂ 91%", "Temperature 38.7°C", "Creatinine elevated"];
  steps.push({ agent: "Safety Agent", status: "flagged", summary: "Safety-sensitive findings require human review; autonomous reliance is blocked in this prototype.", outputs: { flags: safetyFlags, autonomousReliance: false } });

  const trust = evaluateTrust({ evidence: 94, reliability: 88, uncertainty: Math.round(100 - model.averageEce * 500), agreement: Math.round(model.agreement * 100), patientFit: 82, safety: 91, lifecycle: 73 });
  steps.push({ agent: "Trust Agent", status: trust.action === "proceed" ? "complete" : "flagged", summary: `Computed a ${trust.overall}/100 trust profile with action: ${trust.action.replaceAll("_", " ")}.`, outputs: { trust, calibrationTarget: "appropriate reliance" } });

  steps.push({ agent: "Governance Agent", status: "flagged", summary: "Human decision remains mandatory for this synthetic scenario; the decision is written back as a provenance-bearing event.", outputs: { action: trust.action, humanDecisionRequired: true } });

  addNode(graph, { id: `decision:human-review:${now}`, type: "decision", label: "Human review required", validFrom: now, provenance: [{ sourceId: "governance-agent", sourceType: "model_output", sourceDate: now.slice(0, 10), validationStatus: "pending" }] });
  addEdge(graph, { from: "prediction:resp-risk", to: `decision:human-review:${now}`, relation: "requires", confidence: 0.91, validFrom: now });
  addNode(graph, { id: `analysis:${now}`, type: "outcome", label: "Analysis event recorded", validFrom: now, provenance: [{ sourceId: "trust-med-orchestrator", sourceType: "model_output", sourceDate: now.slice(0, 10), validationStatus: "pending" }] });
  addEdge(graph, { from: `analysis:${now}`, to: "prediction:resp-risk", relation: "evaluated", confidence: trust.overall / 100, validFrom: now });

  const conflicts = detectConflicts(graph);
  return { recommendation: "Elevated respiratory risk", question, trust, steps, graph, conflicts, evidence, modelIntelligence: model };
}
