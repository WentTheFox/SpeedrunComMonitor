const suffixMap = { one: 'st', two: 'nd', few: 'rd', zero: 'th', many: 'th', other: 'th' };

const prCache: Record<string, Intl.PluralRules> = {};

export const formatPosition = (locale: string, n: number) => {
  if (!(locale in prCache)) {
    prCache[locale] = new Intl.PluralRules(locale, { type: 'ordinal' });
  }
  return `${n}${suffixMap[prCache[locale].select(n)]}`;
};
