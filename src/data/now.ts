/** "What we're thinking about now": the paper's immediate research directions. */
export interface NowItem {
  title: string;
  body: string;
}

export const nowIntro =
  'Updated October 2026.';

export const now: NowItem[] = [
  {
    title: 'More "contrastive" contrastive learning.',
    body: "Right now, in the GRPO arm, we randomly select a wrong novel when calculating the contrastive reward. We want to explore how to better leverage contrastive learning under our setup: formalizing a notion of normatively 'opposite' novels and using the opposite instead of a random selection, or trying to learn from contrasting *contexts* within the same novel. ",
  },
  {
    title: 'The effect of model memorization.',
    body: "We speculate that the model's latent understanding and crystallized knowledge of the (very popular) novels in our fiction10 corpus improves its performance on the norm and information flow extraction tasks. It would be interesting to qualitatively compare task quality between our fiction10 corpus and a set of novels published very recently (meaning they could not be in the training data of the model).",
  },

];
