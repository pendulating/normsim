/** Content for the three Step 2 diagrams under "How it works": SFT, GRPO, and
 *  KTO. Architecture, hyperparameters, and counts follow the paper
 *  (papers/colm26_normative-simulacra/03_methods.tex and
 *  A_additional-methods.tex: "SFT training data and hyperparameters", "GRPO
 *  training hyperparameters", "Reward component details", "Offline preference
 *  training"). Worked examples are verbatim training data or traces; each one's
 *  comment gives its source file. */

import type { DiagramNode, DiagramStep } from '../components/StepDiagram.astro';

/* ------------------------------------------------------------------------
   Phase 1: supervised fine-tuning
   ------------------------------------------------------------------------ */

export const sft = {
  name: 'Supervised fine-tuning diagram',
  pipeline: [
    { id: 'teacher', title: 'Teacher extractions', detail: 'Gemma-4-31B-it' },
    { id: 'pairs', title: 'Training pairs', detail: 'chunk → trace + tuples' },
    { id: 'model', title: 'Task LLM', detail: '+ LoRA, r = 64' },
    { id: 'policy', title: 'SFT policy', detail: 'merged base for RL' },
  ] as DiagramNode[],
  steps: [
    {
      label: 'Pair',
      caption:
        'Every chunk the extraction teacher read becomes a training pair. The input is the raw chunk with the extraction instruction; the target is the teacher’s reasoning trace followed by the CI flows it extracted, each with an appropriateness judgment.',
      focus: ['teacher', 'pairs'],
      view: 'pair',
      dwell: 6500,
    },
    {
      label: 'Negatives',
      caption:
        'Chunks with no information exchange enter as negatives, so the model learns to abstain. Only genuinely contentless chunks qualify: admitting chunks that hold an exchange but no governing norm taught a marked over-abstention prior.',
      focus: ['pairs'],
      view: 'negative',
      dwell: 5000,
    },
    {
      label: 'Fine-tune',
      caption:
        'Each task LLM is fine-tuned from its instruction-tuned checkpoint with a LoRA adapter and the standard next-token loss. Ten of the eleven models complete 540 optimizer steps over three epochs.',
      focus: ['model'],
      view: 'train',
    },
    {
      label: 'SFT Limitations',
      caption:
        'SFT elicits CI-structured output, but its appropriateness judgments come from the weights alone. On 1,200 teacher flows, the labels SFT trains on agree with the norm-derived label on only 10% of inappropriate flows, a macro agreement below what a blanket label earns. The merged SFT checkpoint is the starting point for both arms below.',
      focus: ['policy'],
      view: 'train',
      dwell: 5500,
    },
  ] as DiagramStep[],
  /** Teacher agreement with norm-derived reference labels (A_additional-methods, R<sub>direct</sub>). */
  agreement: { appropriate: 0.863, inappropriate: 0.102, macro: 0.482, blanket: 0.5, n: 1200 },
  hyper: ['learning rate 2×10⁻⁵', '3 epochs', 'effective batch 16', 'max 8,192 tokens', 'LoRA dropout 0.05'],
  /** Pair counts for the SFT base both Phase 2 arms train from (sft_data_prep log, line 18). */
  pairs: { total: 2874, positive: 2867, negative: 7 },
  /** Training loss of the 11 canonical SFT runs, as [epoch, loss] at every 10th optimizer step
     (log_history of each run's last trainer_state.json, under multirun/<run>/sft_only/outputs/sft/checkpoint/).
     Each point is the mean loss since the previous log. gpt-oss-20b logs every 10 of its 270 steps.
     `accuracy` is the final mean token accuracy. Qwen3.5-9B is the Phase 2 base (model qwen3.5-9b/sft-canonical). */
  base: 'Qwen3.5-9B',
  curves: [
    { model: 'Qwen3.5-2B', run: '2026-07-15_sft_canonical_gemma4/00-07-44/0', steps: 540, accuracy: 0.868,
      points: [[0.056, 1.067], [0.111, 0.959], [0.167, 0.824], [0.223, 0.703], [0.278, 0.647], [0.334, 0.614], [0.390, 0.597], [0.445, 0.578], [0.501, 0.568], [0.557, 0.556], [0.612, 0.554], [0.668, 0.547], [0.724, 0.544], [0.779, 0.530], [0.835, 0.534], [0.891, 0.530], [0.946, 0.523], [1.000, 0.520], [1.056, 0.508], [1.111, 0.504], [1.167, 0.493], [1.223, 0.502], [1.278, 0.498], [1.334, 0.495], [1.390, 0.488], [1.445, 0.489], [1.501, 0.487], [1.557, 0.491], [1.612, 0.488], [1.668, 0.487], [1.724, 0.499], [1.779, 0.488], [1.835, 0.483], [1.891, 0.486], [1.946, 0.478], [2.000, 0.478], [2.056, 0.465], [2.111, 0.458], [2.167, 0.460], [2.223, 0.467], [2.278, 0.468], [2.334, 0.463], [2.390, 0.458], [2.445, 0.459], [2.501, 0.457], [2.557, 0.461], [2.612, 0.461], [2.668, 0.454], [2.724, 0.459], [2.779, 0.464], [2.835, 0.455], [2.891, 0.456], [2.946, 0.461], [3.000, 0.457]] },
    { model: 'Qwen3.5-4B', run: '2026-07-15_sft_canonical_gemma4/00-07-44/1', steps: 540, accuracy: 0.890,
      points: [[0.056, 0.911], [0.111, 0.802], [0.167, 0.689], [0.223, 0.576], [0.278, 0.527], [0.334, 0.496], [0.390, 0.480], [0.445, 0.463], [0.501, 0.452], [0.557, 0.442], [0.612, 0.438], [0.668, 0.434], [0.724, 0.433], [0.779, 0.420], [0.835, 0.421], [0.891, 0.419], [0.946, 0.412], [1.000, 0.409], [1.056, 0.394], [1.111, 0.392], [1.167, 0.384], [1.223, 0.390], [1.278, 0.389], [1.334, 0.385], [1.390, 0.379], [1.445, 0.382], [1.501, 0.380], [1.557, 0.380], [1.612, 0.380], [1.668, 0.379], [1.724, 0.387], [1.779, 0.381], [1.835, 0.376], [1.891, 0.376], [1.946, 0.370], [2.000, 0.373], [2.056, 0.355], [2.111, 0.348], [2.167, 0.351], [2.223, 0.357], [2.278, 0.355], [2.334, 0.354], [2.390, 0.350], [2.445, 0.348], [2.501, 0.349], [2.557, 0.350], [2.612, 0.351], [2.668, 0.346], [2.724, 0.348], [2.779, 0.352], [2.835, 0.345], [2.891, 0.347], [2.946, 0.352], [3.000, 0.349]] },
    { model: 'Qwen3.5-9B', run: '2026-07-15_sft_canonical_gemma4/00-07-44/2', steps: 540, accuracy: 0.898,
      points: [[0.056, 0.855], [0.111, 0.771], [0.167, 0.677], [0.223, 0.554], [0.278, 0.492], [0.334, 0.458], [0.390, 0.441], [0.445, 0.426], [0.501, 0.415], [0.557, 0.403], [0.612, 0.400], [0.668, 0.395], [0.724, 0.393], [0.779, 0.382], [0.835, 0.382], [0.891, 0.380], [0.946, 0.374], [1.000, 0.369], [1.056, 0.360], [1.111, 0.356], [1.167, 0.349], [1.223, 0.355], [1.278, 0.353], [1.334, 0.350], [1.390, 0.344], [1.445, 0.346], [1.501, 0.345], [1.557, 0.345], [1.612, 0.344], [1.668, 0.343], [1.724, 0.351], [1.779, 0.346], [1.835, 0.342], [1.891, 0.339], [1.946, 0.335], [2.000, 0.339], [2.056, 0.323], [2.111, 0.316], [2.167, 0.319], [2.223, 0.324], [2.278, 0.324], [2.334, 0.323], [2.390, 0.319], [2.445, 0.318], [2.501, 0.317], [2.557, 0.317], [2.612, 0.319], [2.668, 0.314], [2.724, 0.317], [2.779, 0.320], [2.835, 0.313], [2.891, 0.314], [2.946, 0.320], [3.000, 0.316]] },
    { model: 'OpenThinker3-7B', run: '2026-07-15_sft_canonical_gemma4/00-07-44/6', steps: 540, accuracy: 0.864,
      points: [[0.056, 1.383], [0.111, 1.306], [0.167, 1.167], [0.223, 1.026], [0.278, 0.894], [0.334, 0.802], [0.390, 0.743], [0.445, 0.703], [0.501, 0.670], [0.557, 0.651], [0.612, 0.641], [0.668, 0.627], [0.724, 0.615], [0.779, 0.593], [0.835, 0.596], [0.891, 0.590], [0.946, 0.576], [1.000, 0.566], [1.056, 0.555], [1.111, 0.549], [1.167, 0.538], [1.223, 0.539], [1.278, 0.537], [1.334, 0.531], [1.390, 0.520], [1.445, 0.521], [1.501, 0.519], [1.557, 0.520], [1.612, 0.516], [1.668, 0.515], [1.724, 0.523], [1.779, 0.515], [1.835, 0.509], [1.891, 0.511], [1.946, 0.502], [2.000, 0.501], [2.056, 0.486], [2.111, 0.479], [2.167, 0.479], [2.223, 0.486], [2.278, 0.488], [2.334, 0.482], [2.390, 0.478], [2.445, 0.479], [2.501, 0.474], [2.557, 0.479], [2.612, 0.480], [2.668, 0.472], [2.724, 0.475], [2.779, 0.479], [2.835, 0.472], [2.891, 0.472], [2.946, 0.478], [3.000, 0.474]] },
    { model: 'Llama-3.1-8B', run: '2026-07-15_sft_canonical_gemma4/00-07-44/7', steps: 540, accuracy: 0.887,
      points: [[0.056, 0.985], [0.111, 0.920], [0.167, 0.804], [0.223, 0.674], [0.278, 0.599], [0.334, 0.551], [0.390, 0.521], [0.445, 0.504], [0.501, 0.483], [0.557, 0.472], [0.612, 0.470], [0.668, 0.460], [0.724, 0.456], [0.779, 0.443], [0.835, 0.445], [0.891, 0.440], [0.946, 0.433], [1.000, 0.423], [1.056, 0.417], [1.111, 0.412], [1.167, 0.404], [1.223, 0.408], [1.278, 0.406], [1.334, 0.402], [1.390, 0.394], [1.445, 0.397], [1.501, 0.395], [1.557, 0.395], [1.612, 0.394], [1.668, 0.391], [1.724, 0.403], [1.779, 0.395], [1.835, 0.390], [1.891, 0.388], [1.946, 0.383], [2.000, 0.385], [2.056, 0.367], [2.111, 0.362], [2.167, 0.362], [2.223, 0.369], [2.278, 0.366], [2.334, 0.367], [2.390, 0.362], [2.445, 0.363], [2.501, 0.359], [2.557, 0.361], [2.612, 0.364], [2.668, 0.359], [2.724, 0.360], [2.779, 0.363], [2.835, 0.356], [2.891, 0.357], [2.946, 0.364], [3.000, 0.359]] },
    { model: 'HARC-Llama-3.1-8B', run: '2026-07-15_sft_canonical_gemma4/00-07-44/8', steps: 540, accuracy: 0.887,
      points: [[0.056, 0.986], [0.111, 0.920], [0.167, 0.804], [0.223, 0.673], [0.278, 0.598], [0.334, 0.552], [0.390, 0.521], [0.445, 0.504], [0.501, 0.483], [0.557, 0.472], [0.612, 0.470], [0.668, 0.460], [0.724, 0.456], [0.779, 0.443], [0.835, 0.445], [0.891, 0.440], [0.946, 0.433], [1.000, 0.424], [1.056, 0.417], [1.111, 0.412], [1.167, 0.403], [1.223, 0.409], [1.278, 0.406], [1.334, 0.402], [1.390, 0.394], [1.445, 0.397], [1.501, 0.395], [1.557, 0.395], [1.612, 0.394], [1.668, 0.391], [1.724, 0.403], [1.779, 0.395], [1.835, 0.390], [1.891, 0.389], [1.946, 0.383], [2.000, 0.385], [2.056, 0.367], [2.111, 0.363], [2.167, 0.362], [2.223, 0.369], [2.278, 0.366], [2.334, 0.367], [2.390, 0.362], [2.445, 0.363], [2.501, 0.359], [2.557, 0.361], [2.612, 0.364], [2.668, 0.359], [2.724, 0.360], [2.779, 0.363], [2.835, 0.356], [2.891, 0.358], [2.946, 0.364], [3.000, 0.360]] },
    { model: 'Phi-4', run: '2026-07-15_sft_canonical_gemma4/00-07-44/9', steps: 540, accuracy: 0.898,
      points: [[0.056, 1.212], [0.111, 1.139], [0.167, 0.966], [0.223, 0.803], [0.278, 0.658], [0.334, 0.567], [0.390, 0.509], [0.445, 0.471], [0.501, 0.447], [0.557, 0.429], [0.612, 0.422], [0.668, 0.412], [0.724, 0.405], [0.779, 0.393], [0.835, 0.390], [0.891, 0.387], [0.946, 0.376], [1.000, 0.374], [1.056, 0.370], [1.111, 0.366], [1.167, 0.354], [1.223, 0.359], [1.278, 0.357], [1.334, 0.354], [1.390, 0.346], [1.445, 0.346], [1.501, 0.345], [1.557, 0.347], [1.612, 0.345], [1.668, 0.341], [1.724, 0.352], [1.779, 0.345], [1.835, 0.342], [1.891, 0.338], [1.946, 0.334], [2.000, 0.336], [2.056, 0.324], [2.111, 0.319], [2.167, 0.319], [2.223, 0.327], [2.278, 0.325], [2.334, 0.323], [2.390, 0.318], [2.445, 0.320], [2.501, 0.317], [2.557, 0.319], [2.612, 0.318], [2.668, 0.315], [2.724, 0.319], [2.779, 0.321], [2.835, 0.313], [2.891, 0.314], [2.946, 0.320], [3.000, 0.316]] },
    { model: 'Gemma-4-E2B', run: '2026-07-15_sft_canonical_gemma4/09-37-54/0', steps: 540, accuracy: 0.869,
      points: [[0.056, 1.823], [0.111, 1.613], [0.167, 1.246], [0.223, 0.952], [0.278, 0.786], [0.334, 0.692], [0.390, 0.636], [0.445, 0.603], [0.501, 0.575], [0.557, 0.553], [0.612, 0.547], [0.668, 0.534], [0.724, 0.526], [0.779, 0.510], [0.835, 0.514], [0.891, 0.514], [0.946, 0.498], [1.000, 0.494], [1.056, 0.484], [1.111, 0.484], [1.167, 0.474], [1.223, 0.477], [1.278, 0.474], [1.334, 0.473], [1.390, 0.464], [1.445, 0.464], [1.501, 0.465], [1.557, 0.468], [1.612, 0.467], [1.668, 0.465], [1.724, 0.474], [1.779, 0.463], [1.835, 0.457], [1.891, 0.462], [1.946, 0.454], [2.000, 0.453], [2.056, 0.450], [2.111, 0.442], [2.167, 0.438], [2.223, 0.446], [2.278, 0.445], [2.334, 0.445], [2.390, 0.439], [2.445, 0.439], [2.501, 0.436], [2.557, 0.440], [2.612, 0.442], [2.668, 0.434], [2.724, 0.438], [2.779, 0.443], [2.835, 0.435], [2.891, 0.435], [2.946, 0.440], [3.000, 0.439]] },
    { model: 'Gemma-4-E4B', run: '2026-07-15_sft_canonical_gemma4/09-37-54/1', steps: 540, accuracy: 0.884,
      points: [[0.056, 1.348], [0.111, 1.151], [0.167, 0.889], [0.223, 0.717], [0.278, 0.612], [0.334, 0.555], [0.390, 0.524], [0.445, 0.503], [0.501, 0.486], [0.557, 0.471], [0.612, 0.467], [0.668, 0.458], [0.724, 0.452], [0.779, 0.440], [0.835, 0.440], [0.891, 0.438], [0.946, 0.430], [1.000, 0.422], [1.056, 0.414], [1.111, 0.414], [1.167, 0.406], [1.223, 0.409], [1.278, 0.406], [1.334, 0.403], [1.390, 0.398], [1.445, 0.397], [1.501, 0.398], [1.557, 0.399], [1.612, 0.398], [1.668, 0.396], [1.724, 0.405], [1.779, 0.396], [1.835, 0.393], [1.891, 0.391], [1.946, 0.385], [2.000, 0.386], [2.056, 0.379], [2.111, 0.373], [2.167, 0.369], [2.223, 0.379], [2.278, 0.377], [2.334, 0.377], [2.390, 0.372], [2.445, 0.372], [2.501, 0.370], [2.557, 0.371], [2.612, 0.372], [2.668, 0.366], [2.724, 0.367], [2.779, 0.374], [2.835, 0.366], [2.891, 0.368], [2.946, 0.373], [3.000, 0.371]] },
    { model: 'Gemma-4-12B', run: '2026-07-15_sft_canonical_gemma4/10-47-28/0', steps: 540, accuracy: 0.897,
      points: [[0.056, 3.124], [0.111, 2.721], [0.167, 1.821], [0.223, 1.049], [0.278, 0.791], [0.334, 0.615], [0.390, 0.528], [0.445, 0.489], [0.501, 0.467], [0.557, 0.442], [0.612, 0.434], [0.668, 0.420], [0.724, 0.415], [0.779, 0.402], [0.835, 0.402], [0.891, 0.401], [0.946, 0.387], [1.000, 0.383], [1.056, 0.375], [1.111, 0.373], [1.167, 0.366], [1.223, 0.366], [1.278, 0.362], [1.334, 0.357], [1.390, 0.353], [1.445, 0.353], [1.501, 0.350], [1.557, 0.354], [1.612, 0.346], [1.668, 0.349], [1.724, 0.356], [1.779, 0.351], [1.835, 0.345], [1.891, 0.343], [1.946, 0.339], [2.000, 0.340], [2.056, 0.332], [2.111, 0.326], [2.167, 0.329], [2.223, 0.333], [2.278, 0.331], [2.334, 0.334], [2.390, 0.328], [2.445, 0.328], [2.501, 0.326], [2.557, 0.328], [2.612, 0.327], [2.668, 0.324], [2.724, 0.324], [2.779, 0.330], [2.835, 0.319], [2.891, 0.321], [2.946, 0.328], [3.000, 0.324]] },
    { model: 'gpt-oss-20b', run: '2026-07-15_sft_canonical_gemma4_gptoss/09-37-54/0', steps: 270, accuracy: 0.849,
      points: [[0.111, 1.010], [0.223, 0.973], [0.334, 0.887], [0.445, 0.817], [0.557, 0.751], [0.668, 0.705], [0.779, 0.663], [0.891, 0.642], [1.000, 0.614], [1.111, 0.609], [1.223, 0.591], [1.334, 0.586], [1.445, 0.569], [1.557, 0.570], [1.668, 0.563], [1.779, 0.567], [1.891, 0.556], [2.000, 0.551], [2.111, 0.546], [2.223, 0.547], [2.334, 0.550], [2.445, 0.541], [2.557, 0.540], [2.668, 0.538], [2.779, 0.542], [2.891, 0.535], [3.000, 0.538]] },
  ],
  /* Les Misérables (Gutenberg 135), chunk 32: row 310 of
     multirun/2026-07-15_sft_canonical_gemma4/00-07-44/2/sft_only/outputs/sft_data/sft_pairs.parquet.
     Chunk id recovered by exact text match against the teacher's ci_flows.parquet
     (rows 6457-6458). The same chunk recurs in the GRPO group and the KTO pair. */
  example: {
    book: 'Les Misérables',
    chunkId: 32,
    instruction:
      'Analyze the following text passage for information flows using the Contextual Integrity framework. First, reason about what information exchanges are described … Then provide a structured extraction of each information flow as a flat JSON object …',
    chunk: [
      '… Sometimes, if the two old women were not asleep, they heard him pacing slowly along the walks at a very advanced hour of the night. …',
      'CHAPTER XIV—WHAT HE THOUGHT',
      'One last word. Since this sort of details might … give to the Bishop of D—— a certain “pantheistical” physiognomy, … we insist upon it, that not one of those persons who knew Monseigneur Welcome would have thought himself authorized to think anything of the sort. …',
    ],
    reasoning:
      "Flow 2: Re: \"not one of those persons who knew Monseigneur Welcome would have thought himself authorized to think anything of the sort.\" — This describes a social norm regarding the 'authorized' interpretation of the Bishop's character. …",
    flowIndex: 1,
    flowsTotal: 2,
    flow: {
      slots: [
        { sym: 's', label: 'sender', value: 'Persons who knew Monseigneur Welcome' },
        { sym: 'r', label: 'recipient', value: 'Themselves (internal cognitive flow/social consensus)' },
        { sym: 'u', label: 'subject', value: 'Monseigneur Welcome' },
        {
          sym: 'a',
          label: 'attribute',
          value: 'Social reputation and character assessment (specifically, the possibility of being a pantheist)',
        },
        { sym: 't', label: 'transmission principle', value: 'Propriety' },
      ],
      appropriateness: 'inappropriate',
      context: 'Social etiquette/Religion',
    },
  },
  /* Les Misérables, chunk 539: row 2871 of the same file, one of the 7 negatives. */
  negative: {
    book: 'Les Misérables',
    chunkId: 539,
    chunk: [
      '… He wished to die; the opportunity presented itself; he knocked at the door of the tomb, a hand in the darkness offered him the key. These melancholy openings which take place in the gloom before despair, are tempting. Marius thrust aside the bar which had so often allowed him to pass, emerged from the garden, and said: “I will go.” …',
    ],
    reasoning:
      "The passage primarily describes Marius's internal emotional state and his physical journey through the streets of Paris toward a barricade. While there are descriptions of crowds 'conversing in low tones' and 'whisperings,' these are atmospheric descriptions of collective behavior rather than specific information flows between identifiable actors. …",
  },
};

/* ------------------------------------------------------------------------
   Phase 2a: GRPO against the modular reward
   ------------------------------------------------------------------------ */

export const grpo = {
  name: 'GRPO training diagram',
  pipeline: [
    { id: 'prompts', title: 'Prompts', detail: '600, pre-screened' },
    { id: 'policy', title: 'Policy', detail: 'G = 8 samples' },
    { id: 'reward', title: 'Reward', detail: 'route · core · aux' },
    { id: 'advantage', title: 'Advantage', detail: 'R − mean R' },
  ] as DiagramNode[],
  loop: { from: 'advantage', to: 'policy', label: 'update, KL to SFT (β = 0.02)' },
  steps: [
    {
      label: 'Prompts',
      caption:
        'Training prompts are pre-screened for reward spread under the SFT policy, ranked within strata so the screen cannot re-weight the task mix. 82% are extraction prompts on fiction chunks; 18% are judgment sets, which ask the policy to assign a deontic force to scenarios from one novel.',
      focus: ['prompts'],
      view: 'prompts',
      dwell: 5000,
    },
    {
      label: 'Sample',
      caption:
        'The policy, initialized from the merged SFT checkpoint, samples G = 8 completions per prompt at temperature 1.0. Each completion is a reasoning trace plus extracted CI flows, emitted as JSON.',
      focus: ['policy'],
      view: 'group',
    },
    {
      label: 'Route',
      caption:
        'Each completion takes exactly one route. Unparseable or schema-incomplete output scores 0. Abstentions, and any completion on a chunk labeled as containing no exchange, take a fixed table with no model calls. Everything else takes the scored path.',
      focus: ['reward'],
      view: 'group',
      dwell: 5500,
    },
    {
      label: 'Core',
      caption:
        'The verifiable core, R<sub>direct</sub>, contains no model. For each flow it retrieves the nearest information-governing norm from the novel’s universe, reads a reference label off that norm’s deontic force and act polarity, and checks the policy’s own appropriateness label against it.',
      focus: ['reward'],
      view: 'direct',
      dwell: 7000,
    },
    {
      label: 'Auxiliaries',
      caption:
        'Two removable auxiliaries come from one LLM judge scoring the whole group listwise. R<sub>ground</sub> asks how well each completion is grounded in the three most relevant norms from its own novel; R<sub>contrast</sub> asks the same question of a wrong novel’s norms and rewards grounding poorly there.',
      focus: ['reward'],
      view: 'aux',
      dwell: 6500,
    },
    {
      label: 'Advantage',
      caption:
        'Advantage is each completion’s reward minus the group mean, deliberately not scaled by the group’s standard deviation. A prompt whose eight samples all score alike contributes no gradient. The update is anchored to the SFT checkpoint by a KL penalty.',
      focus: ['advantage', 'loop'],
      view: 'advantage',
      dwell: 5500,
    },
  ] as DiagramStep[],
  /** Mean group reward of the reported run (m2 `full`, checkpoint-450), as [step, reward] at every
     10th optimizer step: log_history of multirun/2026-07-28_grpo_m2_full/21-31-11/cell=full/
     grpo_only_online_external/outputs/grpo/checkpoint/checkpoint-450/trainer_state.json.
     Each point is the mean over the 10 steps since the previous log. */
  curve: { steps: 450, points: [[10, 0.536], [20, 0.549], [30, 0.541], [40, 0.536], [50, 0.544], [60, 0.497], [70, 0.547], [80, 0.545], [90, 0.577], [100, 0.541], [110, 0.561], [120, 0.548], [130, 0.541], [140, 0.560], [150, 0.514], [160, 0.559], [170, 0.536], [180, 0.534], [190, 0.543], [200, 0.513], [210, 0.555], [220, 0.562], [230, 0.530], [240, 0.540], [250, 0.562], [260, 0.516], [270, 0.579], [280, 0.532], [290, 0.533], [300, 0.550], [310, 0.547], [320, 0.549], [330, 0.553], [340, 0.541], [350, 0.568], [360, 0.554], [370, 0.566], [380, 0.572], [390, 0.568], [400, 0.548], [410, 0.535], [420, 0.521], [430, 0.536], [440, 0.518], [450, 0.547]] },
  /** Pre-screened prompt mix (A_additional-methods, "Stratified prompt pre-screening"). */
  prompts: {
    pool: 2945,
    total: 600,
    parts: [
      { key: 'flows', n: 470, label: 'extraction, chunk has flows' },
      { key: 'empty', n: 22, label: 'extraction, no flows' },
      { key: 'judge', n: 108, label: 'judgment sets' },
    ],
  },
  weights: { direct: 0.5, ground: 0.25, contrast: 0.25, floor: 0.15 },
  abstain: [
    { when: 'correct abstention', r: 0.6 },
    { when: 'abstains on a chunk with flows', r: 0.1 },
    { when: 'no reference label', r: 0.4 },
  ],
  tau: 0.55,
  /* One real group: call 39 (optimizer step 40 of 450, epoch 1) of the m2 `full`
     cell, lines 1257-1264 of
     multirun/2026-07-28_grpo_m2_full/21-31-11/cell=full/grpo_only_online_external/outputs/grpo/checkpoint/reward_traces.jsonl.
     Routes and terms are as logged; advantages are R - group mean, which is what
     the trainer uses (scale_rewards: none). Completion text is not logged, so the
     summaries describe each completion from its trace fields. The wrong book is
     recomputed with aux_scorers.seeded_wrong_book (deterministic), not logged. */
  group: {
    book: 'Les Misérables',
    chunkId: 32,
    step: 40,
    steps: 450,
    contrastBook: 'Alice’s Adventures in Wonderland',
    completions: [
      { route: 'scored', summary: '2 flows; misses the first teacher flow, calls the violation appropriate', d: 0, g: 0.2, c: 1, r: 0.3 },
      { route: 'invalid', summary: 'output does not parse', r: 0 },
      { route: 'scored', summary: '1 flow; calls the violation appropriate', d: 0, g: 0.65, c: 1, r: 0.4125 },
      { route: 'scored', summary: '2 flows; first right, calls the violation appropriate', d: 0.5, g: 0.05, c: 1, r: 0.5125 },
      { route: 'scored', summary: '3 flows; labels both teacher flows correctly', d: 1, g: 0.85, c: 1, r: 0.9625 },
      { route: 'abstain', summary: 'declares no information exchange', r: 0.1 },
      { route: 'scored', summary: '2 flows; first right, calls the violation appropriate', d: 0.5, g: 0.35, c: 1, r: 0.5875 },
      { route: 'scored', summary: '2 flows; misses the first, labels the violation inappropriate', d: 0.5, g: 0.5, c: 1, r: 0.625 },
    ] as GroupCompletion[],
  },
  /* The core on the same chunk. Teacher flows are ci_flows.parquet rows 6457-6458
     (outputs/2026-07-12_fiction10_flows_gemma4/23-14-17/...). The governing norm is
     norm_universes.json['135'][713] (outputs/2026-07-25_universe_fiction10_polarity/);
     the trace does not log retrieved norms, so it is identified by the same labeler
     run offline for the KTO set on this chunk. Per-completion labels and match
     cosines are the trace's direct_flows. */
  direct: {
    flow: [
      { sym: 's', label: 'sender', value: 'Persons who knew Monseigneur Welcome' },
      { sym: 'r', label: 'recipient', value: 'Themselves (internal cognitive flow/social consensus)' },
      { sym: 'u', label: 'subject', value: 'Monseigneur Welcome' },
      { sym: 'a', label: 'attribute', value: 'Social reputation and character assessment (… being a pantheist)' },
      { sym: 't', label: 'transmission principle', value: 'Propriety' },
    ],
    norm: {
      text: 'One must not question the actions or motives of a person regarded as a saint.',
      force: 'prohibited',
      polarity: 'performing',
    },
    reference: 'inappropriate',
    /** Completion number (1-based, as in the group) -> its flow matched to this teacher flow. */
    matches: [
      { completion: 1, label: 'appropriate', cos: 0.627 },
      { completion: 3, label: 'appropriate', cos: 0.837 },
      { completion: 4, label: 'appropriate', cos: 0.798 },
      { completion: 5, label: 'inappropriate', cos: 0.775 },
      { completion: 7, label: 'appropriate', cos: 0.789 },
      { completion: 8, label: 'inappropriate', cos: 0.653 },
    ],
  },
};

export interface GroupCompletion {
  route: 'scored' | 'abstain' | 'invalid';
  summary: string;
  d?: number;
  g?: number;
  c?: number;
  r: number;
}

/* ------------------------------------------------------------------------
   Phase 2b: offline KTO
   ------------------------------------------------------------------------ */

export const kto = {
  name: 'KTO training diagram',
  pipeline: [
    { id: 'policy', title: 'SFT policy', detail: 'sampled offline' },
    { id: 'label', title: 'Label', detail: 'same chain as GRPO core' },
    { id: 'set', title: 'Preference set', detail: '20,059 rows' },
    { id: 'kto', title: 'KTO', detail: 'β = 0.1, 1 epoch' },
  ] as DiagramNode[],
  steps: [
    {
      label: 'Why',
      caption:
        'GRPO learns only from disagreement within a group. When the SFT policy is confidently wrong about a chunk’s violation in all eight samples, the group has no spread and gives no gradient: GRPO can sharpen a behavior the policy sometimes shows, but cannot create one it never samples. KTO instead scores each completion against an absolute label.',
      focus: ['policy'],
      view: 'why',
      dwell: 6500,
    },
    {
      label: 'Sample',
      caption:
        'The merged SFT policy samples several completions per training chunk at temperature 1.0, in a single offline vLLM pass. Completions that fail the GRPO validity check are excluded rather than penalized.',
      focus: ['policy'],
      view: 'label',
    },
    {
      label: 'Label',
      caption:
        'Each completion’s flows are matched to the chunk’s teacher flows exactly as in R<sub>direct</sub>, and each matched flow’s reference label is read off its nearest norm. A completion is desirable if it labels every matched violation correctly and at least half its matched flows overall; undesirable if it mislabels a violation. Completions with no matched flows are excluded.',
      focus: ['label'],
      view: 'label',
      dwell: 7000,
    },
    {
      label: 'Correct',
      caption:
        'For each completion that mislabels a matched flow, the original enters as undesirable and a copy with only the appropriateness values corrected enters as desirable. The pair is byte-identical apart from the judgment, so the contrast carries no format or extraction confound.',
      focus: ['label', 'set'],
      view: 'pair',
      dwell: 7000,
    },
    {
      label: 'Assemble',
      caption:
        'Naturally correct samples join as desirable, unedited, and abstention rows guard against hallucinated flows. Class weights put the weighted desirable-to-undesirable ratio at 1.15, inside the band KTO’s authors recommend.',
      focus: ['set'],
      view: 'set',
      dwell: 5000,
    },
    {
      label: 'Optimize',
      caption:
        'KTO raises the likelihood of desirable completions and lowers that of undesirable ones, each measured against the SFT reference. One epoch over the frozen set; no server takes part in training, which makes this arm far cheaper than a single GRPO configuration.',
      focus: ['kto'],
      view: 'loss',
      dwell: 5000,
    },
  ] as DiagramStep[],
  /** Implied rewards of the reported (verdict) arm, as [step, reward] at every 10th optimizer step:
     rewards/chosen (desirable rows) and rewards/rejected (undesirable rows) from the log_history of
     multirun/2026-08-01_k3_arms_b/18-55-02/1/kto_only/outputs/kto/checkpoint/checkpoint-627/trainer_state.json. */
  curve: {
    steps: 627,
    desirable: [[10, 0.017], [20, 0.024], [30, 0.202], [40, 0.616], [50, 1.202], [60, 0.921], [70, 1.151], [80, 1.420], [90, 1.460], [100, 1.041], [110, 1.056], [120, 1.452], [130, 0.815], [140, 1.311], [150, 1.144], [160, 1.322], [170, 1.105], [180, 0.819], [190, 0.978], [200, 1.359], [210, 1.351], [220, 1.147], [230, 1.574], [240, 1.344], [250, 1.068], [260, 1.317], [270, 1.397], [280, 1.482], [290, 1.321], [300, 1.459], [310, 1.214], [320, 1.335], [330, 1.376], [340, 1.032], [350, 1.159], [360, 1.084], [370, 1.400], [380, 1.232], [390, 1.056], [400, 1.532], [410, 1.278], [420, 1.222], [430, 1.474], [440, 1.281], [450, 1.495], [460, 1.323], [470, 1.365], [480, 1.181], [490, 1.395], [500, 1.096], [510, 1.337], [520, 1.113], [530, 1.444], [540, 1.138], [550, 1.259], [560, 1.441], [570, 1.115], [580, 1.437], [590, 1.241], [600, 1.113], [610, 1.327], [620, 1.602]],
    undesirable: [[10, -0.012], [20, 0.006], [30, 0.004], [40, -0.067], [50, -0.268], [60, -0.830], [70, -1.239], [80, -1.073], [90, -1.093], [100, -1.129], [110, -1.352], [120, -1.505], [130, -1.612], [140, -1.508], [150, -1.597], [160, -1.443], [170, -1.659], [180, -1.854], [190, -1.858], [200, -1.479], [210, -1.737], [220, -1.620], [230, -1.592], [240, -1.466], [250, -1.842], [260, -1.379], [270, -1.478], [280, -1.348], [290, -1.341], [300, -1.815], [310, -1.652], [320, -1.529], [330, -1.706], [340, -1.665], [350, -1.400], [360, -1.491], [370, -1.577], [380, -2.031], [390, -1.695], [400, -1.666], [410, -1.631], [420, -1.676], [430, -1.555], [440, -1.479], [450, -1.581], [460, -1.445], [470, -1.426], [480, -1.750], [490, -1.702], [500, -1.813], [510, -1.786], [520, -1.680], [530, -1.567], [540, -1.868], [550, -1.600], [560, -1.724], [570, -2.000], [580, -1.648], [590, -1.537], [600, -1.938], [610, -1.647], [620, -1.839]],
  },
  set: {
    rows: 20059,
    desirable: 11695,
    undesirable: 8364,
    lambdaD: 0.822,
    lambdaU: 1.0,
    ratio: 1.15,
  },
  /* Row types of the reported (verdict) arm, from
     outputs/2026-07-31_k1_full/kto_rows.parquet (recipe/depth columns);
     totals match kto_metadata.json and the training log. */
  rowTypes: [
    { kind: 'c', label: 'corrected copies, desirable', n: 7986 },
    { kind: 'd', label: 'naturally correct samples, desirable', n: 3414 },
    { kind: 'a', label: 'correct abstentions on no-flow chunks, desirable', n: 295 },
    { kind: 'u', label: 'original samples with a mislabeled flow, undesirable', n: 7986 },
    { kind: 'h', label: 'hallucinated flows on no-flow chunks, undesirable', n: 378 },
  ],
  /** Schematic only: cell kinds for the sample grid on the Label step. */
  gridKinds: Array.from({ length: 64 }, (_, i) => {
    const h = (i * 37 + 11) % 19;
    return h < 8 ? 'd' : h < 15 ? 'u' : 'x';
  }),
  /* Les Misérables, chunk 32 again. Undesirable original: row 5663; desirable
     copy: row 23353 (depth verdict) of outputs/2026-07-31_k1_full/kto_rows.parquet.
     The two completions differ only in this one value ("appropriate" ->
     "inappropriate"); this is flows[1] of 3. The norm comes from the sibling
     citation row 23354 and is norm_universes.json['135'][713]. */
  pair: {
    book: 'Les Misérables',
    chunkId: 32,
    flowIndex: 1,
    flowsTotal: 3,
    before: {
      pre: `{"sender": "those persons who knew Monseigneur Welcome",
 "recipient": "those persons who knew Monseigneur Welcome",
 "subject": "Monseigneur Welcome",
 "information_type": "interpretation of private meditations and social reputation",
 "transmission_principle": "Social obligation",
 "context": "social etiquette",
 "appropriateness": "`,
      label: 'appropriate',
      post: `",
 "norms_invoked": ["Those who know a Bishop are expected to refrain from attributing heretical or pantheistical beliefs to him based on his private thoughts."],
 …}`,
    },
    after: { label: 'inappropriate' },
    norm: {
      text: 'One must not question the actions or motives of a person regarded as a saint.',
      force: 'prohibited',
      polarity: 'performing',
    },
  },
  hyper: ['β = 0.1', 'learning rate 5×10⁻⁶, cosine', '1 epoch', 'batch 2 × 16 accumulation', 'LoRA r = 64, α = 128'],
};

/** Figure labels and captions, in the voice of the Step 1 caption. */
export const captions = {
  sft: {
    phase: 'Phase 1',
    title: 'Supervised fine-tuning',
    text: 'Step 2, Phase 1. The extraction teacher’s outputs become (chunk, trace + tuples) pairs, and each task LLM learns to produce them. The training pairs shown are verbatim; the agreement figures are from the paper’s reward analysis.',
  },
  grpo: {
    phase: 'Phase 2a',
    title: 'GRPO against a grounded reward',
    text: 'Step 2, Phase 2a. The policy samples a group of completions per prompt; a modular reward routes each one, scores it with a model-free core grounded in the novel’s norms and two removable judged auxiliaries, and the update follows each completion’s advantage over its group. The group shown is a real one from the reported run’s reward traces.',
  },
  kto: {
    phase: 'Phase 2b',
    title: 'KTO on norm-labeled preferences',
    text: 'Step 2, Phase 2b. A parallel, offline arm: completions sampled once from the SFT policy are labeled desirable or undesirable by the same norm-grounded chain as the GRPO core, and KTO trains on the frozen set. The pair shown is a real row from the reported preference set.',
  },
};
