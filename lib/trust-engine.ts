export type TrustSignals = {
  evidence: number;
  reliability: number;
  uncertainty: number;
  agreement: number;
  patientFit: number;
  safety: number;
  lifecycle: number;
};

export type TrustResult = TrustSignals & {
  overall: number;
  action: "proceed" | "verify" | "human_review" | "do_not_rely";
};

// Research-prototype heuristic only. Thresholds are not clinically validated.
export function evaluateTrust(s: TrustSignals): TrustResult {
  const overall = Math.round(
    s.evidence * 0.18 + s.reliability * 0.18 + s.uncertainty * 0.12 +
    s.agreement * 0.14 + s.patientFit * 0.14 + s.safety * 0.14 + s.lifecycle * 0.10
  );
  const critical = Math.min(s.safety, s.evidence);
  const action = critical < 50 || s.agreement < 40 ? "do_not_rely"
    : overall < 65 || s.uncertainty < 55 || s.lifecycle < 55 ? "human_review"
    : overall < 80 ? "verify" : "proceed";
  return { ...s, overall, action };
}
