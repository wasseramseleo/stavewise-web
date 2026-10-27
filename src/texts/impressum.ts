import type { Lang } from '../lib/i18n';
import { supportMail } from '../site';

// Impressum, verbatim from the #542 draft, section 1 (wasseramseleo/stavewise#599).

/** One part of a value: plain text, or text rendered as a link, in mono, or both. */
export interface Segment {
  text: string;
  href?: string;
  mono?: boolean;
}

export interface Entry {
  term: string;
  value: readonly Segment[];
}

export interface ImpressumTexts {
  title: string;
  description: string;
  heading: string;
  legalBasis: string;
  entries: readonly Entry[];
  closing: string;
}

const mail: Segment = { text: supportMail, href: `mailto:${supportMail}`, mono: true };
// Non-breaking spaces keep the number on one line (html-validate tel-non-breaking).
const phone: Segment = { text: '+43 678 782 2508', href: 'tel:+436787822508', mono: true };
const registerNumber: Segment = { text: 'FN 678378s', mono: true };
const vatId: Segment = { text: 'ATU83338345', mono: true };
const ris: Segment = { text: 'www.ris.bka.gv.at', href: 'https://www.ris.bka.gv.at' };

export const impressum: Record<Lang, ImpressumTexts> = {
  de: {
    title: 'Impressum | Stavewise',
    description: 'Impressum der Mind the Brain FlexCo für Stavewise und stavewise.app.',
    heading: 'Impressum',
    legalBasis:
      'Angaben nach § 5 E-Commerce-Gesetz und § 14 Unternehmensgesetzbuch, Offenlegung nach § 25 Mediengesetz',
    entries: [
      { term: 'Medieninhaberin und Herausgeberin', value: [{ text: 'Mind the Brain FlexCo' }] },
      {
        term: 'Unternehmensgegenstand',
        value: [{ text: 'Softwareentwicklung und digitale Produkte, Durchführung von Workshops und Seminaren' }],
      },
      { term: 'Sitz', value: [{ text: 'Innsbruck' }] },
      { term: 'Anschrift', value: [{ text: 'Mentlgasse 1/Raum 13, 6020 Innsbruck, Österreich' }] },
      { term: 'E-Mail', value: [mail] },
      { term: 'Telefon', value: [phone] },
      { term: 'Geschäftsführung', value: [{ text: 'Viktoria Mall, Leonard Guelmino' }] },
      { term: 'Firmenbuchnummer', value: [registerNumber] },
      { term: 'Firmenbuchgericht', value: [{ text: 'Landesgericht Innsbruck' }] },
      { term: 'UID-Nummer', value: [vatId] },
      {
        term: 'Kammer',
        value: [
          { text: 'Wirtschaftskammer Tirol, Fachgruppe Unternehmensberatung, Buchhaltung und Informationstechnologie' },
        ],
      },
      { term: 'Gewerbebehörde', value: [{ text: 'Stadtmagistrat Innsbruck' }] },
      { term: 'Berufsrecht', value: [{ text: 'Gewerbeordnung 1994, abrufbar unter ' }, ris] },
    ],
    closing: 'Stavewise ist ein Produkt der Mind the Brain FlexCo.',
  },
  en: {
    title: 'Legal notice | Stavewise',
    description: 'Legal notice of Mind the Brain FlexCo for Stavewise and stavewise.app.',
    heading: 'Legal notice',
    legalBasis:
      'Information pursuant to Section 5 of the Austrian E-Commerce Act and Section 14 of the Austrian Commercial Code; disclosure pursuant to Section 25 of the Austrian Media Act',
    entries: [
      { term: 'Media owner and publisher', value: [{ text: 'Mind the Brain FlexCo' }] },
      {
        term: 'Business purpose',
        value: [{ text: 'software development and digital products, workshops and seminars' }],
      },
      { term: 'Registered office', value: [{ text: 'Innsbruck, Austria' }] },
      { term: 'Address', value: [{ text: 'Mentlgasse 1/Raum 13, 6020 Innsbruck, Austria' }] },
      { term: 'Email', value: [mail] },
      { term: 'Phone', value: [phone] },
      { term: 'Managing directors', value: [{ text: 'Viktoria Mall, Leonard Guelmino' }] },
      { term: 'Company register number', value: [registerNumber] },
      { term: 'Register court', value: [{ text: 'Landesgericht Innsbruck' }] },
      { term: 'VAT ID', value: [vatId] },
      {
        term: 'Chamber',
        value: [
          {
            text: 'Wirtschaftskammer Tirol (Austrian Economic Chamber, Tyrol), Fachgruppe Unternehmensberatung, Buchhaltung und Informationstechnologie',
          },
        ],
      },
      { term: 'Trade authority', value: [{ text: 'Stadtmagistrat Innsbruck' }] },
      {
        term: 'Professional regulations',
        value: [{ text: 'Gewerbeordnung 1994 (Austrian Trade Act), available at ' }, ris],
      },
    ],
    closing: 'Stavewise is a product of Mind the Brain FlexCo.',
  },
};
