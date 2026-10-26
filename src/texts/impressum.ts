import type { Lang } from '../lib/i18n';

// Placeholder until the impressum page ticket fills in the #542 draft (#591).
export const impressum = {
  de: {
    title: 'Impressum | Stavewise',
    description: 'Impressum der Mind the Brain FlexCo für Stavewise und stavewise.app.',
    heading: 'Impressum',
    placeholder: 'Inhalt folgt.',
  },
  en: {
    title: 'Legal notice | Stavewise',
    description: 'Legal notice of Mind the Brain FlexCo for Stavewise and stavewise.app.',
    heading: 'Legal notice',
    placeholder: 'Content follows.',
  },
} satisfies Record<Lang, Record<string, string>>;
