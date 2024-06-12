import { DurationFormat } from '@formatjs/intl-durationformat';

const dfCache: Record<string, DurationFormat> = {};

export const formatTime = (locale: string, secondsFloat: number): string => {
  if (!(locale in dfCache)) {
    dfCache[locale] = new DurationFormat(locale, { style: 'narrow' });
  }
  const df = dfCache[locale];
  let timeTally = secondsFloat;
  const minutes = Math.floor(timeTally / 60);
  timeTally -= minutes * 60;
  const seconds = Math.floor(timeTally);
  timeTally -= seconds;
  const milliseconds = Math.round(1e3 * timeTally);
  return df.format({ minutes, seconds, milliseconds });
};
