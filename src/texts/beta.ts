import type { Lang } from '../lib/i18n';

// /beta while the open test runs (launch § 15.8, variant C; spec stavewise#828):
// the page explains the open test, the call for the closed test team stays
// below. Texts verbatim from proto.<lang>.open of prototype/offener-test.
// "Early Access" only where Play shows it to users that way; never "Beta" on
// its own (launch § 15.1).

export interface BetaTexts {
  title: string;
  description: string;
  label: string;
  heading: string;
  lead: string;
  whatHeading: string;
  /** The three points: levels and purchase, private reviews, updates. */
  what: readonly string[];
  /** Feedback sentence around the support address. */
  feedbackBefore: string;
  feedbackAfter: string;
  /** Call for the closed test team, as long as the closed test runs. */
  teamHeading: string;
  team: string;
  formButton: string;
  privacyBefore: string;
  privacyLink: string;
  privacyAfter: string;
}

export const beta: Record<Lang, BetaTexts> = {
  de: {
    title: 'Offener Test | Stavewise',
    description:
      'Stavewise ist in Google Play im offenen Test: für alle installierbar, ohne Einladung, Level 1 bis 9 frei. Für den geschlossenen Test suchen wir weiter Tester:innen fürs Testteam.',
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
    formButton: 'Zum Bewerbungsformular',
    privacyBefore:
      'Das Formular liegt bei Microsoft Forms. Wofür wir deine Angaben nutzen und wann wir sie löschen: ',
    privacyLink: 'Datenschutz, Teil B',
    privacyAfter: '.',
  },
  en: {
    title: 'Early access | Stavewise',
    description:
      'Stavewise is in early access on Google Play: anyone can install it, no invitation, levels 1 to 9 free. For the closed test we are still looking for testers to join the test team.',
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
    formButton: 'Go to the application form',
    privacyBefore:
      'The form is hosted by Microsoft Forms. What we use your details for and when we delete them: ',
    privacyLink: 'privacy policy, part B',
    privacyAfter: '.',
  },
};
