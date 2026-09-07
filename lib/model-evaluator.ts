export type ModelPrediction = {
  modelId: string;
  modelName: string;
  architecture: string;
  probability: number;
  prediction: "high-risk" | "moderate-risk" | "low-risk";
  latencyMs: number;
};

export type ModelMetrics = {
  brierScore: number;
  ece: number;
  accuracy: number;
  sensitivity: number;
  specificity: number;
  agreementWithEnsemble: number;
  subgroupGap: number;
};

export type ModelEvaluation = ModelPrediction & { metrics: ModelMetrics; status: "strong" | "watch" | "flagged" };

// Synthetic benchmark only. This intentionally mimics a deep-learning evaluation
// layer without pretending to be a clinically validated model.
const benchmark = [
  { y: 1, a: 0.91, b: 0.77, c: 0.64 },
  { y: 1, a: 0.84, b: 0.72, c: 0.57 },
  { y: 0, a: 0.22, b: 0.31, c: 0.48 },
  { y: 0, a: 0.14, b: 0.27, c: 0.41 },
  { y: 1, a: 0.78, b: 0.68, c: 0.61 },
  { y: 0, a: 0.33, b: 0.29, c: 0.52 },
  { y: 1, a: 0.88, b: 0.81, c: 0.69 },
  { y: 0, a: 0.19, b: 0.24, c: 0.46 },
  { y: 1, a: 0.74, b: 0.63, c: 0.55 },
  { y: 0, a: 0.28, b: 0.35, c: 0.44 },
];

function metrics(key: "a" | "b" | "c"): ModelMetrics {
  const probs = benchmark.map((r) => r[key]);
  const labels = benchmark.map((r) => r.y);
  const brier = probs.reduce((s, p, i) => s + (p - labels[i]) ** 2, 0) / probs.length;
  const bins = 5;
  let ece = 0;
  for (let b = 0; b < bins; b++) {
    const lo = b / bins;
    const hi = (b + 1) / bins;
    const rows = benchmark.filter((r) => r[key] >= lo && (b === bins - 1 ? r[key] <= hi : r[key] < hi));
    if (!rows.length) continue;
    const confidence = rows.reduce((s, r) => s + r[key], 0) / rows.length;
    const accuracy = rows.reduce((s, r) => s + (r.y === (r[key] >= 0.5 ? 1 : 0) ? 1 : 0), 0) / rows.length;
    ece += (rows.length / benchmark.length) * Math.abs(confidence - accuracy);
  }
  const tp = benchmark.filter((r) => r.y === 1 && r[key] >= 0.5).length;
  const fn = benchmark.filter((r) => r.y === 1 && r[key] < 0.5).length;
  const tn = benchmark.filter((r) => r.y === 0 && r[key] < 0.5).length;
  const fp = benchmark.filter((r) => r.y === 0 && r[key] >= 0.5).length;
  const accuracy = (tp + tn) / benchmark.length;
  const sensitivity = tp / Math.max(1, tp + fn);
  const specificity = tn / Math.max(1, tn + fp);
  // Synthetic subgroup signal: compare first five vs last five mean probabilities.
  const gap = Math.abs(
    benchmark.slice(0, 5).reduce((s, r) => s + r[key], 0) / 5 -
    benchmark.slice(5).reduce((s, r) => s + r[key], 0) / 5
  );
  return {
    brierScore: Number(brier.toFixed(3)),
    ece: Number(ece.toFixed(3)),
    accuracy: Number(accuracy.toFixed(2)),
    sensitivity: Number(sensitivity.toFixed(2)),
    specificity: Number(specificity.toFixed(2)),
    agreementWithEnsemble: 0,
    subgroupGap: Number(gap.toFixed(2)),
  };
}

export function evaluateModels(): ModelEvaluation[] {
  const specs: ["a" | "b" | "c", string, string, string, number][] = [
    ["a", "DL-RespNet", "Deep residual network", "Model A", 38],
    ["b", "DL-Temporal", "Temporal convolutional network", "Model B", 44],
    ["c", "DL-Compact", "Compact neural network", "Model C", 31],
  ];
  const raw = specs.map(([key, modelName, architecture, modelId, latencyMs]) => ({
    key, modelId, modelName, architecture, probability: benchmark.reduce((s, r) => s + r[key], 0) / benchmark.length, latencyMs,
    metrics: metrics(key),
  }));
  const ensemble = raw.reduce((s, m) => s + m.probability, 0) / raw.length;
  return raw.map((m) => {
    const agreement = 1 - Math.min(1, Math.abs(m.probability - ensemble) * 2);
    const prediction = m.probability >= 0.7 ? "high-risk" : m.probability >= 0.45 ? "moderate-risk" : "low-risk";
    const adjusted = { ...m.metrics, agreementWithEnsemble: Number(agreement.toFixed(2)) };
    const status = adjusted.ece <= 0.12 && adjusted.subgroupGap <= 0.2 && agreement >= 0.8 ? "strong" : agreement < 0.7 ? "flagged" : "watch";
    return { ...m, prediction, metrics: adjusted, status } as ModelEvaluation;
  });
}

export function modelIntelligence() {
  const models = evaluateModels();
  const mean = models.reduce((s, m) => s + m.probability, 0) / models.length;
  const spread = Math.max(...models.map((m) => m.probability)) - Math.min(...models.map((m) => m.probability));
  const agreement = Math.max(0, Math.min(1, 1 - spread * 1.5));
  const avgEce = models.reduce((s, m) => s + m.metrics.ece, 0) / models.length;
  const avgBrier = models.reduce((s, m) => s + m.metrics.brierScore, 0) / models.length;
  return {
    models,
    ensembleProbability: Number(mean.toFixed(2)),
    modelSpread: Number(spread.toFixed(2)),
    agreement: Number(agreement.toFixed(2)),
    averageEce: Number(avgEce.toFixed(3)),
    averageBrier: Number(avgBrier.toFixed(3)),
    benchmarkSize: benchmark.length,
  };
}
