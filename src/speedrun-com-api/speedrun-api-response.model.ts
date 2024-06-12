import { SpeedrunApiEndpoint } from './speedrun-api-endpoint.enum.js';

interface RunLevelData {
  id: string;
  name: string;
  weblink: string;
  rules: string;
  links: unknown[];
}

interface RunCategoryData {
  id: string;
  name: string;
  weblink: string;
  type: string;
  rules: string;
  players: unknown[];
  miscellaneous: boolean;
  links: unknown[];
}

export interface RunPlayerData {
  names: {
    international: string;
    japanese: null | string;
  };
}

export interface SpeedrunApiRunsResponse {
  id: string;
  weblink: string;
  game: string;
  level: string | null | { data: RunLevelData | [] };
  category: string | { data: RunCategoryData };
  status: {
    status: string;
    examiner: string | null;
    'verify-date': string | null;
  },
  players: {
    rel: string;
    id: string;
    uri: string;
  }[] | { data: RunPlayerData[] },
  times: {
    primary: string;
    primary_t: number;
    realtime: string | null;
    realtime_t: number | null;
    realtime_noloads: string | null;
    realtime_noloads_t: number | null;
    ingame: string | null;
    ingame_t: number | null;
  },
}

export interface SpeedrunApiLeaderboardRunData {
  place: number,
  run: SpeedrunApiRunsResponse
}

export interface SpeedrunApiLeaderboardResponse {
  weblink: string;
  game: string;
  category: string;
  level: string | null;
  platform: string | null;
  region: string | null;
  emulators: string | null;
  'video-only': boolean;
  timing: string;
  values: Record<string, unknown>;
  runs: SpeedrunApiLeaderboardRunData[];
  links: {
    rel: string;
    uri: string;
  }[];
}

export interface SpeedrunApiPaginationResponse {
  pagination: {
    offset: number;
    max: number;
    size: number;
    links: { rel: 'next' | 'prev', uri: string }[]
  };
}

export interface SpeedrunApiResponse {
  [SpeedrunApiEndpoint.GET_RUNS]: {
    data: SpeedrunApiRunsResponse[];
  } & SpeedrunApiPaginationResponse;
  [SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_CATEGORY_CATEGORY]: {
    data: SpeedrunApiLeaderboardResponse;
  };
  [SpeedrunApiEndpoint.GET_LEADERBOARDS_GAME_LEVEL_LEVEL_CATEGORY]: {
    data: SpeedrunApiLeaderboardResponse;
  };
}
