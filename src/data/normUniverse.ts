/** Content for the "norm universe extraction" diagram under "How it works".
 *
 *  Ported from the Google NYC talk deck
 *  (papers/colm26_normative-simulacra/slides/google/normsim/): the pipeline
 *  nodes come from the Extract panel of the "End-to-end method" slide
 *  (pages/02-simulacra.md), and the two universes and their norms come from
 *  components/NormUniverseOrbs.vue on "The normative universe N_b" slide. The
 *  norm texts are representative extractions pulled verbatim (lightly trimmed)
 *  from norm_universes.json. Chip positions are layout, not content: they were
 *  re-laid for the web card size, not copied from the deck. */

export type DeonticForce = 'prohibited' | 'obligatory' | 'recommended' | 'permitted' | 'discouraged';

export interface UniverseNorm {
  text: string;
  force: DeonticForce;
  /** Resting position inside the orb, as a percentage of its width / height. */
  x: number;
  y: number;
  /** Where the chip drifts in from, as a percentage of the orb's size. */
  dx: number;
  dy: number;
  /** Entrance stagger in seconds. */
  delay: number;
  /** Optional resting position for phone widths (< 560px), where chips hold
   *  12px text and need more room. Falls back to x / y. */
  nx?: number;
  ny?: number;
  /** True for the norm extracted in the worked example above the orbs. */
  example?: boolean;
}

export interface Universe {
  title: string;
  author: string;
  count: number;
  norms: UniverseNorm[];
}

export interface PipelineNode {
  id: 'books' | 'chunks' | 'llm' | 'flows' | 'universes';
  title: string;
  detail: string;
}

/** Focus targets: a whole pipeline node, or one of the two passes named
 *  inside the Extraction LLM node. */
export type FocusId = PipelineNode['id'] | 'reason' | 'extract';

export interface DiagramStep {
  label: string;
  caption: string;
  /** Pipeline nodes (or LLM passes) that are the focus of this step. */
  focus: FocusId[];
  /** Which view the stage area shows at this step. */
  view: 'orbs' | 'chunk' | 'reason' | 'extract';
}

export const pipeline: PipelineNode[] = [
  { id: 'books', title: 'Fiction novels', detail: 'n = 10' },
  { id: 'chunks', title: 'Chunks', detail: '6,000 chars' },
  { id: 'llm', title: 'Extraction LLM', detail: 'reason · extract' },
  { id: 'flows', title: 'CI flows', detail: '(s, r, u, a, t)' },
  { id: 'universes', title: 'Norm universes', detail: '𝒩_b' },
];

export const steps: DiagramStep[] = [
  {
    label: 'Source texts',
    caption:
      'Each source text b begins with an empty normative universe, 𝒩_b = ∅. The first corpus is ten setting-heavy novels.',
    focus: ['books'],
    view: 'orbs',
  },
  {
    label: 'Chunk',
    caption:
      'Each novel is split on paragraph boundaries into chunks of at most 6,000 characters, each seeded with the last 1,000 characters of the chunk before it. The worked example is chunk 128 of the 156 in Pride and Prejudice.',
    focus: ['chunks'],
    view: 'chunk',
  },
  {
    label: 'Reason',
    caption:
      'A reasoning pass reads the whole chunk and writes free-form analysis: it quotes the evidence, then says who bears a norm, what they must do, when, and how strongly; a parallel pass says who told what to whom. For this chunk it found 4 norms and 5 information flows.',
    focus: ['llm', 'reason'],
    view: 'reason',
  },
  {
    label: 'Extract',
    caption:
      'An extraction pass formalizes each reasoning entry, under guided decoding, into a typed tuple: a CI flow (sender, recipient, subject, attribute, transmission principle) judged for appropriateness, and a Raz norm (deontic element, subject, act, condition) with its normative force.',
    focus: ['llm', 'extract', 'flows'],
    view: 'extract',
  },
  {
    label: 'Aggregate',
    caption:
      'Aggregating every norm extracted from a book gives its normative universe: 463 norms for 1984, 652 for Pride and Prejudice. Flows map onto these norms.',
    focus: ['universes'],
    view: 'orbs',
  },
];

// Chips are verbatim `norm_articulation` strings from the fiction10 universe the
// paper reports (outputs/2026-07-25_universe_fiction10_polarity/norm_universes.json);
// counts follow the paper's source-texts table.
export const universes: Universe[] = [
  {
    title: '1984',
    author: 'George Orwell',
    count: 463,
    norms: [
      {
        text: 'A Party member must not keep a private diary.',
        force: 'prohibited',
        x: 50, y: 17, dx: -10, dy: -55, delay: 0.05, ny: 13, nx: 50,
      },
      {
        text: 'A prisoner under interrogation by the Thought Police must not lie.',
        force: 'prohibited',
        x: 30, y: 43, dx: -60, dy: -10, delay: 0.25, ny: 37, nx: 25,
      },
      {
        text: 'A Party member is expected to call everyone \'comrade\' rather than using traditional titles.',
        force: 'obligatory',
        x: 70, y: 43, dx: 60, dy: -25, delay: 0.45, ny: 36, nx: 75,
      },
      {
        text: 'A subject of the Party must maintain absolute loyalty and conformity to the Party at all times.',
        force: 'obligatory',
        x: 30, y: 69, dx: -55, dy: 40, delay: 0.65, ny: 70, nx: 26,
      },
      {
        text: 'A Party member should refrain from using the word \'Mrs\' as it is discountenanced by the Party.',
        force: 'discouraged',
        x: 71, y: 79, dx: 50, dy: 50, delay: 0.85, ny: 76, nx: 74,
      },
    ],
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    count: 652,
    norms: [
      {
        text: 'A single man in possession of a good fortune must be in want of a wife.',
        force: 'obligatory',
        x: 50, y: 17, dx: 10, dy: -55, delay: 0.15, nx: 50, ny: 14,
      },
      {
        // The Raz norm from the worked example (chunk 128), verbatim from
        // norm_universes.json['1342'][536], force as recorded there.
        text: 'A person who has faithfully promised to keep a secret must not disclose that information to others.',
        force: 'obligatory',
        x: 28, y: 43, dx: -60, dy: -25, delay: 0.35, nx: 28, ny: 48,
        example: true,
      },
      {
        text: 'A parent should not think or speak slightingly of their own children.',
        force: 'recommended',
        x: 73, y: 46, dx: 60, dy: -5, delay: 0.55, nx: 73, ny: 43,
      },
      {
        text: 'A daughter of a respectable family must not elope without parental consent and formal arrangement.',
        force: 'prohibited',
        x: 28, y: 71, dx: -50, dy: 45, delay: 0.75, nx: 27, ny: 86,
      },
      {
        text: 'A suitor ought not to appear overly sure of succeeding when making a formal offer of marriage.',
        force: 'discouraged',
        x: 73, y: 79, dx: 55, dy: 40, delay: 0.95, nx: 74, ny: 78,
      },
    ],
  },
];

export const figureCaption =
  'Step 1, Extract. Each novel is read in chunks; a reasoning pass analyses each chunk, an extraction pass turns that analysis into typed flows and norms, and the norms are aggregated into the book’s normative universe. The worked example is verbatim model output for one real chunk, and the norms shown are real extractions; the label on each gives its deontic force.';

/* ------------------------------------------------------------------------
   Worked example: one real chunk, followed through reasoning and extraction.

   Every string below is verbatim model input or output from the fiction10
   runs (Gemma-4-31B-it, temperature 0), except where a comment says it is a
   label. Source rows, all keyed by gutenberg_id 1342 (Pride and Prejudice),
   chunk_id 128:
     chunk text + norm reasoning   outputs/2026-07-12_fiction10_norms_gemma4/
                                   18-36-28/.../reasoning/reasoning.parquet
                                   (generated_text, norms[2])
     Raz norm                      .../extraction/structured_norms.parquet
                                   (norm_index 2); identical to
                                   norm_universes.json['1342'][536]
     flow reasoning + CI flow      outputs/2026-07-12_fiction10_flows_gemma4/
                                   23-14-17/.../ci_reasoning/reasoning.parquet
                                   (flows[3]) and ci_extraction/ci_flows.parquet
                                   (ci_flow_index 3)
   The chunk is shown as an excerpt (its full length is 5,816 characters).
   Gutenberg's _underscore_ italics are rendered as <em>. Norms go through a
   role-abstraction pass before aggregation; this norm's subject was already a
   role and is unchanged in 𝒩_b. Flows are not role-abstracted, so the CI
   tuple keeps character names.
   ------------------------------------------------------------------------ */

/** A run of text. `key` links a phrase in one panel to where it lands in the
 *  next (chunk -> reasoning, reasoning -> tuple slot). */
export interface Seg {
  text: string;
  key?: string;
  em?: boolean;
}

export interface TupleSlot {
  /** Formal symbol from the paper, e.g. s, r, u. Label, not model output. */
  sym: string;
  label: string;
  value: string;
  /** Key of the reasoning phrase this slot is read from. */
  from?: string;
}

export const workedExample = {
  book: 'Pride and Prejudice',
  author: 'Jane Austen',
  chunkId: 128,
  chunkTotal: 156,
  chunkChars: 5816,
  chunkLimit: 6000,
  overlap: 1000,
  model: 'Gemma-4-31B-it',
  /** Excerpt of the chunk. Ellipses mark the elided text on either side. */
  chunk: [
    [
      {
        text: '… However, I recollected afterwards, that if he ',
      },
      { text: 'had', em: true },
      { text: ' been prevented going, the wedding need not be put off, for Mr. Darcy might have done as well.”' },
    ],
    [{ text: '“Mr. Darcy!” repeated Elizabeth, in utter amazement.' }],
    [
      { text: '“Oh, yes! he was to come there with Wickham, you know. But, gracious me! I quite forgot! ' },
      {
        text: 'I ought not to have said a word about it. I promised them so faithfully! What will Wickham say? It was to be such a secret!',
        key: 'snip',
      },
      { text: '”' },
    ],
    [
      {
        text: '“If it was to be a secret,” said Jane, “say not another word on the subject. You may depend upon my seeking no further.”',
      },
    ],
  ] as Seg[][],
  normReasoning: {
    index: 3,
    total: 4,
    snippet:
      'I ought not to have said a word about it. I promised them so faithfully! What will Wickham say? It was to be such a secret!',
    reasoning: [
      {
        text: "Lydia's immediate regret and fear of Wickham's anger reveal a norm regarding confidentiality. The norm subject is ",
      },
      { text: 'a person who has been entrusted with a secret', key: 'n-subject' },
      { text: '. The norm act is ' },
      { text: 'to refrain from disclosing the information', key: 'n-act' },
      { text: '. The condition of application is ' },
      { text: 'when a faithful promise of secrecy has been made to another party', key: 'n-cond' },
      {
        text: ". The narrative evidence is character reflection on propriety ('I ought not to have said a word') and the fear of social/interpersonal consequences (Wickham's anger).",
      },
    ] as Seg[],
    force: 'obligatory',
    governsInfoFlow: 'true',
  },
  flowReasoning: {
    index: 4,
    total: 5,
    reasoning: [
      {
        text: 'Lydia acknowledges that the information she just shared was intended to be a secret. The text explicitly identifies this flow as a violation of a promise made to Darcy and Wickham, marking it as a breach of a specific informational norm (',
      },
      { text: 'confidentiality', key: 'f-tp' },
      { text: ').' },
    ] as Seg[],
    direction: [
      { text: 'Lydia (sender)', key: 'f-sender' },
      { text: ' to ' },
      { text: 'Elizabeth/Jane (recipients)', key: 'f-recipient' },
      { text: ' regarding ' },
      { text: 'a secret agreement', key: 'f-attr' },
      { text: ' with ' },
      { text: 'Darcy', key: 'f-subject' },
      { text: '/Wickham' },
    ] as Seg[],
    appropriateness: 'inappropriate',
  },
  flow: {
    slots: [
      { sym: 's', label: 'sender', value: 'Lydia', from: 'f-sender' },
      { sym: 'r', label: 'recipient', value: 'The listener (unspecified)', from: 'f-recipient' },
      { sym: 'u', label: 'subject', value: 'Darcy', from: 'f-subject' },
      { sym: 'a', label: 'attribute', value: 'Planned arrival and association with Wickham', from: 'f-attr' },
      { sym: 't', label: 'transmission principle', value: 'Confidentiality', from: 'f-tp' },
    ] as TupleSlot[],
    appropriateness: 'inappropriate',
    context: 'social etiquette',
  },
  norm: {
    slots: [
      { sym: 'd', label: 'deontic element', value: 'must not', from: 'n-act' },
      { sym: 's', label: 'norm subject', value: 'a person entrusted with a secret', from: 'n-subject' },
      { sym: 'a', label: 'norm act', value: 'disclose the confidential information', from: 'n-act' },
      {
        sym: 'c',
        label: 'condition',
        value: 'when a faithful promise of secrecy has been made to another party',
        from: 'n-cond',
      },
    ] as TupleSlot[],
    force: 'obligatory',
    context: 'information/speech',
    governsInfoFlow: 'true',
    articulation: 'A person who has faithfully promised to keep a secret must not disclose that information to others.',
  },
};
