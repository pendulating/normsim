/** Sections in page order, shared by the header nav and the left table of
 *  contents. `header: false` keeps an entry out of the header. */
export const nav = [
  { href: '#abstract', label: 'Abstract' },
  { href: '#cite', label: 'Cite', header: false },
  { href: '#method', label: 'Method' },
  { href: '#reading', label: 'Reading' },
  { href: '#now', label: 'Now' },
];

/** The hero's resource buttons, repeated at the foot of the table of contents. */
export const resources = {
  pdf: 'Paper (PDF)',
  code: 'Code and corpus inspector',
};
