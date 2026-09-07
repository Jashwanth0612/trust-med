export type Provenance = {
  sourceId: string;
  sourceType: "guideline" | "study" | "clinical_record" | "model_output";
  sourceDate: string;
  population?: string;
  validationStatus: "verified" | "pending" | "rejected";
};

export type KnowledgeNode = {
  id: string;
  type: "patient" | "symptom" | "condition" | "lab" | "medication" | "evidence" | "guideline" | "model" | "prediction" | "decision" | "outcome";
  label: string;
  validFrom?: string;
  validTo?: string;
  provenance?: Provenance[];
};

export type KnowledgeEdge = {
  from: string;
  to: string;
  relation: string;
  confidence: number;
  validFrom?: string;
  validTo?: string;
};
