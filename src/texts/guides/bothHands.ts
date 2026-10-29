// Guide page 4 "Noten lesen mit beiden Händen: Violin- und Bassschlüssel gleichzeitig" (launch § 14.3 row 4;
// stavewise#719). A core page with a section for adults and returners: written from the learner's side,
// general music theory only, every needed fact with a linked source (launch § 14.4). The practice order
// follows Leo's own way through the clefs, which the level ladder copies (docs/konzept-v1.md § 6.2 in the
// stavewise repo). Stavewise appears only in the disclosure, the screenshot section and the closing card
// (launch § 14.5). "Klaviersystem" / "grand staff" stay out of title and H1 (launch § 14.3).
import { pathOf, type Lang } from '../../lib/i18n';
import type { GuideTexts } from '../guide';
import shot from '../../assets/screenshots/de/exercise.png';

const WIKI_SYSTEM_DE = 'https://de.wikipedia.org/wiki/Notensystem_(Musik)#Akkolade';
const WIKI_CLEFS_DE = 'https://de.wikipedia.org/wiki/Notenschl%C3%BCssel';
const WIKI_SIGHT_DE = 'https://de.wikipedia.org/wiki/Blattspiel';
const WIKI_STAFF_EN = 'https://en.wikipedia.org/wiki/Staff_(music)';
const WIKI_SIGHT_EN = 'https://en.wikipedia.org/wiki/Sight-reading';

export const bothHands: Record<Lang, GuideTexts> = {
  de: {
    title: 'Noten lesen mit beiden Händen: Violin- und Bassschlüssel gleichzeitig',
    description:
      'Klaviernoten mit beiden Händen lesen: wie die zwei Systeme zusammenhängen, wie ich vom Wechseln zwischen den Schlüsseln zum gleichzeitigen Spielen gekommen bin, und was mir als Erwachsener beim Wiedereinstieg geholfen hat.',
    heading: 'Noten lesen mit beiden Händen',
    headingSub: 'Violin- und Bassschlüssel gleichzeitig',
    answer:
      'Klaviernoten stehen in zwei Systemen übereinander: oben meist der Violinschlüssel für die rechte Hand, unten der Bassschlüssel für die linke. Was gleichzeitig klingt, steht genau übereinander, du liest an diesen Stellen also senkrecht. Mir hat geholfen, erst jeden Schlüssel für sich zu lesen, dann Note für Note zwischen den Systemen zu wechseln und erst danach zwei Noten gleichzeitig zu spielen.',
    disclosureRest: 'Die Übungen hier gehen mit jedem Notenheft.',
    sections: [
      {
        heading: 'Zwei Systeme, eine Klammer',
        blocks: [
          {
            p: [
              'Noten für Klavier stehen in zwei fünflinigen Systemen, die links eine geschweifte Klammer verbindet. Zusammen heißen sie Klaviersystem: ',
              { text: 'oben mit Violinschlüssel, unten mit Bassschlüssel', href: WIKI_SYSTEM_DE },
              '. ',
              { text: 'Die linke Hand ist meistens im Bassschlüssel notiert', href: WIKI_CLEFS_DE },
              ', die rechte im Violinschlüssel.',
            ],
          },
          {
            p: [
              'Für das Lesen mit beiden Händen ist eine Regel wichtig: ',
              { text: 'Noten für Töne, die gleichzeitig erklingen, stehen genau übereinander', href: WIKI_SYSTEM_DE },
              '. Zwischen den Systemen liegt das mittlere C, auf einer Hilfslinie unter dem oberen oder über dem unteren System.',
            ],
          },
        ],
      },
      {
        heading: 'Senkrecht lesen statt Zeile für Zeile',
        blocks: [
          {
            p: 'Naheliegend ist, die beiden Systeme wie zwei Textzeilen zu lesen: erst oben ein Stück, dann unten. Am Klavier passt das nicht, weil die Hände zur selben Zeit spielen. Geholfen hat mir, eine Stelle mit zwei Noten als ein Bild zu sehen: Wo steht die untere Note, wo die obere, und dann beide Tasten zusammen.',
          },
          {
            p: 'Spielt nur eine Hand, schaue ich nur in ihr System. Wichtig war für mich, beim Wechsel nicht zu suchen, in welchem System die nächste Note steht, sondern beide Systeme im Blick zu behalten.',
          },
        ],
      },
      {
        heading: 'In dieser Reihenfolge habe ich geübt',
        blocks: [
          {
            ol: [
              {
                text: 'Jeden Schlüssel für sich, mit wenigen Tönen.',
                note: 'Den Bassschlüssel habe ich nicht aus dem Violinschlüssel umgerechnet, sondern eigens geübt.',
              },
              {
                text: 'Wechseln zwischen den Systemen, eine Note nach der anderen, erst nah am mittleren C.',
                note: 'Oben vom C bis zum G, unten vom E bis zum C: So bleiben beide Hände nah beieinander.',
              },
              {
                text: 'Den Tonumfang nach und nach erweitern, erst bis zu den beiden C eine Oktave über und unter dem mittleren C, dann weiter.',
              },
              {
                text: 'Zwei Noten gleichzeitig, eine je System: oben eine Melodie, unten ein Basston.',
              },
              {
                text: 'Erst danach Zweiklänge und Akkorde in einer Hand.',
              },
            ],
          },
          {
            related: {
              lead: 'Der Bassschlüssel sitzt noch nicht?',
              text: 'Bassschlüssel lesen lernen: die linke Hand am Klavier',
              href: pathOf('de', 'bassClef'),
            },
          },
        ],
      },
      {
        heading: 'Vorauslesen',
        blocks: [
          {
            p: [
              'Wer gut vom Blatt spielt, liest beim Spielen schon weiter: ',
              { text: 'Gute Blattspieler erfassen den weiteren Verlauf einer Passage im Voraus', href: WIKI_SIGHT_DE },
              ' und erkennen wiederkehrende Muster als Orientierungspunkte, statt jede Note einzeln zu entziffern.',
            ],
          },
          {
            p: 'Davon bin ich noch ein Stück entfernt. Ich versuche, beim Drücken einer Taste schon auf die nächste Stelle zu schauen, und lasse mir dafür lieber mehr Zeit.',
          },
        ],
      },
      {
        heading: 'Noten lesen als Erwachsener und Wiedereinsteiger',
        blocks: [
          {
            p: 'Als Kind habe ich fünf Jahre Klavier gespielt, seit 2025 spiele ich als Erwachsener wieder. Das Notenlesen war dabei mein Engpass: Ich habe Noten gezählt, Linie für Linie, statt sie zu erkennen. Mit zwei Systemen gleichzeitig fällt das besonders auf.',
          },
          {
            p: [
              'Ich übe das Lesen deshalb getrennt von den Stücken. Ein Stück, das ich schon kenne, spiele ich teils aus dem Gedächtnis, das Lesen übe ich damit kaum. Für Blattspiel gilt das ausdrücklich: ',
              { text: 'Ein Übungsstück lässt sich dafür nur einmal verwenden', href: WIKI_SIGHT_EN },
              ', du brauchst also immer neue Noten auf passendem Niveau.',
            ],
          },
          {
            p: 'Als Erwachsener hatte ich einen Vorteil: Ich wusste, wo es hakt, und konnte genau das üben, statt ein Heft von vorn bis hinten durchzuarbeiten.',
          },
        ],
      },
      {
        heading: 'Wie ich beide Hände übe',
        blocks: [
          {
            p: 'Ich übe am E-Piano: Die App zeigt kurze Melodien im Klaviersystem, ich spiele sie Note für Note, und sie prüft per MIDI jede Taste. Wo beide Hände spielen, wartet sie, bis beide Tasten gedrückt sind. Das Bild zeigt eine Übung in Stavewise im Level „Beide Hände“: oben die Melodie, unten der Bass.',
          },
          {
            figure: {
              src: shot,
              alt: 'Eine Übung in Stavewise im Level „Beide Hände“: Melodie im Violinschlüssel, Basstöne im Bassschlüssel, an manchen Stellen genau übereinander',
            },
          },
        ],
      },
    ],
    questions: [
      {
        q: 'Soll ich erst jede Hand einzeln üben?',
        a: 'Beim Lesen hat es mir geholfen, beide Schlüssel zuerst einzeln sicher zu lesen. Gewartet, bis einer perfekt sitzt, habe ich aber nicht: Ich habe beide abwechselnd geübt und früh angefangen, zwischen den Systemen zu wechseln.',
      },
      {
        q: 'Spielt die linke Hand immer, was im Bassschlüssel steht?',
        a: [
          'Nicht immer. ',
          { text: 'Meistens ist die linke Hand im Bassschlüssel notiert', href: WIKI_CLEFS_DE },
          '. Zum Lesenlernen reicht mir die einfache Regel: unten links, oben rechts.',
        ],
      },
      {
        q: 'Ist es als Erwachsener zu spät, Noten lesen zu lernen?',
        a: 'Ich kann nur von mir erzählen: Ich habe als Erwachsener wieder angefangen und übe das Lesen seitdem gezielt. Wie schnell es geht, hängt davon ab, wie oft du übst und was du schon kannst; eine Frist kann ich dir nicht seriös nennen.',
      },
    ],
  },
  en: {
    title: 'How to read treble and bass clef at the same time on piano',
    description:
      'Reading piano music with both hands: how the two staves fit together, how I went from switching between clefs to playing both at once, and what helped me learn to read music as an adult coming back to the piano.',
    heading: 'How to read treble and bass clef at the same time',
    headingSub: 'reading piano music with both hands',
    answer:
      'Piano music is written on two staves, one above the other: usually treble clef on top for the right hand, bass clef below for the left. Notes that sound together are lined up vertically, so at those points you read top and bottom as one. What helped me was reading each clef on its own first, then switching between the staves note by note, and only then playing two notes at once.',
    disclosureRest: 'You can practise everything here with any sheet music.',
    sections: [
      {
        heading: 'Two staves, one brace',
        blocks: [
          {
            p: [
              'Piano music is written on two five-line staves joined by a brace on the left; together they are called the grand staff. ',
              { text: 'The upper staff is normally played with the right hand and the lower staff with the left', href: WIKI_STAFF_EN },
              '. The upper one usually has a treble clef, the lower one a bass clef.',
            ],
          },
          {
            p: [
              'For reading with both hands, one rule matters most: notes that sound at the same time are written directly above each other. Between the staves sits middle C, ',
              { text: 'on a ledger line below the upper staff or above the lower one', href: WIKI_STAFF_EN },
              '.',
            ],
          },
        ],
      },
      {
        heading: 'Read down, not line by line',
        blocks: [
          {
            p: 'It is tempting to read the two staves like two lines of text: a bit of the top, then the bottom. That does not work at the piano, because the hands play at the same time. What helped me was seeing a spot with two notes as one picture: where is the lower note, where is the upper one, then both keys together.',
          },
          {
            p: 'When only one hand plays, I only look at its staff. What mattered for me was not hunting for the staff the next note is in, but keeping both staves in view.',
          },
        ],
      },
      {
        heading: 'The order I practised in',
        blocks: [
          {
            ol: [
              {
                text: 'Each clef on its own, with only a few notes.',
                note: 'I practised bass clef in its own right instead of translating it from treble clef.',
              },
              {
                text: 'Switching between the staves, one note at a time, close to middle C at first.',
                note: 'C4 to G4 on top, E3 to C4 below: that keeps both hands close together.',
              },
              {
                text: 'Widening the range bit by bit, first to the two Cs an octave above and below middle C, then further.',
              },
              {
                text: 'Two notes at once, one per staff: a melody on top, a bass note below.',
              },
              {
                text: 'Only then intervals and chords in one hand.',
              },
            ],
          },
          {
            related: {
              lead: 'Bass clef still shaky?',
              text: 'How to read bass clef on piano (left hand)',
              href: pathOf('en', 'bassClef'),
            },
          },
        ],
      },
      {
        heading: 'Reading ahead',
        blocks: [
          {
            p: [
              'Good sight-readers read ahead while they play: ',
              { text: 'highly skilled musicians tend to look ahead further in the music', href: WIKI_SIGHT_EN },
              ', the so-called eye–hand span, and they recognise frequent patterns of notes as a single unit rather than as individual notes.',
            ],
          },
          {
            p: 'I am not there yet. I try to have my eyes on the next spot while I press a key, and I would rather take more time for it.',
          },
        ],
      },
      {
        heading: 'Learning to read music as an adult',
        blocks: [
          {
            p: 'I played piano for five years as a child and came back to it as an adult in 2025. Reading music was what held me back: I counted notes line by line instead of recognising them. With two staves at once, that shows even more.',
          },
          {
            p: [
              'So I practise reading separately from pieces. A piece I already know I play partly from memory, so it hardly trains my reading. For sight-reading this is explicit: ',
              { text: 'a practice piece can only be used once', href: WIKI_SIGHT_EN },
              ', so you keep needing new music at the right level.',
            ],
          },
          {
            p: 'Being an adult had one advantage: I knew where I got stuck and could practise exactly that, instead of working through a method book from front to back.',
          },
        ],
      },
      {
        heading: 'How I practise both hands',
        blocks: [
          {
            p: 'I practise at the digital piano: the app shows short melodies on the grand staff, I play them note by note, and it checks every key over MIDI. Where both hands play, it waits until both keys are down. The screenshot shows an exercise in Stavewise at the level “Both hands”: the melody on top, the bass below.',
          },
          {
            figure: {
              src: shot,
              alt: 'An exercise in Stavewise at the level “Both hands”: a melody in treble clef, bass notes in bass clef, some of them lined up vertically',
            },
          },
        ],
      },
    ],
    questions: [
      {
        q: 'Should I practise each hand separately first?',
        a: 'For reading, it helped me to read each clef securely on its own first. I did not wait until one was perfect, though: I practised both in turns and started switching between the staves early.',
      },
      {
        q: 'Does the left hand always play what is in bass clef?',
        a: [
          'Not always. ',
          { text: 'The lower staff is normally played with the left hand', href: WIKI_STAFF_EN },
          '. For learning to read, the simple rule is enough for me: bottom left, top right.',
        ],
      },
      {
        q: 'Is it too late to learn to read music as an adult?',
        a: 'I can only speak for myself: I came back to it as an adult and have practised reading on purpose ever since. How fast it goes depends on how often you practise and what you already know; I can’t honestly give you a deadline.',
      },
    ],
  },
};
