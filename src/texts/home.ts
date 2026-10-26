import type { Lang } from '../lib/i18n';

// Placeholder until the home page ticket fills in the content (#591).
export const home = {
  de: {
    title: 'Stavewise: Noten lesen lernen, indem du sie spielst',
    description: 'Stavewise trainiert Notenlesen am E-Piano: Melodien mit beiden Händen, für Android, per USB oder Bluetooth-MIDI.',
    heading: 'Noten lesen lernen, indem du sie spielst.',
    placeholder: 'Inhalt folgt.',
  },
  en: {
    title: 'Stavewise: Learn to read music by playing it',
    description: 'Stavewise trains sight-reading on your digital piano: melodies with both hands, for Android, via USB or Bluetooth MIDI.',
    heading: 'Learn to read music by playing it.',
    placeholder: 'Content follows.',
  },
} satisfies Record<Lang, Record<string, string>>;
