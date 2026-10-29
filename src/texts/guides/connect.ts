// Guide page 1 "E-Piano mit Android verbinden" (launch § 14.3 row 1; stavewise#716).
// Facts checked before writing; sources are listed in the PR and linked where a statement
// rests on them. Own tests: docs/abnahme-v1.md in the stavewise repo (KA-E1, Tab P12, Pixel 7 Pro).
import { pathOf, type Lang } from '../../lib/i18n';
import type { GuideTexts } from '../guide';
import still from '../../assets/guides/demo-still.png';
import shot from '../../assets/screenshots/de/exercise-hero.png';

const ANDROID_MIDI = 'https://source.android.com/docs/core/audio/midi';
const KAWAI_CA401 = 'https://cdn.shopify.com/s/files/1/0740/4670/1723/files/CA401_EN_FULL_R100.pdf';

export const connect: Record<Lang, GuideTexts> = {
  de: {
    title: 'E-Piano mit Android-Handy oder -Tablet verbinden (USB, Bluetooth-MIDI)',
    description:
      'So verbindest du dein E-Piano mit einem Android-Handy oder -⁠Tablet: per USB-Kabel an „USB to Host“ oder kabellos über Bluetooth-MIDI. Mit Kabelfrage, Fehlersuche und eigenem Test.',
    heading: 'E-Piano mit Android-Handy oder -⁠Tablet verbinden',
    headingSub: 'per USB oder Bluetooth-MIDI',
    answer:
      'Ein E-Piano verbindest du auf zwei Wegen mit einem Android-Handy oder -⁠Tablet: mit einem USB-Kabel von der Buchse „USB to Host“ am Piano zum USB-C-Anschluss deines Geräts, oder kabellos über Bluetooth-MIDI, wenn dein Piano es hat. Für USB brauchst du ein Datenkabel USB-B auf USB-C oder ein Druckerkabel mit OTG-Adapter. Bluetooth-MIDI verbindest du in der App, nicht in den Android-Einstellungen.',
    disclosureRest: 'Die Schritte hier gelten für jede App, die MIDI liest.',
    still: {
      src: still,
      alt: 'Zwei Hände auf den Tasten eines Kurzweil KA-E1, darüber ein Tablet am Notenpult mit einer Übung im Klaviersystem',
    },
    sections: [
      {
        heading: 'Was du brauchst',
        blocks: [
          {
            ul: [
              {
                text: 'Ein E-Piano mit der Buchse „USB to Host“ oder mit Bluetooth-MIDI. Das steht auf der Rückseite oder im Handbuch; manche Hersteller nennen die Buchse nur „USB“ oder „Computer“.',
              },
              {
                text: [
                  'Ein Android-Handy oder -⁠Tablet. ',
                  { text: 'MIDI kann Android seit Version 6', href: ANDROID_MIDI },
                  '; manche Apps verlangen mehr, Stavewise etwa Android 12.',
                ],
              },
              { text: 'Für USB ein Datenkabel, für Bluetooth nichts weiter.' },
              { text: 'Eine App, die MIDI liest, zum Beispiel zum Notenlesen, zum Üben oder zum Aufnehmen.' },
            ],
          },
        ],
      },
      {
        heading: 'Weg 1: mit USB-Kabel',
        blocks: [
          {
            p: 'Das ist der häufigere Weg: Viele Einstiegsmodelle haben kein Bluetooth-MIDI, aber fast alle eine USB-Buchse. Das Kabel braucht keine Suche und keine Berechtigung.',
          },
          {
            ol: [
              {
                text: 'Am Piano die Buchse „USB to Host“ suchen. Sie ist meist eckig (Typ B), an einzelnen neueren Pianos auch USB-C.',
                note: '„USB to Device“ ist eine andere Buchse, für USB-Sticks.',
              },
              {
                text: 'Ein Kabel USB-B auf USB-C nehmen. Oder ein vorhandenes Druckerkabel (USB-A auf USB-B) mit einem OTG-Adapter auf USB-C.',
                note: 'Reine Ladekabel übertragen keine Daten.',
              },
              {
                text: 'Piano einschalten, Kabel einstecken, die App öffnen. Das Piano erscheint ohne Kopplung in der Liste der App.',
                note: 'Bei manchen Handys musst du OTG vorher in den Einstellungen einschalten.',
              },
            ],
          },
          {
            note: 'Solange das Kabel steckt, ist der USB-C-Anschluss belegt, und das Handy lädt nicht. Für eine lange Übung lade ich vorher auf.',
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
        heading: 'Weg 2: über Bluetooth-MIDI',
        blocks: [
          {
            ol: [
              {
                text: 'Prüfen, ob dein Piano Bluetooth-MIDI hat.',
                note: 'Viele Pianos haben nur Bluetooth-Audio, um Musik vom Handy über ihre Lautsprecher zu spielen. Das reicht nicht.',
              },
              {
                text: 'Bluetooth am Piano einschalten.',
                note: 'Bei manchen Modellen stellst du dabei im Menü MIDI ein; das Handbuch sagt, wie.',
              },
              {
                text: 'Nicht in den Android-Einstellungen koppeln. Die App sucht das Piano selbst; erlaube ihr „Geräte in der Nähe“.',
                note: [
                  'Die Bluetooth-Einstellungen von Android kennen MIDI nicht. So steht es auch bei den Herstellern, etwa im ',
                  { text: 'Handbuch des Kawai CA401', href: KAWAI_CA401 },
                  '.',
                ],
              },
              {
                text: 'Das Piano in der Liste der App antippen.',
                note: 'Fragt Android dabei nach einer Kopplung, bestätige sie.',
              },
            ],
          },
          {
            note: 'Ich habe am Kurzweil KA-E1 über Bluetooth keine Verzögerung gespürt. Wer ganz sicher gehen will, nimmt das Kabel.',
          },
        ],
      },
      {
        heading: 'Wenn das Piano nicht erscheint',
        blocks: [
          {
            checks: [
              ['USB', 'Ist das Piano an und das Kabel ein Datenkabel? Steckt es in „USB to Host“?'],
              ['USB', 'Mit Adapter: Ist es ein OTG-Adapter? Steht das nicht auf der Packung, ist es oft keiner.'],
              ['USB', 'Kabel ab- und wieder anstecken, dann die App neu öffnen.'],
              ['Bluetooth', 'Ist Bluetooth am Piano an und nicht schon mit einem anderen Gerät verbunden?'],
              ['Bluetooth', 'Steht das Piano in den Android-Einstellungen unter den gekoppelten Geräten? Dort entfernen und in der App neu suchen.'],
              ['Bluetooth', 'Zeigt dein Handy zwei Einträge wie „… Audio“ und „… MIDI“? Für die App zählt nur der MIDI-Eintrag.'],
              ['Beide', 'Hat die App die Berechtigung „Geräte in der Nähe“? Manche Apps fragen stattdessen nach dem Standort.'],
            ],
          },
        ],
      },
      {
        heading: 'Womit ich das getestet habe',
        blocks: [
          {
            p: 'Beide Wege habe ich mit meinem Kurzweil KA-E1 getestet, an einem Lenovo Tab P12 mit Android 15 und an einem Pixel 7 Pro mit Android 17. Für USB habe ich ein Kabel USB-B auf USB-C genommen, ohne Adapter. Das Bild zeigt eine Übung in Stavewise.',
          },
          {
            figure: {
              src: shot,
              alt: 'Eine Übung in Stavewise im Klaviersystem, die gespielten Noten sind markiert',
            },
          },
          {
            note: 'Ein Piano und zwei Geräte sind kein Beweis für jedes Modell. Welche Buchse und welches Bluetooth dein Piano hat, steht in seinem Handbuch.',
          },
        ],
      },
    ],
    questions: [
      {
        q: 'Geht jedes E-Piano?',
        a: 'Nur eines mit MIDI-Ausgang: „USB to Host“, Bluetooth-MIDI oder eine runde MIDI-Buchse (5-polig, „MIDI Out“). Für die runde Buchse brauchst du ein USB-MIDI-Interface, an USB-C direkt oder mit OTG-Adapter. Nimm eines, das als „class compliant“ verkauft wird; Treiber kannst du unter Android nicht installieren.',
      },
      {
        q: 'Welcher Weg ist besser, wenn mein Piano beides kann?',
        a: 'Beide liefern dieselben Töne. Das Kabel verbindet ohne Suche und ist bei der Verzögerung im Vorteil; Bluetooth spart das Kabel am Notenpult, und das Handy bleibt frei zum Laden. Probier aus, was dich beim Üben weniger stört.',
      },
      {
        q: 'Geht auch ein MIDI-Keyboard?',
        a: 'Ja. Ein MIDI-Keyboard mit USB-Anschluss verbindest du genauso wie ein E-Piano mit „USB to Host“.',
      },
      {
        q: 'Geht es mit einem akustischen Klavier?',
        a: 'Nein, ein akustisches Klavier hat keinen MIDI-Ausgang. Manche Apps hören über das Mikrofon mit; das ist ein anderer Weg als der hier.',
      },
      {
        q: 'Klingt dann das Handy oder das Piano?',
        a: 'Das hängt von der App ab: Manche spielen eigene Töne über das Handy, andere lassen nur dein Piano klingen.',
      },
      {
        q: 'Und mit dem iPhone oder iPad?',
        a: 'Das geht auch, aber die Schritte sind andere; diese Seite beschreibt Android.',
      },
    ],
  },
  en: {
    title: 'Connect a digital piano to Android (USB OTG and Bluetooth MIDI)',
    description:
      'How to connect a digital piano or MIDI keyboard to an Android phone or tablet: a USB cable from the USB to Host port, or Bluetooth MIDI. Which cable, troubleshooting and what I tested it with.',
    heading: 'Connect a digital piano to an Android phone or tablet',
    headingSub: 'with USB OTG or Bluetooth MIDI',
    answer:
      'Yes, you can connect a digital piano to an Android tablet or phone, in two ways: with a USB cable from the piano’s USB to Host port to the USB-C port of your device, or wirelessly over Bluetooth MIDI if your piano has it. For USB you need a USB-B to USB-C data cable, or a printer cable with a USB OTG adapter. Bluetooth MIDI is connected inside the app, not in Android’s Bluetooth settings.',
    disclosureRest: 'These steps work for any app that reads MIDI.',
    still: {
      src: still,
      alt: 'Two hands on the keys of a Kurzweil KA-E1, with a tablet on the music rest showing an exercise on the grand staff',
    },
    sections: [
      {
        heading: 'What you need',
        blocks: [
          {
            ul: [
              {
                text: 'A digital piano with a “USB to Host” port or Bluetooth MIDI. Look at the back panel or in the manual; some makers just call the port “USB” or “Computer”.',
              },
              {
                text: [
                  'An Android phone or tablet. ',
                  { text: 'Android has supported MIDI since version 6', href: ANDROID_MIDI },
                  ', but some apps need a newer version; Stavewise, for example, needs Android 12.',
                ],
              },
              { text: 'For USB, a cable that carries data. For Bluetooth, nothing else.' },
              { text: 'An app that reads MIDI: for learning to read music, practising, or recording.' },
            ],
          },
        ],
      },
      {
        heading: 'Option 1: USB cable (USB OTG)',
        blocks: [
          {
            p: 'This is the more common route: many entry-level pianos have no Bluetooth MIDI, but nearly all have a USB port. A cable needs no search and no permission.',
          },
          {
            ol: [
              {
                text: 'Find the “USB to Host” port on the piano. It is usually square (type B); a few newer pianos use USB-C.',
                note: '“USB to Device” is a different port, meant for USB sticks.',
              },
              {
                text: 'Use a USB-B to USB-C cable. Or take a printer cable you already have (USB-A to USB-B) and add a USB OTG adapter to USB-C.',
                note: 'Charge-only cables carry no data and will not work.',
              },
              {
                text: 'Switch the piano on, plug in the cable, open the app. The piano shows up in the app without pairing.',
                note: 'Some phones need USB OTG switched on in the settings first.',
              },
            ],
          },
          {
            note: 'While the cable is plugged in, the USB-C port is taken, so the phone does not charge. I charge before a long practice session.',
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
        heading: 'Option 2: Bluetooth MIDI',
        blocks: [
          {
            ol: [
              {
                text: 'Check that your piano has Bluetooth MIDI.',
                note: 'Many pianos only have Bluetooth audio, for playing music from your phone through the piano’s speakers. That is not enough.',
              },
              {
                text: 'Turn on Bluetooth on the piano.',
                note: 'On some models you also set it to MIDI in a menu; the manual explains how.',
              },
              {
                text: 'Do not pair the piano in Android’s Bluetooth settings. The app finds the piano itself; allow it to access “Nearby devices”.',
                note: [
                  'Android’s Bluetooth settings do not handle MIDI. Piano makers say the same, for example the ',
                  { text: 'Kawai CA401 manual', href: KAWAI_CA401 },
                  '.',
                ],
              },
              {
                text: 'Tap the piano in the app’s list.',
                note: 'If Android asks you to pair, confirm it.',
              },
            ],
          },
          {
            note: 'On my Kurzweil KA-E1 I could not feel any delay over Bluetooth. If you want to be safe, use the cable.',
          },
        ],
      },
      {
        heading: 'Piano not showing up?',
        blocks: [
          {
            checks: [
              ['USB', 'Is the piano on, and is the cable a data cable? Is it in “USB to Host”?'],
              ['USB', 'With an adapter: is it a USB OTG adapter? If the box does not say so, it often is not.'],
              ['USB', 'Unplug the cable, plug it back in, and reopen the app.'],
              ['Bluetooth', 'Is Bluetooth on at the piano, and not already connected to another device?'],
              ['Bluetooth', 'Is the piano listed under paired devices in Android’s settings? Remove it there and search again in the app.'],
              ['Bluetooth', 'Does your phone show two entries, like “… Audio” and “… MIDI”? Only the MIDI one counts for the app.'],
              ['Both', 'Does the app have the “Nearby devices” permission? Some apps ask for location instead.'],
            ],
          },
        ],
      },
      {
        heading: 'What I tested this with',
        blocks: [
          {
            p: 'I tested both options with my own Kurzweil KA-E1, on a Lenovo Tab P12 running Android 15 and on a Pixel 7 Pro running Android 17. For USB I used a USB-B to USB-C cable, no adapter. The screenshot shows an exercise in Stavewise.',
          },
          {
            figure: {
              src: shot,
              alt: 'An exercise in Stavewise on the grand staff, with the played notes marked',
            },
          },
          {
            note: 'One piano and two devices do not prove that every model works. Your piano’s manual tells you which ports and which kind of Bluetooth it has.',
          },
        ],
      },
    ],
    questions: [
      {
        q: 'Can you connect any digital piano to an Android tablet?',
        a: 'Only one with a MIDI output: “USB to Host”, Bluetooth MIDI, or a round 5-pin MIDI port (“MIDI Out”). For the round port you need a USB MIDI interface, plugged into USB-C directly or through an OTG adapter. Pick one sold as “class compliant”; you cannot install drivers on Android.',
      },
      {
        q: 'Which is better if my piano has both?',
        a: 'Both send the same notes. The cable connects without a search and has the edge on delay; Bluetooth keeps the music rest free of cables and leaves the USB-C port free for charging. Try both and keep whichever gets in your way less.',
      },
      {
        q: 'Does this work with a MIDI keyboard?',
        a: 'Yes. A MIDI keyboard or controller with a USB port connects the same way as a digital piano with “USB to Host”.',
      },
      {
        q: 'What about an acoustic piano?',
        a: 'An acoustic piano has no MIDI output. Some apps listen through the microphone instead; that is a different setup from the one here.',
      },
      {
        q: 'Will the sound come from the phone or the piano?',
        a: 'That depends on the app: some play their own sounds through the phone, others leave the sound to your piano.',
      },
      {
        q: 'And with an iPhone or iPad?',
        a: 'That works too, but the steps are different; this page covers Android.',
      },
    ],
  },
};
