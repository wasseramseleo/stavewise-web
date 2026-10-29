// Guide page 5 "Noten lesen lernen mit App: Android, E-Piano, ohne Abo" (launch § 14.3 row 5;
// stavewise#720). Starts from criteria and is not a comparison: what matters in a sight-reading app
// for Android (MIDI, both hands, no subscription, offline). Other apps are named factually with the
// date their Play listings were checked, without a table of ticks; every app claim links its Play
// listing or the maker's help page. Stavewise comes at the end (launch § 14.3) and otherwise only in
// the disclosure and the closing card (launch § 14.5). No amount (launch § 6.1).
import { pathOf, type Lang } from '../../lib/i18n';
import type { GuideTexts } from '../guide';
import shot from '../../assets/screenshots/de/exercise.png';

/** Date the Play listings and help pages below were read. */
const CHECKED = { de: '29. Oktober 2026', en: '29 October 2026' } as const;

const AOSP_MIDI = 'https://source.android.com/docs/core/audio/midi';
const SIMPLY_BLUETOOTH = 'https://piano-help.hellosimply.com/en/articles/8147838-connect-to-midi-over-bluetooth';
const FLOWKEY_ANDROID = 'https://help.flowkey.com/en/articles/412902-connect-your-instrument-with-your-android-device';

const play = (id: string) => `https://play.google.com/store/apps/details?id=${id}`;
const SIMPLY = play('com.joytunes.simplypiano');
const FLOWKEY = play('com.flowkey.app');
const SKOOVE = play('com.skoove.piano');
const SYNTHESIA = play('com.synthesia.synthesia');
const CMRT = play('com.binaryguilt.completemusicreadingtrainer');
const PIANO_TRAINER = play('com.pianotraining.app');
const NOTE_SIGHT = play('com.note_sight');

export const app: Record<Lang, GuideTexts> = {
  de: {
    title: 'Noten lesen lernen mit App: Android, E-Piano, ohne Abo',
    description:
      'Worauf es bei einer App zum Notenlesen am E-Piano unter Android ankommt: MIDI, beide Hände, ohne Abo, offline. Dazu Apps, die du dir ansehen kannst, Stand Oktober 2026.',
    heading: 'Noten lesen lernen mit App',
    headingSub: 'für Android, am E-Piano, ohne Abo',
    answer:
      'Für das Notenlesen am E-Piano suchst du eine App, die dein Spiel per MIDI liest, über USB-Kabel oder Bluetooth, Taste für Taste. Achte außerdem darauf, ob sie beide Hände im Klaviersystem prüft, ob sie ein Abo verlangt und ob sie ohne Internet läuft. Auf Android gibt es große Lern-Apps mit Songs und Abo und kleine Trainer nur fürs Lesen; welche passt, hängt davon ab, ob du Stücke lernen oder das Lesen selbst üben willst.',
    disclosureRest: 'Die Kriterien hier gelten für jede App; Stavewise kommt erst am Ende.',
    sections: [
      {
        heading: 'MIDI: die App liest jede Taste',
        blocks: [
          {
            p: [
              'Ein E-Piano kann einer App per MIDI melden, welche Taste du wann drückst. Android kann das ',
              { text: 'seit Android 6.0, über USB und über Bluetooth LE', href: AOSP_MIDI },
              '. Viele Apps hören stattdessen über das Mikrofon zu; das geht auch am akustischen Klavier. Am E-Piano übe ich mit MIDI, weil die App dann jede Taste direkt gemeldet bekommt, statt sie aus dem Klang herauszuhören.',
            ],
          },
          {
            p: [
              'Schau dabei auf beide Wege: Nicht jede App kann auf Android Bluetooth-MIDI. Simply Piano etwa ',
              { text: 'nennt Bluetooth-MIDI in seiner Hilfe nur für iPhone und iPad', href: SIMPLY_BLUETOOTH },
              '. Hat dein Piano kein Bluetooth, brauchst du ohnehin ein Kabel.',
            ],
          },
          {
            related: {
              lead: 'Wie du das Piano anschließt:',
              text: 'E-Piano mit Android-Handy oder -Tablet verbinden',
              href: pathOf('de', 'connect'),
            },
          },
          {
            related: {
              lead: 'Welches Kabel genau?',
              text: 'USB to Host und OTG: welches Kabel ans Handy oder Tablet',
              href: pathOf('de', 'cable'),
            },
          },
        ],
      },
      {
        heading: 'Beide Hände im Klaviersystem',
        blocks: [
          {
            p: 'Klaviernoten stehen in zwei Systemen, oben meist im Violin-, unten im Bassschlüssel. Der Notentrainer, den ich vorher benutzt habe, zeigte eine Note nach der anderen in einem Schlüssel. Das hilft am Anfang; am Klavier liest du aber beide Systeme zugleich, und oft stehen zwei Noten übereinander.',
          },
          {
            p: 'Achte deshalb darauf, ob die App beide Systeme zusammen zeigt und prüft, ob beide Tasten gedrückt sind. In den Store-Einträgen heißt das meist „both hands“ oder „two-hand“.',
          },
          {
            related: {
              lead: 'Der Bassschlüssel sitzt noch nicht?',
              text: 'Bassschlüssel lesen lernen: die linke Hand am Klavier',
              href: pathOf('de', 'bassClef'),
            },
          },
          {
            related: {
              lead: 'Wie ich beide Hände geübt habe:',
              text: 'Noten lesen mit beiden Händen',
              href: pathOf('de', 'bothHands'),
            },
          },
        ],
      },
      {
        heading: 'Abo oder Einmalkauf',
        blocks: [
          {
            p: 'Die großen Lern-Apps verkaufen den vollen Umfang als Abo, teils mit einer Testwoche. Daneben gibt es Apps, die du einmal kaufst, und kostenlose. Fürs Lesen selbst brauchst du keine Song-Bibliothek, sondern viele neue, kurze Übungen. Probier die kostenlose Stufe aus, bevor du dich festlegst.',
          },
          {
            p: 'Der Hinweis „In-App-Käufe“ im Play Store sagt nicht, ob es ein Abo ist. Das steht in der Beschreibung der App.',
          },
        ],
      },
      {
        heading: 'Offline und ohne Konto',
        blocks: [
          {
            p: 'Für fünf Minuten am Klavier ist es angenehm, wenn eine App ohne Anmeldung und ohne Internet startet. Ob sie ein Konto braucht oder Daten in die Cloud schickt, steht nicht in jedem Store-Eintrag; im Zweifel hilft die Datenschutzerklärung, oder du startest die App einmal im Flugmodus.',
          },
        ],
      },
      {
        heading: 'Apps, die du dir ansehen kannst',
        blocks: [
          {
            note: `Stand der Play-Einträge: ${CHECKED.de}. Die Angaben stammen aus den Beschreibungen in Google Play und den Hilfeseiten der Anbieter, nicht aus eigenen Tests.`,
          },
          { p: 'Lern-Apps mit Songs und Kursen:' },
          {
            ul: [
              {
                text: [
                  { text: 'Simply Piano', href: SIMPLY },
                  ': hört über das Mikrofon oder per MIDI zu und führt vom Notenlesen bis zum Spiel mit beiden Händen; den vollen Umfang gibt es im Abo.',
                ],
              },
              {
                text: [
                  { text: 'flowkey', href: FLOWKEY },
                  ': Songs und Kurse, auch zum Notenlesen; der Wartemodus folgt dir über das Mikrofon oder per Bluetooth und MIDI, jede Hand lässt sich einzeln üben; Abo.',
                ],
                note: [
                  'Für Bluetooth-MIDI unter Android braucht flowkey ',
                  { text: 'laut Hilfe teils die Standort-Berechtigung', href: FLOWKEY_ANDROID },
                  '.',
                ],
              },
              {
                text: [
                  { text: 'Skoove', href: SKOOVE },
                  ': Lektionen und Songs mit Notenlesen; E-Pianos über USB-MIDI, Bluetooth-MIDI oder das Mikrofon; Premium im Abo.',
                ],
              },
              {
                text: [
                  { text: 'Synthesia', href: SYNTHESIA },
                  ': Songs als Notenblatt oder als fallende Blöcke, jede Hand einzeln oder beide, mit E-Piano; die Vollversion kaufst du einmal, kein Abo.',
                ],
                note: 'Das letzte Update im Play Store ist vom Februar 2025.',
              },
            ],
          },
          { p: 'Trainer nur fürs Notenlesen:' },
          {
            ul: [
              {
                text: [
                  { text: 'Complete Music Reading Trainer', href: CMRT },
                  ': Übungen zu allen sieben Schlüsseln, Eingabe auch per MIDI oder Mikrofon; das erste Kapitel je Schlüssel ist frei, die Vollversion ein einmaliger Kauf.',
                ],
                note: 'Beide Hände oder Akkorde nennt der Eintrag nicht.',
              },
              {
                text: [
                  { text: 'Piano Trainer: Sight-Reading', href: PIANO_TRAINER },
                  ': erzeugt immer neue Übungen und prüft Akkorde und beide Hände zusammen; braucht ein MIDI-Keyboard am USB-Kabel und hört nicht über das Mikrofon; laut Eintrag ohne Konto, Werbung und Abo.',
                ],
                note: 'Bluetooth-MIDI nennt der Eintrag nicht.',
              },
              {
                text: [
                  { text: 'Note Sight', href: NOTE_SIGHT },
                  ': Notenlesen und Gehörbildung, mit einem Modus für beide Hände und Akkorden; Eingabe per MIDI, Mikrofon oder Bildschirm-Tastatur; der Play-Eintrag nennt keine In-App-Käufe.',
                ],
              },
            ],
          },
        ],
      },
      {
        heading: 'Und Stavewise?',
        blocks: [
          {
            p: 'Stavewise ist ein Trainer fürs Notenlesen: Die App zeigt kurze Melodien im Klaviersystem, du spielst sie mit beiden Händen am E-Piano, und sie prüft jede Taste per USB- oder Bluetooth-MIDI; das Piano koppelt sie selbst. Sie läuft offline und ohne Konto, auf Android ab Version 12. Zum Preis: Level 1 bis 9 frei, die Vollversion kaufst du einmal in Google Play, kein Abo.',
          },
          {
            p: 'Was sie nicht kann: Sie hört nicht über das Mikrofon, ein akustisches Klavier geht also nicht. Es gibt keine Songs und keine Fassung für das iPhone, und gerade läuft noch der Beta-Test. Das Bild zeigt eine Übung im Level „Beide Hände“.',
          },
          {
            figure: {
              src: shot,
              alt: 'Eine Übung in Stavewise im Level „Beide Hände“: Melodie im Violinschlüssel, Basstöne im Bassschlüssel',
            },
          },
        ],
      },
    ],
    questions: [
      {
        q: 'Gibt es eine Notenlese-App für Android ohne Abo?',
        a: `Ja. Von den Apps oben verkaufen Synthesia und Complete Music Reading Trainer die Vollversion einmal, Piano Trainer: Sight-Reading kommt laut Eintrag ohne Abo aus, und Note Sight nennt im Play-Eintrag keine In-App-Käufe (Stand ${CHECKED.de}).`,
      },
      {
        q: 'Reicht das Mikrofon statt MIDI?',
        a: 'Am akustischen Klavier ist das Mikrofon der einzige Weg, und viele Apps können das. Am E-Piano nehme ich MIDI, weil die App dann jede Taste direkt gemeldet bekommt.',
      },
      {
        q: 'Song-App oder Trainer fürs Notenlesen?',
        a: 'Willst du bestimmte Stücke spielen, liegt eine Song-App nahe. Hakt es wie bei mir am Lesen selbst, übe ich das lieber getrennt von Stücken: Ein Stück, das ich schon kenne, spiele ich teils aus dem Gedächtnis, das Lesen übe ich damit kaum.',
      },
    ],
  },
  en: {
    title: 'Sight reading app for Android with MIDI, no subscription',
    description:
      'What matters in a sight-reading app for your digital piano on Android: MIDI, both hands, no subscription, offline. Plus the apps worth a look, as of October 2026.',
    heading: 'Sight reading app for Android',
    headingSub: 'with MIDI, both hands and no subscription',
    answer:
      'To learn to read music on a digital piano, look for an app that reads your playing over MIDI, by USB cable or Bluetooth, key by key. Also check whether it checks both hands on the grand staff, whether it needs a subscription and whether it works offline. On Android there are big learning apps with songs and a subscription, and small trainers just for reading; which one fits depends on whether you want to learn pieces or practise reading itself.',
    disclosureRest: 'The criteria here apply to any app; Stavewise only comes at the end.',
    sections: [
      {
        heading: 'MIDI: the app reads every key',
        blocks: [
          {
            p: [
              'Over MIDI, a digital piano tells an app which key you press and when. Android supports this ',
              { text: 'since Android 6.0, over USB and over Bluetooth LE', href: AOSP_MIDI },
              '. Many apps listen through the microphone instead, which also works on an acoustic piano. On a digital piano I practise with MIDI, because the app then gets every key reported directly instead of picking it out of the sound.',
            ],
          },
          {
            p: [
              'Check both ways in: not every app supports Bluetooth MIDI on Android. Simply Piano, for example, ',
              { text: 'names Bluetooth MIDI in its help only for iPhone and iPad', href: SIMPLY_BLUETOOTH },
              '. If your piano has no Bluetooth, you need a cable anyway.',
            ],
          },
          {
            related: {
              lead: 'How to hook up the piano:',
              text: 'Connect a digital piano to Android',
              href: pathOf('en', 'connect'),
            },
          },
          {
            related: {
              lead: 'Which cable exactly?',
              text: 'USB to Host, OTG adapters and USB-C',
              href: pathOf('en', 'cable'),
            },
          },
        ],
      },
      {
        heading: 'Both hands on the grand staff',
        blocks: [
          {
            p: 'Piano music is written on two staves, usually treble clef on top and bass clef below. The note trainer I used before showed one note after another in a single clef. That helps at first, but at the piano you read both staves at once, and often two notes sit one above the other.',
          },
          {
            p: 'So check whether the app shows both staves together and checks that both keys are down. In store listings this is usually called “both hands” or “two-hand”.',
          },
          {
            related: {
              lead: 'Bass clef still shaky?',
              text: 'How to read bass clef on piano (left hand)',
              href: pathOf('en', 'bassClef'),
            },
          },
          {
            related: {
              lead: 'How I practised both hands:',
              text: 'Reading treble and bass clef at the same time',
              href: pathOf('en', 'bothHands'),
            },
          },
        ],
      },
      {
        heading: 'Subscription or one-time purchase',
        blocks: [
          {
            p: 'The big learning apps sell their full range as a subscription, some with a free trial week. There are also apps you buy once, and free ones. For reading itself you don’t need a song library, you need lots of new, short exercises. Try the free tier before you commit.',
          },
          {
            p: 'The “In-app purchases” label in the Play Store doesn’t tell you whether it’s a subscription. The app’s description does.',
          },
        ],
      },
      {
        heading: 'Offline and without an account',
        blocks: [
          {
            p: 'For five minutes at the piano it’s nice when an app starts without a login and without internet. Whether it needs an account or sends data to the cloud isn’t in every store listing; if in doubt, read the privacy policy, or start the app once in airplane mode.',
          },
        ],
      },
      {
        heading: 'Apps worth a look',
        blocks: [
          {
            note: `Play listings as of ${CHECKED.en}. The details come from the descriptions in Google Play and the makers’ help pages, not from my own tests.`,
          },
          { p: 'Learning apps with songs and courses:' },
          {
            ul: [
              {
                text: [
                  { text: 'Simply Piano', href: SIMPLY },
                  ': listens through the microphone or over MIDI and takes you from reading sheet music to playing with both hands; the full range is a subscription.',
                ],
              },
              {
                text: [
                  { text: 'flowkey', href: FLOWKEY },
                  ': songs and courses, including reading sheet music; Wait Mode follows you through the microphone or over Bluetooth and MIDI, and you can practise each hand on its own; subscription.',
                ],
                note: [
                  'For Bluetooth MIDI on Android, flowkey ',
                  { text: 'may need the location permission, says its help', href: FLOWKEY_ANDROID },
                  '.',
                ],
              },
              {
                text: [
                  { text: 'Skoove', href: SKOOVE },
                  ': lessons and songs with note reading; digital pianos over USB MIDI, Bluetooth MIDI or the microphone; Premium is a subscription.',
                ],
              },
              {
                text: [
                  { text: 'Synthesia', href: SYNTHESIA },
                  ': songs as sheet music or falling blocks, each hand separately or together, with a digital piano; you unlock it with a one-time purchase, no subscription.',
                ],
                note: 'Its last update in the Play Store is from February 2025.',
              },
            ],
          },
          { p: 'Trainers just for reading music:' },
          {
            ul: [
              {
                text: [
                  { text: 'Complete Music Reading Trainer', href: CMRT },
                  ': drills for all seven clefs, with input over MIDI or the microphone as well; the first chapter of each clef is free, the full version a one-time purchase.',
                ],
                note: 'The listing doesn’t mention both hands or chords.',
              },
              {
                text: [
                  { text: 'Piano Trainer: Sight-Reading', href: PIANO_TRAINER },
                  ': generates fresh exercises and checks chords and both hands together; needs a MIDI keyboard on a USB cable and doesn’t listen through the microphone; no accounts, ads or subscriptions, says the listing.',
                ],
                note: 'The listing doesn’t mention Bluetooth MIDI.',
              },
              {
                text: [
                  { text: 'Note Sight', href: NOTE_SIGHT },
                  ': note reading and ear training, with a two-hand mode and chords; input over MIDI, the microphone or an on-screen keyboard; the Play listing shows no in-app purchases.',
                ],
              },
            ],
          },
        ],
      },
      {
        heading: 'And Stavewise?',
        blocks: [
          {
            p: 'Stavewise is a trainer for reading music: it shows short melodies on the grand staff, you play them with both hands on your digital piano, and it checks every key over USB or Bluetooth MIDI; it pairs the piano itself. It works offline and without an account, on Android 12 and later. On price: Levels 1 to 9 are free, you buy the full version once in Google Play, no subscription.',
          },
          {
            p: 'What it can’t do: it doesn’t listen through the microphone, so an acoustic piano won’t work. There are no songs and no iPhone version, and the beta test is still running. The screenshot shows an exercise at the level “Both hands”.',
          },
          {
            figure: {
              src: shot,
              alt: 'An exercise in Stavewise at the level “Both hands”: a melody in treble clef, bass notes in bass clef',
            },
          },
        ],
      },
    ],
    questions: [
      {
        q: 'Is there a sight-reading app for Android without a subscription?',
        a: `Yes. Of the apps above, Synthesia and Complete Music Reading Trainer sell the full version once, Piano Trainer: Sight-Reading says it has no subscriptions, and Note Sight shows no in-app purchases in its Play listing (as of ${CHECKED.en}).`,
      },
      {
        q: 'Is the microphone enough instead of MIDI?',
        a: 'On an acoustic piano the microphone is the only way, and many apps can do it. On a digital piano I use MIDI, because the app then gets every key reported directly.',
      },
      {
        q: 'Song app or reading trainer?',
        a: 'If you want to play particular pieces, a song app is the obvious choice. If, like me, reading itself is what holds you back, I’d practise it separately from pieces: a piece I already know I play partly from memory, so it hardly trains my reading.',
      },
    ],
  },
};
