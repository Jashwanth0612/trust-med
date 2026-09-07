export type EvidenceChunk = {
  id: string;
  title: string;
  text: string;
  sourceType: "guideline" | "study";
  date: string;
  population: string;
  tags: string[];
};

const corpus: EvidenceChunk[] = [
  { id: "e1", title: "Synthetic safety rule", text: "Low oxygen saturation, fever, and renal-function abnormalities should trigger additional clinical review rather than autonomous reliance on a generated recommendation.", sourceType: "guideline", date: "2026-09-07", population: "Synthetic demonstration", tags: ["oxygen", "fever", "renal", "review"] },
  { id: "e2", title: "Synthetic respiratory evidence", text: "Respiratory-risk signals are stronger when multiple independent observations point in the same direction, but disagreement between models should reduce reliance.", sourceType: "study", date: "2026-09-07", population: "Synthetic demonstration", tags: ["respiratory", "agreement", "models"] },
  { id: "e3", title: "Human oversight principle", text: "A trust layer should expose uncertainty, evidence provenance, conflicts, and lifecycle signals so a clinician can make the final decision.", sourceType: "guideline", date: "2026-09-07", population: "Synthetic demonstration", tags: ["trust", "uncertainty", "provenance", "human"] }
];

function score(query: string, chunk: EvidenceChunk) {
  const terms = query.toLowerCase().split(/\W+/).filter(Boolean);
  const haystack = `${chunk.title} ${chunk.text} ${chunk.tags.join(" ")}`.toLowerCase();
  return terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
}

export function retrieveEvidence(query: string, limit = 3) {
  return corpus.map((chunk) => ({ chunk, score: score(query, chunk) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
