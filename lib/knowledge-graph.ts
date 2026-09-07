import { KnowledgeEdge, KnowledgeNode } from "./types";

export type GraphStore = {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
};

export const demoGraph: GraphStore = {
  nodes: [
    { id: "patient:PT-001", type: "patient", label: "Synthetic Patient PT-001", validFrom: "2026-09-07", provenance: [{ sourceId: "demo-patient", sourceType: "clinical_record", sourceDate: "2026-09-07", validationStatus: "verified" }] },
    { id: "condition:t2d", type: "condition", label: "Type 2 diabetes", validFrom: "2024-01-01", provenance: [{ sourceId: "demo-patient", sourceType: "clinical_record", sourceDate: "2026-09-07", validationStatus: "verified" }] },
    { id: "condition:htn", type: "condition", label: "Hypertension", validFrom: "2024-01-01", provenance: [{ sourceId: "demo-patient", sourceType: "clinical_record", sourceDate: "2026-09-07", validationStatus: "verified" }] },
    { id: "lab:spo2", type: "lab", label: "SpO₂ 91%", validFrom: "2026-09-07", provenance: [{ sourceId: "demo-vitals", sourceType: "clinical_record", sourceDate: "2026-09-07", validationStatus: "verified" }] },
    { id: "lab:temp", type: "lab", label: "Temperature 38.7°C", validFrom: "2026-09-07", provenance: [{ sourceId: "demo-vitals", sourceType: "clinical_record", sourceDate: "2026-09-07", validationStatus: "verified" }] },
    { id: "lab:creatinine", type: "lab", label: "Creatinine elevated", validFrom: "2026-09-07", provenance: [{ sourceId: "demo-labs", sourceType: "clinical_record", sourceDate: "2026-09-07", validationStatus: "verified" }] },
    { id: "prediction:resp-risk", type: "prediction", label: "Elevated respiratory risk", validFrom: "2026-09-07", provenance: [{ sourceId: "demo-model-run", sourceType: "model_output", sourceDate: "2026-09-07", validationStatus: "pending" }] },
    { id: "evidence:demo", type: "evidence", label: "Synthetic evidence bundle", validFrom: "2026-09-07", provenance: [{ sourceId: "demo-evidence", sourceType: "study", sourceDate: "2026-09-07", population: "Synthetic demonstration population", validationStatus: "verified" }] }
  ],
  edges: [
    { from: "patient:PT-001", to: "condition:t2d", relation: "has_condition", confidence: 1, validFrom: "2024-01-01" },
    { from: "patient:PT-001", to: "condition:htn", relation: "has_condition", confidence: 1, validFrom: "2024-01-01" },
    { from: "patient:PT-001", to: "lab:spo2", relation: "has_lab", confidence: 1, validFrom: "2026-09-07" },
    { from: "patient:PT-001", to: "lab:temp", relation: "has_lab", confidence: 1, validFrom: "2026-09-07" },
    { from: "patient:PT-001", to: "lab:creatinine", relation: "has_lab", confidence: 1, validFrom: "2026-09-07" },
    { from: "patient:PT-001", to: "prediction:resp-risk", relation: "receives_prediction", confidence: 0.81, validFrom: "2026-09-07" },
    { from: "prediction:resp-risk", to: "evidence:demo", relation: "supported_by", confidence: 0.94, validFrom: "2026-09-07" }
  ]
};

export function cloneGraph(): GraphStore {
  return JSON.parse(JSON.stringify(demoGraph)) as GraphStore;
}

export function addNode(graph: GraphStore, node: KnowledgeNode) {
  if (!graph.nodes.some((n) => n.id === node.id)) graph.nodes.push(node);
}

export function addEdge(graph: GraphStore, edge: KnowledgeEdge) {
  if (!graph.edges.some((e) => e.from === edge.from && e.to === edge.to && e.relation === edge.relation)) graph.edges.push(edge);
}

export function relatedNodes(graph: GraphStore, nodeId: string) {
  const ids = new Set<string>([nodeId]);
  graph.edges.forEach((e) => {
    if (e.from === nodeId) ids.add(e.to);
    if (e.to === nodeId) ids.add(e.from);
  });
  return graph.nodes.filter((n) => ids.has(n.id));
}

export function detectConflicts(graph: GraphStore) {
  const conflicts: string[] = [];
  const groups = new Map<string, KnowledgeEdge[]>();
  graph.edges.forEach((edge) => {
    const key = `${edge.from}|${edge.relation}`;
    groups.set(key, [...(groups.get(key) ?? []), edge]);
  });
  groups.forEach((edges, key) => {
    const targets = new Set(edges.map((e) => e.to));
    if (targets.size > 1) conflicts.push(`Conflicting targets for ${key.replace("|", " → ")}`);
  });
  return conflicts;
}
