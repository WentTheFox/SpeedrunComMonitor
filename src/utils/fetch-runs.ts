// Split/Second game ID = 'm1zg3360'
import { SpeedrunComApiClient } from '../speedrun-com-api/speedrun-com-api-client';
import { SpeedrunApiEndpoint } from '../speedrun-com-api/speedrun-api-endpoint.enum';
import { fetchLeaderboardPosition } from './fetch-leaderboard-position';

// const splitSecondGameId = 'm1zg3360';

export interface LocalRunData {
  runId: string;
  weblink: string;
  levelId: string | null;
  levelName: string | null;
  categoryId: string;
  categoryName: string;
  position: number;
  primaryTime: number;
  playerNames: string[] | null;
  verifiedAt: number;
}

export async function fetchRuns(client: SpeedrunComApiClient, gameId: string): Promise<LocalRunData[]> {
  const result = await client.request(SpeedrunApiEndpoint.GET_RUNS, { game: gameId, status: 'verified', orderby: 'verify-date', direction: 'desc', embed: 'category,level,players' });
  const allRuns: LocalRunData[] = [];
  for (const run of result.data) {
    const runId = run.id;
    const verifiedAt = new Date(run.status['verify-date']).getTime();
    let levelId: string | null = null;
    let levelName: string | null = null;
    let categoryId: string | null = null;
    let categoryName: string | null = null;
    if (run.level && typeof run.level === 'object' && !Array.isArray(run.level.data)) {
      levelId = run.level.data.id;
      levelName = run.level.data.name;
    }
    if (run.category && typeof run.category === 'object') {
      categoryId = run.category.data.id;
      categoryName = run.category.data.name;
    }
    const position = categoryId && await fetchLeaderboardPosition(client, runId, gameId, categoryId, levelId);
    if (typeof position !== 'number') {
      continue;
    }
    let playerNames: string[] | null;
    if (!Array.isArray(run.players) && run.players.data) {
      playerNames = run.players.data.map(player => (
        player.names.japanese
          ? `${player.names.japanese} (${player.names.international})`
          : player.names.international
      ));
    }
    allRuns.push({
      runId,
      weblink: run.weblink,
      levelId,
      levelName,
      categoryId,
      categoryName,
      position,
      primaryTime: run.times.primary_t,
      playerNames,
      verifiedAt,
    });
  }
  return allRuns;
}
