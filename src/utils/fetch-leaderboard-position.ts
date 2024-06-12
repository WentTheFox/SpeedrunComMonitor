import { SpeedrunComApiClient } from '../speedrun-com-api/speedrun-com-api-client.js';
import { SpeedrunApiEndpoint } from '../speedrun-com-api/speedrun-api-endpoint.enum.js';
import { SpeedrunApiLeaderboardResponse } from '../speedrun-com-api/speedrun-api-response.model.js';

const findRunPlaceById = (response: SpeedrunApiLeaderboardResponse, runId: string): number | undefined => {
  return response.runs.find(runData => runData.run.id === runId)?.place;
};

export async function fetchLeaderboardPosition(client: SpeedrunComApiClient, runId: string, gameId: string, categoryId: string, levelId: string | null): Promise<number | undefined> {
  if (levelId) {
    const result = await client.request(SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_LEVEL_LEVEL_CATEGORY, { level: levelId, game: gameId, category: categoryId });
    return findRunPlaceById(result.data, runId);
  }

  const result = await client.request(SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_CATEGORY_CATEGORY, { game: gameId, category: categoryId });
  return findRunPlaceById(result.data, runId);
}
