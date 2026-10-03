/** "What we're thinking about now": the paper's immediate research directions. */
export interface NowItem {
  title: string;
  body: string;
}

export const nowIntro =
  'Narrative fiction is a testbed for the methodology, not the end of it. The paper closes with five immediate directions, and a sixth has grown out of writing the discussion.';

export const now: NowItem[] = [
  {
    title: 'Operationalizing the CI decision heuristic',
    body: "Established norms cover the flows a novel depicts. Novel flows, often introduced by new technology, have no entrenched norm to check against. Nissenbaum's decision heuristic evaluates such flows over context, actors, attributes, and transmission principles, and we want a model that can run it rather than default to prohibition.",
  },

];
