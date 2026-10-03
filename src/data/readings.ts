/**
 * Further reading. Each entry may carry one selected quote. Quotes must be
 * verbatim from the source (or its published abstract); `source` says where the
 * passage comes from. Leave `quote` out rather than paraphrase.
 */
export interface Quote {
  text: string;
  source?: string;
  href?: string;
}

export interface Reading {
  title: string;
  /** Authors, venue, year. Rendered as a caption. */
  meta: string;
  href?: string;
  /** One or two sentences on why it matters for this project. */
  why?: string;
  quote?: Quote;
  /** Puts the reading on the bookshelf. `slug` names its scans in public/assets/books (see
   *  scripts/books.mjs); `author` is the name shown on hover. A book with no spine scan gets a
   *  drawn spine in its cover's colors, `thickness` wide (spine width ÷ height, default 0.075),
   *  lettered with `spineTitle` (default: the title before any colon). */
  book?: { slug: string; author: string; thickness?: number; spineTitle?: string };
  /** Puts the reading on the shelf's paper stack. `slug` names its first page in
   *  public/assets/papers (see scripts/books.mjs); `author` is the short byline in the caption. */
  paper?: { slug: string; author: string };
}

export interface ReadingGroup {
  title: string;
  blurb?: string;
  items: Reading[];
}

export const readingIntro =
  '';

export const readingGroups: ReadingGroup[] = [
  {
    title: 'Contextual Integrity and the anatomy of norms',
    items: [
      {
        title: 'Privacy in Context: Technology, Policy, and the Integrity of Social Life',
        meta: 'Helen Nissenbaum. Stanford University Press, 2009.',
        href: 'https://books.google.com/books?vid=ISBN9780804772891',
        book: { slug: 'privacy-in-context_nissenbaum', author: 'Helen Nissenbaum' },
        why: 'The source of the theory. Chapter 7 defines contexts, informational norms, actors, attributes, and transmission principles, the five parameters that make a flow assessable. Chapter 8 gives the decision heuristic for novel flows that lack an established norm.',
      },
      {
        title: 'Practical Reason and Norms',
        meta: 'Joseph Raz. Oxford University Press, 1999.',
        href: 'https://doi.org/10.1093/acprof:oso/9780198268345.001.0001',
        why: "Our prescriptive norm representation follows Raz's anatomy: a deontic element, a subject, an act, and a condition of application. This is the 'ought' that the descriptive flow tuples are judged against.",
        quote: {
          text: 'Rules are a structure of reasons to perform the required act and an exclusionary reason not to follow some competing reasons.',
          source: "Raz, publisher's abstract",
        },
      },
      {
        title: 'A Grammar of Institutions',
        meta: 'Sue E. S. Crawford and Elinor Ostrom. American Political Science Review, 1995.',
        href: 'https://doi.org/10.2307/2082975',
        paper: { slug: 'a-grammar-of-institutions-crawford-ostrom', author: 'Crawford and Ostrom' },
        why: '',
        quote: {
          text: 'The institutional grammar introduced here is based on a view that institutions are enduring regularities of human action in situations structured by rules, norms, and shared strategies, as well as by the physical world.',
          source: 'Crawford and Ostrom, abstract',
        },
      },
    ],
  },
  {
    title: 'Fiction as a laboratory of worlds',
    items: [
      {
        title: 'Possible Worlds, Artificial Intelligence, and Narrative Theory',
        meta: 'Marie-Laure Ryan. Indiana University Press, 1991.',
        href: 'https://books.google.com/books?vid=ISBN9780253350046',
        book: { slug: 'possible-worlds_ryan', author: 'Marie-Laure Ryan' },
        why: "Ryan brings possible-worlds semantics to narrative and, remarkably for 1991, to artificial intelligence. Her account of fiction as textual space it motivates treating a novel as a world with its own rules.",
        quote: {
          text: 'While fiction is characterized as a mode of travel into textual space, the trajectory of narrative can be visualized as a journey within the confines of this space.',
          source: 'Ryan, marilaur.info',
          href: 'https://marilaur.info/pwtext.htm',
        },
      },
      {
        title: 'Heterocosmica: Fiction and Possible Worlds',
        meta: 'Lubomír Doležel. Johns Hopkins University Press, 1998.',
        href: 'https://doi.org/10.56021/9780801857492',
        why: "Doležel's fictional worlds are self-contained but internally consistent, which is the property that lets us extract a normative universe per book rather than one blended distribution.",
        quote: {
          text: 'The universe of possible worlds is constantly expanding and diversifying thanks to the incessant world-constructing activity of human minds and hands. Literary fiction is probably the most active experimental laboratory of the world-constructing enterprise.',
          source: 'Doležel, from the preface',
        },
      },
      {
        title: 'The Myth of Sisyphus',
        meta: 'Albert Camus. 1942.',
        href: 'https://books.google.com/books?id=zaPoAQAAQBAJ',
        book: { slug: 'myth-of-sisyphus_camus', author: 'Albert Camus' },
        why: "",
        quote: {
          text: 'One must imagine Sisyphus happy.',
          source: 'Camus, closing line',
        },
      },
      {
        title: 'A Theory of Vibe',
        meta: 'Peli Grietzer. Glass Bead, Site 1: Logic Gate, the Politics of the Artifactual Mind, 2017.',
        href: 'https://www.glass-bead.org/article/a-theory-of-vibe/',
        paper: { slug: 'a-theory-of-vibe-grietzer', author: 'Grietzer' },
        why: '',
        quote: {
          text: 'An autoencoder is a neural network process tasked with learning from scratch, through a kind of trial and error, how to make facsimiles of worldly things.',
          source: 'Grietzer, §1',
        },
      },
    ],
  },
  {
    title: 'Agents, simulacra, and privacy in practice',
    items: [
      {
        title: 'Generative Agents: Interactive Simulacra of Human Behavior',
        meta: 'Joon Sung Park et al. UIST, 2023.',
        href: 'https://doi.org/10.1145/3586183.3606763',
        paper: { slug: 'park_simulacra', author: 'Park et al.' },
        why: '',
        quote: {
          text: 'Generative agents wake up, cook breakfast, and head to work; artists paint, while authors write; they form opinions, notice each other, and initiate conversations; they remember and reflect on days past as they plan the next day.',
          source: 'Park et al., abstract',
        },
      },
      {
        title: 'Simulacrum of Stories: Examining Large Language Models as Qualitative Research Participants',
        meta: 'Shivani Kapania, William Agnew, Motahhare Eslami, Hoda Heidari, and Sarah E. Fox. CHI, 2025.',
        href: 'https://doi.org/10.1145/3706598.3713220',
        why: "",
        quote: {
          text: "LLMs foreclose participants' consent and agency, produce responses lacking in palpability and contextual depth, and risk delegitimizing qualitative research methods.",
          source: 'Kapania et al., abstract',
        },
      },
      {
        title: 'Operationalizing Contextual Integrity in Privacy-Conscious Assistants',
        meta: 'Sahra Ghalebikesabi et al. 2024.',
        href: 'https://arxiv.org/abs/2408.02373',
        why: "",
        quote: {
          text: 'We propose to operationalize the design of privacy-conscious assistants that conform with contextual integrity (CI), a framework that equates privacy with the appropriate flow of information in a given context.',
          source: 'Ghalebikesabi et al., abstract',
        },
      },
      {
        title: 'A Philosophical Introduction to Language Models, Part I: Continuity With Classic Debates',
        meta: 'Raphaël Millière and Cameron Buckner. arXiv, 2024.',
        href: 'https://arxiv.org/abs/2401.03910',
        paper: { slug: 'a-philsophical-intro-to-language-models-milliere-buckner', author: 'Millière and Buckner' },
        why: '',
        quote: {
          text: 'This article–the first part of two companion papers–serves both as a primer on language models for philosophers, and as an opinionated survey of their significance in relation to classic debates in the philosophy cognitive science, artificial intelligence, and linguistics.',
          source: 'Millière and Buckner, abstract',
        },
      },
      {
        title: 'The Philosophy of Language Models',
        meta: 'Raphaël Millière and Cameron Buckner. Philosophy Compass, 2026.',
        href: 'https://doi.org/10.1111/phc3.70095',
        why: '',
        quote: {
          text: 'We contend that progress on these issues requires not only clarity about background philosophical commitments but also, in many cases, close engagement with emerging empirical evidence.',
          source: 'Millière and Buckner, abstract',
        },
      },
    ],
  },
];
