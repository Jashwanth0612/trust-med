import { demoGraph, GraphStore } from "./knowledge-graph";
import { AnalysisResult } from "./agents";

export type AnalysisMemory = {
  id: string;
  timestamp: string;
  query: string;
  action: string;
  trustOverall: number;
  prediction: string;
};

export type OutcomeMemory = {
  analysisId: string;
  timestamp: string;
  decision: "accepted" | "overridden" | "deferred";
  note?: string;
};

type MemoryStore = {
  graph: GraphStore;
  analyses: AnalysisMemory[];
  outcomes: OutcomeMemory[];
};

const g = globalThis as typeof globalThis & { __trustMedMemory?: MemoryStore };

function makeStore(): MemoryStore {
  return {
    graph: JSON.parse(JSON.stringify(demoGraph)) as GraphStore,
    analyses: [],
    outcomes: [],
  };
}

export function getMemory(): MemoryStore {
  if (!g.__trustMedMemory) g.__trustMedMemory = makeStore();
  return g.__trustMedMemory;
}

export function recordAnalysis(result: AnalysisResult, query: string) {
  const memory = getMemory();
  const id = `analysis-${Date.now()}`;
  memory.graph = result.graph;
  memory.analyses.unshift({
    id,
    timestamp: new Date().toISOString(),
    query,
    action: result.trust.action,
    trustOverall: result.trust.overall,
    prediction: result.recommendation,
  });
  memory.analyses = memory.analyses.slice(0, 50);
  return id;
}

export function recordOutcome(analysisId: string, decision: OutcomeMemory["decision"], note?: string) {
  const memory = getMemory();
  memory.outcomes.unshift({ analysisId, timestamp: new Date().toISOString(), decision, note });
  memory.outcomes = memory.outcomes.slice(0, 100);
  return memory.outcomes[0];
}

export function memorySnapshot() {
  const memory = getMemory();
  const overrides = memory.outcomes.filter((o) => o.decision === "overridden").length;
  const decisions = memory.outcomes.length;
  return {
    graph: memory.graph,
    analyses: memory.analyses,
    outcomes: memory.outcomes,
    stats: {
      analyses: memory.analyses.length,
      nodes: memory.graph.nodes.length,
      relationships: memory.graph.edges.length,
      pendingClaims: memory.graph.nodes.filter((n) => n.provenance?.some((p) => p.validationStatus === "pending")).length,
      overrideRate: decisions ? Math.round((overrides / decisions) * 100) : 0,
    },
  };
}
