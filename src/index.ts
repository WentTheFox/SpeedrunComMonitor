import { SpeedrunComApiClient } from './speedrun-com-api/speedrun-com-api-client.js';
import { SpeedrunApiEndpoint } from './speedrun-com-api/speedrun-api-endpoint.enum.js';
import { SpeedrunApiLeaderboardResponse, SpeedrunApiRunsResponse } from './speedrun-com-api/speedrun-api-response.model.js';
import { DurationFormat } from '@formatjs/intl-durationformat';

const locale = 'en-US';
const df = new DurationFormat(locale, { style: 'narrow' });
const formatTime = (secondsFloat: number): string => {
  let timeTally = secondsFloat;
  const minutes = Math.floor(timeTally / 60);
  timeTally -= minutes * 60;
  const seconds = Math.floor(timeTally);
  timeTally -= seconds;
  const milliseconds = Math.round(1e3 * timeTally);
  return df.format({ minutes, seconds, milliseconds });
};

const suffixMap = { one: 'st', two: 'nd', few: 'rd', zero: 'th', many: 'th', other: 'th' };
const pr = new Intl.PluralRules(locale, { type: 'ordinal' });
const formatPosition = (n: number) => `${n}${suffixMap[pr.select(n)]}`;

const formatRun = async (client: SpeedrunComApiClient, run: SpeedrunApiRunsResponse): Promise<string | null> => {
  const parts = [];
  let levelId: string | null = null;
  let categoryId: string | null = null;
  if (run.level && typeof run.level === 'object' && !Array.isArray(run.level.data)) {
    levelId = run.level.data.id;
    parts.push(run.level.data.name);
  }
  if (run.category && typeof run.category === 'object') {
    categoryId = run.category.data.id;
    parts.push(run.category.data.name);
  }
  let position = categoryId && await fetchLeaderboardPosition(client, run.id, run.game, categoryId, levelId);
  if (typeof position !== 'number') {
    return null;
  }
  parts.push('in');
  parts.push(formatTime(run.times.primary_t));
  parts.push('by');
  if (!Array.isArray(run.players) && run.players.data) {
    const playerNames = run.players.data.map(player => (
      player.names.japanese
        ? `${player.names.japanese} (${player.names.international})`
        : player.names.international
    ));
    parts.push(playerNames.join(', '));
  }
  parts.push('-');
  parts.push(`${formatPosition(position)} place`);

  return parts.join(' ') + '\n' + run.weblink;
};

const findRunPlaceById = (response: SpeedrunApiLeaderboardResponse, runId: string): number | undefined => {
  return response.runs.find(runData => runData.run.id === runId)?.place;
};

async function fetchLeaderboardPosition(client: SpeedrunComApiClient, runId: string, gameId: string, categoryId: string, levelId: string | null): Promise<number | undefined> {
  if (levelId) {
    const result = await client.request(SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_LEVEL_LEVEL_CATEGORY, { level: levelId, game: gameId, category: categoryId });
    return findRunPlaceById(result.data, runId);
  }

  const result = await client.request(SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_CATEGORY_CATEGORY, { game: gameId, category: categoryId });
  return findRunPlaceById(result.data, runId);
}

async function fetchRuns(client: SpeedrunComApiClient): Promise<void> {
  const gameId = 'm1zg3360';
  const result = await client.request(SpeedrunApiEndpoint.GET_RUNS, { game: gameId, status: 'verified', orderby: 'verify-date', direction: 'desc', embed: 'category,level,players' });
  for (const run of result.data) {
    const formatResult = await formatRun(client, run);
    if (typeof formatResult === 'string') {
      console.log(formatResult);
    }
  }
  // Force exit even if we have rate limits remaining
  process.exit(1);
}

const userAgent = process.env.USER_AGENT || 'SpeedrunComMonitor';

const apiClient = new SpeedrunComApiClient(userAgent);
void fetchRuns(apiClient);
