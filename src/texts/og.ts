import type { Lang } from '../lib/i18n';

// Preview image (launch § 14.5). The claim is the heading of the home page
// (src/texts/home.ts); only the mono line below it lives here.

export interface OgTexts {
  subline: string;
}

export const og: Record<Lang, OgTexts> = {
  de: { subline: 'Am E-Piano · Android · USB und Bluetooth-MIDI' },
  en: { subline: 'On your digital piano · Android · USB and Bluetooth MIDI' },
};
