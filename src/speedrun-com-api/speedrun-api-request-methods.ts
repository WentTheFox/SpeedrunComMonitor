import { SpeedrunApiEndpoint } from './speedrun-api-endpoint.enum.js';

export const SpeedrunApiRequestMethods: Record<SpeedrunApiEndpoint, string> = {
  [SpeedrunApiEndpoint.GET_RUNS]: 'GET',
  [SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_CATEGORY_CATEGORY]: 'GET',
  [SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_LEVEL_LEVEL_CATEGORY]: 'GET',
};
