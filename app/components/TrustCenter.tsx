"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Activity, AlertTriangle, BookOpen, CheckCircle2, ChevronRight, Database, FileCheck2, Network, Play, ShieldCheck, UserRound } from "lucide-react";

type Trust = { overall: number; evidence: number; reliability: number; uncertainty: number; agreement: number; patientFit: number; safety: number; lifecycle: number; action: string };
type TraceStep = { agent: string; status: string; summary: string; outputs: Record<string, unknown> };
type Evidence = { chunk: { id: string; title: string; text: string; sourceType: string; date: string; population: string; tags: string[] }; score: number };
type ModelEvaluation = { modelId: string; modelName: string; architecture: string; probability: number; prediction: string; latencyMs: number; status: string; metrics: { brierScore: number; ece: number; accuracy: number; sensitivity: number; specificity: number; agreementWithEnsemble: number; subgroupGap: number } };
type ModelIntelligence = { models: ModelEvaluation[]; ensembleProbability: number; modelSpread: number; agreement: number; averageEce: number; averageBrier: number; benchmarkSize: number };
type Analysis = { recommendation: string; question: string; trust: Trust; steps: TraceStep[]; modelIntelligence: ModelIntelligence; graph: { nodes: { id: string; type: string; label: string }[]; edges: { from: string; to: string; relation: string; confidence: number }[] }; conflicts: string[]; evidence: Evidence[]; analysisId?: string };

const patient = {
  id: "PT-001", name: "Synthetic Patient 001", age: 64,
  conditions: ["Type 2 diabetes", "Hypertension"],
  labs: ["SpO₂ 91%", "Temperature 38.7°C", "Creatinine elevated"]
};

const agents = [
  ["Clinical Agent", "Interprets patient context and generates the clinical question."],
  ["Evidence Agent", "Retrieves relevant evidence from the RAG layer."],
  ["Verification Agent", "Checks whether evidence actually supports the claim."],
  ["Safety Agent", "Looks for contraindications, conflicts and missing information."],
  ["Trust Agent", "Synthesizes reliability, uncertainty, agreement and safety signals."],
  ["Governance Agent", "Determines whether human escalation is required."]
];

const initialTrust: Trust = { overall: 81, evidence: 94, reliability: 88, uncertainty: 71, agreement: 67, patientFit: 82, safety: 91, lifecycle: 73, action: "human_review" };

export default function TrustCenter({ section = "overview" }: { section?: string }) {
  const [selected, setSelected] = useState(section);
  const [trust, setTrust] = useState(initialTrust);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [graph, setGraph] = useState<Analysis["graph"] | null>(null);
  const [modelIntelligence, setModelIntelligence] = useState<ModelIntelligence | null>(null);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState("Elevated respiratory risk");
  const [query, setQuery] = useState("Assess respiratory risk for PT-001");
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const trustDimensions = useMemo(() => Object.entries(trust).filter(([k]) => !["overall", "action"].includes(k)), [trust]);

  async function runAnalysis() {
    setRunning(true);
    try {
      const response = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query }) });
      if (!response.ok) throw new Error("Analysis request failed");
      const data: Analysis = await response.json();
      setTrust(data.trust); setTrace(data.steps ?? []); setModelIntelligence(data.modelIntelligence ?? null); setEvidence(data.evidence ?? []); setGraph(data.graph ?? null); setConflicts(data.conflicts ?? []); setRecommendation(data.recommendation); setAnalysisId(data.analysisId ?? null); setRan(true);
    } catch (error) {
      console.error(error);
    } finally { setRunning(false); }
  }

  return (
    <main>
      <aside className="sidebar">
        <div className="brand"><div className="logo">T</div><div><b>TRUST-MED</b><span>AI Trust Fabric · v0.6</span></div></div>
        {[["overview","Overview","/"],["models","Model Lab","/models"],["knowledge","Knowledge","/knowledge"],["agents","Agents","/agents"],["evidence","Evidence","/evidence"],["monitoring","Monitoring","/monitoring"]].map(([id,label,href]) => <Link className={selected === id ? "nav active" : "nav"} href={href} key={id}>{label}<ChevronRight size={15} /></Link>)}
        <div className="sideCard"><ShieldCheck size={20} /><b>Human-first AI</b><p>AI reasons. Evidence verifies. Humans decide.</p></div>
      </aside>

      <section className="content">
        <header><div><p className="eyebrow">HEALTHCARE AI ASSURANCE</p><h1>Trust Center</h1><p className="muted">A living view of AI reliability, evidence, safety and human oversight.</p></div><div className="status"><span /> SYSTEM HEALTHY</div></header>

        {selected === "overview" && <>
          <section className="queryBar"><div><b>Run a trust-aware analysis</b><span>Local multi-agent orchestration · synthetic data only · research prototype</span></div><div className="queryControls"><input value={query} onChange={e => setQuery(e.target.value)} /><button className="primary run" onClick={runAnalysis} disabled={running}>{running ? "Running…" : <><Play size={14} /> Run analysis</>}</button></div></section>

          <section className="heroGrid">
            <div className="trustCard"><div className="cardTop"><span>TRUST PROFILE</span><ShieldCheck size={20} /></div><div className="score">{trust.overall}<small>/100</small></div><p>{trust.action === "human_review" ? "Human review required" : trust.action.replaceAll("_", " ")}</p><div className="meter"><i style={{ width: `${trust.overall}%` }} /></div><div className="warning"><AlertTriangle size={17} /><div><b>Prototype safety gate</b><br /><span>Trust is a decision-support signal, not clinical authorization.</span></div></div></div>
            <div className="recommendation"><div className="cardTop"><span>AI RECOMMENDATION</span><Activity size={20} /></div><h2>{recommendation}</h2><p>The system combines patient context, retrieved evidence, verification, safety checks and model-agreement signals before deciding how much reliance is appropriate.</p><div className="chips"><span>2/3 models agree</span><span>Evidence strong</span><span>Patient fit {trust.patientFit}%</span></div><button className="primary" onClick={() => setSelected("agents")}>Open reasoning trace <ChevronRight size={14} /></button></div>
          </section>

          <section className="panel"><div className="panelTitle"><div><h2>Trust dimensions</h2><p>Multidimensional assurance — not a single model confidence number.</p></div><span className="liveBadge">LIVE PROFILE</span></div><div className="dimensions">{trustDimensions.map(([k, v]) => <div className="dimension" key={k}><div><b>{k.replace(/([A-Z])/g, " $1")}</b><strong>{v as number}</strong></div><div className="bar"><i style={{ width: `${v}%` }} /></div></div>)}</div></section>

          <section className="lower"><div className="panel"><div className="panelTitle"><div><h2>Patient context</h2><p>Demo data only</p></div><UserRound size={20} /></div><div className="patient"><div className="avatar">64</div><div><b>{patient.name}</b><span>{patient.id} · {patient.age} years</span></div></div><div className="tags">{[...patient.conditions, ...patient.labs].map(x => <span key={x}>{x}</span>)}</div></div>
            <div className="panel"><div className="panelTitle"><div><h2>Agent activity</h2><p>{ran ? "Latest orchestration trace" : "Specialized checks for this recommendation"}</p></div><Network size={20} /></div>{(trace.length ? trace : agents).slice(0, 6).map((a: any, i) => <div className="agent" key={a.agent ?? a[0]}><div className="agentDot">{i + 1}</div><div><b>{a.agent ?? a[0]}</b><span>{a.summary ?? a[1]}</span></div><em className={a.status === "flagged" ? "flag" : "ok"}>{a.status ?? "ready"}</em></div>)}</div></section>

          <section className="splitPanels"><div className="panel"><div className="panelTitle"><div><h2>Knowledge graph</h2><p>New facts are provenance-gated before they become trusted.</p></div><Network size={19} /></div><MiniGraph graph={graph} /></div><div className="panel"><div className="panelTitle"><div><h2>Evidence trail</h2><p>RAG retrieval with source metadata.</p></div><BookOpen size={19} /></div><EvidenceList evidence={evidence} compact onSelect={setSelectedEvidence} /></div></section>
          {conflicts.length > 0 && <div className="notice alertNotice"><AlertTriangle size={16} /><span><b>Graph conflicts:</b> {conflicts.join(" · ")}</span></div>}
        </>}

        {selected === "models" && <ModelLab model={modelIntelligence} />}
        {selected === "knowledge" && <Knowledge graph={graph} conflicts={conflicts} />}
        {selected === "agents" && <Agents trace={trace} ran={ran} />}
        {selected === "evidence" && <EvidencePage evidence={evidence} selectedEvidence={selectedEvidence} onSelect={setSelectedEvidence} />}
        {selected === "monitoring" && <Monitoring trust={trust} analysisId={analysisId} />}
      </section>
    </main>
  );
}

function MiniGraph({ graph }: { graph: Analysis["graph"] | null }) {
  const labels = graph?.nodes.slice(0, 7).map(n => n.label) ?? ["PT-001", "Type 2 diabetes", "SpO₂ 91%", "Respiratory risk", "Evidence", "Human review"];
  return <div className="miniGraph"><div className="graphCenter">PT-001</div>{labels.slice(1).map((label, i) => <div className={`graphPill p${i + 1}`} key={label}><span />{label}</div>)}</div>;
}

function EvidenceList({ evidence, compact = false, onSelect }: { evidence: Evidence[]; compact?: boolean; onSelect: (id: string) => void }) {
  if (!evidence.length) return <div className="empty">Run an analysis to populate the evidence trail.</div>;
  return <div className="evidenceList">{evidence.map(({ chunk, score }) => <button className="evidenceItem" key={chunk.id} onClick={() => onSelect(chunk.id)}><div className="evidenceIcon"><FileCheck2 size={15} /></div><div><b>{chunk.title}</b><span>{chunk.sourceType} · {chunk.date} · retrieval score {score}</span>{!compact && <p>{chunk.text}</p>}</div><ChevronRight size={14} /></button>)}</div>;
}

function ModelLab({ model }: { model: ModelIntelligence | null }) {
  if (!model) return <section className="panel full"><div className="panelTitle"><div><h2>Model Intelligence Lab</h2><p>Run an analysis to evaluate the synthetic deep-learning ensemble.</p></div><Activity /></div><div className="empty">No model evaluation yet. Run an analysis from Overview.</div></section>;
  return <section className="panel full"><div className="panelTitle"><div><h2>Model Intelligence Lab</h2><p>Calibration, uncertainty, agreement and subgroup checks across synthetic models.</p></div><span className="liveBadge">BENCHMARK · {model.benchmarkSize} CASES</span></div><div className="modelSummary"><div><strong>{Math.round(model.ensembleProbability * 100)}%</strong><span>Ensemble risk probability</span></div><div><strong>{Math.round(model.agreement * 100)}%</strong><span>Ensemble agreement</span></div><div><strong>{model.averageEce}</strong><span>Mean ECE</span></div><div><strong>{model.averageBrier}</strong><span>Mean Brier</span></div></div><div className="modelTable">{model.models.map(m => <div className="modelRow" key={m.modelId}><div className="modelIdentity"><div className="modelBadge">DL</div><div><b>{m.modelName}</b><span>{m.architecture} · {m.latencyMs} ms</span></div></div><div><small>Probability</small><strong>{Math.round(m.probability * 100)}%</strong></div><div><small>ECE</small><strong>{m.metrics.ece}</strong></div><div><small>Brier</small><strong>{m.metrics.brierScore}</strong></div><div><small>Subgroup gap</small><strong>{Math.round(m.metrics.subgroupGap * 100)}%</strong></div><em className={m.status === "flagged" ? "flag" : m.status === "watch" ? "watch" : "ok"}>{m.status}</em></div>)}</div><div className="notice"><b>Interpretation:</b> TRUST-MED does not treat confidence as truth. Model calibration, disagreement and subgroup behavior become inputs to the Trust Engine. These benchmark values are synthetic and are not clinical performance claims.</div></section>;
}

function Knowledge({ graph, conflicts }: { graph: Analysis["graph"] | null; conflicts: string[] }) {
  const nodes = graph?.nodes ?? [];
  return <section className="panel full"><div className="panelTitle"><div><h2>Knowledge Fabric</h2><p>Temporal, provenance-aware healthcare knowledge graph.</p></div><Network /></div><div className="graphStats"><div><strong>{nodes.length || 8}</strong><span>nodes</span></div><div><strong>{graph?.edges.length || 7}</strong><span>relationships</span></div><div><strong>{conflicts.length}</strong><span>conflicts</span></div><div><strong>pending</strong><span>AI claims</span></div></div><div className="graphLarge">{(nodes.length ? nodes : [{id:"patient",type:"patient",label:"Patient PT-001"},{id:"prediction",type:"prediction",label:"Elevated respiratory risk"},{id:"evidence",type:"evidence",label:"Evidence bundle"}]).map(n => <div className={`nodeCard ${n.type}`} key={n.id}><small>{n.type}</small><b>{n.label}</b><span>{n.type === "prediction" ? "provenance: pending" : "provenance: verified"}</span></div>)}</div><div className="notice">Agent-generated claims enter a pending state. They do not become trusted graph facts until provenance and verification checks pass.</div></section>;
}

function Agents({ trace, ran }: { trace: TraceStep[]; ran: boolean }) {
  const rows = trace.length ? trace : agents.map((a, i) => ({ agent: a[0], summary: a[1], status: i < 4 ? "complete" : "flagged", outputs: {} }));
  return <section className="panel full"><div className="panelTitle"><div><h2>Agent Fabric</h2><p>Specialized agents operate with narrow responsibilities and an auditable trace.</p></div><Activity /></div>{rows.map((step, i) => <div className="agent big" key={step.agent}><div className="agentDot">{i + 1}</div><div className="agentCopy"><b>{step.agent}</b><span>{step.summary}</span>{ran && <small>{Object.keys(step.outputs ?? {}).length} output fields · provenance preserved</small>}</div><em className={step.status === "flagged" ? "flag" : "ok"}>{step.status}</em></div>)}<div className="notice">{ran ? "Live local orchestrator trace. No external LLM or patient-data connection is active." : "Run an analysis from Overview to populate the reasoning trace."}</div></section>;
}

function EvidencePage({ evidence, selectedEvidence, onSelect }: { evidence: Evidence[]; selectedEvidence: string | null; onSelect: (id: string) => void }) {
  const selected = evidence.find(e => e.chunk.id === selectedEvidence)?.chunk;
  return <section className="panel full"><div className="panelTitle"><div><h2>Evidence & RAG</h2><p>Every retrieved claim carries source type, date, population and retrieval score.</p></div><BookOpen /></div><EvidenceList evidence={evidence} onSelect={onSelect} />{selected && <div className="evidenceDetail"><div className="detailHeader"><FileCheck2 size={18} /><b>{selected.title}</b></div><p>{selected.text}</p><div className="tags"><span>{selected.sourceType}</span><span>{selected.date}</span><span>{selected.population}</span>{selected.tags.map(t => <span key={t}>{t}</span>)}</div></div>}<div className="notice">This MVP uses a local synthetic corpus. The next research phase can connect approved guidelines, studies and institutional sources with citation-level provenance.</div></section>;
}

function Monitoring({ trust, analysisId }: { trust: Trust; analysisId: string | null }) {
  const [memory, setMemory] = useState<any>(null);
  async function refresh() { const r = await fetch("/api/memory", { cache: "no-store" }); if (r.ok) setMemory(await r.json()); }
  async function decide(decision: "accepted" | "overridden" | "deferred") {
    if (!analysisId) return;
    await fetch("/api/outcome", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ analysisId, decision }) });
    await refresh();
  }
  return <section className="panel full"><div className="panelTitle"><div><h2>Adaptive Lifecycle Memory</h2><p>The system remembers analyses and human outcomes instead of treating every run as isolated.</p></div><Activity /></div><div className="monitorGrid"><div><strong>{trust.lifecycle}</strong><span>Lifecycle health</span></div><div><strong>{memory?.stats?.overrideRate ?? 0}%</strong><span>Recorded override rate</span></div><div><strong>{memory?.stats?.analyses ?? 0}</strong><span>Analyses remembered</span></div><div><strong>{memory?.stats?.nodes ?? 8}</strong><span>Graph nodes</span></div></div><div className="decisionBar"><span>{analysisId ? "Record the human outcome for the latest analysis:" : "Run an analysis first to record a human outcome."}</span><button className="decisionBtn" disabled={!analysisId} onClick={() => decide("accepted")}>Accepted</button><button className="decisionBtn override" disabled={!analysisId} onClick={() => decide("overridden")}>Override</button><button className="decisionBtn" disabled={!analysisId} onClick={() => decide("deferred")}>Deferred</button><button className="decisionBtn" onClick={refresh}>Refresh memory</button></div><div className="timeline"><div><CheckCircle2 size={16} /><span><b>Now</b> — trust profile and analysis event written to memory</span></div><div><AlertTriangle size={16} /><span><b>Watch</b> — lifecycle signals can change as outcomes accumulate</span></div><div><Database size={16} /><span><b>Next</b> — use outcome history to evaluate calibration and drift</span></div></div>{memory?.outcomes?.slice(0,5).map((o:any)=><div className="memoryEvent" key={o.timestamp}><b>{o.decision}</b><span>{new Date(o.timestamp).toLocaleString()}</span><em>{o.analysisId}</em></div>)}<div className="notice">This adaptive memory is an MVP research mechanism. It does not learn clinical truth automatically; human outcomes are stored as auditable events for later evaluation.</div></section>;
}
