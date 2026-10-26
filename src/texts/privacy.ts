import type { Lang } from '../lib/i18n';

// Placeholder until the privacy page ticket fills in the #542 draft (#591).
// The section ids app, website and rechte are fixed (app and Play link to them).
export const privacy = {
  de: {
    title: 'Datenschutzerklärung | Stavewise',
    description: 'Datenschutzerklärung für die App Stavewise und die Website stavewise.app.',
    heading: 'Datenschutzerklärung',
    placeholder: 'Inhalt folgt.',
    app: 'Teil A: App Stavewise',
    website: 'Teil B: Website stavewise.app',
    rights: 'Deine Rechte',
  },
  en: {
    title: 'Privacy policy | Stavewise',
    description: 'Privacy policy for the Stavewise app and the website stavewise.app.',
    heading: 'Privacy policy',
    placeholder: 'Content follows.',
    app: 'Part A: the Stavewise app',
    website: 'Part B: the website stavewise.app',
    rights: 'Your rights',
  },
} satisfies Record<Lang, Record<string, string>>;
