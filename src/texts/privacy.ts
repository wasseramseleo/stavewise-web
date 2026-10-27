import type { Lang } from '../lib/i18n';

// Head and headings of the privacy page; the body is the #542 draft verbatim in
// src/pages/{de,en}/privacy.astro. The section ids app, website and rechte are
// fixed (app and /beta link to them).
export const privacy = {
  de: {
    title: 'Datenschutzerklärung | Stavewise',
    description: 'Datenschutzerklärung für die App Stavewise und die Website stavewise.app.',
    heading: 'Datenschutzerklärung',
    app: 'Teil A: App Stavewise',
    website: 'Teil B: Website stavewise.app',
    rights: 'Deine Rechte',
  },
  en: {
    title: 'Privacy policy | Stavewise',
    description: 'Privacy policy for the Stavewise app and the website stavewise.app.',
    heading: 'Privacy policy',
    app: 'Part A: the Stavewise app',
    website: 'Part B: the website stavewise.app',
    rights: 'Your rights',
  },
} satisfies Record<Lang, Record<string, string>>;
