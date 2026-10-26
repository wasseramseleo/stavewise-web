import type { Lang } from '../lib/i18n';

// Placeholder until the beta page ticket fills in the content (#591).
export const beta = {
  de: {
    title: 'Beta: Tester gesucht | Stavewise',
    description: 'Stavewise sucht Tester mit eigenem E-Piano und Android-Gerät für den Test vor dem Start in Google Play.',
    heading: 'Tester mit eigenem E-Piano gesucht',
    placeholder: 'Inhalt folgt.',
  },
  en: {
    title: 'Beta: testers wanted | Stavewise',
    description: 'Stavewise is looking for testers with their own digital piano and an Android device before launch on Google Play.',
    heading: 'Testers with their own digital piano wanted',
    placeholder: 'Content follows.',
  },
} satisfies Record<Lang, Record<string, string>>;
