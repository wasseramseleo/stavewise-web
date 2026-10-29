// PROTOTYPE (#709, throwaway branch prototype/ratgeber): rough German draft of
// guide page 1 "E-Piano mit Android verbinden". Facts are a draft, to be checked
// before the real page is written. Shared by variants A, B and C.

export interface Step {
  text: string;
  note?: string;
}

export const guide = {
  title: 'E-Piano mit Android-Handy oder -⁠Tablet verbinden (USB und Bluetooth-MIDI) | Stavewise',
  description:
    'So verbindest du dein E-Piano mit einem Android-Handy oder -⁠Tablet: per USB-Kabel an „USB to Host“ oder kabellos über Bluetooth-MIDI. Mit Kabelfrage und Fehlersuche.',
  heading: 'E-Piano mit Android-Handy oder -⁠Tablet verbinden',
  headingSub: 'per USB oder Bluetooth-MIDI',
  byline: 'Von Leonard Guelmino',
  updated: 'Stand Oktober 2026',

  answerLabel: 'Kurz gesagt',
  answer:
    'Ein E-Piano verbindest du auf zwei Wegen mit einem Android-Handy oder -⁠Tablet: mit einem USB-Kabel von der Buchse „USB to Host“ am Piano zum USB-C-Anschluss, oder kabellos über Bluetooth-MIDI, wenn dein Piano es kann. Für USB brauchst du ein Datenkabel USB-B auf USB-C. Bluetooth-MIDI verbindest du in der App, nicht in den Android-Einstellungen.',

  disclosure:
    'Offen gesagt: Ich habe Stavewise entwickelt, eine App zum Notenlesen am E-Piano. Die Schritte hier gelten für jede App, die MIDI liest.',

  needTitle: 'Was du brauchst',
  needQuestion: 'Was brauche ich, um mein E-Piano mit Android zu verbinden?',
  need: [
    'Ein E-Piano mit der Buchse „USB to Host“ oder mit Bluetooth-MIDI. Das steht auf der Rückseite oder im Handbuch.',
    'Ein Android-Handy oder -⁠Tablet. MIDI kann Android seit Version 6; manche Apps verlangen mehr, Stavewise etwa Android 12.',
    'Für USB ein Datenkabel, für Bluetooth nichts weiter.',
    'Eine App, die MIDI liest, zum Beispiel zum Notenlesen oder zum Aufnehmen.',
  ],

  usbTitle: 'Weg 1: mit USB-Kabel',
  usbQuestion: 'Wie verbinde ich das E-Piano per USB-Kabel?',
  usbTag: 'die meisten Pianos',
  usbAnswer: 'Ein Datenkabel von „USB to Host“ am Piano zum USB-C-Anschluss deines Geräts, Piano einschalten, fertig.',
  usbSteps: [
    { text: 'Am Piano die Buchse „USB to Host“ suchen. Sie ist meist eckig (Typ B), an neueren Pianos auch USB-C.', note: '„USB to Device“ ist eine andere Buchse, für USB-Sticks.' },
    { text: 'Ein Kabel USB-B auf USB-C nehmen. Oder ein vorhandenes Druckerkabel (USB-A auf USB-B) mit einem OTG-Adapter auf USB-C.', note: 'Reine Ladekabel gehen nicht.' },
    { text: 'Piano einschalten, Kabel einstecken, die App öffnen. Das Piano erscheint ohne Kopplung.' },
  ] as Step[],
  usbAside: 'Solange das Kabel steckt, lädt das Handy nicht. Für eine lange Übung vorher aufladen.',
  usbMore: 'Welches Kabel genau?',

  bleTitle: 'Weg 2: über Bluetooth-MIDI',
  bleQuestion: 'Geht es auch ohne Kabel?',
  bleTag: 'z. B. Roland, Kawai, Kurzweil',
  bleAnswer: 'Ja, wenn dein Piano Bluetooth-MIDI hat. Dann verbindest du es in der App, nicht in den Android-Einstellungen.',
  bleSteps: [
    { text: 'Prüfen, ob dein Piano Bluetooth-MIDI hat.', note: 'Viele Pianos haben nur Bluetooth-Audio zum Musikhören. Das reicht nicht.' },
    { text: 'Bluetooth am Piano einschalten.' },
    { text: 'Nicht in den Android-Einstellungen koppeln. Die App sucht das Piano selbst; erlaube ihr „Geräte in der Nähe“.' },
    { text: 'Das Piano in der Liste der App antippen.' },
  ] as Step[],
  bleAside: 'Ich habe am Kurzweil KA-E1 über Bluetooth keine Verzögerung gespürt. Wer ganz sicher gehen will, nimmt das Kabel.',

  troubleTitle: 'Wenn das Piano nicht erscheint',
  troubleQuestion: 'Warum erscheint mein E-Piano nicht in der App?',
  troubleAnswer: 'Meist ist es ein Ladekabel statt eines Datenkabels, die falsche Buchse oder eine Kopplung in den Android-Einstellungen.',
  trouble: [
    ['USB', 'Ist das Piano an und das Kabel ein Datenkabel? Steckt es in „USB to Host“?'],
    ['USB', 'Mit Adapter: Ist es ein OTG-Adapter und nicht nur ein Stecker-Wandler?'],
    ['Bluetooth', 'Ist Bluetooth am Piano an und nicht schon mit einem anderen Gerät verbunden?'],
    ['Bluetooth', 'In den Android-Einstellungen gekoppelt? Dort entfernen und in der App neu suchen.'],
    ['Beide', 'Hat die App die Berechtigung „Geräte in der Nähe“?'],
  ] as [string, string][],

  testedTitle: 'Womit ich das getestet habe',
  tested:
    'Beide Wege habe ich mit einem Kurzweil KA-E1 an einem Lenovo Tab P12 (Android 15) und einem Pixel 7 Pro getestet.',
  testedMore: 'Getestete Pianos (ab Launch)',

  faqTitle: 'Fragen',
  faq: [
    { q: 'Geht jedes E-Piano?', a: 'Nur eines mit MIDI-Ausgang: „USB to Host“, Bluetooth-MIDI oder eine runde MIDI-Buchse (5-polig). Für die runde Buchse brauchst du zusätzlich ein USB-MIDI-Interface mit OTG-Adapter.' },
    { q: 'Geht es mit einem akustischen Klavier?', a: 'Nein, ein akustisches Klavier hat keinen MIDI-Ausgang. Apps, die über das Mikrofon hören, gehen dort trotzdem.' },
    { q: 'Klingt dann das Handy oder das Piano?', a: 'Das hängt von der App ab. Stavewise erzeugt keinen Klang, du hörst dein Piano.' },
    { q: 'Und mit dem iPhone oder iPad?', a: 'Das geht auch, aber anders; diese Seite beschreibt Android.' },
  ],

  ctaLabel: 'Stavewise',
  ctaTitle: 'Noten lesen lernen, indem du sie spielst',
  ctaText: 'Stavewise trainiert Notenlesen an deinem E-Piano: Melodien mit beiden Händen, für Android, per USB oder Bluetooth-MIDI. Gerade läuft der Beta-Test.',
  ctaButton: 'Als Tester bewerben',
  ctaWindow: 'BETA',
  ctaLaunchNote: 'Ab Launch: Google-Play-Badge statt Beta-Knopf, dazu „Getestete Pianos“.',

  authorTitle: 'Über den Autor',
  author:
    'Ich bin Leonard Guelmino. Als Kind habe ich fünf Jahre Klavier gespielt, seit 2025 spiele ich als Erwachsener wieder. Das Notenlesen war dabei mein Engpass. Als Informatiker habe ich mir Stavewise gebaut, zuerst für mich, und teile es jetzt. Ich bin kein Klavierlehrer: Hier steht, was ich beim Üben und beim Testen mit Pianos und Android-Geräten gelernt habe. Stavewise ist meine App, ein Produkt der Mind the Brain FlexCo, Innsbruck.',
  authorShort: 'Wiedereinsteiger am Klavier, Informatiker, Entwickler von Stavewise. Kein Klavierlehrer.',
  authorLink: 'Impressum',

  relatedTitle: 'Weiterlesen',
  demoStill: 'Standbild aus dem Demo-Clip: Hände am KA-E1, Tablet am Pult (folgt)',
  shotAlt: 'Stavewise am Tablet: Übung im Klaviersystem, das Piano ist per MIDI verbunden',
};

/** The five guide pages (#708), in footer order. Page 1 is the prototyped one. */
export const guides = [
  { href: '/de/prototype-ratgeber/a', short: 'E-Piano mit Android verbinden', group: 'Technik', current: true },
  { href: '#kabel', short: 'Welches Kabel: USB to Host und OTG', group: 'Technik' },
  { href: '#bass', short: 'Bassschlüssel lesen lernen', group: 'Noten lesen' },
  { href: '#beide', short: 'Noten lesen mit beiden Händen', group: 'Noten lesen' },
  { href: '#app', short: 'Noten lesen lernen mit App', group: 'App' },
];
