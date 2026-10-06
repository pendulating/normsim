export const paper = {
  title: 'Context-based normative simulacra from narrative fiction',
  shortTitle: 'Normative Simulacra',
  venue: 'COLM 2026',
  venueLong: 'Third Conference on Language Modeling',
  authors: [
    { name: 'Matt Franchi' },
    { name: 'Madiha Zahrah Choksi' },
    { name: 'Hal Triedman' },
    { name: 'Helen Nissenbaum' },
  ],
  affiliation: 'Cornell Tech, New York, NY',
  contact: 'mattfranchi@cs.cornell.edu',
  description:
    'Context-based normative simulacra from narrative fiction: teaching LLMs contextual-integrity privacy reasoning by fine-tuning on norms and information flows extracted from public-domain novels. COLM 2026.',
  epigraph: {
    text: 'While fiction is characterized as a mode of travel into textual space, the trajectory of narrative can be visualized as a journey within the confines of this space.',
    source: 'Marie-Laure Ryan',
    href: 'https://marilaur.info/pwtext.htm',
  },
  links: {
    /** Relative to the site base; lives in public/assets/. */
    pdf: 'assets/paper.pdf',
    code: 'https://github.com/pendulating/normative-simulacra',
  },
  abstract: [
    'Information handling practices of LLM agents are broadly misaligned with privacy expectations, raising urgent questions as these systems, increasingly autonomous, proliferate. Contextual Integrity (CI), which defines privacy as appropriate information flows, provides a principled framework for addressing these questions. Although other work has drawn on CI, existing approaches double inference cost via supervisor-assistant architectures, or fine-tune on narrow task-specific data.',
    'Here, we offer an approach for learning context-specific privacy reasoning, demonstrating its efficacy in a surprising application to narrative fiction: we fine-tune LLMs (SFT, then RL) on normative simulacra (structured representations of norms and information flows) that we extract from public-domain novels. We evaluate on five CI-aligned benchmarks spanning distinct societal contexts and conduct ablations to isolate the contributions of reinforcement learning and normative grounding.',
  ],
  bibtex: `@inproceedings{franchi2026normative,
  title     = {Context-based normative simulacra from narrative fiction},
  author    = {Franchi, Matt and Choksi, Madiha Zahrah and Triedman, Hal and Nissenbaum, Helen},
  booktitle = {Proceedings of the Third Conference on Language Modeling (COLM)},
  year      = {2026}
}`,
  funding:
    'The authors were supported by a gift from Google DeepMind to the Digital Life Initiative and a DLI Doctoral Fellowship. All source texts are available via Project Gutenberg.',
} as const;
