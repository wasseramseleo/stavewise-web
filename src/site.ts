import type { Lang } from './lib/i18n';

/** Production origin, without trailing slash. */
export const siteUrl = 'https://stavewise.app';

/** Support address, shown as text with a mailto: link. */
export const supportMail = 'support@stavewise.app';

/** Beta application form in Microsoft Forms (#537). */
export const betaFormUrl =
  'https://forms.office.com/Pages/ResponsePage.aspx?id=usvaxFJ9yUqH2KhXLAIoT2ieVcdFXUpHs7N5luK9m4lUNTE2R0kyRkRPRkc2QlBRS1hPUDExVDVMWS4u';

/** Store listing of the app on Google Play, in the language of the page. */
export const playUrl = (lang: Lang): string =>
  `https://play.google.com/store/apps/details?id=app.stavewise&hl=${lang}`;
