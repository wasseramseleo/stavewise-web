import type { Lang } from '../lib/i18n';

export interface BetaTexts {
  title: string;
  description: string;
  label: string;
  /** Call from #537 ("Beta-Aufruf"), without "echte" / "real". */
  heading: string;
  call: readonly string[];
  stepsHeading: string;
  /** The four steps; DE from prototype/website, EN translated (#591 open question 1). */
  steps: readonly string[];
  thanksLead: string;
  thanksRest: string;
  formButton: string;
  /** Shown next to the button while betaFormUrl is null. */
  formPending: string;
  privacyBefore: string;
  privacyLink: string;
  privacyAfter: string;
  questions: string;
}

export const beta: Record<Lang, BetaTexts> = {
  de: {
    title: 'Beta: Tester gesucht | Stavewise',
    description:
      'Stavewise sucht Tester mit eigenem E-Piano und Android-Gerät für den Test vor dem Start in Google Play.',
    label: 'Beta',
    heading: 'Tester mit eigenem E-Piano gesucht',
    call: [
      'Stavewise trainiert Notenlesen direkt am E-Piano: Die App zeigt Noten im Klaviersystem, du spielst sie, und die App hört über USB oder Bluetooth-MIDI mit. Kleine Melodien statt Einzelnoten-Drill, beide Hände ab dem ersten Tag, offline und ohne Konto.',
      'Vor dem Start in Google Play suchen wir 10 bis 20 Tester mit eigenem Digitalpiano und einem Android-Phone oder -Tablet (Android 12 oder neuer). Besonders gesucht sind Pianos mit USB-Anschluss (Yamaha, Casio, Korg, Roland, Kawai, Thomann …) und Samsung-Geräte.',
    ],
    stepsHeading: 'So läuft es ab',
    steps: [
      'Du bewirbst dich mit dem Formular unten. Wir wählen so aus, dass möglichst viele verschiedene Pianos und Geräte dabei sind.',
      'Wir schalten dein Google-Konto für den Test frei und schicken dir einen Link.',
      'Du installierst Stavewise über Google Play, verbindest dein Piano und übst etwa eine halbe Stunde.',
      'Du füllst einen Fragebogen aus, etwa 10 Minuten.',
    ],
    thanksLead: 'Als Dank',
    thanksRest: ' bekommst du die Vollversion dauerhaft kostenlos.',
    formButton: 'Zum Bewerbungsformular',
    formPending: 'Formular-Link folgt',
    privacyBefore:
      'Das Formular liegt bei Microsoft Forms. Wofür wir deine Angaben nutzen und wann wir sie löschen: ',
    privacyLink: 'Datenschutz, Teil B',
    privacyAfter: '.',
    questions: 'Fragen?',
  },
  en: {
    title: 'Beta: testers wanted | Stavewise',
    description:
      'Stavewise is looking for testers with their own digital piano and an Android device before launch on Google Play.',
    label: 'Beta',
    heading: 'Looking for testers with a digital piano',
    call: [
      'Stavewise trains sight-reading right at your digital piano: the app shows notes on the grand staff, you play them, and the app listens via USB or Bluetooth MIDI. Short melodies instead of single-note drills, both hands from day one, offline, no account.',
      'Before the Play Store launch we are looking for 10–20 testers with their own digital piano and an Android phone or tablet (Android 12 or newer). Pianos with a USB port (Yamaha, Casio, Korg, Roland, Kawai, Thomann …) and Samsung devices are especially welcome.',
    ],
    stepsHeading: 'How it works',
    steps: [
      'You apply with the form below. We pick testers so that as many different pianos and devices as possible are covered.',
      'We unlock your Google account for the test and send you a link.',
      'You install Stavewise from Google Play, connect your piano and practise for about half an hour.',
      'You fill in a questionnaire, about 10 minutes.',
    ],
    thanksLead: 'As a thank-you',
    thanksRest: ' you get the full version for free, for good.',
    formButton: 'Go to the application form',
    formPending: 'Form link follows',
    privacyBefore:
      'The form is hosted by Microsoft Forms. What we use your details for and when we delete them: ',
    privacyLink: 'privacy policy, part B',
    privacyAfter: '.',
    questions: 'Questions?',
  },
};
