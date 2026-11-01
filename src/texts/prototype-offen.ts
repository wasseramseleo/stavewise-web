// PROTOTYPE (stavewise#825): texts of the three variants for the home page and
// /beta once the open test is live. Never merged.
// A "Badge": official Play badge in the hero, test named in a small note and a question.
// B "Hausknopf": own ink button to Play, badge only in the full-version column.
// C "Leiste": notice strip under the header on every page, /beta explains the open test.
import type { Lang } from '../lib/i18n';

export type Variant = 'a' | 'b' | 'c';
export const VARIANTS: readonly Variant[] = ['a', 'b', 'c'];

export const playUrl = (lang: Lang) => `https://play.google.com/store/apps/details?id=app.stavewise&hl=${lang}`;

export const names: Record<Variant, string> = { a: 'Badge', b: 'Hausknopf', c: 'Leiste' };

interface ProtoTexts {
  badgeAlt: string;
  pill: Record<Variant, string>;
  /** Where the header pill points: Play or the /beta page. */
  pillTo: Record<Variant, 'play' | 'beta'>;
  heroNote: Record<Variant, string>;
  heroButton: string;
  /** C: line under the badge. */
  heroWhat: string;
  strip: { label: string; text: string; link: string };
  footerBeta: Record<Variant, string>;
  question: { question: string; answer: string };
  fullTextB: string;
  open: {
    title: string;
    label: string;
    heading: string;
    lead: string;
    whatHeading: string;
    what: readonly string[];
    feedbackBefore: string;
    feedbackAfter: string;
    teamHeading: string;
    team: string;
    teamButton: string;
    closedNote: string;
  };
}

export const proto: Record<Lang, ProtoTexts> = {
  de: {
    badgeAlt: 'Jetzt bei Google Play',
    pill: { a: 'Early Access in Google Play', b: 'Jetzt in Google Play', c: 'Offener Test' },
    pillTo: { a: 'play', b: 'play', c: 'beta' },
    heroNote: { a: 'Android · offener Test', b: 'Early Access · Level 1–9 frei', c: '' },
    heroButton: 'In Google Play installieren',
    heroWhat: 'Was heißt offener Test?',
    strip: {
      label: 'Offener Test',
      text: 'Stavewise ist in Google Play als Early Access zu haben, vor dem offiziellen Start.',
      link: 'Was das für dich heißt',
    },
    footerBeta: { a: 'Testteam', b: 'Offener Test', c: 'Offener Test' },
    question: {
      question: 'Was heißt Early Access?',
      answer:
        'Stavewise ist in Google Play im offenen Test, bevor es offiziell startet. Jede:r kann es installieren, ohne Einladung. Die Vollversion ist ein normaler Kauf und bleibt dir auch nach dem Start. Bewertungen gehen bis dahin privat an uns statt öffentlich in den Store.',
    },
    fullTextB:
      'Level 1 bis 9 sind frei. Die Vollversion mit allen 65 Leveln und dem Sandkasten kaufst du einmal in Google Play: kein Abo, keine Werbung.',
    open: {
      title: 'Offener Test | Stavewise',
      label: 'Offener Test',
      heading: 'Stavewise ist im offenen Test',
      lead: 'Bevor Stavewise offiziell in Google Play startet, ist es für alle als Early Access zu haben. Du installierst es ganz normal aus Google Play, ohne Anmeldung und ohne Einladung.',
      whatHeading: 'Was das für dich heißt',
      what: [
        'Level 1 bis 9 sind frei, die Vollversion kaufst du einmal. Der Kauf ist echt und bleibt dir nach dem Start.',
        'Google Play zeigt Stavewise als Early Access. Bewertungen gehen bis zum Start privat an uns, nicht öffentlich in den Store.',
        'Updates kommen über Google Play wie bei jeder App.',
      ],
      feedbackBefore: 'Klappt etwas nicht, oder fehlt dir etwas? Schreib an',
      feedbackAfter: '; mit Piano-Modell und Gerät helfen wir am schnellsten.',
      teamHeading: 'Ins Testteam',
      team: 'Für den geschlossenen Test suchen wir weiter Tester:innen mit möglichst verschiedenen Pianos und Geräten. Du übst etwa eine halbe Stunde, füllst einen Fragebogen aus (etwa 10 Minuten) und bekommst als Dank die Vollversion dauerhaft kostenlos.',
      teamButton: 'Zum Bewerbungsformular',
      closedNote: 'Der Aufruf für das Testteam ist geschlossen. Danke an alle, die mitgemacht haben.',
    },
  },
  en: {
    badgeAlt: 'Get it on Google Play',
    pill: { a: 'Early access on Google Play', b: 'Now on Google Play', c: 'Open testing' },
    pillTo: { a: 'play', b: 'play', c: 'beta' },
    heroNote: { a: 'Android · early access', b: 'Early access · levels 1–9 free', c: '' },
    heroButton: 'Install from Google Play',
    heroWhat: 'What does early access mean?',
    strip: {
      label: 'Open testing',
      text: 'Stavewise is available on Google Play as early access, ahead of its official launch.',
      link: 'What that means for you',
    },
    footerBeta: { a: 'Test team', b: 'Early access', c: 'Early access' },
    question: {
      question: 'What does early access mean?',
      answer:
        'Stavewise is in open testing on Google Play before its official launch. Anyone can install it, no invitation needed. The full version is a regular purchase and stays yours after launch. Until then, reviews go privately to us instead of publicly to the store.',
    },
    fullTextB:
      'Levels 1 to 9 are free. The full version with all 65 levels and the sandbox is a one-time purchase in Google Play: no subscription, no ads.',
    open: {
      title: 'Early access | Stavewise',
      label: 'Early access',
      heading: 'Stavewise is in early access',
      lead: 'Before Stavewise officially launches on Google Play, anyone can get it as early access. You install it from Google Play like any other app, no sign-up, no invitation.',
      whatHeading: 'What that means for you',
      what: [
        'Levels 1 to 9 are free, the full version is a one-time purchase. The purchase is real and stays yours after launch.',
        'Google Play shows Stavewise as early access. Until launch, reviews go privately to us, not publicly to the store.',
        'Updates come through Google Play like for any app.',
      ],
      feedbackBefore: 'Something not working, or something missing? Write to',
      feedbackAfter: '; your piano model and device help us most.',
      teamHeading: 'Join the test team',
      team: 'For the closed test we are still looking for testers with as many different pianos and devices as possible. You practise for about half an hour, fill in a questionnaire (about 10 minutes) and get the full version for free, for good, as a thank-you.',
      teamButton: 'Go to the application form',
      closedNote: 'The call for the test team is closed. Thanks to everyone who took part.',
    },
  },
};
