import { DurationFormat } from '@formatjs/intl-durationformat';

const dfCache: Record<string, DurationFormat> = {};
const hourInSeconds = 60 * 60;

export const formatTime = (locale: string, secondsFloat: number): string => {
  if (!(locale in dfCache)) {
    dfCache[locale] = new DurationFormat(locale, { style: 'narrow' });
  }
  const df = dfCache[locale];
  let timeTally = secondsFloat;
  const hours = Math.floor(timeTally / hourInSeconds);
  if (hours > 0) {
    timeTally -= hours * hourInSeconds;
  }
  const minutes = Math.floor(timeTally / 60);
  timeTally -= minutes * 60;
  const seconds = Math.floor(timeTally);
  timeTally -= seconds;
  const milliseconds = Math.round(1e3 * timeTally);
  return df.format({ hours, minutes, seconds, milliseconds });
};
