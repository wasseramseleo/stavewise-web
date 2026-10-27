export type Lang = 'de' | 'en';
export type PageName = 'home' | 'beta' | 'privacy' | 'impressum';

export const otherLang = (lang: Lang): Lang => (lang === 'de' ? 'en' : 'de');

/** Internal link of a page: /de/, /de/beta, ... (no trailing slash except home). */
export const pathOf = (lang: Lang, page: PageName): string =>
  page === 'home' ? `/${lang}/` : `/${lang}/${page}`;

/** Language-neutral path that nginx resolves by Accept-Language. */
export const neutralPathOf = (page: PageName): string => (page === 'home' ? '/' : `/${page}`);
