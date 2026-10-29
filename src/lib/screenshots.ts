import type { ImageMetadata } from 'astro';
import exerciseHeroDe from '../assets/screenshots/de/exercise-hero.png';
import type { Lang } from './i18n';

/**
 * Exercise screenshot in the hero of the home page, per language. The preview
 * image (src/pages/og/) shows the same one (launch § 14.5). Until the launch
 * screenshots arrive, English uses the German one (launch § 6.3).
 */
export const heroShot: Record<Lang, ImageMetadata> = {
  de: exerciseHeroDe,
  en: exerciseHeroDe,
};
