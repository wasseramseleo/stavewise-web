import type { Lang } from '../lib/i18n';

// Home page, variant B "Gerät" with the questions of C (#545, #596).
// German from #545 and prototype/website (#b); English claim and subline from
// #539, the English ways from #544, the rest translated in the tone of the EN
// store listing (open question 1 in #591, Leo checks it in the [Leo] PR).
// No "real melodies", no price, no "never" (#539, #542 decision 7).

export interface Readout {
  label: string;
  value: string;
  note: string;
}

export interface Way {
  title: string;
  tag: string;
  steps: readonly string[];
}

export interface Question {
  question: string;
  answers: readonly string[];
}

export interface HomeTexts {
  title: string;
  description: string;
  heading: string;
  subline: string;
  applyButton: string;
  applyWindow: string;
  heroAlt: string;
  readouts: readonly Readout[];
  sheetTitle: string;
  /** Rows of the data sheet: [what, answer]. */
  sheet: readonly (readonly [string, string])[];
  shotsTitle: string;
  shotAlts: { exercise: string; result: string; statistics: string };
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
    subline: 'Melodien mit beiden Händen, an deinem E-Piano. Für Android, per USB oder Bluetooth-MIDI.',
    applyButton: 'Als Tester bewerben',
    applyWindow: 'BETA',
    heroAlt: 'Übung in B-Dur mit Tonart-Leiste und Hilfe zu Notennamen und Tasten',
    readouts: [
      { label: 'Level', value: '29', note: 'vom ersten Schlüssel bis Moll mit Umkehrungen' },
      { label: 'Frei', value: '1–9', note: 'Level ohne Kauf, dazu Statistik und Streak' },
      { label: 'Android', value: '12+', note: 'Phone quer, Tablet in beide Richtungen' },
      { label: 'Konto', value: '0', note: 'offline, die App schickt nichts an uns' },
    ],
    sheetTitle: 'Was Stavewise macht',
    sheet: [
      ['Was du liest', 'Melodien mit Kadenz'],
      ['Notensystem', 'Klaviersystem ab Tag 1'],
      ['Wie du antwortest', 'am E-Piano, per MIDI'],
      ['Bezahlen', 'einmal, kein Abo'],
      ['Notennamen', 'deutsch mit H und B'],
    ],
    shotsTitle: 'So sieht es aus',
    shotAlts: {
      exercise: 'Übung im Klaviersystem mitten in der Phrase, gespielte Noten grün',
      result: 'Ergebnis: Level gemeistert, mit Genauigkeit, Lösezeit und dem nächsten Level',
      statistics: 'Statistik als Heatmap: welche Noten du sicher liest und welche nicht',
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
    fullText: 'Level 1 bis 9 sind frei. Die Vollversion mit allen 29 Leveln und dem Sandkasten kaufst du einmal in Google Play: kein Abo, keine Werbung.',
    teacherLabel: 'Für Klavierlehrer',
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
    subline: 'Melodies with both hands, on your own digital piano. For Android, via USB or Bluetooth MIDI.',
    applyButton: 'Apply as a tester',
    applyWindow: 'BETA',
    heroAlt: 'Exercise in B-flat major with the key strip and a hint showing note names and keys',
    readouts: [
      { label: 'Levels', value: '29', note: 'from the first clef to minor with inversions' },
      { label: 'Free', value: '1–9', note: 'levels without buying, plus statistics and streak' },
      { label: 'Android', value: '12+', note: 'phone in landscape, tablet either way' },
      { label: 'Account', value: '0', note: 'offline, the app sends nothing to us' },
    ],
    sheetTitle: 'What Stavewise does',
    sheet: [
      ['What you read', 'melodies with a cadence'],
      ['Staff', 'grand staff from day one'],
      ['How you answer', 'on your digital piano, via MIDI'],
      ['Paying', 'once, no subscription'],
    ],
    shotsTitle: 'What it looks like',
    shotAlts: {
      exercise: 'Exercise on the grand staff in the middle of a phrase, played notes in green',
      result: 'Result: level mastered, with accuracy, solve time and the next level',
      statistics: 'Statistics as a heatmap: which notes you read confidently and which you don’t',
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
    fullText: 'Levels 1 to 9 are free. The full version with all 29 levels and the sandbox is a one-time purchase in Google Play: no subscription, no ads.',
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
    ],
    // English link texts from spec stavewise#713, open question 2.
    waysGuide: 'Step-by-step guide',
    moreLabel: 'More',
    moreConnect: 'Connect a digital piano to Android',
    moreCable: 'Which cable: USB to Host and OTG',
  },
};
