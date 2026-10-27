import type { Lang } from '../lib/i18n';

export interface LayoutTexts {
  /** aria-label of the wordmark link to the home page. */
  homeLabel: string;
  pill: string;
  company: string;
  footerNavLabel: string;
  beta: string;
  impressum: string;
  privacy: string;
  /** Name of the other language, in that language. */
  otherLanguage: string;
}

export const layout: Record<Lang, LayoutTexts> = {
  de: {
    homeLabel: 'Stavewise Startseite',
    pill: 'Beta: Tester gesucht',
    company: 'Ein Produkt der Mind the Brain FlexCo, Innsbruck',
    footerNavLabel: 'Weitere Seiten',
    beta: 'Beta',
    impressum: 'Impressum',
    privacy: 'Datenschutz',
    otherLanguage: 'English',
  },
  en: {
    homeLabel: 'Stavewise home',
    pill: 'Beta: testers wanted',
    company: 'A product of Mind the Brain FlexCo, Innsbruck',
    footerNavLabel: 'More pages',
    beta: 'Beta',
    impressum: 'Legal notice',
    privacy: 'Privacy policy',
    otherLanguage: 'Deutsch',
  },
};
