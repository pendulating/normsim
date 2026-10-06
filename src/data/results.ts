/* Step 3, Evaluate: benchmark results as the paper reports them.

   Generated from the paper's LaTeX tables (papers/colm26_normative-simulacra/tables/
   benchmark_results.tex, benchmark_results_grpo.tex, benchmark_results_kto.tex) by parsing each
   cell, so no value is hand-copied. Per cell: `v` is the value (percent ×100, except CI-RL net,
   −1 to 1); `bold` is the paper's statistical tie set (re-run noise cannot separate the cell from
   its column's top value, judged within its own table); `gate` marks a run below the benchmark's
   70% strict-format parse gate; `self` marks a self-judged cell (judge and subject share weights);
   `status: 'missing'` is "not reported" (--) and `status: 'na'` is "ran but structurally
   unscoreable" (N/A). */

export interface Cell {
  v?: number;
  bold?: boolean;
  gate?: boolean;
  self?: boolean;
  status?: 'missing' | 'na';
}

export type MetricKey =
  | 'gc_appl' | 'gc_comp' | 'pl_qa' | 'pl_leak' | 'pl_help' | 'cf_r'
  | 'ci_leak' | 'ci_util' | 'ci_net' | 'vlm_q7' | 'mmlu';

export interface Metric {
  key: MetricKey;
  bench: string;
  name: string;
  /** What the number measures, in one line. */
  detail: string;
  lower?: boolean;
  /** Value range the axis may not exceed. */
  bounds: [number, number];
}

export const metrics: Metric[] = [
  { key: 'gc_appl', bench: 'GoldCoin-HIPAA', name: 'Applicability', detail: 'does HIPAA apply to the court case? (214 cases)', bounds: [0, 100] },
  { key: 'gc_comp', bench: 'GoldCoin-HIPAA', name: 'Compliance', detail: 'is the case’s flow permitted or forbidden under HIPAA? (107 cases)', bounds: [0, 100] },
  { key: 'pl_qa', bench: 'PrivacyLens', name: 'QA accuracy', detail: 'accuracy on probing questions about each vignette', bounds: [0, 100] },
  { key: 'pl_leak', bench: 'PrivacyLens', name: 'Adjusted leakage', detail: 'helpful agent actions that leak the protected detail', lower: true, bounds: [0, 100] },
  { key: 'pl_help', bench: 'PrivacyLens', name: 'Helpfulness', detail: 'judged helpfulness of the agent’s final action', bounds: [0, 100] },
  { key: 'cf_r', bench: 'ConfAIde', name: 'Human agreement', detail: 'Pearson r × 100 with crowdsourced appropriateness ratings', bounds: [-100, 100] },
  { key: 'ci_leak', bench: 'CI-RL Vignettes', name: 'Leakage', detail: 'share of disallowed attributes the response discloses', lower: true, bounds: [0, 100] },
  { key: 'ci_util', bench: 'CI-RL Vignettes', name: 'Utility', detail: 'share of allowed attributes the response includes', bounds: [0, 100] },
  { key: 'ci_net', bench: 'CI-RL Vignettes', name: 'Net score', detail: 'utility − leakage, −1 to 1; an unparseable row scores −1', bounds: [-1, 1] },
  { key: 'vlm_q7', bench: 'VLM-GeoPrivacy', name: 'Disclosure granularity', detail: 'Q7 accuracy: how precise a location it is appropriate to disclose', bounds: [0, 100] },
  { key: 'mmlu', bench: 'MMLU', name: 'Accuracy', detail: 'general-knowledge control, not a CI benchmark', bounds: [0, 100] },
];

/** Zero-shot (the instruct checkpoint) and SFT for the canonical model set. */
/** Titles of the three result cards, shared with the table of contents. */
export const cards = {
  sft: 'Zero-shot vs. SFT, 11 task LLMs',
  rl: 'Qwen3.5-9B through every stage',
  grounding: 'Where grounding shows: held-out normative alignment',
};

export const zeroShotSft = {
  teacher: { model: 'Gemma-4-31B-it', cells: { gc_appl: {v: 87.4}, gc_comp: {v: 83.2}, pl_qa: {v: 92.6}, pl_leak: {self: true, v: 41.7}, pl_help: {self: true, v: 51.9}, cf_r: {v: 68.8}, ci_leak: {v: 25.5}, ci_util: {v: 86.7}, ci_net: {v: 0.61}, vlm_q7: {v: 68.7}, mmlu: {v: 87.1} } },
  models: [
    {
      model: 'Qwen3.5-2B',
      zeroShot: { gc_appl: {v: 63.1}, gc_comp: {bold: true, v: 84.1}, pl_qa: {v: 83.7}, pl_leak: {v: 41.4}, pl_help: {v: 35.4}, cf_r: {v: 13.9}, ci_leak: {gate: true, v: 49.6}, ci_util: {gate: true, v: 83.5}, ci_net: {gate: true, v: -0.94}, vlm_q7: {v: 21.2}, mmlu: {v: 58.0} },
      sft: { gc_appl: {v: 80.8}, gc_comp: {bold: true, v: 83.2}, pl_qa: {v: 60.4}, pl_leak: {v: 41.4}, pl_help: {v: 31.3}, cf_r: {v: 25.4}, ci_leak: {gate: true, v: 26.4}, ci_util: {gate: true, v: 50.7}, ci_net: {gate: true, v: -0.97}, vlm_q7: {v: 21.2}, mmlu: {v: 53.8} },
    },
    {
      model: 'Qwen3.5-4B',
      zeroShot: { gc_appl: {v: 89.7}, gc_comp: {bold: true, v: 81.3}, pl_qa: {v: 93.6}, pl_leak: {v: 55.8}, pl_help: {v: 54.3}, cf_r: {v: 54.1}, ci_leak: {gate: true, v: 51.8}, ci_util: {bold: true, gate: true, v: 87.2}, ci_net: {gate: true, v: -0.97}, vlm_q7: {v: 50.8}, mmlu: {v: 74.0} },
      sft: { gc_appl: {v: 94.4}, gc_comp: {v: 78.5}, pl_qa: {v: 96.1}, pl_leak: {v: 50.5}, pl_help: {v: 65.1}, cf_r: {v: 46.2}, ci_leak: {gate: true, v: 31.3}, ci_util: {gate: true, v: 74.0}, ci_net: {gate: true, v: -0.82}, vlm_q7: {v: 52.0}, mmlu: {v: 72.8} },
    },
    {
      model: 'Qwen3.5-9B',
      zeroShot: { gc_appl: {v: 95.3}, gc_comp: {bold: true, v: 81.3}, pl_qa: {v: 94.0}, pl_leak: {v: 57.2}, pl_help: {v: 67.7}, cf_r: {v: 66.1}, ci_leak: {gate: true, v: 37.7}, ci_util: {gate: true, v: 85.9}, ci_net: {gate: true, v: -0.95}, vlm_q7: {v: 62.3}, mmlu: {v: 78.4} },
      sft: { gc_appl: {v: 95.3}, gc_comp: {bold: true, v: 83.2}, pl_qa: {v: 93.2}, pl_leak: {v: 50.2}, pl_help: {v: 64.1}, cf_r: {v: 58.0}, ci_leak: {gate: true, v: 69.9}, ci_util: {bold: true, gate: true, v: 87.3}, ci_net: {gate: true, v: -0.97}, vlm_q7: {v: 62.3}, mmlu: {v: 75.3} },
    },
    {
      model: 'Gemma-4-E2B',
      zeroShot: { gc_appl: {v: 82.2}, gc_comp: {v: 77.6}, pl_qa: {v: 95.8}, pl_leak: {v: 35.0}, pl_help: {v: 64.1}, cf_r: {v: 18.3}, ci_leak: {v: 22.9}, ci_util: {v: 82.6}, ci_net: {v: 0.6}, vlm_q7: {v: 21.3}, mmlu: {v: 53.2} },
      sft: { gc_appl: {v: 78.0}, gc_comp: {v: 78.5}, pl_qa: {v: 90.5}, pl_leak: {v: 37.6}, pl_help: {v: 61.8}, cf_r: {v: 50.8}, ci_leak: {gate: true, v: 24.3}, ci_util: {gate: true, v: 76.4}, ci_net: {gate: true, v: -0.11}, vlm_q7: {v: 23.8}, mmlu: {v: 46.4} },
    },
    {
      model: 'Gemma-4-E4B',
      zeroShot: { gc_appl: {v: 93.5}, gc_comp: {v: 79.4}, pl_qa: {v: 90.8}, pl_leak: {v: 45.4}, pl_help: {bold: true, v: 75.1}, cf_r: {v: 57.3}, ci_leak: {v: 21.2}, ci_util: {v: 83.4}, ci_net: {bold: true, v: 0.62}, vlm_q7: {v: 23.8}, mmlu: {v: 69.8} },
      sft: { gc_appl: {v: 87.9}, gc_comp: {bold: true, v: 83.2}, pl_qa: {v: 92.2}, pl_leak: {v: 34.9}, pl_help: {bold: true, v: 77.0}, cf_r: {v: 44.2}, ci_leak: {bold: true, v: 18.0}, ci_util: {v: 78.9}, ci_net: {v: 0.49}, vlm_q7: {v: 22.0}, mmlu: {v: 63.6} },
    },
    {
      model: 'Gemma-4-12B',
      zeroShot: { gc_appl: {v: 92.1}, gc_comp: {v: 76.6}, pl_qa: {v: 94.5}, pl_leak: {gate: true, v: 53.5}, pl_help: {bold: true, gate: true, v: 77.0}, cf_r: {bold: true, v: 71.5}, ci_leak: {v: 23.7}, ci_util: {v: 86.0}, ci_net: {bold: true, v: 0.62}, vlm_q7: {bold: true, v: 64.2}, mmlu: {v: 79.0} },
      sft: { gc_appl: {bold: true, v: 98.1}, gc_comp: {v: 75.7}, pl_qa: {v: 94.5}, pl_leak: {v: 40.1}, pl_help: {v: 72.6}, cf_r: {bold: true, v: 71.9}, ci_leak: {v: 21.5}, ci_util: {v: 83.2}, ci_net: {bold: true, v: 0.62}, vlm_q7: {v: 52.6}, mmlu: {v: 78.4} },
    },
    {
      model: 'OpenThinker3-7B',
      zeroShot: { gc_appl: {v: 83.2}, gc_comp: {v: 18.7}, pl_qa: {v: 50.9}, pl_leak: {v: 41.1}, pl_help: {v: 35.2}, cf_r: {v: 31.7}, ci_leak: {gate: true, v: 48.6}, ci_util: {gate: true, v: 69.1}, ci_net: {gate: true, v: -0.66}, vlm_q7: {status: "missing"}, mmlu: {v: 54.7} },
      sft: { gc_appl: {v: 86.4}, gc_comp: {v: 34.6}, pl_qa: {status: "missing"}, pl_leak: {status: "missing"}, pl_help: {status: "missing"}, cf_r: {v: 26.3}, ci_leak: {status: "na"}, ci_util: {status: "na"}, ci_net: {gate: true, v: -0.96}, vlm_q7: {status: "missing"}, mmlu: {v: 53.1} },
    },
    {
      model: 'Llama-3.1-8B',
      zeroShot: { gc_appl: {v: 91.1}, gc_comp: {v: 61.7}, pl_qa: {v: 81.3}, pl_leak: {bold: true, v: 30.5}, pl_help: {v: 16.6}, cf_r: {v: 57.2}, ci_leak: {gate: true, v: 21.7}, ci_util: {gate: true, v: 78.2}, ci_net: {gate: true, v: -0.31}, vlm_q7: {status: "missing"}, mmlu: {v: 62.8} },
      sft: { gc_appl: {v: 93.9}, gc_comp: {v: 68.2}, pl_qa: {v: 79.5}, pl_leak: {v: 39.8}, pl_help: {v: 19.9}, cf_r: {v: 51.5}, ci_leak: {gate: true, v: 29.9}, ci_util: {gate: true, v: 77.5}, ci_net: {gate: true, v: -0.37}, vlm_q7: {status: "missing"}, mmlu: {v: 59.4} },
    },
    {
      model: 'HARC-Llama-3.1-8B',
      zeroShot: { gc_appl: {v: 80.4}, gc_comp: {v: 50.5}, pl_qa: {v: 96.2}, pl_leak: {v: 32.3}, pl_help: {v: 19.5}, cf_r: {status: "missing"}, ci_leak: {gate: true, v: 19.4}, ci_util: {gate: true, v: 75.9}, ci_net: {gate: true, v: -0.25}, vlm_q7: {status: "missing"}, mmlu: {v: 61.8} },
      sft: { gc_appl: {v: 93.0}, gc_comp: {v: 56.1}, pl_qa: {bold: true, v: 97.7}, pl_leak: {v: 34.1}, pl_help: {v: 20.0}, cf_r: {v: 61.2}, ci_leak: {gate: true, v: 27.4}, ci_util: {gate: true, v: 67.1}, ci_net: {gate: true, v: -0.39}, vlm_q7: {status: "missing"}, mmlu: {v: 58.3} },
    },
    {
      model: 'Phi-4',
      zeroShot: { gc_appl: {v: 96.3}, gc_comp: {v: 74.8}, pl_qa: {v: 94.4}, pl_leak: {v: 52.0}, pl_help: {v: 66.7}, cf_r: {v: 66.2}, ci_leak: {v: 27.5}, ci_util: {v: 85.7}, ci_net: {v: 0.58}, vlm_q7: {status: "missing"}, mmlu: {v: 79.6} },
      sft: { gc_appl: {v: 88.3}, gc_comp: {v: 79.4}, pl_qa: {v: 89.9}, pl_leak: {gate: true, v: 50.0}, pl_help: {gate: true, v: 63.6}, cf_r: {v: 67.6}, ci_leak: {status: "na"}, ci_util: {status: "na"}, ci_net: {gate: true, v: -0.93}, vlm_q7: {status: "missing"}, mmlu: {v: 79.6} },
    },
    {
      model: 'GPT-OSS-20B',
      zeroShot: { gc_appl: {v: 93.0}, gc_comp: {v: 63.6}, pl_qa: {v: 92.0}, pl_leak: {v: 50.0}, pl_help: {bold: true, v: 74.6}, cf_r: {bold: true, v: 71.5}, ci_leak: {gate: true, v: 30.9}, ci_util: {gate: true, v: 63.3}, ci_net: {gate: true, v: -0.5}, vlm_q7: {status: "missing"}, mmlu: {bold: true, v: 83.5} },
      sft: { gc_appl: {v: 87.9}, gc_comp: {v: 72.0}, pl_qa: {status: "missing"}, pl_leak: {status: "missing"}, pl_help: {status: "missing"}, cf_r: {v: 62.0}, ci_leak: {status: "na"}, ci_util: {status: "na"}, ci_net: {gate: true, v: -0.96}, vlm_q7: {status: "missing"}, mmlu: {v: 81.2} },
    },
  ],
};

/** Qwen3.5-9B through every stage. Both RL tables print the same zero-shot and SFT base rows;
    `kind`: 'ref' zero-shot, 'base' the merged SFT base every arm trains from, 'reported' the
    paper's reported GRPO and KTO models, 'grpo' / 'kto' their ablation arms. */
export const rlStage: { arm: string; kind: 'ref' | 'base' | 'reported' | 'grpo' | 'kto'; cells: Record<MetricKey, Cell> }[] = [
    { arm: 'Zero-shot', kind: 'ref', cells: { gc_appl: {v: 95.8}, gc_comp: {v: 81.3}, pl_qa: {v: 93.9}, pl_leak: {v: 50.9}, pl_help: {bold: true, v: 77.3}, cf_r: {v: 64.1}, ci_leak: {gate: true, v: 37.7}, ci_util: {gate: true, v: 85.9}, ci_net: {gate: true, v: -0.95}, vlm_q7: {v: 62.3}, mmlu: {v: 78.5} } },
    { arm: 'SFT base', kind: 'base', cells: { gc_appl: {v: 94.9}, gc_comp: {bold: true, v: 82.2}, pl_qa: {v: 93.3}, pl_leak: {gate: true, v: 49.0}, pl_help: {bold: true, gate: true, v: 74.2}, cf_r: {v: 62.2}, ci_leak: {gate: true, v: 67.3}, ci_util: {gate: true, v: 85.3}, ci_net: {gate: true, v: -0.96}, vlm_q7: {v: 57.0}, mmlu: {v: 75.3} } },
    { arm: 'GRPO, full reward', kind: 'reported', cells: { gc_appl: {v: 95.8}, gc_comp: {bold: true, v: 84.1}, pl_qa: {v: 94.0}, pl_leak: {v: 48.8}, pl_help: {bold: true, v: 75.2}, cf_r: {v: 63.6}, ci_leak: {gate: true, v: 31.2}, ci_util: {gate: true, v: 77.4}, ci_net: {gate: true, v: -0.87}, vlm_q7: {v: 57.1}, mmlu: {v: 75.2} } },
    { arm: 'GRPO −aux', kind: 'grpo', cells: { gc_appl: {v: 95.3}, gc_comp: {bold: true, v: 82.2}, pl_qa: {v: 92.7}, pl_leak: {v: 50.2}, pl_help: {bold: true, v: 75.4}, cf_r: {v: 59.5}, ci_leak: {gate: true, v: 61.6}, ci_util: {gate: true, v: 84.6}, ci_net: {gate: true, v: -0.98}, vlm_q7: {v: 57.5}, mmlu: {v: 75.3} } },
    { arm: 'GRPO −core', kind: 'grpo', cells: { gc_appl: {v: 94.4}, gc_comp: {bold: true, v: 83.2}, pl_qa: {v: 92.9}, pl_leak: {v: 47.6}, pl_help: {v: 73.7}, cf_r: {v: 61.9}, ci_leak: {gate: true, v: 28.2}, ci_util: {gate: true, v: 73.5}, ci_net: {gate: true, v: -1.0}, vlm_q7: {v: 56.8}, mmlu: {v: 75.5} } },
    { arm: 'GRPO −judg', kind: 'grpo', cells: { gc_appl: {v: 96.3}, gc_comp: {v: 81.3}, pl_qa: {v: 93.2}, pl_leak: {v: 45.0}, pl_help: {bold: true, v: 74.9}, cf_r: {v: 60.7}, ci_leak: {gate: true, v: 29.2}, ci_util: {gate: true, v: 75.9}, ci_net: {gate: true, v: -1.0}, vlm_q7: {v: 57.0}, mmlu: {v: 75.6} } },
    { arm: 'KTO, label only', kind: 'reported', cells: { gc_appl: {v: 93.0}, gc_comp: {bold: true, v: 83.2}, pl_qa: {v: 95.3}, pl_leak: {v: 48.5}, pl_help: {v: 73.9}, cf_r: {v: 60.6}, ci_leak: {gate: true, v: 71.3}, ci_util: {gate: true, v: 85.1}, ci_net: {gate: true, v: -0.98}, vlm_q7: {v: 57.0}, mmlu: {v: 76.1} } },
    { arm: 'KTO, label + norm', kind: 'kto', cells: { gc_appl: {v: 93.9}, gc_comp: {bold: true, v: 82.2}, pl_qa: {v: 94.5}, pl_leak: {gate: true, v: 47.2}, pl_help: {bold: true, gate: true, v: 75.5}, cf_r: {v: 62.8}, ci_leak: {gate: true, v: 68.7}, ci_util: {gate: true, v: 86.6}, ci_net: {gate: true, v: -0.98}, vlm_q7: {v: 57.1}, mmlu: {v: 75.1} } },
    { arm: 'KTO, label + rationale', kind: 'kto', cells: { gc_appl: {v: 90.2}, gc_comp: {bold: true, v: 82.2}, pl_qa: {v: 96.3}, pl_leak: {gate: true, v: 49.6}, pl_help: {gate: true, v: 74.0}, cf_r: {v: 62.3}, ci_leak: {gate: true, v: 77.4}, ci_util: {bold: true, gate: true, v: 87.6}, ci_net: {gate: true, v: -1.0}, vlm_q7: {v: 56.7}, mmlu: {v: 74.3} } },
    { arm: 'SFT control', kind: 'kto', cells: { gc_appl: {v: 94.4}, gc_comp: {bold: true, v: 82.2}, pl_qa: {v: 94.2}, pl_leak: {gate: true, v: 45.9}, pl_help: {gate: true, v: 70.6}, cf_r: {v: 57.7}, ci_leak: {gate: true, v: 67.5}, ci_util: {gate: true, v: 85.7}, ci_net: {gate: true, v: -0.97}, vlm_q7: {v: 55.7}, mmlu: {v: 74.9} } },
];

/** Held-out normative alignment, the double-heldout column of tables/distilled_grounding.tex:
    Cohen's κ between each extractor's own appropriateness label and the norm-grounded label, on
    the 503 fiction10 chunks unseen by GRPO and withheld from KTO preference-set construction. The
    chance model is fixed within each novel; intervals are 95% bootstrap percentiles resampling
    whole novels (n = 10 books, so coarse). `bold` follows the table. */
export const grounding: {
  extractor: string;
  kind: 'teacher' | 'ref' | 'base' | 'reported';
  flows: number;
  kappa: number;
  ci: [number, number];
  bold?: boolean;
}[] = [
  { extractor: 'Gemma-4-31B-it teacher', kind: 'teacher', flows: 2764, kappa: 0.068, ci: [0.04, 0.09] },
  { extractor: 'Qwen3.5-9B instruct', kind: 'ref', flows: 2537, kappa: 0.029, ci: [-0.01, 0.064] },
  { extractor: '+ SFT', kind: 'base', flows: 2502, kappa: 0.06, ci: [0.041, 0.078] },
  { extractor: '+ SFT + GRPO', kind: 'reported', flows: 2153, kappa: 0.12, ci: [0.082, 0.145], bold: true },
  { extractor: '+ SFT + KTO', kind: 'reported', flows: 2154, kappa: 0.11, ci: [0.075, 0.14], bold: true },
];
