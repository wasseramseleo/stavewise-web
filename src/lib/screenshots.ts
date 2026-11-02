import type { ImageMetadata } from 'astro';
import exerciseHeroDe from '../assets/screenshots/de/exercise-hero.png';
import exerciseHeroEn from '../assets/screenshots/en/exercise-hero.png';
import type { Lang } from './i18n';

/**
 * Exercise screenshot of the preview image (src/pages/og/, launch § 14.5), per
 * language; the hero of the home page shows the animated score instead
 * (src/lib/score.ts).
 */
export const heroShot: Record<Lang, ImageMetadata> = {
  de: exerciseHeroDe,
  en: exerciseHeroEn,
};
