/** Copy for "How it works". */
export const methodIntro =
  'Our central insight is that teaching an LLM to reason about privacy norms requires rich examples of normative reasoning grounded in well-defined social contexts. Narrative fiction supplies exactly that: novels like Pride and Prejudice and 1984 depict fully realized societies that specify who may share what with whom, under what conditions, and with what consequences. We treat each novel as a simulacrum of a human society and distill its normative landscape, top-down, into a machine-readable form.';

/** Headings for the three stages. Steps 1 and 2 are told by their diagrams;
 *  step 3's prose introduces the results figure below it. */
export const stages = {
  extract: {
    label: 'Step 1',
    title: 'Extract',
    lead: 'An extraction teacher (Gemma-4-31B-it) reads ten public-domain novels from Project Gutenberg and records two kinds of structure: descriptive information flows, which say who passed what about whom and on what terms, and prescriptive norms, which say what the society expects. Keeping the two apart is what makes grounding checkable later. The corpus yields 16,200 flows and 10,034 norms, gathered book by book into normative universes.',
  },
  train: {
    label: 'Step 2',
    title: 'Train',
    lead: 'Supervised fine-tuning first teaches the model to express its privacy reasoning in CI syntax. Two further arms then make that reasoning accountable to context, each trained from the same merged SFT checkpoint so that neither confounds the other: online GRPO against a modular reward grounded in the source novel’s normative universe, and offline KTO against desirability labels drawn from the same universe.',
  },
  evaluate: {
    label: 'Step 3',
    title: 'Evaluate',
    paragraphs: [
      'We evaluate every fine-tuning stage on five existing CI-aligned benchmarks: PrivacyLens, ConfAIde, GoldCoin-HIPAA, CI-RL Vignettes, and VLM-GeoPrivacy. None of these benchmarks resemble the training texts, so improvements must come from transferable reasoning patterns rather than memorized scenarios.',
      'The study spans 11 task LLMs from 2B to 20B parameters across five model families (Qwen3.5, Gemma4, Phi-4, GPT-OSS, and Llama3.1), including reasoning- and safety-specific fine-tunes. We pair the quantitative results with qualitative review of model completions.',
      'Most of these comparisons do not resolve. The benchmarks are small, several metrics rest on an LLM judge, and sampling noise across seeds is large, so four of the five benchmarks have at least one major metric with no single best model. The figure keeps the paper’s markings: which cells are statistically tied for the top, and which runs mostly failed the output format. Where normative grounding does show is in the weights: on chunks neither RL arm saw, both double the alignment SFT buys.',
    ],
  },
};
