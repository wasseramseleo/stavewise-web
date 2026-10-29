// Shared texts and content types of the guide pages (launch § 14.4, 14.5; spec stavewise#713).
import type { ImageMetadata } from 'astro';
import type { Lang } from '../lib/i18n';

/** Inline text: plain, or a link (internal path or external source). */
export type Inline = string | { text: string; href: string };
/** A run of inline text. */
export type Rich = string | readonly Inline[];

/** A list item with an optional grey addition in the same item (launch § 14.5 Nr. 6). */
export interface Item {
  text: Rich;
  note?: Rich;
}

/** Building blocks of an H2 section, rendered in order. */
export type Block =
  | { p: Rich }
  | { note: Rich }
  | { ul: readonly Item[] }
  | { ol: readonly Item[] }
  /** Troubleshooting list with a label per way (USB, Bluetooth, ...). */
  | { checks: readonly (readonly [label: string, text: Rich])[] }
  /** Cross reference to another guide page as its own line ("Welches Kabel genau? → ..."). */
  | { related: { lead: string; text: string; href: string } }
  /** App screenshot in a card. */
  | { figure: { src: ImageMetadata; alt: string } };

export interface Section {
  heading: string;
  blocks: readonly Block[];
}

export interface Question {
  q: string;
  a: Rich;
}

/** Everything one language version of a guide page says. */
export interface GuideTexts {
  title: string;
  description: string;
  /** H1 with the main search query. */
  heading: string;
  /** Grey line below the H1. */
  headingSub: string;
  /** "Kurz gesagt": the direct answer in two to four sentences. */
  answer: Rich;
  /** Sentence after the fixed disclosure, fitting the page. */
  disclosureRest: string;
  /** Demo still on the setup pages (launch § 14.5 Nr. 5). */
  still?: { src: ImageMetadata; alt: string };
  sections: readonly Section[];
  questions: readonly Question[];
}

/**
 * Month of the last update in the byline: month and year of the merge of the
 * [Leo] PR of spec stavewise#713. Leo adjusts it if the merge moves.
 */
export const UPDATED = { de: 'November 2026', en: 'November 2026' } as const satisfies Record<Lang, string>;

export interface GuideSharedTexts {
  author: string;
  bylinePrefix: string;
  updatedPrefix: string;
  answerLabel: string;
  disclosure: string;
  questionsHeading: string;
  ctaLabel: string;
  /** Claim of the home page, without the full stop. */
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  ctaWindow: string;
  authorLabel: string;
  /** Author block, wording of launch § 14.4. */
  authorText: string;
  homeLead: string;
  homeLink: string;
}

export const guideShared: Record<Lang, GuideSharedTexts> = {
  de: {
    author: 'Leonard Guelmino',
    bylinePrefix: 'Von',
    updatedPrefix: 'Stand',
    answerLabel: 'Kurz gesagt',
    disclosure: 'Offen gesagt: Ich habe Stavewise entwickelt, eine App zum Notenlesen am E-Piano.',
    questionsHeading: 'Fragen',
    ctaLabel: 'Stavewise',
    ctaTitle: 'Noten lesen lernen, indem du sie spielst',
    ctaText:
      'Stavewise trainiert Notenlesen an deinem E-Piano: Melodien mit beiden Händen, für Android, per USB oder Bluetooth-MIDI. Gerade läuft der Beta-Test.',
    ctaButton: 'Als Tester bewerben',
    ctaWindow: 'BETA',
    authorLabel: 'Über den Autor',
    authorText:
      'Ich bin Leonard Guelmino. Als Kind habe ich fünf Jahre Klavier gespielt, seit 2025 spiele ich als Erwachsener wieder. Das Notenlesen war dabei mein Engpass. Als Informatiker habe ich mir Stavewise gebaut, zuerst für mich, und teile es jetzt.',
    homeLead: 'Mehr über die App:',
    homeLink: 'Stavewise',
  },
  en: {
    author: 'Leonard Guelmino',
    bylinePrefix: 'By',
    updatedPrefix: 'Updated',
    answerLabel: 'In short',
    disclosure: 'Full disclosure: I built Stavewise, an app for learning to read music on a digital piano.',
    questionsHeading: 'Questions',
    ctaLabel: 'Stavewise',
    ctaTitle: 'Learn to read music by playing it',
    ctaText:
      'Stavewise trains sight-reading on your own digital piano: short melodies with both hands, on Android, over USB or Bluetooth MIDI. The beta test is running now.',
    ctaButton: 'Apply as a tester',
    ctaWindow: 'BETA',
    authorLabel: 'About the author',
    authorText:
      "I'm Leonard Guelmino. I played piano for five years as a child and came back to it as an adult in 2025. Reading music was what held me back, so, being a software developer, I built Stavewise for myself first and now I'm sharing it.",
    homeLead: 'More about the app:',
    homeLink: 'Stavewise',
  },
};
