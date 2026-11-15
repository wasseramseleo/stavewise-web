import type { Lang, PageName } from '../lib/i18n';

// Home page: content of variant B "Gerät" with the questions of C (#545, #596),
// set as an engraved score that behaves like an instrument.
// German from #545 and prototype/website (#b); English claim and subline from
// #539, the English ways from #544, the rest translated in the tone of the EN
// store listing (open question 1 in #591, Leo checks it in the [Leo] PR).
// No "real melodies", no price, no "never" (#539, #542 decision 7).
// German is gender-inclusive with the colon: Tester:in, Klavierlehrer:innen.
// Release 1.1.0 (launch § 6.1 and its addendum, stavewise#924): the basics in the
// readout, the data sheet, the full-version card, the second question and the screenshots.

export interface Readout {
  label: string;
  value: string;
  note: string;
  /** The value is a word, not a figure: set in Schola italic like "einmal" of the full version. */
  spelled?: boolean;
}

export interface Way {
  title: string;
  tag: string;
  steps: readonly string[];
}

export interface Question {
  question: string;
  answers: readonly string[];
  /** Link line under the answer, to another page of the site. */
  link?: { text: string; page: PageName };
}

export interface HomeTexts {
  title: string;
  description: string;
  heading: string;
  /** End of the claim, set in italic in the hero; must end the heading. */
  headingItalic: string;
  subline: string;
  /** Alt text of the screenshot in the preview image (src/pages/og/). */
  heroAlt: string;
  /** Label of the animated score in the hero. */
  scoreLabel: string;
  readouts: readonly Readout[];
  sheetTitle: string;
  /** Rows of the data sheet: [what, answer]. */
  sheet: readonly (readonly [string, string])[];
  shotsTitle: string;
  shotAlts: { basics: string; exercise: string; statistics: string };
  /** Short caption line under each screenshot, after its figure number. */
  shotCaptions: { basics: string; exercise: string; statistics: string };
  waysTitle: string;
  ways: readonly Way[];
  fullLabel: string;
  fullWell: string;
  fullText: string;
  teacherLabel: string;
  teacherTitle: string;
  /** Teacher text around the support address. */
  teacherBefore: string;
  teacherAfter: string;
  questionsTitle: string;
  questions: readonly Question[];
  /** Guide links (launch § 14.6, variant B): line under each card of the ways, without the arrow. */
  waysGuide: string;
  /** Line "Mehr dazu" under the answer to the first question: label and texts of the connect and cable links. */
  moreLabel: string;
  moreConnect: string;
  moreCable: string;
}

export const home: Record<Lang, HomeTexts> = {
  de: {
    title: 'Stavewise: Noten lesen lernen am E-Piano, App für Android',
    description: 'Stavewise trainiert Notenlesen am E-Piano: Melodien mit beiden Händen, für Android, per USB oder Bluetooth-MIDI. Kein Abo, offline.',
    heading: 'Noten lesen lernen, indem du sie spielst.',
    headingItalic: 'indem du sie spielst.',
    subline: 'Melodien mit beiden Händen, an deinem E-Piano. Für Android, per USB oder Bluetooth-MIDI.',
    heroAlt: 'Übung in B-Dur mit Tonart-Leiste, Akkorde in beiden Händen',
    scoreLabel: 'Notenbeispiel in B-Dur, beide Hände: Die Markierung wartet auf jeder Note, bis die richtigen Tasten gedrückt sind. Richtig gespielte Noten werden grün, ein Fehlgriff erscheint rot.',
    readouts: [
      { label: 'Level', value: '65', note: 'vom ersten Schlüssel bis Moll mit Umkehrungen' },
      { label: 'Frei', value: '1–9', note: 'Level ohne Kauf, dazu Grundlagen, Statistik und Streak' },
      { label: 'Android', value: '12+', note: 'Phone quer, Tablet in beide Richtungen' },
      { label: 'Konto', value: 'keines', spelled: true, note: 'offline, die App schickt nichts an uns' },
    ],
    sheetTitle: 'Was Stavewise macht',
    sheet: [
      ['Was du liest', 'Melodien mit Kadenz'],
      ['Vorwissen', 'keines, die Grundlagen fangen bei den Tasten an'],
      ['Notensystem', 'Klaviersystem ab Tag 1'],
      ['Wie du antwortest', 'am E-Piano, per MIDI'],
      ['Bezahlen', 'einmal, kein Abo'],
      ['Notennamen', 'deutsch mit H und B'],
    ],
    shotsTitle: 'So sieht es aus',
    shotAlts: {
      basics: 'Grundlagen, Einheit 6 „Das G im Violinschlüssel“: Noten im Klaviersystem, darüber eine beschriftete Klaviatur und die Rückmeldung „Richtig: das G.“',
      exercise: 'Übung im Klaviersystem mitten in der Phrase, gespielte Noten grün',
      statistics: 'Statistik, Ansicht Lösezeit: ein Punkt je Übung über Level 1 bis 8, die Kurve fällt von 2,6 s in der ersten auf 1,6 s in der letzten Woche',
    },
    shotCaptions: {
      basics: 'Grundlagen: von den Tasten zu den ersten Noten.',
      exercise: 'Mitten in der Phrase: gespielte Noten werden grün.',
      statistics: 'Deine Lösezeit, Übung für Übung.',
    },
    waysTitle: 'Zwei Wege zum Klavier',
    ways: [
      {
        title: 'Mit USB-Kabel',
        tag: 'die meisten Digitalpianos',
        steps: [
          'Am Klavier die Buchse „USB to Host“ suchen, meist eckig (Typ B).',
          'Ein Kabel USB-B auf USB-C, oder ein USB-A-Kabel mit OTG-Adapter. Reine Ladekabel gehen nicht.',
          'Klavier einschalten. Es erscheint von selbst.',
        ],
      },
      {
        title: 'Über Bluetooth-MIDI',
        tag: 'z. B. Roland, Kawai',
        steps: [
          'Bluetooth am Klavier einschalten.',
          'Nicht in den Android-Einstellungen koppeln: Stavewise findet das Klavier selbst.',
          'Das Klavier in der Liste antippen.',
        ],
      },
    ],
    fullLabel: 'Vollversion',
    fullWell: 'einmal',
    fullText: 'Die Grundlagen und Level 1 bis 9 sind frei. Die Vollversion mit allen 65 Leveln und dem Sandkasten kaufst du einmal in Google Play: kein Abo, keine Werbung.',
    teacherLabel: 'Für Klavierlehrer:innen',
    teacherTitle: 'Vollversion kostenlos',
    teacherBefore: 'Wenn du unterrichtest, schreib an',
    teacherAfter: '; du bekommst einen Code.',
    questionsTitle: 'Fragen',
    questions: [
      {
        question: 'Passt mein Klavier?',
        answers: [
          'Wenn es eine USB-Buchse „USB to Host“ hat oder Bluetooth-MIDI, sehr wahrscheinlich. Für USB brauchst du zusätzlich einen OTG-Adapter für dein Phone oder Tablet. Ein akustisches Klavier geht nicht.',
        ],
      },
      {
        question: 'Ich kann noch gar keine Noten lesen. Geht das?',
        answers: [
          'Ja. Die Grundlagen beginnen bei den schwarzen Tasten: In sieben kurzen Einheiten findest du das mittlere C und liest C und G im Violinschlüssel. Danach geht es mit Level 1 weiter. Die Grundlagen sind kostenlos.',
        ],
      },
      {
        question: 'Was kostet Stavewise?',
        answers: [
          'Level 1 bis 9 sind kostenlos, ebenso Statistik, Streak und Erinnerung. Die Vollversion kaufst du einmal in Google Play. Kein Abo, keine Werbung.',
        ],
      },
      {
        question: 'Brauche ich ein Konto oder Internet?',
        answers: ['Nein. Stavewise läuft offline, braucht kein Konto und schickt nichts an uns.'],
      },
      {
        question: 'Welche Geräte?',
        answers: ['Android-Phones und -Tablets ab Android 12. Das Phone hältst du quer, das Tablet in beide Richtungen.'],
      },
      {
        question: 'Gibt es Stavewise für iPhone?',
        answers: ['Nein, nur für Android.'],
      },
      // Open test (launch § 15.8 Nr. 3); goes away at production (§ 12.2 step 14).
      {
        question: 'Was heißt Early Access?',
        answers: [
          'Stavewise ist in Google Play im offenen Test, bevor es offiziell startet. Jede:r kann es installieren, ohne Einladung. Die Vollversion ist ein normaler Kauf und bleibt dir auch nach dem Start. Bewertungen gehen bis dahin privat an uns statt öffentlich in den Store.',
        ],
        link: { text: 'Mehr zum offenen Test', page: 'beta' },
      },
    ],
    waysGuide: 'Ausführliche Anleitung',
    moreLabel: 'Mehr dazu',
    moreConnect: 'E-Piano mit Android verbinden',
    moreCable: 'Welches Kabel: USB to Host und OTG',
  },
  en: {
    title: 'Stavewise: Sight reading app for your digital piano (Android)',
    description: 'Stavewise trains sight reading on your digital piano: melodies with both hands, for Android, via USB or Bluetooth MIDI. No subscription, offline.',
    heading: 'Learn to read music by playing it.',
    headingItalic: 'by playing it.',
    subline: 'Melodies with both hands, on your own digital piano. For Android, via USB or Bluetooth MIDI.',
    heroAlt: 'Exercise in B-flat major with the key strip, chords in both hands',
    scoreLabel: 'Score in B-flat major, both hands: the playhead waits on each note until the right keys are pressed. Notes played correctly turn green, a wrong key shows in red.',
    readouts: [
      { label: 'Levels', value: '65', note: 'from the first clef to minor with inversions' },
      { label: 'Free', value: '1–9', note: 'levels without buying, plus the basics, statistics and streak' },
      { label: 'Android', value: '12+', note: 'phone in landscape, tablet either way' },
      { label: 'Account', value: 'none', spelled: true, note: 'offline, the app sends nothing to us' },
    ],
    sheetTitle: 'What Stavewise does',
    sheet: [
      ['What you read', 'melodies with a cadence'],
      ['Experience', 'none, the basics start at the keys'],
      ['Staff', 'grand staff from day one'],
      ['How you answer', 'on your digital piano, via MIDI'],
      ['Paying', 'once, no subscription'],
    ],
    shotsTitle: 'What it looks like',
    shotAlts: {
      basics: 'Basics, unit 6 “G in the treble clef”: notes on the grand staff, a labelled keyboard beside them and the feedback “Right: G.”',
      exercise: 'Exercise on the grand staff in the middle of a phrase, played notes in green',
      statistics: 'Statistics, solve time view: one dot per exercise across levels 1 to 8, the curve falls from 2.6 s in the first week to 1.6 s in the last',
    },
    shotCaptions: {
      basics: 'Basics: from the keys to your first notes.',
      exercise: 'Mid-phrase: played notes turn green.',
      statistics: 'Your solve time, exercise by exercise.',
    },
    waysTitle: 'Two ways to your piano',
    ways: [
      {
        title: 'With a USB cable',
        tag: 'most pianos',
        steps: [
          'Find the “USB to Host” port on the piano, usually square (type B).',
          'A USB-B to USB-C cable, or a USB-A cable with an OTG adapter. Charge-only cables don’t work.',
          'Switch the piano on. It shows up by itself.',
        ],
      },
      {
        title: 'With Bluetooth MIDI',
        tag: 'e.g. Roland, Kawai',
        steps: [
          'Turn on Bluetooth on the piano.',
          'Don’t pair it in Android’s settings: Stavewise finds the piano itself.',
          'Tap the piano in the list.',
        ],
      },
    ],
    fullLabel: 'Full version',
    fullWell: 'once',
    fullText: 'The basics and levels 1 to 9 are free. The full version with all 65 levels and the sandbox is a one-time purchase in Google Play: no subscription, no ads.',
    teacherLabel: 'For piano teachers',
    teacherTitle: 'Full version for free',
    teacherBefore: 'If you teach, write to',
    teacherAfter: '; you’ll get a code.',
    questionsTitle: 'Questions',
    questions: [
      {
        question: 'Will my piano work?',
        answers: [
          'If it has a “USB to Host” port or Bluetooth MIDI, very likely. For USB you also need an OTG adapter for your phone or tablet. An acoustic piano won’t work.',
        ],
      },
      {
        question: 'I can’t read music at all yet. Can I still start?',
        answers: [
          'Yes. The basics start at the black keys: in seven short units you find middle C and read C and G in the treble clef. Then you carry on with level 1. The basics are free.',
        ],
      },
      {
        question: 'What does Stavewise cost?',
        answers: [
          'Levels 1 to 9 are free, and so are statistics, streak and reminders. The full version is a one-time purchase in Google Play. No subscription, no ads.',
        ],
      },
      {
        question: 'Do I need an account or internet?',
        answers: ['No. Stavewise works offline, needs no account and sends nothing to us.'],
      },
      {
        question: 'Which devices?',
        answers: ['Android phones and tablets running Android 12 or newer. You hold the phone in landscape, the tablet either way.'],
      },
      {
        question: 'Is there Stavewise for iPhone?',
        answers: ['No, only for Android.'],
      },
      // Open test (launch § 15.8 Nr. 3); goes away at production (§ 12.2 step 14).
      {
        question: 'What does early access mean?',
        answers: [
          'Stavewise is in open testing on Google Play before its official launch. Anyone can install it, no invitation needed. The full version is a regular purchase and stays yours after launch. Until then, reviews go privately to us instead of publicly to the store.',
        ],
        link: { text: 'More about early access', page: 'beta' },
      },
    ],
    // English link texts from spec stavewise#713, open question 2.
    waysGuide: 'Step-by-step guide',
    moreLabel: 'More',
    moreConnect: 'Connect a digital piano to Android',
    moreCable: 'Which cable: USB to Host and OTG',
  },
};

/** The claim split for setting: [upright lead, italic end]. */
export function claimParts(t: HomeTexts): readonly [string, string] {
  if (!t.heading.endsWith(t.headingItalic)) throw new Error(`headingItalic must end the heading: ${t.heading}`);
  return [t.heading.slice(0, t.heading.length - t.headingItalic.length), t.headingItalic];
}
