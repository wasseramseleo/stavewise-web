import type { Lang } from '../lib/i18n';

// The open test on Google Play (launch § 15.8, spec stavewise#828): badge, the
// mono note beside it and the store listing. "Early Access" only where Play
// shows it to users that way; never "Beta" on its own (launch § 15.1).

export interface PlayTexts {
  /** Alt text of the official badge: the text on the badge. */
  badgeAlt: string;
  /** Small mono note beside the badge in the hero and the guide call to action. */
  note: string;
}

export const play: Record<Lang, PlayTexts> = {
  de: { badgeAlt: 'Jetzt bei Google Play', note: 'Android · offener Test' },
  en: { badgeAlt: 'Get it on Google Play', note: 'Android · early access' },
};
