import type { Lang, PageName } from '../lib/i18n';

/** A group of the guide row in the footer: its name and its pages with their short link text. */
export interface GuideGroup {
  name: string;
  guides: readonly (readonly [page: PageName, text: string])[];
}

export interface LayoutTexts {
  /** aria-label of the wordmark link to the home page. */
  homeLabel: string;
  /** Pill in the header, linked to the store listing on Google Play (launch § 15.8 Nr. 2). */
  playLink: string;
  company: string;
  /** Trademark line Google asks for wherever the badge is shown (launch § 15.8 Nr. 5). */
  trademark: string;
  footerNavLabel: string;
  beta: string;
  impressum: string;
  privacy: string;
  /** Name of the other language, in that language. */
  otherLanguage: string;
  /** Label of the guide row above the footer (launch § 14.6, variant C). */
  guidesLabel: string;
  guideGroups: readonly GuideGroup[];
}

export const layout: Record<Lang, LayoutTexts> = {
  de: {
    homeLabel: 'Stavewise Startseite',
    playLink: 'Early Access in Google Play',
    company: 'Ein Produkt der Mind the Brain FlexCo, Innsbruck',
    trademark: 'Google Play und das Google Play-Logo sind Marken von Google LLC.',
    footerNavLabel: 'Weitere Seiten',
    beta: 'Beta',
    impressum: 'Impressum',
    privacy: 'Datenschutz',
    otherLanguage: 'English',
    guidesLabel: 'Ratgeber',
    guideGroups: [
      {
        name: 'Technik',
        guides: [
          ['connect', 'E-Piano mit Android verbinden'],
          ['cable', 'Welches Kabel: USB to Host und OTG'],
        ],
      },
      {
        name: 'Noten lesen',
        guides: [
          ['bassClef', 'Bassschlüssel lesen lernen'],
          ['bothHands', 'Noten lesen mit beiden Händen'],
        ],
      },
      { name: 'App', guides: [['app', 'Noten lesen lernen mit App']] },
    ],
  },
  en: {
    homeLabel: 'Stavewise home',
    playLink: 'Early access on Google Play',
    company: 'A product of Mind the Brain FlexCo, Innsbruck',
    trademark: 'Google Play and the Google Play logo are trademarks of Google LLC.',
    footerNavLabel: 'More pages',
    beta: 'Beta',
    impressum: 'Legal notice',
    privacy: 'Privacy policy',
    otherLanguage: 'Deutsch',
    // Group names from spec stavewise#713, open question 1.
    guidesLabel: 'Guides',
    guideGroups: [
      {
        name: 'Setup',
        guides: [
          ['connect', 'Connect a digital piano to Android'],
          ['cable', 'Which cable: USB to Host and OTG'],
        ],
      },
      {
        name: 'Reading music',
        guides: [
          ['bassClef', 'How to read bass clef'],
          ['bothHands', 'Reading treble and bass clef together'],
        ],
      },
      { name: 'App', guides: [['app', 'Sight reading app for Android']] },
    ],
  },
};
