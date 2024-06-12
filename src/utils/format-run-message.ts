import { formatTime } from '../util/format-time';
import { formatPosition } from '../util/format-position';
import { LocalRunData } from './fetch-runs';

export const formatRunMessage = (run: LocalRunData, locale: string): string => {
  const parts = [];
  if (run.levelName) {
    parts.push(run.levelName);
  }
  parts.push(run.categoryName);
  parts.push(`in ${formatTime(locale, run.primaryTime)}`);
  if (run.playerNames.length > 0) {
    parts.push(`by ${run.playerNames.join(', ')}`);
  }
  parts.push(`- ${formatPosition(locale, run.position)} place`);

  return parts.join(' ') + '\n' + run.weblink;
};
