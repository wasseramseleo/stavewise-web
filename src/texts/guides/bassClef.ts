// Guide page 3 "Bassschlüssel lesen lernen: die linke Hand am Klavier" (launch § 14.3 row 3; stavewise#718).
// A core page: written from the learner's side, general music theory only, every needed fact with a
// linked source (launch § 14.4). Facts checked before writing against the sources below. Stavewise
// appears only in the disclosure, the screenshot section and the closing card (launch § 14.5).
// The forum links show the problem, they are not a source for theory.
import type { Lang } from '../../lib/i18n';
import type { GuideTexts } from '../guide';
import shot from '../../assets/screenshots/de/exercise.png';

const WIKI_CLEFS_DE = 'https://de.wikipedia.org/wiki/Notenschl%C3%BCssel';
const WIKI_LEDGER_DE = 'https://de.wikipedia.org/wiki/Hilfslinie#Noten_in_der_Musik';
const STUDYFLIX = 'https://studyflix.de/allgemeinwissen/bassschluessel-5178';
const CLAVIO = 'https://www.clavio.de/threads/wie-lest-ihr-den-bassschluessel-unabhaengig-vom-violinschluessel.29015/';
const WIKI_CLEF_EN = 'https://en.wikipedia.org/wiki/Clef';
const WIKI_STAFF_EN = 'https://en.wikipedia.org/wiki/Staff_(music)';
const AMT_BASS = 'https://www.allaboutmusictheory.com/musical-staff/learn-read-bass-clef-notes/';
const TONEBASE =
  'https://piano-community.tonebase.co/t/y4h08tr/bass-clef-strategy-for-treble-clef-dominant-reader';

export const bassClef: Record<Lang, GuideTexts> = {
  de: {
    title: 'Bassschlüssel lesen lernen: die linke Hand am Klavier',
    description:
      'Wie liest man den Bassschlüssel am Klavier? Die Linie zwischen den Punkten, die Noten auf Linien und Zwischenräumen, Hilfslinien und ein paar Orientierungsnoten für die linke Hand, aus Sicht eines Wiedereinsteigers.',
    heading: 'Bassschlüssel lesen lernen',
    headingSub: 'die linke Hand am Klavier',
    answer:
      'Der Bassschlüssel legt das F unter dem mittleren C auf die vierte Linie von unten, genau zwischen seine beiden Punkte. Von dort liest du ab: Die Linien heißen von unten G, H, D, F, A, die Zwischenräume A, C, E, G. Statt den Bassschlüssel aus dem Violinschlüssel umzurechnen, übe ich ihn für sich, mit wenigen Tönen und ein paar festen Orientierungsnoten wie F und C.',
    disclosureRest: 'Was hier steht, kannst du mit jedem Notenheft üben.',
    sections: [
      {
        heading: 'Was der Bassschlüssel festlegt',
        blocks: [
          {
            p: [
              'Am Klavier stehen zwei Notensysteme übereinander, zusammen heißen sie Klaviersystem. Oben steht meist der Violinschlüssel für die rechte Hand, unten der Bassschlüssel für die linke. ',
              { text: 'Bei Tasteninstrumenten ist die linke Hand meistens im Bassschlüssel notiert', href: WIKI_CLEFS_DE },
              '.',
            ],
          },
          {
            p: [
              'Der Bassschlüssel ist ein F-Schlüssel. Seine zwei Punkte umschließen die vierte Linie von unten, und ',
              { text: 'auf dieser Linie liegt das F', href: WIKI_CLEFS_DE },
              ' unter dem mittleren C. Das mittlere C selbst steht auf der ersten Hilfslinie über dem System, also zwischen Bass- und Violinschlüssel.',
            ],
          },
        ],
      },
      {
        heading: 'Linien und Zwischenräume',
        blocks: [
          {
            ul: [
              { text: 'Die fünf Linien, von unten nach oben: G, H, D, F, A.' },
              { text: 'Die vier Zwischenräume, von unten nach oben: A, C, E, G.' },
            ],
          },
          {
            p: [
              'Dafür gibt es Eselsbrücken, etwa „Gabi hört die Fische atmen“ für die Linien und „Alle coolen Einhörner grinsen“ für die Zwischenräume (',
              { text: 'Studyflix', href: STUDYFLIX },
              '). Zum Nachzählen helfen sie. Beim Spielen willst du die Note aber auf einen Blick erkennen, nicht erst einen Satz aufsagen.',
            ],
          },
        ],
      },
      {
        heading: 'Nicht aus dem Violinschlüssel umrechnen',
        blocks: [
          {
            p: [
              'Wer den Violinschlüssel zuerst gelernt hat, liest den Bassschlüssel oft wie einen verschobenen Violinschlüssel und rechnet jede Note um. Danach fragen Leute in Klavierforen, etwa ',
              { text: '„Wie lest ihr den Bassschlüssel?“ auf Clavio', href: CLAVIO },
              '. Das Umrechnen kostet bei jeder Note einen Moment, und die linke Hand hinkt hinterher.',
            ],
          },
          {
            p: 'Mir hat geholfen, den Bassschlüssel für sich zu üben, mit Übungen nur in diesem Schlüssel, statt ihn über den Violinschlüssel herzuleiten. Warten, bis der Violinschlüssel sitzt, musste ich dafür nicht: Ich habe beide abwechselnd geübt und den Tonumfang nach und nach erweitert.',
          },
        ],
      },
      {
        heading: 'Ein paar Orientierungsnoten, den Rest ablesen',
        blocks: [
          {
            p: 'Was mir geholfen hat, sind Orientierungsnoten: ein paar Noten, die ich auf einen Blick erkenne und von denen aus ich die Nachbarn ablese, statt alle Linien gleichzeitig zu lernen. Im Bassschlüssel nehme ich diese:',
          },
          {
            ul: [
              { text: 'Das mittlere C: die erste Hilfslinie über dem System. Du kennst es meist schon aus dem Violinschlüssel.' },
              { text: 'Das F unter dem mittleren C: die Linie zwischen den beiden Punkten.' },
              { text: 'Das C eine Oktave tiefer: der zweite Zwischenraum von unten.' },
              { text: 'Das F eine Oktave tiefer: der Zwischenraum unter der untersten Linie.' },
              { text: 'Das tiefe C, zwei Oktaven unter dem mittleren: die zweite Hilfslinie unter dem System.' },
            ],
          },
          {
            p: 'Alle fünf auf einmal waren mir zu viel. Ich habe mit einem kleinen Stück angefangen, vom E bis zum mittleren C, mit dem F als Orientierung. Danach bin ich hinunter bis zum C eine Oktave tiefer gegangen und erst dann bis zum tiefen C.',
          },
        ],
      },
      {
        heading: 'Hilfslinien',
        blocks: [
          {
            p: [
              'Was über oder unter die fünf Linien hinausgeht, steht auf ',
              { text: 'kurzen Hilfslinien', href: WIKI_LEDGER_DE },
              '. Nach oben ist die erste Hilfslinie das mittlere C. ',
              { text: 'Dieselbe Hilfslinie ist im Violinschlüssel die erste unter dem System', href: WIKI_CLEFS_DE },
              ': Das mittlere C ist in beiden Schlüsseln dieselbe Taste, es steht nur einmal oben und einmal unten.',
            ],
          },
          {
            p: 'Nach unten geht es weiter, wie die Linien es vorgeben: unter dem G der untersten Linie das F im Zwischenraum, dann das E auf der ersten Hilfslinie, das D darunter und das C auf der zweiten Hilfslinie.',
          },
        ],
      },
      {
        heading: 'Wie ich den Bassschlüssel übe',
        blocks: [
          {
            p: 'Ich übe am E-Piano, nicht auf Papier: Die App zeigt kurze Melodien, ich spiele sie Note für Note, und sie prüft per MIDI jede Taste. Alle Noten sind Viertel ohne Rhythmus, es geht nur ums Lesen. Das Bild zeigt eine Übung in Stavewise mit beiden Schlüsseln; die untere Zeile spielt die linke Hand.',
          },
          {
            figure: {
              src: shot,
              alt: 'Eine Übung in Stavewise im Klaviersystem: oben der Violinschlüssel, unten der Bassschlüssel mit den Noten der linken Hand',
            },
          },
        ],
      },
    ],
    questions: [
      {
        q: 'Muss ich zuerst den Violinschlüssel können?',
        a: 'Nicht unbedingt. Beide Schlüssel folgen denselben Regeln, nur liegen die Töne auf anderen Linien. Ich habe beide Schlüssel von Anfang an abwechselnd geübt.',
      },
      {
        q: 'Warum steht das mittlere C mal oben, mal unten?',
        a: [
          'Es liegt zwischen den beiden Systemen und kann ',
          { text: 'auf einer Hilfslinie unter dem oberen oder über dem unteren System', href: WIKI_CLEFS_DE },
          ' stehen. Am Klavier ist es beide Male dieselbe Taste.',
        ],
      },
      {
        q: 'Wie lange dauert es, bis ich den Bassschlüssel flüssig lese?',
        a: 'Das kann ich dir nicht seriös sagen, es hängt davon ab, wie oft du übst und was du schon kannst. Hilfreicher als eine Frist finde ich, darauf zu achten, welche Noten mich noch aufhalten, und genau die öfter zu üben.',
      },
    ],
  },
  en: {
    title: 'How to read bass clef on piano (left hand)',
    description:
      'How to read bass clef notes on piano: the line between the two dots, the notes on lines and spaces, ledger lines and a few landmark notes for the left hand, from an adult coming back to the piano.',
    heading: 'How to read bass clef on piano',
    headingSub: 'notes for the left hand',
    answer:
      'The bass clef puts the F below middle C on the fourth line from the bottom, right between its two dots. You read everything else from there: the lines are G, B, D, F, A from the bottom up, the spaces A, C, E, G. Instead of translating from treble clef, I practise the bass clef on its own, with a small range and a few fixed landmark notes such as F and C.',
    disclosureRest: 'You can practise everything here with any sheet music.',
    sections: [
      {
        heading: 'What the bass clef tells you',
        blocks: [
          {
            p: [
              'Piano music is written on two staves, one above the other; together they are called the grand staff. ',
              { text: 'The upper staff is normally played with the right hand and the lower staff with the left', href: WIKI_STAFF_EN },
              '. The upper one usually has a treble clef, the lower one a bass clef.',
            ],
          },
          {
            p: [
              'The bass clef is an F clef. Its two dots sit either side of the fourth line from the bottom, and ',
              { text: 'that line is the F below middle C', href: WIKI_CLEF_EN },
              ' (F3). Middle C itself sits on the first ledger line above the staff, between the bass and the treble staff.',
            ],
          },
        ],
      },
      {
        heading: 'Lines and spaces',
        blocks: [
          {
            ul: [
              { text: 'The five lines, bottom to top: G, B, D, F, A.' },
              { text: 'The four spaces, bottom to top: A, C, E, G.' },
            ],
          },
          {
            p: [
              'The usual mnemonics are “Good Boys Do Fine Always” for the lines and “All Cows Eat Grass” for the spaces (',
              { text: 'All About Music Theory', href: AMT_BASS },
              '). They help when you count. When you play, though, you want to see the note and know it, not recite a sentence first.',
            ],
          },
        ],
      },
      {
        heading: 'Don’t translate from treble clef',
        blocks: [
          {
            p: [
              'If you learned treble clef first, it is tempting to read bass clef as a shifted treble clef and translate every note. People ask about it in piano forums, for example in ',
              { text: '“Bass Clef Strategy for Treble-Clef Dominant Reader”', href: TONEBASE },
              '. Translating costs a moment on every note, and the left hand falls behind.',
            ],
          },
          {
            p: 'What helped me was practising the bass clef on its own, with exercises in that clef only, instead of working it out from treble clef. I did not have to wait until treble clef was solid for that: I practised the two clefs in turns and widened the range bit by bit.',
          },
        ],
      },
      {
        heading: 'A few landmark notes, read the rest from there',
        blocks: [
          {
            p: 'What helped me were landmark notes: a few notes I recognise at a glance and read their neighbours from, rather than learning every line at once. In bass clef, these are the landmarks I use:',
          },
          {
            ul: [
              { text: 'Middle C (C4): the first ledger line above the staff. You probably know it from treble clef already.' },
              { text: 'F below middle C (F3): the line between the two dots.' },
              { text: 'C an octave lower (C3): the second space from the bottom.' },
              { text: 'F an octave lower (F2): the space below the bottom line.' },
              { text: 'Low C, two octaves below middle C (C2): the second ledger line below the staff.' },
            ],
          },
          {
            p: 'All five at once was too much for me. I started with a small stretch, from E3 up to middle C, with F3 as the landmark. After that I went down to C3, and only then down to C2.',
          },
        ],
      },
      {
        heading: 'Ledger lines in bass clef',
        blocks: [
          {
            p: [
              'Notes above or below the five lines go on ',
              { text: 'short ledger lines', href: WIKI_STAFF_EN },
              '. Going up, the first ledger line is middle C. In treble clef the same note sits on the first ledger line below the staff: middle C is the same key in both clefs, it is just written at the top of one staff or the bottom of the other.',
            ],
          },
          {
            p: 'Going down, you follow the lines: below the bottom-line G comes F in the space, then E on the first ledger line, D below it and C on the second ledger line.',
          },
        ],
      },
      {
        heading: 'How I practise bass clef',
        blocks: [
          {
            p: 'I practise at the digital piano, not on paper: the app shows short melodies, I play them note by note, and it checks every key over MIDI. Every note is a quarter note with no rhythm, so it is only about reading. The screenshot shows an exercise in Stavewise with both clefs; the lower staff is the left hand.',
          },
          {
            figure: {
              src: shot,
              alt: 'An exercise in Stavewise on the grand staff: treble clef at the top, bass clef with the left-hand notes below',
            },
          },
        ],
      },
    ],
    questions: [
      {
        q: 'Do I need to know treble clef first?',
        a: 'Not necessarily. Both clefs follow the same rules; the notes just sit on different lines. I practised both clefs in turns from the start.',
      },
      {
        q: 'Why is middle C sometimes at the top and sometimes at the bottom?',
        a: [
          'It sits between the two staves and ',
          { text: 'can be written on a ledger line below the upper staff or above the lower one', href: WIKI_STAFF_EN },
          '. On the piano it is the same key either way.',
        ],
      },
      {
        q: 'How long until I can read bass clef fluently?',
        a: 'I can’t honestly tell you; it depends on how often you practise and what you already know. What I find more useful than a deadline is noticing which notes still slow me down and practising exactly those more often.',
      },
    ],
  },
};
