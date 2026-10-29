export type Lang = 'de' | 'en';
export const LANGS: readonly Lang[] = ['de', 'en'];

/** Pages of the site; the five guide pages follow launch § 14.3. */
export type PageName =
  | 'home'
  | 'beta'
  | 'privacy'
  | 'impressum'
  | 'connect'
  | 'cable'
  | 'bassClef'
  | 'bothHands'
  | 'app';

export const otherLang = (lang: Lang): Lang => (lang === 'de' ? 'en' : 'de');

/** Path segment below /<lang>/ per page and language; home has none. */
const SLUGS: Record<Lang, Record<Exclude<PageName, 'home'>, string>> = {
  de: {
    beta: 'beta',
    privacy: 'privacy',
    impressum: 'impressum',
    connect: 'e-piano-mit-android-verbinden',
    cable: 'usb-to-host-kabel',
    bassClef: 'bassschluessel-lesen',
    bothHands: 'noten-lesen-beide-haende',
    app: 'noten-lesen-app-android',
  },
  en: {
    beta: 'beta',
    privacy: 'privacy',
    impressum: 'impressum',
    connect: 'connect-digital-piano-to-android',
    cable: 'usb-to-host-cable',
    bassClef: 'read-bass-clef',
    bothHands: 'read-treble-and-bass-clef-together',
    app: 'sight-reading-app-android',
  },
};

/** Language-neutral paths that nginx resolves by Accept-Language; guide pages have none. */
const NEUTRAL: Record<PageName, string | null> = {
  home: '/',
  beta: '/beta',
  privacy: '/privacy',
  impressum: '/impressum',
  connect: null,
  cable: null,
  bassClef: null,
  bothHands: null,
  app: null,
};

/** Internal and canonical path of a page: /de/, /de/beta, ... (no trailing slash except home). */
export const pathOf = (lang: Lang, page: PageName): string =>
  page === 'home' ? `/${lang}/` : `/${lang}/${SLUGS[lang][page]}`;

/** Language-neutral path that nginx resolves by Accept-Language, or null for guide pages. */
export const neutralPathOf = (page: PageName): string | null => NEUTRAL[page];

/** Pages that are built today; the sitemap lists exactly these. Each guide ticket adds its page. */
export const BUILT_PAGES: readonly PageName[] = ['home', 'beta', 'privacy', 'impressum', 'connect', 'cable', 'bassClef', 'bothHands'];
