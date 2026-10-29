// Guide page 2 "USB to Host und OTG: welches Kabel" (launch § 14.3 row 2; stavewise#717).
// Facts checked before writing against the manufacturer sources linked below and the Android
// MIDI documentation; sources are listed in the PR. Own tests: docs/abnahme-v1.md in the
// stavewise repo (KA-E1 with a USB-B to USB-C cable on Tab P12 and Pixel 7 Pro). Adapters,
// USB-C pianos and MIDI interfaces are not tested by me and rest on the manuals only.
import { pathOf, type Lang } from '../../lib/i18n';
import type { GuideTexts } from '../guide';
import still from '../../assets/guides/demo-still.png';
import shot from '../../assets/screenshots/de/exercise-hero.png';

const ANDROID_MIDI = 'https://source.android.com/docs/core/audio/midi';
const KAWAI_ES920 = 'https://cdn.shopify.com/s/files/1/0740/4670/1723/files/ES920_EN_R101.pdf';
const ROLAND_GO88PX = 'https://www.roland.com/global/products/gopiano_go-88px/specifications/';
const KORG_D1 = 'https://www.korg.com/us/products/digitalpianos/d1/specifications.php';
const YAMAHA_CONNECT = 'https://manual.yamaha.com/mi/app/smartpianist_connect/en/';
const CASIO_CONNECT = 'https://web.casio.com/app/en/music_space/support/connect.html';

export const cable: Record<Lang, GuideTexts> = {
  de: {
    title: 'USB to Host Kabel: welches Kabel ans Android-Handy oder -Tablet',
    description:
      'Welches Kabel verbindet dein E-Piano mit Handy oder Tablet? USB to Host Typ B oder USB-C, Kabel USB-B auf USB-C, Druckerkabel mit OTG-Adapter, MIDI-Interface für runde Buchsen und Laden beim Üben.',
    heading: 'USB to Host: welches Kabel ans Handy oder Tablet',
    headingSub: 'und wann du einen OTG-Adapter brauchst',
    answer:
      'Für die meisten E-Pianos brauchst du ein Datenkabel USB-B auf USB-C: Der eckige Stecker kommt in die Buchse „USB to Host“ am Piano, der USB-C-Stecker in dein Handy oder Tablet. Hast du schon ein Druckerkabel (USB-A auf USB-B), reicht dazu ein OTG-Adapter von USB-A auf USB-C. Hat dein Piano nur runde MIDI-Buchsen, brauchst du stattdessen ein USB-MIDI-Interface.',
    disclosureRest: 'Die Kabel hier passen für jede App, die MIDI liest.',
    still: {
      src: still,
      alt: 'Zwei Hände auf den Tasten eines Kurzweil KA-E1, darüber ein Tablet am Notenpult mit einer Übung im Klaviersystem',
    },
    sections: [
      {
        heading: 'Welche Buchse hat dein Piano?',
        blocks: [
          {
            p: 'Schau auf die Rückseite oder unter die Tastatur, oder im Handbuch unter „Anschlüsse“. Diese Buchsen kommen vor:',
          },
          {
            ul: [
              {
                text: '„USB to Host“, bei Roland „USB Computer“: meist eckig, Typ B. Das ist die richtige Buchse.',
                note: [
                  'Kawai schreibt im ',
                  { text: 'Handbuch des ES920', href: KAWAI_ES920 },
                  ', dass sie mit Adaptern auch Tablets anschließt.',
                ],
              },
              {
                text: [
                  'USB-C als „USB to Host“, an einzelnen neueren Modellen, etwa dem ',
                  { text: 'Roland GO:PIANO88 (GO-88PX)', href: ROLAND_GO88PX },
                  '.',
                ],
              },
              {
                text: '„USB to Device“: flach, Typ A, wie am Computer. Sie ist für USB-Sticks, nicht für dein Handy.',
              },
              {
                text: [
                  'Runde 5-polige Buchsen „MIDI In“ und „MIDI Out“. Manche Pianos haben nur diese und gar kein USB, etwa das ',
                  { text: 'Korg D1', href: KORG_D1 },
                  '.',
                ],
              },
            ],
          },
        ],
      },
      {
        heading: 'Welches Kabel zu welcher Buchse',
        blocks: [
          {
            ol: [
              {
                text: 'Piano mit USB-B, Gerät mit USB-C: ein Kabel USB-B auf USB-C. Ein Teil, kein Adapter.',
                note: 'So verbinde ich mein Piano selbst.',
              },
              {
                text: 'Du hast schon ein Druckerkabel (USB-A auf USB-B): dazu ein OTG-Adapter mit USB-A-Buchse und USB-C-Stecker.',
                note: [
                  'Genau diese Kombination nennt auch ',
                  { text: 'Yamahas Anleitung für Smart Pianist', href: YAMAHA_CONNECT },
                  '.',
                ],
              },
              {
                text: 'Piano mit USB-C: ein Kabel USB-C auf USB-C.',
                note: 'Dieses Kabel nennt Yamaha für Pianos mit USB-C. Selbst testen konnte ich es nicht, mein Piano hat USB-B.',
              },
              {
                text: 'Älteres Gerät mit Micro-USB: ein OTG-Kabel von Micro-USB auf USB-A, dazu das Druckerkabel.',
                note: [
                  'So steht es in der ',
                  { text: 'Verbindungshilfe von Casio', href: CASIO_CONNECT },
                  '.',
                ],
              },
            ],
          },
          {
            related: {
              lead: 'Kabel steckt, wie geht es weiter?',
              text: 'E-Piano mit Android-Handy oder -⁠Tablet verbinden',
              href: pathOf('de', 'connect'),
            },
          },
        ],
      },
      {
        heading: 'Datenkabel, kein Ladekabel',
        blocks: [
          {
            p: [
              'Manche USB-C-Kabel laden nur und übertragen keine Daten, und von außen sieht man das oft nicht. ',
              { text: 'Casio', href: CASIO_CONNECT },
              ' schreibt dazu knapp: ein Kabel für Datenübertragung nehmen, kein reines Ladekabel. Ein Kabel, mit dem du Fotos vom Handy auf den Computer kopieren kannst, ist ein Datenkabel.',
            ],
          },
          {
            p: 'Beim Adapter gilt dasselbe: Steht auf der Packung „OTG“, ist er für Zubehör wie Tastatur, Stick oder Piano gedacht. Achte darauf, dass der Adapter als OTG-Adapter verkauft wird.',
          },
        ],
      },
      {
        heading: 'Nur runde MIDI-Buchsen: ein USB-MIDI-Interface',
        blocks: [
          {
            p: 'Ein USB-MIDI-Interface hat auf einer Seite runde MIDI-Stecker, auf der anderen USB. Für eine App zum Notenlesen reicht die Richtung vom Piano zum Gerät: Der passende Stecker kommt in „MIDI Out“ am Piano, der USB-Stecker direkt oder mit OTG-Adapter in dein Handy.',
          },
          {
            p: [
              'Nimm ein Interface, das als „class compliant“ verkauft wird. ',
              { text: 'Android spricht USB-MIDI nach dem Standard der USB-Geräteklasse', href: ANDROID_MIDI },
              ' und lädt keine Treiber von Herstellern. Ein Interface, das am Computer einen eigenen Treiber braucht, läuft am Handy meist nicht.',
            ],
          },
          { note: 'Diesen Weg habe ich nicht selbst getestet; der KA-E1 hat USB und Bluetooth-MIDI.' },
        ],
      },
      {
        heading: 'Laden während des Übens',
        blocks: [
          {
            p: 'Steckt das Piano, ist der USB-C-Anschluss belegt. Mein Pixel 7 Pro lädt dann nicht. Was hilft:',
          },
          {
            ul: [
              { text: 'Vor einer langen Übung aufladen.' },
              {
                text: 'Hat dein Piano Bluetooth-MIDI, bleibt der Anschluss zum Laden frei.',
                note: [
                  'Bei manchen Pianos ist USB-MIDI abgeschaltet, solange Bluetooth-MIDI verbunden ist, etwa beim ',
                  { text: 'Kawai ES920', href: KAWAI_ES920 },
                  '. Beides zugleich brauchst du nicht.',
                ],
              },
              {
                text: 'Es gibt OTG-Adapter mit einer zusätzlichen Ladebuchse.',
                note: 'Ob dein Handy damit lädt und zugleich das Piano erkennt, hängt von Handy und Adapter ab. Ich habe das nicht getestet.',
              },
            ],
          },
        ],
      },
      {
        heading: 'Womit ich das getestet habe',
        blocks: [
          {
            p: 'Mein Kabel ist USB-B auf USB-C, ohne Adapter, zwischen meinem Kurzweil KA-E1 und einem Lenovo Tab P12 mit Android 15 und einem Pixel 7 Pro mit Android 17. Das Piano erschien jedes Mal von selbst in der App. Das Bild zeigt eine Übung in Stavewise.',
          },
          {
            figure: {
              src: shot,
              alt: 'Eine Übung in Stavewise im Klaviersystem, die gespielten Noten sind markiert',
            },
          },
          {
            note: 'Adapter, Pianos mit USB-C und MIDI-Interfaces habe ich nicht getestet; dort stütze ich mich auf die verlinkten Handbücher der Hersteller.',
          },
        ],
      },
    ],
    questions: [
      {
        q: 'Was ist ein OTG-Adapter?',
        a: [
          'OTG steht für USB On-The-Go. ',
          { text: 'Damit arbeitet ein Android-Gerät als USB-Host', href: ANDROID_MIDI },
          ' und betreibt Zubehör wie dein Piano. Der Adapter macht aus dem USB-C-Anschluss eine USB-A-Buchse, in die das Druckerkabel passt.',
        ],
      },
      {
        q: 'Brauche ich ein USB-3.0-Kabel?',
        a: 'Nein. MIDI überträgt sehr wenig Daten, USB 2.0 reicht. Ein USB-B-Stecker von USB 3.0 ist zudem höher und passt nicht in die übliche USB-B-Buchse eines Pianos.',
      },
      {
        q: 'Muss ich am Handy etwas einstellen?',
        a: 'Meist nicht. Bei manchen Handys musst du OTG erst in den Einstellungen einschalten.',
      },
      {
        q: 'Welche Marke soll ich kaufen?',
        a: 'Eine Marke empfehle ich nicht. Wichtig sind die richtigen Stecker an beiden Enden, „Daten“ statt nur „Laden“ und beim Adapter „OTG“.',
      },
    ],
  },
  en: {
    title: 'Which cable? USB to Host, OTG adapters and USB-C for Android',
    description:
      'What cable do you need to connect a digital piano to an Android tablet or phone? USB to Host type B or USB-C, USB-B to USB-C cables, printer cable with OTG adapter, MIDI interfaces and charging while you practise.',
    heading: 'What cable do you need to connect a digital piano to a tablet?',
    headingSub: 'USB to Host, OTG adapters and USB-C on Android',
    answer:
      'For most digital pianos you need a USB-B to USB-C data cable: the square plug goes into the piano’s “USB to Host” port, the USB-C plug into your Android phone or tablet. If you already have a printer cable (USB-A to USB-B), add a USB OTG adapter from USB-A to USB-C. If your piano only has round MIDI ports, you need a USB MIDI interface instead.',
    disclosureRest: 'The cables here work for any app that reads MIDI.',
    still: {
      src: still,
      alt: 'Two hands on the keys of a Kurzweil KA-E1, with a tablet on the music rest showing an exercise on the grand staff',
    },
    sections: [
      {
        heading: 'Which port does your piano have?',
        blocks: [
          {
            p: 'Look at the back panel or under the keyboard, or under “Connections” in the manual. You will find some of these:',
          },
          {
            ul: [
              {
                text: '“USB to Host”, called “USB Computer” on Roland pianos: usually square, type B. This is the one you want.',
                note: [
                  'Kawai’s ',
                  { text: 'ES920 manual', href: KAWAI_ES920 },
                  ' says it also connects tablets with adapters.',
                ],
              },
              {
                text: [
                  'USB-C as the “USB to Host” port, on a few newer models such as the ',
                  { text: 'Roland GO:PIANO88 (GO-88PX)', href: ROLAND_GO88PX },
                  '.',
                ],
              },
              {
                text: '“USB to Device”: flat, type A, like on a computer. It is meant for USB sticks, not for your phone.',
              },
              {
                text: [
                  'Round 5-pin ports, “MIDI In” and “MIDI Out”. Some pianos have only these and no USB at all, such as the ',
                  { text: 'Korg D1', href: KORG_D1 },
                  '.',
                ],
              },
            ],
          },
        ],
      },
      {
        heading: 'Which cable for which port',
        blocks: [
          {
            ol: [
              {
                text: 'Piano with USB-B, device with USB-C: a USB-B to USB-C cable. One piece, no adapter.',
                note: 'This is how I connect my own piano.',
              },
              {
                text: 'You already have a printer cable (USB-A to USB-B): add a USB OTG adapter with a USB-A socket and a USB-C plug.',
                note: [
                  'This is the same combination ',
                  { text: 'Yamaha’s Smart Pianist connection guide', href: YAMAHA_CONNECT },
                  ' lists.',
                ],
              },
              {
                text: 'Piano with USB-C: a USB-C to USB-C cable.',
                note: 'Yamaha lists this cable for pianos with USB-C. I could not test it myself; my piano has USB-B.',
              },
              {
                text: 'Older device with Micro-USB: a USB OTG cable from Micro-USB to USB-A, plus the printer cable.',
                note: [
                  'That is what ',
                  { text: 'Casio’s connection help', href: CASIO_CONNECT },
                  ' says.',
                ],
              },
            ],
          },
          {
            related: {
              lead: 'Cable in, what next?',
              text: 'Connect a digital piano to an Android phone or tablet',
              href: pathOf('en', 'connect'),
            },
          },
        ],
      },
      {
        heading: 'A data cable, not a charging cable',
        blocks: [
          {
            p: [
              'Some USB-C cables only charge and carry no data, and you often cannot tell from the outside. ',
              { text: 'Casio', href: CASIO_CONNECT },
              ' puts it briefly: use a cable suitable for data communication, not a charge-only cable. A cable that copies photos from your phone to a computer is a data cable.',
            ],
          },
          {
            p: 'The same goes for the adapter: if the box says “OTG”, it is made for accessories like keyboards, sticks or a piano. Make sure the adapter is sold as a USB OTG adapter.',
          },
        ],
      },
      {
        heading: 'Only round MIDI ports: a USB MIDI interface',
        blocks: [
          {
            p: 'A USB MIDI interface has round MIDI plugs on one side and USB on the other. For an app that teaches reading music, the direction from piano to device is enough: the matching plug goes into the piano’s “MIDI Out”, the USB plug into your phone, directly or through an OTG adapter.',
          },
          {
            p: [
              'Pick an interface sold as “class compliant”. ',
              { text: 'Android handles USB MIDI by the USB device class standard', href: ANDROID_MIDI },
              ' and does not load drivers from manufacturers. An interface that needs its own driver on a computer usually does not work on a phone.',
            ],
          },
          { note: 'I have not tested this route myself; the KA-E1 has USB and Bluetooth MIDI.' },
        ],
      },
      {
        heading: 'Charging while you practise',
        blocks: [
          {
            p: 'With the piano plugged in, the USB-C port is taken. My Pixel 7 Pro does not charge then. What helps:',
          },
          {
            ul: [
              { text: 'Charge before a long session.' },
              {
                text: 'If your piano has Bluetooth MIDI, the port stays free for charging.',
                note: [
                  'On some pianos USB MIDI is switched off while Bluetooth MIDI is connected, for example the ',
                  { text: 'Kawai ES920', href: KAWAI_ES920 },
                  '. You do not need both at once.',
                ],
              },
              {
                text: 'There are OTG adapters with an extra charging port.',
                note: 'Whether your phone then charges and still sees the piano depends on the phone and the adapter. I have not tested it.',
              },
            ],
          },
        ],
      },
      {
        heading: 'What I tested this with',
        blocks: [
          {
            p: 'My cable is USB-B to USB-C, no adapter, between my Kurzweil KA-E1 and a Lenovo Tab P12 running Android 15 and a Pixel 7 Pro running Android 17. The piano showed up in the app on its own every time. The screenshot shows an exercise in Stavewise.',
          },
          {
            figure: {
              src: shot,
              alt: 'An exercise in Stavewise on the grand staff, with the played notes marked',
            },
          },
          {
            note: 'I have not tested adapters, pianos with USB-C or MIDI interfaces; for those I rely on the manufacturers’ manuals linked above.',
          },
        ],
      },
    ],
    questions: [
      {
        q: 'What is a USB OTG adapter?',
        a: [
          'OTG stands for USB On-The-Go. ',
          { text: 'It lets an Android device act as a USB host', href: ANDROID_MIDI },
          ' and drive accessories such as your piano. The adapter turns the USB-C port into a USB-A socket that the printer cable fits into.',
        ],
      },
      {
        q: 'Do I need a USB 3.0 cable?',
        a: 'No. MIDI sends very little data, and USB 2.0 is plenty. A USB 3.0 type B plug is also taller and does not fit the usual USB-B port on a piano.',
      },
      {
        q: 'Do I have to change a setting on the phone?',
        a: 'Usually not. Some phones need USB OTG switched on in the settings first.',
      },
      {
        q: 'Which brand should I buy?',
        a: 'I do not recommend a brand. What matters is the right plug on each end, “data” rather than just “charging”, and “OTG” on the adapter.',
      },
    ],
  },
};
